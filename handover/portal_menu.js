/* ============================================================
   Portal navigation: minimal, accessible behaviour.
   No animation, no dependencies. The links and structure work
   without this script; it only opens/closes the panel and the
   groups. Uses event delegation, so it works for any menu depth.
   ============================================================ */
(function () {
  'use strict';

  var toggle  = document.querySelector('.portal-menu-toggle');
  var panel   = document.getElementById('portal-menu-panel');
  var overlay = document.querySelector('.portal-menu-overlay');
  var closeEl = document.querySelector('.portal-menu-close');
  if (!toggle || !panel || !overlay) return;

  function openMenu() {
    overlay.hidden = false;
    panel.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    var first = panel.querySelector('a, button');
    if (first) first.focus();
  }

  function closeMenu() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    overlay.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  /* Visible, focusable elements inside the panel (collapsed sub lists are
     hidden, so their links are excluded automatically). */
  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  toggle.addEventListener('click', function () {
    if (panel.classList.contains('open')) { closeMenu(); } else { openMenu(); }
  });
  overlay.addEventListener('click', closeMenu);
  if (closeEl) closeEl.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('open')) return;

    if (e.key === 'Escape') { closeMenu(); return; }

    /* Trap focus inside the panel while it is open */
    if (e.key === 'Tab') {
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault(); first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* Expand / collapse a group (delegated, so any depth works) */
  panel.addEventListener('click', function (e) {
    var btn = e.target.closest('.portal-menu-expand');
    if (!btn) return;

    var group = btn.closest('.portal-menu-group');
    var sub   = group.querySelector(':scope > .portal-menu-sub');
    var open  = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', String(!open));
    group.classList.toggle('open', !open);
    if (sub) sub.hidden = open;

    /* OPTIONAL: one section open at a time. Delete this block for
       a menu where everything toggles freely. */
    if (!open && group.classList.contains('level-1')) {
      var siblings = group.parentElement.children;
      for (var i = 0; i < siblings.length; i++) {
        var s = siblings[i];
        if (s !== group && s.classList && s.classList.contains('open')) {
          s.classList.remove('open');
          var sBtn = s.querySelector(':scope > .portal-menu-row > .portal-menu-expand');
          var sSub = s.querySelector(':scope > .portal-menu-sub');
          if (sBtn) sBtn.setAttribute('aria-expanded', 'false');
          if (sSub) sSub.hidden = true;
        }
      }
    }
  });

})();
