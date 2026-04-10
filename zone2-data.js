// ===== Zone 2 Level Data: 二倍角方程 =====
const ZONE2_LEVELS = [
  {
    id: '2-1',
    equation: 'sin(2x) = √3/2',
    func: 'sin2x',
    target: Math.sqrt(3)/2,
    answers: [30, 60, 210, 240],
    hint: '先把 <strong>2x</strong> 当作整体。sin(θ)=√3/2 时 θ=60° 或 120°。<br>所以 2x=60°, 120°, 420°, 480°<br>再除以2得到 <strong>x</strong> 的值。注意 2x 的范围是 [0°,720°)！',
    knowledge: `
      <p>欢迎来到<strong>第二区</strong>！这里我们要征服<strong>二倍角方程</strong>。</p>
      <p>核心公式：<strong style="color:#ff2d95">sin(2θ) = 2·sinθ·cosθ</strong></p>
      <p>解 sin(2x) = k 的关键思路：</p>
      <p>1. 令 <strong>u = 2x</strong>，先解 sin(u) = k</p>
      <p>2. 因为 x ∈ [0°, 360°)，所以 <strong>u ∈ [0°, 720°)</strong></p>
      <p>3. 在这个扩大的范围内找到所有 u 的解</p>
      <p>4. 最后 <strong>x = u / 2</strong></p>
      <p>本关目标：找到所有使 sin(2x) = √3/2 的角度。</p>
    `,
    summary: `
      <strong>学习总结：</strong>sin(2x) = √3/2 的解是 <strong>30°, 60°, 210°, 240°</strong>。<br><br>
      解题过程：<br>
      ① sin(u) = √3/2 → u = 60°, 120°（基本解）<br>
      ② u ∈ [0°, 720°) → u = 60°, 120°, 420°, 480°<br>
      ③ x = u/2 → x = 30°, 60°, 210°, 240°<br><br>
      <strong>规律：</strong>sin(2x) 的周期是 180°，所以在 360° 范围内有 <strong>4个解</strong>，比 sin(x) 多一倍！
    `
  },
  {
    id: '2-2',
    equation: '2sin(x)cos(x) = 1',
    func: 'sin2x',
    target: 1,
    answers: [45, 225],
    hint: '注意 <strong>2sin(x)cos(x)</strong> 其实就是 <strong>sin(2x)</strong>！<br>所以方程变成 sin(2x) = 1。<br>sin(θ)=1 时 θ=90°，那么 2x=90° 或 450°...',
    knowledge: `
      <p>本关的方程看起来复杂：<strong>2sin(x)cos(x) = 1</strong></p>
      <p>但别被表象迷惑！回忆二倍角公式：</p>
      <p style="text-align:center;font-size:18px"><strong style="color:#ff2d95">sin(2θ) = 2·sinθ·cosθ</strong></p>
      <p>所以 2sin(x)cos(x) = sin(2x)，方程化简为 <strong>sin(2x) = 1</strong></p>
      <p>这就是<strong>公式识别</strong>的能力——看穿伪装，化繁为简！</p>
      <p>本关目标：找到所有使 2sin(x)cos(x) = 1 的角度。</p>
    `,
    summary: `
      <strong>学习总结：</strong>2sin(x)cos(x) = 1 的解是 <strong>45°</strong> 和 <strong>225°</strong>。<br><br>
      解题过程：<br>
      ① 识别公式：2sinxcosx = sin(2x)<br>
      ② sin(2x) = 1 → 2x = 90°<br>
      ③ 2x ∈ [0°, 720°) → 2x = 90°, 450°<br>
      ④ x = 45°, 225°<br><br>
      <strong>启示：</strong>遇到 2sinxcosx 要立刻联想到 sin(2x)，这是最常见的二倍角变形！
    `
  },
  {
    id: '2-3',
    equation: 'cos²(x) - sin²(x) = 0.5',
    func: 'cos2x',
    target: 0.5,
    answers: [30, 150, 210, 330],
    hint: '<strong>cos²(x) - sin²(x)</strong> 就是 <strong>cos(2x)</strong>！<br>所以方程变成 cos(2x) = 0.5。<br>cos(θ)=0.5 时 θ=60° 或 300°，别忘了 2x 的范围是 [0°,720°)。',
    knowledge: `
      <p>最后一关！方程：<strong>cos²(x) - sin²(x) = 0.5</strong></p>
      <p>这又是一个公式识别题。cos 的二倍角公式有三种形式：</p>
      <p>• <strong style="color:#ff2d95">cos(2θ) = cos²θ - sin²θ</strong> ← 本关用这个</p>
      <p>• cos(2θ) = 2cos²θ - 1</p>
      <p>• cos(2θ) = 1 - 2sin²θ</p>
      <p>所以方程化简为 <strong>cos(2x) = 0.5</strong></p>
      <p>本关目标：找到所有满足方程的角度。</p>
    `,
    summary: `
      <strong>学习总结：</strong>cos²(x) - sin²(x) = 0.5 的解是 <strong>30°, 150°, 210°, 330°</strong>。<br><br>
      解题过程：<br>
      ① 识别公式：cos²x - sin²x = cos(2x)<br>
      ② cos(2x) = 0.5 → 2x = 60°, 300°（基本解）<br>
      ③ 2x ∈ [0°, 720°) → 2x = 60°, 300°, 420°, 660°<br>
      ④ x = 30°, 150°, 210°, 330°<br><br>
      <strong>三种 cos(2x) 公式要记牢：</strong>遇到 cos²-sin²、2cos²-1、1-2sin² 都要想到 cos(2x)！
    `
  }
];
