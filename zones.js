// zones.js - Zone selection & Zone 2 support
let currentZone = 0;
const ZONE_INFO = [
  { id: 0, name: "第一区", sub: "基础三角方程", badge: "ZONE 1", color: "cyan", levels: null, themeClass: "" },
  { id: 1, name: "第二区", sub: "二倍角方程", badge: "ZONE 2", color: "pink", levels: null, themeClass: "z2-theme" }
];

function isZone1Complete() {
  return completed.every(c => c === true);
}

function renderZoneScreen() {
  const container = document.getElementById("zone-cards");
  if (!container) return;
  container.innerHTML = "";
  ZONE_INFO.forEach((z, i) => {
    const locked = i > 0 && !isZone1Complete();
    const done = i === 0 && isZone1Complete();
    const card = document.createElement("div");
    card.className = "zone-card glass-panel z-" + z.color + (locked ? " locked" : "") + (done ? " zone-done" : "");
    card.innerHTML = "<div class=\"zone-num\">" + z.name + "</div><div class=\"zone-name\">" + z.sub + "</div><div class=\"zone-desc\">" + (locked ? "通关第一区解锁" : "共3个关卡") + "</div>";
    if (!locked) card.onclick = function() { currentZone = i; showScreen("level-screen"); };
    container.appendChild(card);
  });
}

// --- Override showScreen ---
const _origShowScreen = showScreen;
showScreen = function(id) {
  if (id === "zone-screen") {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("zone-screen").classList.add("active");
    renderZoneScreen();
    return;
  }
  if (id === "level-screen") {
    const zi = ZONE_INFO[currentZone];
    const badge = document.getElementById("zone-badge-text");
    const title = document.getElementById("zone-title");
    if (badge) badge.textContent = zi.badge;
    if (title) { title.textContent = zi.name + " · " + zi.sub; title.className = currentZone === 1 ? "neon-pink-text" : "neon-text"; }
    document.getElementById("level-screen").classList.toggle("z2-theme", currentZone === 1);
  }
  _origShowScreen(id);
  if (id === "level-screen") renderLevels();
};

// --- Override renderLevels ---
const _origRenderLevels = renderLevels;
renderLevels = function() {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  const comp = currentZone === 0 ? completed : (window.completed2 = window.completed2 || ZONE2_LEVELS.map(() => false));
  const grid = document.getElementById("levels-grid");
  grid.innerHTML = "";
  lvs.forEach((lv, i) => {
    const card = document.createElement("div");
    card.className = "level-card glass-panel " + (comp[i] ? "completed" : "");
    card.innerHTML = "<div class=\"level-num\">" + lv.id + "</div><div class=\"level-eq\">" + lv.equation + "</div><div class=\"level-desc\">找到0°~360°范围内所有满足方程的角度</div>";
    card.onclick = function() { startLevel(i); };
    grid.appendChild(card);
  });
};

// --- Override startLevel ---
const _origStartLevel = startLevel;
startLevel = function(idx) {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  currentLevel = idx;
  foundAnswers = [];
  attempts = 0;
  currentAngle = 0;
  showScreen("game-screen");
  document.getElementById("game-screen").classList.toggle("z2-theme", currentZone === 1);
  const lv = lvs[idx];
  document.getElementById("level-tag").textContent = "关卡 " + lv.id;
  document.getElementById("question-text").textContent = "求解: " + lv.equation;
  document.getElementById("hint-box").innerHTML = lv.hint;
  // Add/remove double angle value boxes
  let dblContainer = document.getElementById("dbl-values");
  if (currentZone === 1) {
    if (!dblContainer) {
      dblContainer = document.createElement("div");
      dblContainer.id = "dbl-values";
      dblContainer.className = "values-display";
      dblContainer.innerHTML = "<div class=\"val-box dbl-box glass-panel\"><div class=\"val-label\">SIN(2x)</div><div class=\"val-num\" id=\"sin2-val\">0.000</div></div><div class=\"val-box dbl-box glass-panel\"><div class=\"val-label\">COS(2x)</div><div class=\"val-num\" id=\"cos2-val\">1.000</div></div>";
      document.querySelector(".values-display").after(dblContainer);
    }
    dblContainer.style.display = "flex";
  } else if (dblContainer) {
    dblContainer.style.display = "none";
  }
  renderAnswerSlots();
  updateProgress();
  resizeCircleCanvas();
  drawCircle();
  document.getElementById("modal-title").textContent = "关卡 " + lv.id + " · 知识卡片";
  document.getElementById("modal-content").innerHTML = lv.knowledge;
  openModal("knowledge-modal");
};

// --- Override renderAnswerSlots ---
const _origRenderAnswerSlots = renderAnswerSlots;
renderAnswerSlots = function() {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  const lv = lvs[currentLevel];
  const area = document.getElementById("answer-area");
  area.innerHTML = "";
  lv.answers.forEach(function(_, i) {
    const slot = document.createElement("div");
    slot.className = "answer-slot";
    slot.id = "slot-" + i;
    slot.textContent = "?";
    area.appendChild(slot);
  });
  const btn = document.createElement("button");
  btn.className = "btn btn-small btn-green submit-angle-btn";
  btn.textContent = "提交角度";
  btn.onclick = submitAnswer;
  area.appendChild(btn);
  document.getElementById("answers-needed").textContent = "需要找到 " + lv.answers.length + " 个角度 (0° ≤ x < 360°)";
};

// --- Override submitAnswer ---
const _origSubmitAnswer = submitAnswer;
submitAnswer = function() {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  const comp = currentZone === 0 ? completed : window.completed2;
  const lv = lvs[currentLevel];
  const deg = Math.round(currentAngle * 180 / Math.PI + 360) % 360;
  attempts++;
  if (foundAnswers.includes(deg)) return;
  let matchIdx = -1;
  lv.answers.forEach(function(ans, i) {
    if (Math.abs(deg - ans) <= 3 && !foundAnswers.some(function(fa) { return Math.abs(fa - ans) <= 3; })) {
      matchIdx = i;
    }
  });
  if (matchIdx >= 0) {
    foundAnswers.push(lv.answers[matchIdx]);
    const slot = document.getElementById("slot-" + matchIdx);
    slot.textContent = lv.answers[matchIdx] + "°";
    slot.classList.add("filled");
    slot.style.transform = "scale(1.15)";
    setTimeout(function() { slot.style.transform = ""; }, 300);
    updateProgress();
    if (foundAnswers.length === lv.answers.length) {
      setTimeout(function() { showSummary(); }, 600);
    }
  } else {
    document.querySelectorAll(".answer-slot:not(.filled)").forEach(function(s) {
      s.classList.add("wrong");
      setTimeout(function() { s.classList.remove("wrong"); }, 500);
    });
  }
};

// --- Override updateProgress ---
const _origUpdateProgress = updateProgress;
updateProgress = function() {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  const lv = lvs[currentLevel];
  document.getElementById("progress-info").innerHTML = "已找到: <span style=\"color:var(--neon-green)\">" + foundAnswers.length + "</span> / " + lv.answers.length + " 个解<br>尝试次数: " + attempts + "<br>" + foundAnswers.map(function(a) { return "✓ " + a + "°"; }).join("<br>");
};

// --- Override showSummary ---
const _origShowSummary = showSummary;
showSummary = function() {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  const comp = currentZone === 0 ? completed : window.completed2;
  const lv = lvs[currentLevel];
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const stars = attempts <= lv.answers.length ? 3 : attempts <= lv.answers.length + 2 ? 2 : 1;
  comp[currentLevel] = true;
  var starsHtml = "";
  for (var i = 0; i < 3; i++) { starsHtml += "<span class=\"star " + (i < stars ? "active" : "") + "\">★</span>"; }
  document.getElementById("summary-title").textContent = "🎉 关卡 " + lv.id + " 通过!";
  document.getElementById("summary-stars").innerHTML = starsHtml;
  document.getElementById("summary-stats").innerHTML = "<div class=\"summary-stat\">用时: <span>" + elapsed + "秒</span></div><div class=\"summary-stat\">尝试次数: <span>" + attempts + "</span></div><div class=\"summary-stat\">答案: <span>" + lv.answers.map(function(a) { return a + "°"; }).join(", ") + "</span></div>";
  document.getElementById("summary-tip").innerHTML = lv.summary;
  var nextBtn = document.getElementById("next-level-btn");
  if (currentLevel < lvs.length - 1) {
    nextBtn.style.display = "";
    nextBtn.textContent = "下一关 →";
    nextBtn.onclick = function() { closeModal("summary-modal"); nextLevel(); };
  } else {
    nextBtn.style.display = "";
    nextBtn.textContent = "🏆 本区通关!";
    nextBtn.onclick = function() { closeModal("summary-modal"); showScreen("zone-screen"); };
  }
  openModal("summary-modal");
};

// --- Override nextLevel ---
const _origNextLevel = nextLevel;
nextLevel = function() {
  const lvs = currentZone === 0 ? LEVELS : ZONE2_LEVELS;
  if (currentLevel < lvs.length - 1) { startLevel(currentLevel + 1); }
  else { showScreen("zone-screen"); }
};

// --- Override drawCircle for zone 2 ---
const _origDrawCircle = drawCircle;
drawCircle = function() {
  if (currentZone === 0) { _origDrawCircle(); return; }
  // Zone 2: call original first, then add double-angle overlay
  const lvs = ZONE2_LEVELS;
  const lv = lvs[currentLevel];
  // We need to temporarily set the draw context for zone 1 style base
  _origDrawCircle();
  // Now overlay zone 2 specifics
  const sinV = Math.sin(currentAngle);
  const cosV = Math.cos(currentAngle);
  const sin2 = Math.sin(2 * currentAngle);
  const cos2 = Math.cos(2 * currentAngle);
  const w = circleCanvas.width;
  // Draw 2x angle arc in pink
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.3, 0, -2 * currentAngle, currentAngle > 0);
  ctx.strokeStyle = "rgba(255,45,149,0.5)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
  // Label 2x angle
  var labelAngle = -currentAngle;
  var lx2 = cx + Math.cos(labelAngle) * (radius * 0.35);
  var ly2 = cy + Math.sin(labelAngle) * (radius * 0.35);
  ctx.fillStyle = "rgba(255,45,149,0.7)";
  ctx.font = "bold 11px Orbitron";
  ctx.textAlign = "center";
  var deg2 = ((2 * currentAngle * 180 / Math.PI) % 360 + 360) % 360;
  ctx.fillText("2x=" + deg2.toFixed(0) + "°", lx2, ly2 - 8);
  // Draw target line for sin2x or cos2x
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 1.5;
  if (lv.func === "sin2x") {
    var ty = cy - lv.target * radius;
    ctx.strokeStyle = "rgba(255,45,149,0.4)";
    ctx.beginPath(); ctx.moveTo(cx - radius - 10, ty); ctx.lineTo(cx + radius + 10, ty); ctx.stroke();
    ctx.fillStyle = "rgba(255,45,149,0.6)";
    ctx.font = "11px Orbitron"; ctx.textAlign = "left";
    ctx.fillText("sin(2x)=" + lv.target.toFixed(3), cx + radius + 14, ty + 4);
  } else if (lv.func === "cos2x") {
    var tx = cx + lv.target * radius;
    ctx.strokeStyle = "rgba(255,45,149,0.4)";
    ctx.beginPath(); ctx.moveTo(tx, cy - radius - 10); ctx.lineTo(tx, cy + radius + 10); ctx.stroke();
    ctx.fillStyle = "rgba(255,45,149,0.6)";
    ctx.font = "11px Orbitron"; ctx.textAlign = "center";
    ctx.fillText("cos(2x)=" + lv.target.toFixed(3), tx, cy - radius - 14);
  }
  ctx.setLineDash([]);
  // Update double angle value display
  var s2el = document.getElementById("sin2-val");
  var c2el = document.getElementById("cos2-val");
  if (s2el) s2el.textContent = sin2.toFixed(3);
  if (c2el) c2el.textContent = cos2.toFixed(3);
};

// --- Override exitLevel to go back to correct screen ---
const _origExitLevel = exitLevel;
exitLevel = function() {
  showScreen("level-screen");
  currentLevel = null;
};

// --- Init: set completed2 ---
window.completed2 = window.completed2 || (typeof ZONE2_LEVELS !== "undefined" ? ZONE2_LEVELS.map(function() { return false; }) : [false, false, false]);
