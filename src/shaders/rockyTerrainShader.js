// Procedural FBM rock heightfield + atmospheric volumetric glow shaders
// Used for the dark obsidian rocky terrain and subtle light horizon underneath the sphere.

function hash2D(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise2D(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2D(ix, iy);
  const b = hash2D(ix + 1, iy);
  const c = hash2D(ix, iy + 1);
  const d = hash2D(ix + 1, iy + 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export function fbm2D(x, y, octaves = 5) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i += 1) {
    value += amp * valueNoise2D(x * freq, y * freq);
    freq *= 2.08;
    amp *= 0.48;
  }
  return value;
}

export function computeRockyHeight(x, z) {
  const dist = Math.sqrt(x * x + z * z);
  // Keep central basin directly under sphere flatter for the wet reflective obsidian mirror pool
  const centerPoolMask = Math.min(1, Math.max(0, (dist - 1.9) / 3.8));
  const ridgeNoise = 1 - Math.abs(fbm2D(x * 0.24 + 4.1, z * 0.24 - 2.3, 5) * 2 - 1);
  const fineCrags = fbm2D(x * 0.85 - 7.2, z * 0.85 + 3.6, 4);

  const outerElevation = (ridgeNoise * ridgeNoise * 1.95 + fineCrags * 0.55 - 0.35) * centerPoolMask;
  // Subtle rise in far horizon to frame the sphere silhouette dramatically
  const horizonFrame = Math.max(0, (dist - 7.0) * 0.08) * (0.4 + ridgeNoise * 0.8);
  const edgeFade = Math.max(0, 1 - Math.max(0, dist - 16) / 6);

  return (outerElevation + horizonFrame) * edgeFade;
}

export const volumetricAuraVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const volumetricAuraFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uProjectIndex;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - vec2(0.5);
    float d = length(centered);

    // Soft exponential volumetric halo behind the central sphere
    float halo = exp(-d * 4.8) * 0.72 + exp(-d * 10.5) * 0.35;
    float pulse = 0.92 + 0.08 * sin(uTime * 0.9);

    vec3 cyan = vec3(0.0, 0.94, 1.0);
    vec3 magenta = vec3(0.93, 0.28, 0.60);
    vec3 turquoise = vec3(0.18, 0.84, 0.75);
    vec3 violet = vec3(0.52, 0.35, 0.95);

    vec3 defaultGlow = mix(cyan, magenta, smoothstep(-0.35, 0.35, centered.x + 0.1 * sin(uTime * 0.4)));
    vec3 p1Glow = mix(cyan, vec3(0.9, 0.95, 1.0), 0.35);
    vec3 p2Glow = mix(magenta, cyan, 0.5 + 0.5 * sin(uTime * 0.6));
    vec3 p3Glow = mix(turquoise, violet, smoothstep(-0.3, 0.3, centered.y));

    float p1 = smoothstep(0.0, 1.0, uProjectIndex) * (1.0 - smoothstep(1.0, 2.0, uProjectIndex));
    float p2 = smoothstep(1.0, 2.0, uProjectIndex) * (1.0 - smoothstep(2.0, 3.0, uProjectIndex));
    float p3 = smoothstep(2.0, 3.0, uProjectIndex);

    vec3 col = defaultGlow;
    col = mix(col, p1Glow, p1);
    col = mix(col, p2Glow, p2);
    col = mix(col, p3Glow, p3);

    float alpha = halo * pulse * uIntensity * smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(col, alpha);
  }
`;

