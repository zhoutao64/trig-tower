// ===== Zone 3 Level Data: 方程之殿 =====
const ZONE3_LEVELS = [
  {
    id: '3-1',
    equation: 'sin(x) + cos(x) = 1',
    func: 'aux',
    target: 1,
    answers: [0, 90],
    hint: '令 sin(x)+cos(x) = <strong>√2·sin(x+45°)</strong>（辅助角公式）。<br>方程变为 √2·sin(x+45°) = 1，即 sin(x+45°) = √2/2。<br>sin(θ) = √2/2 时 θ = 45° 或 135°，所以 x = 0° 或 90°。',
    knowledge: `
      <p>欢迎来到<strong>第三区 · 方程之殿</strong>！</p>
      <p>这里我们要掌握<strong>辅助角公式</strong>：</p>
      <p style="text-align:center;font-size:18px"><strong style="color:#b44dff">a·sinx + b·cosx = √(a²+b²)·sin(x+φ)</strong></p>
      <p>其中 <strong>tan(φ) = b/a</strong></p>
      <p>本关中 a=1, b=1，所以：</p>
      <p>sinx + cosx = <strong>√2 · sin(x+45°)</strong></p>
      <p>这样就把两个三角函数的和变成了<strong>一个</strong>三角函数！</p>
      <p>本关目标：找到所有使 sin(x)+cos(x) = 1 的角度。</p>
    `,
    summary: `
      <strong>学习总结：</strong>sin(x)+cos(x) = 1 的解是 <strong>0°</strong> 和 <strong>90°</strong>。<br><br>
      解题过程：<br>
      ① 辅助角公式：sinx+cosx = √2·sin(x+45°)<br>
      ② √2·sin(x+45°) = 1 → sin(x+45°) = √2/2<br>
      ③ x+45° = 45° 或 135° → x = 0° 或 90°<br><br>
      <strong>关键：</strong>a·sinx + b·cosx 型方程，用辅助角公式化为 R·sin(x+φ) 的形式，变为基础方程！
    `
  },
  {
    id: '3-2',
    equation: '2sin²(x) - 3sin(x) + 1 = 0',
    func: 'quad_sin',
    target: null,
    answers: [30, 90, 150],
    hint: '令 <strong>u = sin(x)</strong>，方程变为 2u²-3u+1=0。<br>因式分解：<strong>(2u-1)(u-1) = 0</strong><br>所以 u = 1/2 或 u = 1，即 sin(x)=1/2 或 sin(x)=1。<br>分别求解这两个基本方程即可。',
    knowledge: `
      <p>本关方程：<strong>2sin²(x) - 3sin(x) + 1 = 0</strong></p>
      <p>这是一个关于 sin(x) 的<strong>二次方程</strong>！</p>
      <p>解题策略：<strong style="color:#b44dff">换元法</strong></p>
      <p>令 <strong>u = sin(x)</strong>，方程变为：</p>
      <p style="text-align:center;font-size:18px"><strong>2u² - 3u + 1 = 0</strong></p>
      <p>这就是一个普通的一元二次方程！解出 u 后，再解 sin(x) = u。</p>
      <p>注意：sin(x) 的范围是 [-1, 1]，超出范围的根要<strong>舍去</strong>。</p>
      <p>本关目标：找到所有满足方程的角度。</p>
    `,
    summary: `
      <strong>学习总结：</strong>2sin²(x)-3sin(x)+1=0 的解是 <strong>30°, 90°, 150°</strong>。<br><br>
      解题过程：<br>
      ① 换元：令 u=sin(x)，得 2u²-3u+1=0<br>
      ② 因式分解：(2u-1)(u-1)=0 → u=1/2 或 u=1<br>
      ③ sin(x)=1/2 → x=30°, 150°<br>
      ④ sin(x)=1 → x=90°<br><br>
      <strong>方法：</strong>遇到 sin²x、cos²x 的方程，想到换元为一元二次方程。注意检验 u 是否在 [-1,1] 范围内！
    `
  },
  {
    id: '3-3',
    equation: 'sin²(x) + sin(x)·cos(x) = 0',
    func: 'factor',
    target: null,
    answers: [0, 135, 180, 315],
    hint: '提取公因式 <strong>sin(x)</strong>：<br>sin(x)·(sin(x)+cos(x)) = 0<br>所以 <strong>sin(x)=0</strong> 或 <strong>sin(x)+cos(x)=0</strong>。<br>第二个方程等价于 <strong>tan(x)=-1</strong>。分别求解即可！',
    knowledge: `
      <p>最后一关！方程：<strong>sin²(x) + sin(x)cos(x) = 0</strong></p>
      <p>这道题结合了前两关的思路。关键在于<strong style="color:#b44dff">因式分解</strong>：</p>
      <p style="text-align:center;font-size:18px"><strong>sin(x)·[sin(x)+cos(x)] = 0</strong></p>
      <p>零因子定律：<strong>A·B = 0 → A=0 或 B=0</strong></p>
      <p>• sin(x) = 0（基础方程）</p>
      <p>• sin(x)+cos(x) = 0 → tan(x) = -1</p>
      <p>这是综合运用因式分解、基础方程和辅助角的<strong>混合型</strong>方程。</p>
      <p>本关目标：找到所有满足方程的角度。</p>
    `,
    summary: `
      <strong>学习总结：</strong>sin²(x)+sin(x)cos(x)=0 的解是 <strong>0°, 135°, 180°, 315°</strong>。<br><br>
      解题过程：<br>
      ① 提公因式：sin(x)·(sin(x)+cos(x)) = 0<br>
      ② sin(x) = 0 → x = 0°, 180°<br>
      ③ sin(x)+cos(x) = 0 → tan(x) = -1 → x = 135°, 315°<br><br>
      <strong>总结：</strong>混合型方程的核心是"拆"——通过因式分解把复杂方程拆成几个简单方程，逐个击破！
    `
  }
];
