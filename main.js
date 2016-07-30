var zoom = 1;
var brojStrane = 1;
var fajl_url = '4_1_5.pdf';
var drzac = null;

PDFJS.workerSrc = 'libs/pdfjs/pdf.worker.js';

window.addEventListener('load', function() {
  drzac = document.getElementById('pdf-drzac');
  ucitajPDF(fajl_url);
});

function ucitajPDF(fajl_url) {
  PDFJS.getDocument(fajl_url).then(function(ovajDokument) {
    return ovajDokument.getPage(brojStrane).then(function(pdfStrana) {
      var renderOpcije = {
        container: drzac,
        scale: zoom,
        defaultViewport: pdfStrana.getViewport(zoom),
        textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
        // annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
      };
      var pdfPrikaz = new PDFJS.PDFPageView(renderOpcije);
      pdfPrikaz.setPdfPage(pdfStrana);
      return pdfPrikaz.draw();
    });
  });
}
