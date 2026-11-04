// 11/5 전학공 사례발표 사이트 — 수업 장면 카드, 그림 크게 보기, 차례 강조, 학생 데이터(data.js) 그리기
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// 3 수업 장면 — 그림은 가상 데이터 예시(odap-guide 와 같은 그림)
const FLOW = [
  ['01', '14-prep-diag', '준비 진단', '단원 들어가기 전 · 과제', [['s', '초등 입체도형 A·B 14문항, 답 + 이유 + 확신도'], ['s', '제출 뒤 AI가 정답 대신 되묻기 대화'], ['t', '초등 오개념(E1~E12) 분포를 반별로']]],
  ['02', '05-teacher-map', '사전 진단 — 회전체 탐정 노트', '회전체 수업 직전', [['s', '두 친구 주장 중 누구에게 동의? + 이유 + 확신도'], ['t', '반 오개념 지도(M1~M9)와 오개념별 수업 처방']]],
  ['03', '07-rotation-algeo3d', '회전체 만들기', '본차시 · 90분 블록 · 노트북', [['s', '42쪽 웹 활동지: 돌려 보고, 잘라 보고, 일반화'], ['s', '알지오3D → STL → 그림판3D → AR'], ['t', '쪽별 모니터링 · 📢 잘 쓴 답 공유']]],
  ['04', '10-live-student', '오답의 재발견 수업 1~3차시', '교사가 단계를 열며', [['s', '1차시 무엇이 맞을까? · 2차시 숨은 단서 · 3차시 성질 전문가'], ['t', '단계 열기·고정·마감, 선택 분포 실시간'], ['s', '끝에 3-Step 회고 + AI 피드백']]],
  ['05', '06-teacher-change', '사후 진단', '처방 수업 뒤', [['s', '겉모습만 바꾼 같은 개념 9문항(컵 → 휴지 심)'], ['t', '오개념마다 해소 · 지속 · 새로 생김']]],
  ['06', '02-home-change', '마무리 · 단원 내내', '단원 끝 · 매일', [['s', '내 생각의 변화(사전·사후 나란히), 3-Step 자가진단'], ['s', '오늘의 퀴즈 · 질문하기 · 수학 일기 · 탐정 수첩']]],
];
$('#flow').innerHTML = FLOW.map(([n, img, t, when, items]) => `<div class="fl c3">
  <button type="button" data-img="${img}" data-cap="${esc(t)}"><img src="img/odap/${img}.jpg" alt="${esc(t)} 화면"></button>
  <div class="tx"><div class="st"><i>${+n}</i>${esc(t)}</div><div class="when">📅 ${esc(when)}</div>
  <ul>${items.map(([w, x]) => `<li><span class="tag ${w}">${w === 's' ? '학생' : '교사'}</span>${esc(x)}</li>`).join('')}</ul></div></div>`).join('');

const dlg = $('#dlg');
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-img]'); if (!b) return;
  $('#dlg-img').src = `img/odap/${b.dataset.img}.jpg`;
  $('#dlg-cap').textContent = b.dataset.cap + ' (가상 데이터 예시 · 아무 곳이나 누르면 닫혀요)';
  dlg.showModal();
});
dlg.addEventListener('click', () => dlg.close());

// 차례: 지금 보는 마당 강조
const links = [...document.querySelectorAll('nav.toc a')];
const io = new IntersectionObserver((es) => {
  for (const e of es) if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section.part').forEach((s) => io.observe(s));

// 갤러리 QR(그림 파일)
$('#gal-qr').innerHTML = '<img src="img/gallery-qr.svg" alt="갤러리 QR 코드">';

// 4 학생 데이터
const D = window.DATA;
if (D) $('#data').innerHTML = renderData(D);

// 민수·지연·둘 다 아님 가로 막대(처음 생각·다시 생각이 같은 모양·순서라야 눈으로 비교된다)
function stack(o) {
  const seg = (w, col, txt) => `<div class="seg" style="width:${w}%;background:var(${col})">${txt}</div>`;
  return `<div class="stack">${seg(o.minsu, '--minsu', o.minsu >= 12 ? `민수 ${o.minsu}%` : '')}${seg(o.jiyeon, '--jiyeon', o.jiyeon >= 12 ? `지연 ${o.jiyeon}%` : '')}${seg(o.neither, '--neither', o.neither >= 6 ? o.neither + '%' : '')}</div>`;
}
function bar(segs) { return `<div class="track">${segs.map(([p, c]) => `<div class="seg" style="width:${p}%;background:${c}"></div>`).join('')}</div>`; }

function renderData(D) {
  const pct = (x) => `${x}%`;
  let h = `<div class="basis"><span>📅 <b>${esc(D.asof)}</b> 기준</span><span>👩‍🎓 <b>${esc(D.scope)}</b></span><span>🔒 이름·학번 없이 집계</span></div>`;
  if (D.kpis?.length) h += `<div class="grid4">${D.kpis.map((k) => `<div class="kpi"><b>${esc(k.v)}</b><span>${esc(k.l)}</span></div>`).join('')}</div>`;

  if (D.pre) {
    const p = D.pre;
    h += `<h3>① 수업 전: 사전 진단으로 본 오개념 <span style="font-size:14px;color:var(--muted);font-weight:600">${esc(p.n)}명 제출</span></h3>
      <p class="lead">${esc(p.lead)}</p>
      <div class="legend"><span><i style="background:#2a78d6"></i>확인(증거 2개 이상)</span><span><i style="background:#a9c8f0"></i>의심(증거 1개)</span></div>
      ${p.rows.map((r) => `<div class="hrow"><div class="lab">${esc(r.name)}<small>${esc(r.code)}</small></div>${bar([[r.confirm, '#2a78d6'], [r.suspect, '#a9c8f0']])}<div class="val">${pct(r.confirm + r.suspect)}</div></div>`).join('')}`;
  }

  if (D.first) {
    const f = D.first;
    h += `<h3>② 1차시 시작: 누구의 말이 맞을까?</h3>
      <div class="vs"><div class="a"><b>민수</b>“회전체를 회전축에 수직인 평면으로 자를 때 생기는 단면은 원 모양이야.”</div><div class="b"><b>지연 (정답)</b>“회전체를 회전축에 수직인 평면으로 자를 때 생기는 단면은 원 모양이 아닐 수도 있어.”</div></div>
      <div class="legend"><span><i style="background:var(--minsu)"></i>민수</span><span><i style="background:var(--jiyeon)"></i>지연(정답)</span><span><i style="background:var(--neither)"></i>둘 다 아님</span></div>
      <div class="rowlab">처음 생각 <small>${esc(f.n)}명</small></div>
      ${stack(f)}
      ${f.sure != null ? `<p class="lead" style="margin-top:8px">민수를 고른 학생 중 <b>${f.sure}%</b>가 ‘매우 자신 있음’(4점) → 오답이 몰라서 찍은 답이 아니라 <b>자신 있게 믿는 생각</b>이에요. 그래서 반례를 직접 보게 하는 처방 수업이 필요했어요.</p>` : ''}`;
  }

  if (D.change?.length) {
    const c = D.compare;
    h += `<h3>③ 반례를 만난 뒤: 생각이 바뀌었나?</h3>${D.changeLead ? `<p class="lead">${esc(D.changeLead)}</p>` : ''}
      ${c ? `<div class="cmp">
        <div class="legend"><span><i style="background:var(--minsu)"></i>민수</span><span><i style="background:var(--jiyeon)"></i>지연(정답)</span><span><i style="background:var(--neither)"></i>둘 다 아님</span><span class="cmp-n">두 번 모두 답한 같은 ${esc(c.n)}명</span></div>
        <div class="rowlab">처음 생각 <small>수업 시작</small></div>
        ${stack(c.before)}
        <div class="cmp-arrow">↓ 반례를 만난 뒤 <b>지연 ${c.before.jiyeon}% → ${c.after.jiyeon}%</b> · 민수 ${c.before.minsu}% → ${c.after.minsu}%</div>
        <div class="rowlab">다시 생각 <small>수업 끝</small></div>
        ${stack(c.after)}
      </div>` : ''}
      <div class="change">${D.change.map((c) => `<div class="kpi"><b>${esc(c.v)}</b><span>${esc(c.l)}</span></div>`).join('')}</div>`;
  }

  if (D.extra?.length) {
    h += `<h3>④ 단원 내내 쌓인 기록</h3><div class="grid4">${D.extra.map((k) => `<div class="kpi"><b>${esc(k.v)}</b><span>${esc(k.l)}</span></div>`).join('')}</div>`;
  }

  if (D.voices?.length) {
    h += `<h3>⑤ 학생의 목소리 <span style="font-size:14px;color:var(--muted);font-weight:600">원문 그대로 · 익명</span></h3>
      <div class="voices">${D.voices.map((v) => `<div class="voice"><div class="ctx">${esc(v.ctx)}</div>${v.lines.map((l, i) => (i && v.arrow ? `<div class="arrow">${esc(v.arrow)}</div>` : '') + `<p>“${esc(l)}”</p>`).join('')}</div>`).join('')}</div>`;
  }

  if (D.caveats?.length) h += `<div class="caveat">⚠️ 읽을 때 주의: ${D.caveats.map(esc).join(' ')}</div>`;
  h += `<div class="more"><a href="odap-stats.html" target="_blank" rel="noopener">학생 데이터 자세히 ↗</a><a href="https://j333333766-hub.github.io/odap-plc-ar-gallery/" target="_blank" rel="noopener">학생 회전체 작품 갤러리 ↗</a></div>`;
  return h;
}
