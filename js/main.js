/* global PDFJS */

let zum = 1.0
let brojStrane = 1
const fajl_url = 'game-programming.pdf'

let drzac = null
let ovajDokument = null

PDFJS.workerSrc = 'libs/pdfjs/pdf.worker.js'
PDFJS.disableWorker = true // gasi workere zbog cross-origin greške

/** FUNCTIONS **/

function $(selektor) {
  return document.querySelector(selektor)
}

function proverBrojStrane() {
  if (brojStrane < 1) brojStrane = 1
  if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages
}

function brisiPrethodneStrane() {
  const strane = document.querySelectorAll('.page')
  for (let i = 0; i < strane.length; i++) {
    strane[i].remove()
  }
}

function azurirajPolja() {
  $('#trenutna_strana').textContent = brojStrane
  $('#ukupno_strana').textContent = ovajDokument.numPages
  $('#zum').textContent = zum.toFixed(1)
}

function azurirajStanje() {
  proverBrojStrane()
  brisiPrethodneStrane()
  azurirajPolja()
}

function renderujStranu() {
  azurirajStanje()
  ovajDokument.getPage(brojStrane)
    .then(function(pdfStrana) {
      const renderOpcije = {
        container: drzac,
        id: brojStrane,
        scale: zum,
        defaultViewport: pdfStrana.getViewport(zum),  // namesta platno na velicinu vidnog polja
        textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
      }
      const pdfPrikaz = new PDFJS.PDFPageView(renderOpcije)
      pdfPrikaz.setPdfPage(pdfStrana)
      pdfPrikaz.draw()
    })
}

function ucitajPDF(fajl_url) {
  PDFJS.getDocument(fajl_url)
    .then(function(pdf) {
      ovajDokument = pdf
      if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages
      renderujStranu()
    })
}

function okreniStranu(broj) {
  brojStrane += broj
  renderujStranu()
}

function zumiraj(broj) {
  zum += broj
  renderujStranu()
}

/** EVENTS **/

window.addEventListener('load', function() {
  drzac = document.getElementById('pdf-drzac')
  ucitajPDF(fajl_url)
})

document.addEventListener('click', function(e) {
  const element = e.target
  if (element.classList.contains('js-idi-nazad')) okreniStranu(-1)
  if (element.classList.contains('js-idi-napred')) okreniStranu(1)
  if (element.classList.contains('js-zum')) zumiraj(0.1)
  if (element.classList.contains('js-odzum')) zumiraj(-0.1)
})
