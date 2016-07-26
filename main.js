var zoom = 1;
var brojStrane = 1;
var fajl_url = 'ctut.pdf';
var platno = null;
var podloga = null;
var mesto_za_tekst = null;

window.addEventListener('load', function () {
  platno = document.getElementById("platno");
  podloga = platno.getContext("2d");
  mesto_za_tekst = document.getElementById("mesto_za_tekst");
  ucitajPdf(fajl_url);
});

document.addEventListener('click', function (e) {
  var element = e.target;
  if (element.classList.contains('js-idi-nazad')) idiNazad();
  if (element.classList.contains('js-idi-napred')) idiNapred();
}); // on click


/* FUNKCIJE */

function ucitajPdf(fajl_url) {
  PDFJS.disableWorker = true; // gasi workere zbog cross-origin greške
  PDFJS.getDocument(fajl_url).then(function renderujPdf(pdf) {
    pdf.getPage(brojStrane).then(renderujStranu);
  });
}

function renderujStranu(pdfStrana) {
  var vidno_polje = pdfStrana.getViewport(zoom); // namesta platno na velicinu vidnog polja
  platno.height = vidno_polje.height;
  platno.width = vidno_polje.width;

  mesto_za_tekst.style.height = vidno_polje.height + "px";
  mesto_za_tekst.style.width = vidno_polje.width + "px";
  mesto_za_tekst.offsetTop = platno.offsetTop;
  mesto_za_tekst.offsetLeft = platno.offsetLeft;

  pdfStrana.getTextContent().then(function (textContent) {
    var tekst_lejer = new TextLayerBuilder(mesto_za_tekst, pdfStrana.number - 1); // broji od nule
    tekst_lejer.setTextContent(textContent);

    var render_podloga = {
      canvasContext: podloga,
      viewport: vidno_polje,
      textLayer: tekst_lejer
    };
    pdfStrana.render(render_podloga);
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
