(function(){
  const lb = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const btnZoomIn = document.getElementById('lb-zoom-in');
  const btnZoomOut = document.getElementById('lb-zoom-out');
  const btnReset = document.getElementById('lb-reset');
  const btnClose = document.getElementById('lb-close');
  const btnDownload = document.getElementById('lb-download');

  let scale = 1;
  let originX = 0.5, originY = 0.5;
  let isOpen = false;

  function open(src, alt){
    lbImage.src = src;
    lbImage.alt = alt || '';
    scale = 1;
    setTransform();
    btnDownload.href = src;
    lb.classList.remove('lb-hidden');
    lb.setAttribute('aria-hidden','false');
    isOpen = true;
  }

  function close(){
    lb.classList.add('lb-hidden');
    lb.setAttribute('aria-hidden','true');
    lbImage.src = '';
    isOpen = false;
  }

  function setTransform(){
    lbImage.style.transform = `translate(-50%,-50%) scale(${scale})`;
    lbImage.style.position = 'relative';
    lbImage.style.left = '50%';
    lbImage.style.top = '50%';
  }

  function zoom(delta){
    scale = Math.max(0.4, Math.min(6, scale + delta));
    setTransform();
  }

  // Attach clicks to ministry images
  function attach(){
    const imgs = document.querySelectorAll('.ministry-card img');
    imgs.forEach(img => {
      img.style.touchAction = 'manipulation';
      img.addEventListener('click', (e) => {
        open(img.src, img.alt);
      });
    });
  }

  // Toolbar actions
  btnZoomIn.addEventListener('click', () => zoom(0.3));
  btnZoomOut.addEventListener('click', () => zoom(-0.3));
  btnReset.addEventListener('click', () => { scale = 1; setTransform(); });
  btnClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoom(0.2);
    if (e.key === '-') zoom(-0.2);
    if (e.key === '0') { scale = 1; setTransform(); }
  });

  // Wheel to zoom
  lb.addEventListener('wheel', (e) => {
    if (!isOpen) return;
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.08;
    zoom(delta);
  }, { passive: false });

  // Pointer drag to pan
  let dragging = false;
  let lastX = 0, lastY = 0;
  let translateX = 0, translateY = 0;

  lbImage.addEventListener('pointerdown', (e) => {
    if (scale <= 1) return;
    dragging = true; lbImage.setPointerCapture(e.pointerId);
    lastX = e.clientX; lastY = e.clientY;
    lbImage.style.cursor = 'grabbing';
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX; const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    translateX += dx; translateY += dy;
    lbImage.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
  });
  window.addEventListener('pointerup', (e) => {
    if (!dragging) return; dragging = false; lbImage.style.cursor = 'grab';
  });

  // Re-attach on DOM load
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
