# Gera assets/projetos.js a partir de _raw.json (API GitHub) + _curadoria.json
# Raiz do site: funciona tanto com os scripts na raiz quanto dentro de _fonte/
$ROOT = if (Test-Path "$PSScriptRoot\index.html") { $PSScriptRoot } else { Split-Path -Parent $PSScriptRoot }
# os JSON de dados viajam junto do script (na entrega ficam em _fonte/)
$DATA = $PSScriptRoot

# Repos que NAO entram no site (a lista fica em _fora.local.txt, que nao viaja
# para o repositorio publicado): saem da vitrine, do arquivo e das contagens.
$FORA = @()
if (Test-Path "$DATA\_fora.local.txt") {
  $FORA = @(Get-Content "$DATA\_fora.local.txt" -Encoding UTF8 |
            Where-Object { $_.Trim() -and $_.Trim() -notmatch '^#' } |
            ForEach-Object { $_.Trim() })
}

$raw = Get-Content "$DATA\_raw.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$cur = Get-Content "$DATA\_curadoria.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$CFG = Get-Content "$DATA\_acentos.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$ACRO = @{}
'qos,voip,siem,lgpd,owasp,sla,ad,pcap,ssh,mitre,iot,vpc,lan,arp,fii,pwa,ats,nvr,cftv,ospf,vms,json,aws,s3,modbus,xgboost,mlops,etl,irpf,dio,bia,rag,api,ia,ai,kpi,cwe,n8n,sql,xml,css,html,ui,ux,gfs,rbac,erp' -split ',' | ForEach-Object { $ACRO[$_] = $_.ToUpper() }
$ACRO['fiis'] = 'FIIs'
$ACRO['aes256'] = 'AES-256'
$ACRO['oauth2'] = 'OAuth2'
$ACRO['n8n'] = 'n8n'
$ACRO['ia'] = 'IA'
$ACRO['s3'] = 'S3'
foreach ($sig in $CFG.siglas.PSObject.Properties) { $ACRO[$sig.Name] = $sig.Value }

$PART = @{}
foreach ($pa in $CFG.particulas) { $PART["$pa"] = $true }

$PAL = @{}
foreach ($w in $CFG.palavras.PSObject.Properties) { $PAL[$w.Name] = $w.Value }

$TIT = @{}
foreach ($t in $CFG.titulos.PSObject.Properties) { $TIT[$t.Name] = $t.Value }

# titulos em ingles (arquivo separado: sem acentos, seguro de editar a mao)
$TITE = @{}
if (Test-Path "$DATA\_titulos_en.json") {
  $en = Get-Content "$DATA\_titulos_en.json" -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($t in $en.PSObject.Properties) { $TITE[$t.Name] = $t.Value }
}

function Humanizar($slug) {
  if ($TIT.ContainsKey($slug)) { return $TIT[$slug] }

  $out = @()
  foreach ($p in ($slug -split '[-_]')) {
    $k = $p.ToLower()
    if ($PART.ContainsKey($k)) { $out += $k; continue }
    if ($ACRO.ContainsKey($k)) { $out += $ACRO[$k]; continue }

    $base = $k
    if ($PAL.ContainsKey($k)) { $base = $PAL[$k] }

    $out += ($base.Substring(0,1).ToUpper() + $base.Substring(1))
  }
  return ($out -join ' ')
}

function LimparDesc($d, $slug) {
  if ([string]::IsNullOrWhiteSpace($d)) { return $null }
  $t = $d.Trim()
  $t = $t -replace '^\s*Projeto\s+funcional\s*[\u2013\u2014-]\s*', ''
  $t = $t -replace '\s*[\u2013\u2014|]\s*.*$', ''
  $t = $t.Trim()
  if ($t.Length -lt 24) { return $null }
  # descartar quando a descricao e apenas o proprio nome do repositorio
  $norm = ($t.ToLower() -replace '[^a-z0-9]', '')
  $slugnorm = ($slug.ToLower() -replace '[^a-z0-9]', '')
  if ($norm -eq $slugnorm -or $norm -eq $slugnorm + 'projetofuncional') { return $null }
  return $t
}

function Topics($t) {
  if (-not $t) { return @() }
  return @($t | Where-Object { $_ -notin @('portfolio', 'bilingual') })
}

$featSet = @{}
foreach ($f in $cur.featured) { $featSet[$f.n] = $true }

$lista = @()
foreach ($r in ($raw | Sort-Object name)) {
  $slug = $r.name
  if ($FORA -contains $slug) { continue }
  $areas = @()
  if ($cur.areas.PSObject.Properties.Name -contains $slug) { $areas = @($cur.areas.$slug) }
  $live = $null
  if ($r.has_pages) { $live = "https://kelvinoliveiracode.github.io/$slug/" }
  $lista += [ordered]@{
    n    = $slug
    t    = (Humanizar $slug)
    te   = $(if ($TITE.ContainsKey($slug)) { $TITE[$slug] } else { (Humanizar $slug) })
    l    = $(if ($r.language) { $r.language } else { '' })
    y    = ([datetime]$r.created_at).Year
    u    = "https://github.com/KelvinOliveiraCode/$slug"
    live = $live
    a    = $areas
    d    = (LimparDesc $r.description $slug)
    tp   = (Topics $r.topics)
    f    = [bool]$featSet[$slug]
  }
}

$vitrine = @()
foreach ($f in $cur.featured) {
  $meta = $lista | Where-Object { $_.n -eq $f.n } | Select-Object -First 1
  if (-not $meta) { continue }
  $vitrine += [ordered]@{
    n     = $f.n
    t     = $f.t
    d     = $f.d
    badge = $f.badge
    stack = $f.stack
    a     = $f.a
    l     = $meta.l
    y     = $meta.y
    u     = $meta.u
    live  = $meta.live
  }
}

$vivos = ($lista | Where-Object { $_.live }).Count
$obj = [ordered]@{ total = $lista.Count; vivos = $vivos; vitrine = $vitrine; lista = $lista }
$json = $obj | ConvertTo-Json -Depth 8 -Compress

$js = "/* Dados gerados da API do GitHub em $(Get-Date -Format 'yyyy-MM-dd') - nao editar a mao.`n   Fonte: github.com/KelvinOliveiraCode | Repos publicos: $($lista.Count) | Com pagina no ar: $vivos */`nwindow.PORTFOLIO = $json;`n"
[System.IO.File]::WriteAllText("$ROOT\assets\projetos.js", $js, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "REPOS:" $lista.Count "| COM PAGINA:" $vivos "| VITRINE:" $vitrine.Count
Write-Host "TAMANHO projetos.js:" ([math]::Round((Get-Item "$ROOT\assets\projetos.js").Length/1KB,1)) "KB"
Write-Host "--- amostra ---"
$lista | Select-Object -First 6 | ForEach-Object { "{0,-34} {1,-11} y{2} a[{3}] live={4} d={5}" -f $_.n, $_.l, $_.y, ($_.a -join ','), [bool]$_.live, $_.d }
Write-Host "--- sem descricao real: ---" (($lista | Where-Object { -not $_.d }).Count)
