var zoom = 1;
var brojStrane = 1;
var fajl_url = 'draza.pdf';
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

function ucitajPdf(fajl) {
  PDFJS.disableWorker = true; // gasi workere zbog cross-origin greške
  PDFJS.getDocument(fajl)
    .then(function (pdf) {
      ovajDokument = pdf;
      renderujStranu();
    });
}

function renderujStranu() {
  ovajDokument.getPage(brojStrane)
    .then(function (pdfStrana) {
      var vidno_polje = pdfStrana.getViewport(zoom); // namesta platno na velicinu vidnog polja
      platno.height = vidno_polje.height;
      platno.width = vidno_polje.width;
      pozicionirajText(vidno_polje);

      pdfStrana.getTextContent().then(function (tekstualniSadrzaj) {
        var tekst_lejer = new TextLayerBuilder(mesto_za_tekst, pdfStrana.number - 1); // broji od nule
        tekst_lejer.setTextContent(tekstualniSadrzaj);
        var renderOpcije = {
          canvasContext: podloga,
          viewport: vidno_polje,
          textLayer: tekst_lejer
        };
        pdfStrana.render(renderOpcije);
      });
    });
}

function pozicionirajText(vidno_polje) {
  mesto_za_tekst.style.height = vidno_polje.height + "px";
  mesto_za_tekst.style.width = vidno_polje.width + "px";
  mesto_za_tekst.offsetTop = platno.offsetTop;
  mesto_za_tekst.offsetLeft = platno.offsetLeft;
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
