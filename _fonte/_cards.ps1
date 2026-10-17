# Injeta os cards de vitrine e arquivo no index.html a partir de assets/projetos.js
# Raiz do site: funciona tanto com os scripts na raiz quanto dentro de _fonte/
$ROOT = if (Test-Path "$PSScriptRoot\index.html") { $PSScriptRoot } else { Split-Path -Parent $PSScriptRoot }

$js = [System.IO.File]::ReadAllText("$ROOT\assets\projetos.js", [System.Text.Encoding]::UTF8)
$json = $js.Substring($js.IndexOf('= ') + 2).Trim().TrimEnd(';')
$d = $json | ConvertFrom-Json

function Esc($s) {
  if ($null -eq $s) { return '' }
  return ($s -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;' -replace '"', '&quot;')
}

$AREA = @{
  dados   = @{ pt = 'Dados & IA';        en = 'Data & AI' }
  backend = @{ pt = 'Backend';           en = 'Backend' }
  web     = @{ pt = 'Web & Produto';     en = 'Web & Product' }
  cyber   = @{ pt = 'Ciberseguranca';    en = 'Cybersecurity' }
  infra   = @{ pt = 'Redes & Infra';     en = 'Networking & Infra' }
  ti      = @{ pt = 'TI & Suporte';      en = 'IT & Support' }
}
$AREA['cyber'].pt = [char]0x0043 + 'iberseguran' + [char]0x00E7 + 'a'   # Ciberseguranca com cedilha
$AREA['dados'].pt = 'Dados & IA'

function AreaChips($codes) {
  $out = @()
  foreach ($c in $codes) {
    $k = "$c"
    if ($AREA.ContainsKey($k)) {
      $a = $AREA[$k]
      $out += '<span class="chip area" data-pt="' + (Esc $a.pt) + '" data-en="' + (Esc $a.en) + '">' + (Esc $a.pt) + '</span>'
    }
  }
  return ($out -join "`n        ")
}

function AreaRotulo($codes) {
  if (-not $codes -or $codes.Count -eq 0) { return @{ pt = 'Projeto'; en = 'Project' } }
  $a = $AREA["$($codes[0])"]
  if (-not $a) { return @{ pt = 'Projeto'; en = 'Project' } }
  return $a
}

# ---------------- VITRINE ----------------
$cards = @()
$ordenada = @($d.vitrine | Sort-Object @{ Expression = { if ($_.live) { 0 } else { 1 } } })
foreach ($v in $ordenada) {
  $rot = AreaRotulo $v.a
  $vivo = [bool]$v.live
  $hrefTitulo = if ($vivo) { $v.live } else { $v.u }

  $selo = if ($vivo) {
    '<span class="badge-live" data-pt="No ar" data-en="Live">No ar</span>'
  } else {
    '<span class="badge-note" data-pt="' + (Esc $v.badge.pt) + '" data-en="' + (Esc $v.badge.en) + '">' + (Esc $v.badge.pt) + '</span>'
  }

  $pilha = ($v.stack | ForEach-Object { '<li>' + (Esc $_) + '</li>' }) -join ''

  $links = ''
  if ($vivo) {
    $links += '<a class="lnk primary" href="' + $v.live + '" target="_blank" rel="noopener" data-pt="abrir site &#8599;" data-en="open site &#8599;">abrir site &#8599;</a>'
  }
  $links += '<a class="lnk" href="' + $v.u + '" target="_blank" rel="noopener" data-pt="c&#243;digo &#8599;" data-en="code &#8599;">c&#243;digo &#8599;</a>'

  $cards += @"
      <article class="vcard">
        <div class="vcard-top">
          <span class="vcard-area" data-pt="$(Esc $rot.pt)" data-en="$(Esc $rot.en)">$(Esc $rot.pt)</span>
          $selo
        </div>
        <h3><a href="$hrefTitulo" target="_blank" rel="noopener" data-pt="$(Esc $v.t.pt)" data-en="$(Esc $v.t.en)">$(Esc $v.t.pt)</a></h3>
        <p data-pt="$(Esc $v.d.pt)" data-en="$(Esc $v.d.en)">$(Esc $v.d.pt)</p>
        <ul class="vcard-stack">$pilha</ul>
        <div class="vcard-links">$links</div>
      </article>
"@
}

$vitrineHtml = @"

      <div class="vitrine" id="vitrine">
$($cards -join "`n")
      </div>

      <div class="conta-linha" style="margin-top:var(--s6)">
        <span class="contagem"><b>12</b> <span data-pt="dos 100 projetos t&#234;m p&#225;gina publicada e funcionando" data-en="of the 100 projects have a published, working page">dos 100 projetos t&#234;m p&#225;gina publicada e funcionando</span></span>
        <span class="conta-acoes">
          <span class="contagem" id="vitrine-conta" aria-live="polite"></span>
          <button type="button" class="btn ghost mais-btn" id="vitrine-mais" aria-controls="vitrine" data-pt="Mostrar mais" data-en="Show more">Mostrar mais</button>
        </span>
      </div>
"@

# ---------------- ARQUIVO ----------------
$linhas = @()
$i = 0
foreach ($p in ($d.lista | Sort-Object n)) {
  $i++
  $idx = $i.ToString('000')
  $areas = @()
  foreach ($c in $p.a) { $areas += "$c" }
  $areaAttr = ($areas -join ',')
  $vivoAttr = if ($p.live) { '1' } else { '0' }
  $tipo = if ($p.l) { '<span class="chip">' + (Esc $p.l) + '</span>' } else { '' }
  $ano = '<span class="chip">' + $p.y + '</span>'
  $seloVivo = if ($p.live) { '<span class="chip live" data-pt="no ar" data-en="live">no ar</span>' } else { '' }
  $tituloAttr = if ($p.d) { ' title="' + (Esc $p.d) + '"' } else { '' }
  # titulo em ingles: se o repo nao estiver no mapa, o proprio titulo PT serve
  $te = if ($p.te) { $p.te } else { $p.t }
  $linkSite = if ($p.live) { '<a class="lnk primary" href="' + $p.live + '" target="_blank" rel="noopener" data-pt="site &#8599;" data-en="site &#8599;">site &#8599;</a>' } else { '' }

  $linhas += @"
        <article class="acard" data-nome="$(Esc $p.n)" data-area="$areaAttr" data-live="$vivoAttr">
          <div class="ac-top"><span class="ac-idx">$idx</span></div>
          <h3><a href="$($p.u)" target="_blank" rel="noopener"$tituloAttr data-pt="$(Esc $p.t)" data-en="$(Esc $te)">$(Esc $p.t)</a></h3>
          <div class="ac-meta">
            $tipo
            $(AreaChips $p.a)
            $ano
            $seloVivo
          </div>
          <div class="ac-links">
            <a class="lnk" href="$($p.u)" target="_blank" rel="noopener" data-pt="c&#243;digo" data-en="code">c&#243;digo</a>
            $linkSite
          </div>
        </article>
"@
}

$arquivoHtml = @"

      <div class="arq-grid" id="arquivo">
$($linhas -join "`n")
      </div>

      <div class="conta-linha" style="margin-top:var(--s6)">
        <span class="contagem" id="contagem" aria-live="polite"></span>
        <button type="button" class="btn ghost mais-btn" id="arquivo-mais" aria-controls="arquivo" data-pt="Mostrar mais" data-en="Show more">Mostrar mais</button>
      </div>
"@

# ---------------- injeta (idempotente: restaura placeholders antes) ----------------
$html = [System.IO.File]::ReadAllText("$ROOT\index.html", [System.Text.Encoding]::UTF8)

# o bloco reinjetado ja traz o proprio <div class="vitrine">, entao o regex
# precisa consumir o div existente (se nao, ele fica duplicado e engole as
# secoes seguintes dentro do grid da vitrine)
$html = [regex]::Replace($html,
  '(?s)[ \t]*<div class="vitrine"[^>]*>.*?(?=<div class="sec-head" style="margin-top:var\(--s9\)">)',
  "      <!--#VITRINE#-->" + "`n`n      ")

# o bloco do arquivo tambem traz o proprio <div class="arq-grid"> e a linha de
# contagem que fica DEPOIS da grade (o "mostrar mais" no fim da lista, nao no
# topo: acima da grade o clique parecia nao fazer nada)
$html = [regex]::Replace($html,
  '(?s)[ \t]*<div class="arq-grid" id="arquivo">.*?(\s*)(?=</div>\s*</section>\s*<!-- =+ CERTIFICADOS)',
  ("      <!--#ARQUIVO#-->" + '$1'))

if ($html.IndexOf('<!--#VITRINE#-->') -lt 0 -or $html.IndexOf('<!--#ARQUIVO#-->') -lt 0) {
  throw 'Nao encontrei os marcadores #VITRINE# / #ARQUIVO# no index.html.'
}

$html = $html.Replace('<!--#VITRINE#-->', $vitrineHtml.Trim("`n"))
$html = $html.Replace('<!--#ARQUIVO#-->', $arquivoHtml.Trim("`n"))
[System.IO.File]::WriteAllText("$ROOT\index.html", $html, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "VITRINE cards:" $ordenada.Count
Write-Host "ARQUIVO cards:" $linhas.Count
Write-Host "index.html:" ([math]::Round((Get-Item "$ROOT\index.html").Length/1KB,1)) "KB"
