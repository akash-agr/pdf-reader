/*** VARIJABLE ***/

var zoom = 1;
var brojStrane = 1;
var fajl_url = '4_1_5.pdf';

var id = null;
var vrsta = null;
var drzac = null;
var ovajDokument = null;

/*** DOGAĐAJI ***/

window.addEventListener('load', function () {
  drzac = document.getElementById('pdf-drzac');
  ucitajPDF(fajl_url);
});

document.addEventListener('click', function (e) {
  var element = e.target;
  if (element.classList.contains('js-idi-nazad')) okreniStranu(-1);
  if (element.classList.contains('js-idi-napred')) okreniStranu(1);
}); // on click

/*** FUNKCIJE ***/

function ucitajPDF(fajl_url) {
  PDFJS.getDocument(fajl_url).then(function (pdf) {
    ovajDokument = pdf;
    renderujStranu();
  });
}

function renderujStranu() {
  azurirajStanje();
  ovajDokument.getPage(brojStrane).then(function (pdfStrana) {
    var vidno_polje = pdfStrana.getViewport(zoom);
    var renderOpcije = {
      container: drzac,
      id: brojStrane,
      scale: zoom,
      defaultViewport: vidno_polje,
      textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
    };
    var pdfPrikaz = new PDFJS.PDFPageView(renderOpcije);
    pdfPrikaz.setPdfPage(pdfStrana);
    pdfPrikaz.draw();
  });
}

function azurirajStanje() {
  proverBrojStrane();
  azurirajBrojStrane();
  brisiPrethodneStrane();
}

function azurirajBrojStrane() {
  $('#trenutna_strana').textContent = brojStrane;
  $('#ukupno_strana').textContent = ovajDokument.numPages;
}

function brisiPrethodneStrane() {
  var strane = document.querySelectorAll('.page');
  for (var i = 0; i < strane.length; i++) {
    strane[i].remove();
  }
}

function okreniStranu(broj) {
  brojStrane += broj;
  renderujStranu(brojStrane);
}

function proverBrojStrane() {
  if (brojStrane < 1) brojStrane = 1;
  if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages;
}

function isprazniTag() {
  $('#tag').value = "";
}

function $(selektor) {
  return document.querySelector(selektor);
}
