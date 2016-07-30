/*** VARIJABLE ***/

var zoom = 1;
var id = null;
var vrsta = null;
var platno = null;
var podloga = null;
var ovajDokument = null;
var brojStrane = 1;
var fajl_url = 'ctut.pdf';

/*** DOGAĐAJI ***/

window.addEventListener('load', function () {
  platno = $('#platno');
  platno.width = platno.parentElement.offsetWidth;
  platno.height = window.innerHeight;
  podloga = platno.getContext('2d');
  podloga.font = "bold 16px Arial";
  podloga.fillText("Dokument se učitava...", platno.width / 2 - 100, 100);

  ucitajPDF(fajl_url);
}); // on load

document.addEventListener('click', function (e) {
  var element = e.target;
  if (element.classList.contains('js-idi-nazad')) idiNazad();
  if (element.classList.contains('js-idi-napred')) idiNapred();
}); // on click

/*** FUNKCIJE ***/

function ucitajPDF(fajl_url) {
  PDFJS.disableWorker = true; // disable workers to avoid cross-origin issue
  PDFJS.getDocument(fajl_url).then(function (pdf) {
    ovajDokument = pdf;
    if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages;
    renderujStranu();
  });
}

function renderujStranu() {
  $('#trenutna_strana').textContent = brojStrane;
  $('#ukupno_strana').textContent = ovajDokument.numPages;
  ovajDokument.getPage(brojStrane).then(function (pdfStrana) {
    var roditeljskaSirina = platno.parentElement.offsetWidth;
    var vidno_polje = pdfStrana.getViewport (roditeljskaSirina / pdfStrana.getViewport(zoom).width);
    platno.height = vidno_polje.height;
    platno.width = vidno_polje.width;
    var renderOpcije = {
      canvasContext: podloga,
      viewport: vidno_polje
    };
    pdfStrana.render(renderOpcije);
  });
}

function idiNazad() {
  if (brojStrane <= 1) return;
  brojStrane--;
  renderujStranu(brojStrane);
}

function idiNapred() {
  if (brojStrane >= ovajDokument.numPages) return;
  brojStrane++;
  renderujStranu(brojStrane);
}

function isprazniTag() {
  $('#tag').value = "";
}


function $(selektor) {
  return document.querySelector(selektor);
}
