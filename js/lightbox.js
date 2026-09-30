// Click any <img data-full="..."> to view it large. Images sharing a data-group
// can be browsed with arrows/keys; hidden (filtered-out) images are skipped.
(function () {
  var overlay, imgEl, capEl, items = [], index = 0;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="">' +
      '<div class="lb-caption"></div>' +
      '<button class="lb-btn lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector('img');
    capEl = overlay.querySelector('.lb-caption');
    overlay.querySelector('.lb-close').onclick = close;
    overlay.querySelector('.lb-prev').onclick = function (e) { e.stopPropagation(); step(-1); };
    overlay.querySelector('.lb-next').onclick = function (e) { e.stopPropagation(); step(1); };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  }

  function visible(el) { return el.offsetParent !== null; }

  function show() {
    var el = items[index];
    imgEl.src = el.getAttribute('data-full');
    imgEl.alt = el.alt || '';
    capEl.textContent = el.getAttribute('data-caption') || el.alt || '';
    var multi = items.length > 1;
    overlay.querySelector('.lb-prev').style.display = multi ? '' : 'none';
    overlay.querySelector('.lb-next').style.display = multi ? '' : 'none';
  }

  function open(el) {
    if (!overlay) build();
    var group = el.getAttribute('data-group');
    items = group
      ? Array.prototype.filter.call(document.querySelectorAll('img[data-full][data-group="' + group + '"]'), visible)
      : [el];
    index = Math.max(0, items.indexOf(el));
    show();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function step(d) {
    index = (index + d + items.length) % items.length;
    show();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('img[data-full]') : null;
    if (!el) return;
    e.preventDefault();
    open(el);
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();
