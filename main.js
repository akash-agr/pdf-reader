var pdfBase64 = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';

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

  var pdfUint8Array = prevedi_base64_u_uint8Array(pdfBase64);
  ucitajPdf(fajl_url);
});

document.addEventListener('click', function (e) {
  var element = e.target;
  if (element.classList.contains('js-idi-nazad')) idiNazad();
  if (element.classList.contains('js-idi-napred')) idiNapred();
}); // on click


/* FUNKCIJE */

function prevedi_base64_u_uint8Array(base64) {
  var sirovo = atob(base64); // prirodna funkcija koja dekodira base64
  var uint8Array = new Uint8Array(new ArrayBuffer(sirovo.length));
  for (var i = 0; i < sirovo.length; i++) {
    uint8Array[i] = sirovo.charCodeAt(i);
  }
  return uint8Array;
}

function ucitajPdf(fajl_url) {
  PDFJS.disableWorker = true; // gasi workere zbog cross-origin greške
  PDFJS.getDocument(fajl_url).then(function (pdf) {
    ovajDokument = pdf;
    renderujStranu();
  });
}

function renderujStranu() {
  ovajDokument.getPage(brojStrane).then(function (pdfStrana) {
    var vidno_polje = pdfStrana.getViewport(zoom); // namesta platno na velicinu vidnog polja
    platno.height = vidno_polje.height;
    platno.width = vidno_polje.width;

    mesto_za_tekst.style.height = vidno_polje.height + "px";
    mesto_za_tekst.style.width = vidno_polje.width + "px";
    mesto_za_tekst.offsetTop = platno.offsetTop;
    mesto_za_tekst.offsetLeft = platno.offsetLeft;

    pdfStrana.getTextContent().then(function renderujTekst(tekstualniSadrzaj) {
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
