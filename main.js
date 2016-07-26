var pdfBase64 = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';

var scale = 1; // zoom
var platno = document.getElementById("platno");
var podloga = platno.getContext("2d");
var mesto_za_tekst = document.getElementById("mesto_za_tekst");

var pdfUint8Array = prevedi_base64Strunu_u_uint8Array(pdfBase64);
ucitajPdf(pdfUint8Array);

/* FUNKCIJE */

function prevedi_base64Strunu_u_uint8Array(base64) {
  var sirovo = atob(base64); // prirodna funkcija koja dekodira base64
  var uint8Array = new Uint8Array(new ArrayBuffer(sirovo.length));
  for (var i = 0; i < sirovo.length; i++) {
    uint8Array[i] = sirovo.charCodeAt(i);
  }
  return uint8Array;
}

function ucitajPdf(pdfUint8Array) {
  PDFJS.disableWorker = true; // gasi workere zbog cross-origin greške
  PDFJS.getDocument(pdfUint8Array).then(function renderujPdf(pdf) {
    pdf.getPage(1).then(renderujStranu);
  });
}

function renderujStranu(strana) {
  var vidno_polje = strana.getViewport(scale); // namesta platno na velicinu vidnog polja
  platno.height = vidno_polje.height;
  platno.width = vidno_polje.width;

  mesto_za_tekst.style.height = vidno_polje.height + "px";
  mesto_za_tekst.style.width = vidno_polje.width + "px";
  mesto_za_tekst.offsetTop = platno.offsetTop;
  mesto_za_tekst.offsetLeft = platno.offsetLeft;

  strana.getTextContent().then(function (textContent) {
    var tekst_lejer = new TextLayerBuilder(mesto_za_tekst, strana.number - 1); // broji od nule
    tekst_lejer.setTextContent(textContent);

    var render_podloga = {
      canvasContext: podloga,
      viewport: vidno_polje,
      textLayer: tekst_lejer
    };
    strana.render(render_podloga);
  });
}
