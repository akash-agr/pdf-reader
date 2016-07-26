/*** VARIJABLE ***/

var id = null;
var vrsta = null;
var platno = null;
var sadrzaj = null;
var ovajDokument = null;
var brojStrane = null;

/*** DOGAĐAJI ***/

window.addEventListener('load', function () {
  vrsta = 2;
  platno = $('#platno');

  if (vrsta == 2) {
    platno.width = platno.parentElement.offsetWidth;
    platno.height = window.innerHeight;
    sadrzaj = platno.getContext('2d');
    sadrzaj.font = "bold 16px Arial";
    sadrzaj.fillText("Dokument se učitava...", platno.width / 2 - 100, 100);
    brojStrane = 1;
    ucitajPDF();
  }

}); // on load

document.addEventListener('click', function (e) {
  var element = e.target;

  if (element.classList.contains('js-idi-nazad')) idiNazad();

  if (element.classList.contains('js-idi-napred')) idiNapred();

}); // on click

/*** FUNKCIJE ***/

function ucitajPDF() {
  var fajl_url = 'ctut.pdf';
  PDFJS.disableWorker = true; // disable workers to avoid cross-origin issue
  // asinhrono downloaduje PDF kao ArrayBuffer
  PDFJS.getDocument(fajl_url).then(function (_pdfDoc) {
    ovajDokument = _pdfDoc;
    if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages;
    renderujStranu(brojStrane);
  });
}

function renderujStranu(broj) {
  // koristi promise da fetchuje stranu
  ovajDokument.getPage(broj).then(function (pdfStrana) {
    // prilagodjava se raspoloživoj širini
    var roditeljskaSirina = platno.parentElement.offsetWidth;
    var viewport = pdfStrana.getViewport(roditeljskaSirina / pdfStrana.getViewport(1.0).width);
    platno.height = viewport.height;
    platno.width = viewport.width;
    // renderuje PDF stranu na platno
    var renderContext = {
      canvasContext: sadrzaj,
      viewport: viewport
    };
    pdfStrana.render(renderContext);
  });
  $('#trenutna_strana').textContent = brojStrane;
  $('#ukupno_strana').textContent = ovajDokument.numPages;
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
