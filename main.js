var zum = 1.0;
var brojStrane = 1;
var fajl_url = '4_1_5.pdf';

var drzac = null;
var ovajDokument = null;

PDFJS.workerSrc = 'libs/pdfjs/pdf.worker.js';
PDFJS.disableWorker = true;

window.addEventListener('load', function() {
  drzac = document.getElementById('pdf-drzac');
  ucitajPDF(fajl_url);
});

document.addEventListener('click', function (e) {
  var element = e.target;
  if (element.classList.contains('js-idi-nazad')) okreniStranu(-1);
  if (element.classList.contains('js-idi-napred')) okreniStranu(1);
  if (element.classList.contains('js-zum')) zumiraj(0.1);
  if (element.classList.contains('js-odzum')) zumiraj(-0.1);
});


function ucitajPDF(fajl_url) {
  PDFJS.getDocument(fajl_url).then(function(pdf) {
    ovajDokument = pdf;
    if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages;
    renderujStranu();
  });
}

function renderujStranu() {
  azurirajStanje();
  ovajDokument.getPage(brojStrane).then(function(pdfStrana) {
    var renderOpcije = {
      container: drzac,
      id: brojStrane,
      scale: zum,
      defaultViewport: pdfStrana.getViewport(zum),
      textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
    };
    var pdfPrikaz = new PDFJS.PDFPageView(renderOpcije);
    pdfPrikaz.setPdfPage(pdfStrana);
    pdfPrikaz.draw();
  });
}

function azurirajStanje() {
  proverBrojStrane();
  brisiPrethodneStrane();
  azurirajPolja();
}

function proverBrojStrane() {
  if (brojStrane < 1) brojStrane = 1;
  if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages;
}

function brisiPrethodneStrane() {
  var strane = document.querySelectorAll('.page');
  for (var i = 0; i < strane.length; i++) {
    strane[i].remove();
  }
}

function azurirajPolja() {
  $('#trenutna_strana').textContent = brojStrane;
  $('#ukupno_strana').textContent = ovajDokument.numPages;
  $('#zum').textContent = zum.toFixed(1);
}

function okreniStranu(broj) {
  brojStrane += broj;
  renderujStranu();
}

function zumiraj(broj) {
  zum += broj;
  renderujStranu();
}

function $(selektor) {
  return document.querySelector(selektor);
}
