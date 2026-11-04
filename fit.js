// 100% 막대(.stack .seg) 안 글자가 칸보다 길면(휴대폰 등 좁은 화면) '민수 59%' → '59%' → 빈칸 순으로 줄인다.
// 원래 글자는 data-full 에 두고, 마우스를 올리면 title 로 볼 수 있게 한다. 화면 크기가 바뀌면 다시 맞춘다.
(function () {
  function fit() {
    document.querySelectorAll('.stack .seg').forEach(function (el) {
      if (el.dataset.full == null) {
        el.dataset.full = el.textContent.trim();
        if (el.dataset.full && !el.title) el.title = el.dataset.full;
      }
      var full = el.dataset.full;
      if (!full) return;
      el.textContent = full;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      var m = full.match(/\d+(\.\d+)?%/);
      el.textContent = m ? m[0] : '';
      if (el.scrollWidth > el.clientWidth + 1) el.textContent = '';
    });
  }
  window.fitStack = fit;
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 120); });
  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  setTimeout(fit, 0);
})();
