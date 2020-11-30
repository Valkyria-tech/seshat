var pdfState = {
  pdf: null,
  currentPage: 1,
  zoom: 1
}

var rendering = false;

function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function render() {
  pdfState.pdf.getPage(pdfState.currentPage).then((page) => {

    let canvas = document.getElementById('pdf_renderer');
    let ctx = canvas.getContext('2d');

    let viewport = page.getViewport(pdfState.zoom);

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    rendering = true;
    page.render({
      canvasContext: ctx,
      viewport: viewport
    }).then(function () {
      rendering = false;
    }).catch(function(error){
      console.log('Error :: ' + error);
      rendering = false;
    });

  });
}

docReady(function() {
  console.log('Filhos de Gondor, de Rohan, meus irmãos! Vejo em seus olhos o mesmo medo que domou meu coração. Poderá haver um dia em que deserdamos os nossos amigos e traímos os laços de amizade. Mas esse dia não é hoje! Uma hora de lobos e escudos despedaçados quando a era dos homens for destruída. Mas esse dia não é hoje! Hoje, nós lutamos!');

  // ========== LOAD PDF FILE ==========
  pdfjsLib.getDocument('./content/frankenstein.pdf').promise.then((pdf) => {

    pdfState.pdf = pdf;
    render();

  });

  //========== CONTROLLS ==========
  if(document.getElementById('previousBtn'))
    document.getElementById('previousBtn').addEventListener('click', function(){
      if(pdfState.pdf == null|| pdfState.currentPage == 1)
        return;

        pdfState.currentPage -= 1;
        document.getElementById("currentPage").value = pdfState.currentPage;
        render();
    });

  if(document.getElementById('nextBtn'))
    document.getElementById('nextBtn').addEventListener('click', function(){
      if(pdfState.pdf == null|| pdfState.currentPage >= pdfState.pdf._pdfInfo.numPages)
        return;

        pdfState.currentPage += 1;
        document.getElementById("currentPage").value = pdfState.currentPage;
        render();
    });

  if(document.getElementById('currentPage')) {
    let currentPageInput = document.getElementById('currentPage');
    currentPageInput.addEventListener('change', function(){
      let pageNumber = currentPageInput.valueAsNumber;
      if(pageNumber >= 1 && pageNumber <= pdfState.pdf._pdfInfo.numPages)
        pdfState.currentPage = pageNumber;
        render();
    });
  }

  if(document.getElementById('zoomIn'))
    document.getElementById('zoomIn').addEventListener('click', function(){
      if(pdfState.pdf == null) return;

      pdfState.zoom += 0.5;
      render();
    });

  if(document.getElementById('zoomOut'))
    document.getElementById('zoomOut').addEventListener('click', function(){
      if(pdfState.pdf == null) return;

      pdfState.zoom -= 0.5;
      render();
    });

  let lastVerticalScroll = 0;
  window.addEventListener('wheel', function(e){

    let delta = e.deltaY;
    let zoomValue = delta / 100;

    console.log(pdfState.zoom + zoomValue);

    if((pdfState.zoom + zoomValue) > 0.5 && (pdfState.zoom + zoomValue) < 2.0)
      pdfState.zoom += zoomValue;
      if(!rendering)
        render();

    if (delta < 0) {
      //scroll up
    } else {
      //scroll down
    }

    return false;
  });

});
