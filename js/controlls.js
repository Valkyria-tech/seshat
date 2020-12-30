var LAST_QUERY = '';

function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function search(query) {
  LAST_QUERY = query;

  pdfFindController.executeCommand('find', {
    query: query,
    caseSensitive: false,
    findPrevious: undefined,
    highlightAll: true,
    phraseSearch: true
  });
}

function searchNext() {
  // navigate to next result page
  for (let i = (pdfSinglePageViewer.currentPageNumber); i < pdfFindController._pageMatches.length; i++) {
    if(pdfFindController._pageMatches[i].length > 0) {
      let nextPageIndex = (i + 1);
      pdfSinglePageViewer.currentPageNumber = nextPageIndex;
      break;
    }
  }
}

function searchPrevious() {
  // navigate to previous result page
  for (let i = (pdfSinglePageViewer.currentPageNumber - 1); i >= 0; i--) {
    if(pdfFindController._pageMatches[i].length > 0) {
      if(pdfSinglePageViewer.currentPageNumber != (i + 1)) {
        let nextPageIndex = (i + 1);
        pdfSinglePageViewer.currentPageNumber = nextPageIndex;
        break;
      }
    }
  }
}

docReady(function() {
  console.log('Filhos de Gondor, de Rohan, meus irmãos! Vejo em seus olhos o mesmo medo que domou meu coração. Poderá haver um dia em que deserdamos os nossos amigos e traímos os laços de amizade. Mas esse dia não é hoje! Uma hora de lobos e escudos despedaçados quando a era dos homens for destruída. Mas esse dia não é hoje! Hoje, nós lutamos!');

  if(document.getElementById('viewer')) {
    const viewer = document.getElementById('viewer');
  }

  var renderingStateTimer = setInterval(function() {
    if(pdfSinglePageViewer._pages[0]) {
      if(pdfSinglePageViewer._pages[0].renderingState === 3) {

        // page front controller
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        let page = Number(searchParams.get('page'));
        if(page != null && page != 0)
          pdfSinglePageViewer.currentPageNumber = page;

        clearInterval(renderingStateTimer);
      }
    }
  }, 10);

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

  //========== SEARCH ==========

  if(document.getElementById('searchTxt')) {

    let searchTxt = document.getElementById('searchTxt');

    searchTxt.addEventListener('change', function() {

      search(this.value);

    });

    searchTxt.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        if(LAST_QUERY == searchTxt.value) {
          searchNext();
        }
      }
    });

    document.getElementById('searchBtn').addEventListener('click', function() {
      if(searchTxt.value != null && searchTxt.value != '') {
        search(searchTxt.value);
      } else {
        searchTxt.focus();
      }
    });

    document.getElementById('searchNext').addEventListener('click', function(){
      if(LAST_QUERY == searchTxt.value) {
        searchNext();
      }
    });

    document.getElementById('searchPrevious').addEventListener('click', function(){
      if(LAST_QUERY == searchTxt.value) {
        searchPrevious();
      }
    });

  }

  //========== ZOOM / SCROLL CONTROLLS ==========

  if(document.getElementById('zoomIn'))
    document.getElementById('zoomIn').addEventListener('click', function(){
      pdfSinglePageViewer.currentScale += 0.1;
    });

  if(document.getElementById('zoomOut'))
    document.getElementById('zoomOut').addEventListener('click', function(){
      if(pdfSinglePageViewer.currentScale - 0.1 >= 0.15)
        pdfSinglePageViewer.currentScale -= 0.1;
    });

  if(document.getElementById('fullscreen'))
    document.getElementById('fullscreen').addEventListener('click', function(){
      document.getElementById('viewerContainer').classList.toggle('fullscreen');
      document.getElementById('controlls').classList.toggle('controlls-fullscreen');
    });

  viewer.addEventListener('wheel', function(e){

    // block window scroll
    document.querySelector('body').classList.add('no-scroll');

    let delta = e.deltaY;
    let zoomValue = 0.05;

    if (delta < 0) {
      pdfSinglePageViewer.currentScale += zoomValue;
    } else {
      if(pdfSinglePageViewer.currentScale - zoomValue >= 0.15)
        pdfSinglePageViewer.currentScale -= zoomValue;
    }

    // reset window scroll
    setTimeout(function(){
      document.querySelector('body').classList.remove('no-scroll');
    }, 2000);

    return false;
  });

  var hammertime = new Hammer(viewer, { touchAction: 'pan-x pan-y' });
  hammertime.get('pinch').set({enable: true});
  hammertime.get('pan').set({enable: true});

  hammertime.on("pinchin", function(e) {
    if(pdfSinglePageViewer.currentScale - 0.02 >= 0.15)
      pdfSinglePageViewer.currentScale -= 0.02;
  });

  hammertime.on("pinchout", function(e) {
    pdfSinglePageViewer.currentScale += 0.02;
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
