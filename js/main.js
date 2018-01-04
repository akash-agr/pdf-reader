/* global PDFJS */

const $ = selektor => document.querySelector(selektor)

const fajl_url = 'game-programming.pdf'
const drzac = document.getElementById('pdf-drzac')

let zum = 1.0
let brojStrane = 1
let dokument = null

PDFJS.workerSrc = 'libs/pdfjs/pdf.worker.js'
PDFJS.disableWorker = true // gasi workere zbog cross-origin greške

/** FUNCTIONS **/

function proverBrojStrane() {
  if (brojStrane < 1) brojStrane = 1
  if (brojStrane > dokument.numPages) brojStrane = dokument.numPages
}

function brisiPrethodneStrane() {
  const strane = document.querySelectorAll('.page')
  for (let i = 0; i < strane.length; i++) {
    strane[i].remove()
  }
}

function azurirajPolja() {
  $('#trenutna_strana').textContent = brojStrane
  $('#ukupno_strana').textContent = dokument.numPages
  $('#zum').textContent = zum.toFixed(1)
}

function azurirajStanje() {
  proverBrojStrane()
  brisiPrethodneStrane()
  azurirajPolja()
}

function renderujStranu() {
  azurirajStanje()
  dokument.getPage(brojStrane)
    .then(function(strana) {
      const params = {
        container: drzac,
        id: brojStrane,
        scale: zum,
        defaultViewport: strana.getViewport(zum),
        textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
      }
      const pdfJs = new PDFJS.PDFPageView(params)
      pdfJs.setPdfPage(strana)
      pdfJs.draw()
    })
}

function ucitajPDF(fajl_url) {
  PDFJS.getDocument(fajl_url)
    .then(function(pdf) {
      if (brojStrane > pdf.numPages) brojStrane = pdf.numPages
      dokument = pdf
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

/** INIT **/

ucitajPDF(fajl_url)

/** EVENTS **/

document.addEventListener('click', function(e) {
  const element = e.target
  if (element.classList.contains('js-idi-nazad')) okreniStranu(-1)
  if (element.classList.contains('js-idi-napred')) okreniStranu(1)
  if (element.classList.contains('js-zum')) zumiraj(0.1)
  if (element.classList.contains('js-odzum')) zumiraj(-0.1)
})
