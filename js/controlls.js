function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(function() {
  console.log('Filhos de Gondor, de Rohan, meus irmãos! Vejo em seus olhos o mesmo medo que domou meu coração. Poderá haver um dia em que deserdamos os nossos amigos e traímos os laços de amizade. Mas esse dia não é hoje! Uma hora de lobos e escudos despedaçados quando a era dos homens for destruída. Mas esse dia não é hoje! Hoje, nós lutamos!');

  if(document.getElementById('viewer')) {
    const viewer = document.getElementById('viewer');
  }

  //========== CONTROLLS ==========

  if(document.getElementById('previousBtn'))
    document.getElementById('previousBtn').addEventListener('click', function(){
      if(pdfSinglePageViewer.currentPageNumber - 1 > 0)
        pdfSinglePageViewer.currentPageNumber -= 1;
    });

  if(document.getElementById('nextBtn'))
    document.getElementById('nextBtn').addEventListener('click', function(){
      if(pdfSinglePageViewer.currentPageNumber + 1 <= pdfSinglePageViewer.pdfDocument.numPages)
        pdfSinglePageViewer.currentPageNumber += 1;
    });

  //========== SCROLL CONTROLLS ==========

  if(document.getElementById('zoomIn'))
    document.getElementById('zoomIn').addEventListener('click', function(){
      pdfSinglePageViewer.currentScale += 0.25;
    });

  if(document.getElementById('zoomOut'))
    document.getElementById('zoomOut').addEventListener('click', function(){
      if(pdfSinglePageViewer.currentScale - 0.25 >= 0.15)
        pdfSinglePageViewer.currentScale -= 0.25;
    });

  viewer.addEventListener('wheel', function(e){

    let delta = e.deltaY;
    let zoomValue = 0.05;

    if (delta < 0) {
      pdfSinglePageViewer.currentScale += zoomValue;
    } else {
      if(pdfSinglePageViewer.currentScale - zoomValue >= 0.15)
        pdfSinglePageViewer.currentScale -= zoomValue;
    }

    return false;
  });

  //========== DRAG CONTROLL ==========

  if(viewer) {
    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    const moveVelocity = 1; // default velocity

    viewer.addEventListener('mousedown', (e) => {

      isDown = true;
      viewer.classList.add('active');
      startX = e.pageX - viewer.offsetLeft;
      startY = e.pageY - viewer.offsetTop;
      scrollLeft = viewer.scrollLeft;
      scrollTop = viewer.scrollTop;

    });
    viewer.addEventListener('mouseleave', () => {
      isDown = false;
      viewer.classList.remove('active');
    });
    viewer.addEventListener('mouseup', () => {
      isDown = false;
      viewer.classList.remove('active');
    });
    viewer.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();

      const x = e.pageX - viewer.offsetLeft;
      const y = e.pageY - viewer.offsetTop;

      const walkX = (x - startX) * moveVelocity;
      viewer.scrollLeft = scrollLeft - walkX;

      const walkY = (y - startY) * moveVelocity;
      viewer.scrollTop = scrollTop - walkY;
    });
  }

});
