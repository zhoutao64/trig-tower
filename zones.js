// zones.js - Zone selection & Zone 2/3 support
let currentZone = 0;
const ZONE_INFO = [
  { id: 0, name: "第一区", sub: "基础三角方程", badge: "ZONE 1", color: "cyan", levels: null, themeClass: "" },
  { id: 1, name: "第二区", sub: "二倍角方程", badge: "ZONE 2", color: "pink", levels: null, themeClass: "z2-theme" },
  { id: 2, name: "第三区", sub: "方程之殿", badge: "ZONE 3", color: "purple", levels: null, themeClass: "z3-theme" }
];

function isZone1Complete() {
  return completed.every(c => c === true);
}

function isZone2Complete() {
  return (window.completed2 || []).every(c => c === true);
}

function getLevelsForZone(z) {
  return z === 0 ? LEVELS : z === 1 ? ZONE2_LEVELS : ZONE3_LEVELS;
}

function getCompletedForZone(z) {
  if (z === 0) return completed;
  if (z === 1) { window.completed2 = window.completed2 || ZONE2_LEVELS.map(function() { return false; }); return window.completed2; }
  window.completed3 = window.completed3 || ZONE3_LEVELS.map(function() { return false; }); return window.completed3;
}

function renderZoneScreen() {
  const container = document.getElementById("zone-cards");
  if (!container) return;
  container.innerHTML = "";
  ZONE_INFO.forEach(function(z, i) {
    var locked = (i === 1 && !isZone1Complete()) || (i === 2 && !isZone2Complete());
    var done = (i === 0 && isZone1Complete()) || (i === 1 && isZone2Complete());
    var card = document.createElement("div");
    card.className = "zone-card glass-panel z-" + z.color + (locked ? " locked" : "") + (done ? " zone-done" : "");
    var descText = locked ? (i === 1 ? "通关第一区解锁" : "通关第二区解锁") : "共3个关卡";
    card.innerHTML = "<div class=\"zone-num\">" + z.name + "</div><div class=\"zone-name\">" + z.sub + "</div><div class=\"zone-desc\">" + descText + "</div>";
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
    var zi = ZONE_INFO[currentZone];
    var badge = document.getElementById("zone-badge-text");
    var title = document.getElementById("zone-title");
    if (badge) badge.textContent = zi.badge;
    if (title) {
      title.textContent = zi.name + " · " + zi.sub;
      title.className = currentZone === 1 ? "neon-pink-text" : currentZone === 2 ? "neon-purple-text" : "neon-text";
    }
    var ls = document.getElementById("level-screen");
    ls.classList.remove("z2-theme", "z3-theme");
    if (currentZone === 1) ls.classList.add("z2-theme");
    if (currentZone === 2) ls.classList.add("z3-theme");
  }
  _origShowScreen(id);
  if (id === "level-screen") renderLevels();
};

// --- Override renderLevels ---
const _origRenderLevels = renderLevels;
renderLevels = function() {
  var lvs = getLevelsForZone(currentZone);
  var comp = getCompletedForZone(currentZone);
  var grid = document.getElementById("levels-grid");
  grid.innerHTML = "";
  lvs.forEach(function(lv, i) {
    var card = document.createElement("div");
    card.className = "level-card glass-panel " + (comp[i] ? "completed" : "");
    card.innerHTML = "<div class=\"level-num\">" + lv.id + "</div><div class=\"level-eq\">" + lv.equation + "</div><div class=\"level-desc\">找到0°~360°范围内所有满足方程的角度</div>";
    card.onclick = function() { startLevel(i); };
    grid.appendChild(card);
  });
};

// --- Override startLevel ---
const _origStartLevel = startLevel;
startLevel = function(idx) {
  var lvs = getLevelsForZone(currentZone);
  currentLevel = idx;
  foundAnswers = [];
  attempts = 0;
  currentAngle = 0;
  showScreen("game-screen");

  // Theme class management
  var gs = document.getElementById("game-screen");
  gs.classList.remove("z2-theme", "z3-theme");
  if (currentZone === 1) gs.classList.add("z2-theme");
  if (currentZone === 2) gs.classList.add("z3-theme");

  var lv = lvs[idx];
  document.getElementById("level-tag").textContent = "关卡 " + lv.id;
  document.getElementById("question-text").textContent = "求解: " + lv.equation;
  document.getElementById("hint-box").innerHTML = lv.hint;

  // Zone 2 double angle value boxes
  var dblContainer = document.getElementById("dbl-values");
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

  // Zone 3 value boxes
  var z3Container = document.getElementById("z3-values");
  if (currentZone === 2) {
    if (!z3Container) {
      z3Container = document.createElement("div");
      z3Container.id = "z3-values";
      z3Container.className = "values-display";
      z3Container.innerHTML = "<div class=\"val-box z3-box glass-panel\"><div class=\"val-label\">SIN+COS</div><div class=\"val-num\" id=\"sincos-sum\">1.000</div></div><div class=\"val-box z3-box glass-panel\"><div class=\"val-label\">SIN\u00B2</div><div class=\"val-num\" id=\"sin2-power\">0.000</div></div><div class=\"val-box z3-box glass-panel\"><div class=\"val-label\">SIN\u00B7COS</div><div class=\"val-num\" id=\"sincos-prod\">0.000</div></div>";
      document.querySelector(".values-display").after(z3Container);
    }
    z3Container.style.display = "flex";
  } else if (z3Container) {
    z3Container.style.display = "none";
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
  var lvs = getLevelsForZone(currentZone);
  var lv = lvs[currentLevel];
  var area = document.getElementById("answer-area");
  area.innerHTML = "";
  lv.answers.forEach(function(_, i) {
    var slot = document.createElement("div");
    slot.className = "answer-slot";
    slot.id = "slot-" + i;
    slot.textContent = "?";
    area.appendChild(slot);
  });
  var btn = document.createElement("button");
  btn.className = "btn btn-small btn-green submit-angle-btn";
  btn.textContent = "提交角度";
  btn.onclick = submitAnswer;
  area.appendChild(btn);
  document.getElementById("answers-needed").textContent = "需要找到 " + lv.answers.length + " 个角度 (0° ≤ x < 360°)";
};

// --- Override submitAnswer ---
const _origSubmitAnswer = submitAnswer;
submitAnswer = function() {
  var lvs = getLevelsForZone(currentZone);
  var comp = getCompletedForZone(currentZone);
  var lv = lvs[currentLevel];
  var deg = Math.round(currentAngle * 180 / Math.PI + 360) % 360;
  attempts++;
  if (foundAnswers.includes(deg)) return;
  var matchIdx = -1;
  lv.answers.forEach(function(ans, i) {
    if (Math.abs(deg - ans) <= 3 && !foundAnswers.some(function(fa) { return Math.abs(fa - ans) <= 3; })) {
      matchIdx = i;
    }
  });
  if (matchIdx >= 0) {
    foundAnswers.push(lv.answers[matchIdx]);
    var slot = document.getElementById("slot-" + matchIdx);
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
  var lvs = getLevelsForZone(currentZone);
  var lv = lvs[currentLevel];
  document.getElementById("progress-info").innerHTML = "已找到: <span style=\"color:var(--neon-green)\">" + foundAnswers.length + "</span> / " + lv.answers.length + " 个解<br>尝试次数: " + attempts + "<br>" + foundAnswers.map(function(a) { return "✓ " + a + "°"; }).join("<br>");
};

// --- Override showSummary ---
const _origShowSummary = showSummary;
showSummary = function() {
  var lvs = getLevelsForZone(currentZone);
  var comp = getCompletedForZone(currentZone);
  var lv = lvs[currentLevel];
  var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  var stars = attempts <= lv.answers.length ? 3 : attempts <= lv.answers.length + 2 ? 2 : 1;
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
  var lvs = getLevelsForZone(currentZone);
  if (currentLevel < lvs.length - 1) { startLevel(currentLevel + 1); }
  else { showScreen("zone-screen"); }
};

// --- Override drawCircle for zone 2 & 3 ---
const _origDrawCircle = drawCircle;
drawCircle = function() {
  if (currentZone === 0) { _origDrawCircle(); return; }

  if (currentZone === 1) {
    // Zone 2: call original first, then add double-angle overlay
    var lvs2 = ZONE2_LEVELS;
    var lv2 = lvs2[currentLevel];
    _origDrawCircle();
    var sinV2 = Math.sin(currentAngle);
    var cosV2 = Math.cos(currentAngle);
    var sin2 = Math.sin(2 * currentAngle);
    var cos2 = Math.cos(2 * currentAngle);
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
    if (lv2.func === "sin2x") {
      var ty = cy - lv2.target * radius;
      ctx.strokeStyle = "rgba(255,45,149,0.4)";
      ctx.beginPath(); ctx.moveTo(cx - radius - 10, ty); ctx.lineTo(cx + radius + 10, ty); ctx.stroke();
      ctx.fillStyle = "rgba(255,45,149,0.6)";
      ctx.font = "11px Orbitron"; ctx.textAlign = "left";
      ctx.fillText("sin(2x)=" + lv2.target.toFixed(3), cx + radius + 14, ty + 4);
    } else if (lv2.func === "cos2x") {
      var tx = cx + lv2.target * radius;
      ctx.strokeStyle = "rgba(255,45,149,0.4)";
      ctx.beginPath(); ctx.moveTo(tx, cy - radius - 10); ctx.lineTo(tx, cy + radius + 10); ctx.stroke();
      ctx.fillStyle = "rgba(255,45,149,0.6)";
      ctx.font = "11px Orbitron"; ctx.textAlign = "center";
      ctx.fillText("cos(2x)=" + lv2.target.toFixed(3), tx, cy - radius - 14);
    }
    ctx.setLineDash([]);
    // Update double angle value display
    var s2el = document.getElementById("sin2-val");
    var c2el = document.getElementById("cos2-val");
    if (s2el) s2el.textContent = sin2.toFixed(3);
    if (c2el) c2el.textContent = cos2.toFixed(3);
    return;
  }

  // Zone 3: call base draw, then add zone 3 overlays
  _origDrawCircle();
  var lvs3 = ZONE3_LEVELS;
  var lv3 = lvs3[currentLevel];
  var sinV = Math.sin(currentAngle);
  var cosV = Math.cos(currentAngle);
  var purple = "rgba(180,77,255,";

  if (lv3.func === "aux") {
    // Level 3-1: sinx + cosx = 1
    var sumVal = sinV + cosV;
    // Draw constraint line from (1,0) to (0,1) on the unit circle
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = purple + "0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + radius, cy);
    ctx.lineTo(cx, cy - radius);
    ctx.stroke();
    ctx.setLineDash([]);
    // Label
    ctx.fillStyle = purple + "0.6)";
    ctx.font = "11px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("sinx+cosx=1", cx + radius * 0.65, cy - radius * 0.65);
    // Show combined value indicator
    ctx.fillStyle = purple + "0.8)";
    ctx.font = "bold 11px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("sin+cos=" + sumVal.toFixed(3), cx, cy + radius + 32);
  } else if (lv3.func === "quad_sin") {
    // Level 3-2: 2sin²x - 3sinx + 1 = 0
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;
    // Target: sin(x) = 0.5
    var ty1 = cy - 0.5 * radius;
    ctx.strokeStyle = purple + "0.35)";
    ctx.beginPath(); ctx.moveTo(cx - radius - 10, ty1); ctx.lineTo(cx + radius + 10, ty1); ctx.stroke();
    ctx.fillStyle = purple + "0.6)";
    ctx.font = "11px Orbitron"; ctx.textAlign = "left";
    ctx.fillText("sin=1/2", cx + radius + 14, ty1 + 4);
    // Target: sin(x) = 1
    var ty2 = cy - 1 * radius;
    ctx.strokeStyle = purple + "0.35)";
    ctx.beginPath(); ctx.moveTo(cx - radius - 10, ty2); ctx.lineTo(cx + radius + 10, ty2); ctx.stroke();
    ctx.fillStyle = purple + "0.6)";
    ctx.font = "11px Orbitron"; ctx.textAlign = "left";
    ctx.fillText("sin=1", cx + radius + 14, ty2 + 4);
    ctx.setLineDash([]);
    // Show substitution variable
    var u = sinV;
    var eqVal = 2 * u * u - 3 * u + 1;
    ctx.fillStyle = purple + "0.7)";
    ctx.font = "bold 11px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("u=sin(x)=" + u.toFixed(3), cx, cy + radius + 32);
    ctx.font = "10px Orbitron";
    ctx.fillText("2u\u00B2-3u+1=" + eqVal.toFixed(3), cx, cy + radius + 46);
  } else if (lv3.func === "factor") {
    // Level 3-3: sin²x + sinx·cosx = 0 => sinx(sinx+cosx) = 0
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;
    // Highlight y=0 (sin=0) line
    ctx.strokeStyle = purple + "0.35)";
    ctx.beginPath(); ctx.moveTo(cx - radius - 10, cy); ctx.lineTo(cx + radius + 10, cy); ctx.stroke();
    ctx.fillStyle = purple + "0.5)";
    ctx.font = "11px Orbitron"; ctx.textAlign = "left";
    ctx.fillText("sin=0", cx + radius + 14, cy - 6);
    // Draw sinx+cosx=0 line (y = -x direction)
    ctx.strokeStyle = purple + "0.35)";
    ctx.beginPath();
    ctx.moveTo(cx + radius, cy + radius);
    ctx.lineTo(cx - radius, cy - radius);
    ctx.stroke();
    ctx.fillStyle = purple + "0.5)";
    ctx.font = "11px Orbitron"; ctx.textAlign = "left";
    ctx.fillText("sin+cos=0", cx + radius * 0.45, cy + radius * 0.45 - 8);
    ctx.setLineDash([]);
    // Show factored form
    var f1 = sinV;
    var f2 = sinV + cosV;
    ctx.fillStyle = purple + "0.7)";
    ctx.font = "bold 10px Orbitron";
    ctx.textAlign = "center";
    ctx.fillText("sinx=" + f1.toFixed(3) + " | sinx+cosx=" + f2.toFixed(3), cx, cy + radius + 32);
    ctx.font = "10px Orbitron";
    ctx.fillText("\u79EF=" + (f1 * f2).toFixed(3), cx, cy + radius + 46);
  }

  // Update Zone 3 value boxes
  var sumEl = document.getElementById("sincos-sum");
  var sin2El = document.getElementById("sin2-power");
  var prodEl = document.getElementById("sincos-prod");
  if (sumEl) sumEl.textContent = (sinV + cosV).toFixed(3);
  if (sin2El) sin2El.textContent = (sinV * sinV).toFixed(3);
  if (prodEl) prodEl.textContent = (sinV * cosV).toFixed(3);
};

// --- Override exitLevel to go back to correct screen ---
const _origExitLevel = exitLevel;
exitLevel = function() {
  showScreen("level-screen");
  currentLevel = null;
};

// --- Init: set completed2 & completed3 ---
window.completed2 = window.completed2 || (typeof ZONE2_LEVELS !== "undefined" ? ZONE2_LEVELS.map(function() { return false; }) : [false, false, false]);
window.completed3 = window.completed3 || (typeof ZONE3_LEVELS !== "undefined" ? ZONE3_LEVELS.map(function() { return false; }) : [false, false, false]);
