var zoom = 1;
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
      scale: zoom,
      defaultViewport: pdfStrana.getViewport(zoom),
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

function okreniStranu(broj) {
  brojStrane += broj;
  renderujStranu();
}
