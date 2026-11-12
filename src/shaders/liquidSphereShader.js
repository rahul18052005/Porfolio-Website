// Custom GLSL shaders for the Living Liquid Iridescent Sphere
// Features:
// - 3D Simplex Noise + FBM liquid displacement along vertex normals
// - Mouse-responsive gravitational bulge / ripple wave
// - Thin-film iridescent Fresnel interference (Cyan, Turquoise, Magenta, Violet, Pearl-White)
// - Dynamic project-specific visual transformations (ATS scan matrix, Agentic neural pulses, Gym pose lattice)
// - Shader mode switcher (0: Iridescent Liquid, 1: Neural Wireframe/Lattice, 2: Obsidian Pulse)

export const liquidSphereVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMouseInfluence;
  uniform vec3 uMouseLocal;
  uniform float uDisplacementStrength;
  uniform float uSpeed;
  uniform float uProjectIndex; // 0 = Hero/Default, 1 = ATS, 2 = Chatbot, 3 = Gym
  uniform float uShaderMode;   // 0 = Liquid, 1 = Neural Lattice, 2 = Obsidian Pulse
  uniform float uSpinImpulse;

  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;
  varying float vNoise;
  varying float vMouseRipple;

  // Compact 3D Simplex Noise
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.52;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amp * snoise(p * freq);
      freq *= 2.02;
      amp *= 0.48;
    }
    return value;
  }

  float evalDisplacement(vec3 pos) {
    float t = uTime * uSpeed;
    // Smooth transitions across project visual identities
    float p1 = smoothstep(0.0, 1.0, uProjectIndex) * (1.0 - smoothstep(1.0, 2.0, uProjectIndex));
    float p2 = smoothstep(1.0, 2.0, uProjectIndex) * (1.0 - smoothstep(2.0, 3.0, uProjectIndex));
    float p3 = smoothstep(2.0, 3.0, uProjectIndex);

    // Base organic liquid flow
    vec3 q = pos * 1.15 + vec3(t * 0.24, -t * 0.19, t * 0.16);
    float baseWave = fbm(q);

    // Project 1: Subtle horizontal crystalline document facets
    float atsFacet = sin(pos.y * 8.0 - t * 2.4) * 0.035 + snoise(pos * 2.8 + t * 0.2) * 0.05;
    // Project 2: Neural harmonic pulses
    float neuralPulse = sin(length(pos.xy) * 6.0 - t * 3.0) * 0.045 + snoise(pos * 3.2 - t * 0.4) * 0.09;
    // Project 3: Biomechanical kinetic rhythmic wave
    float kineticWave = cos(pos.y * 4.5 + pos.x * 3.0 - t * 2.6) * 0.055 + fbm(pos * 1.9 + t * 0.35) * 0.06;

    float d = baseWave * uDisplacementStrength;
    d = mix(d, atsFacet, p1 * 0.65);
    d = mix(d, neuralPulse, p2 * 0.72);
    d = mix(d, kineticWave, p3 * 0.68);

    // Mode 2: Obsidian pulse tightens surface tension with sharp harmonic ripples
    float obsidianMode = smoothstep(1.5, 2.0, uShaderMode);
    d = mix(d, sin(pos.y * 10.0 + t * 3.2) * 0.025 + baseWave * 0.08, obsidianMode);

    // Mouse gravitational attraction + ripple ring
    float distMouse = distance(normalize(pos), normalize(uMouseLocal + vec3(0.0001)));
    float pull = exp(-distMouse * 3.6) * uMouseInfluence;
    float ripple = sin(distMouse * 14.0 - uTime * 7.0) * exp(-distMouse * 2.6) * uMouseInfluence * 0.38;

    return d + (pull * 0.19 + ripple * 0.07) + uSpinImpulse * sin(pos.x * 6.0 + uTime * 8.0) * 0.025;
  }

  void main() {
    vec3 n = normalize(normal);
    float disp = evalDisplacement(position);
    vec3 displaced = position + n * disp;

    // Finite-difference normal recalculation for crisp lighting & Fresnel reflections
    float eps = 0.025;
    vec3 up = abs(n.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(up, n));
    vec3 bitangent = normalize(cross(n, tangent));

    vec3 p1 = position + tangent * eps;
    vec3 p2 = position + bitangent * eps;
    vec3 d1 = normalize(p1) * length(position) + normalize(p1) * evalDisplacement(normalize(p1) * length(position));
    vec3 d2 = normalize(p2) * length(position) + normalize(p2) * evalDisplacement(normalize(p2) * length(position));

    vec3 perturbedNormal = normalize(cross(d1 - displaced, d2 - displaced));
    if (dot(perturbedNormal, n) < 0.0) perturbedNormal = -perturbedNormal;
    vec3 finalNormal = normalize(mix(n, perturbedNormal, 0.85));

    vNoise = disp;
    vLocalPosition = displaced;
    vMouseRipple = exp(-distance(normalize(position), normalize(uMouseLocal + vec3(0.0001))) * 3.0) * uMouseInfluence;

    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * finalNormal);
    vNormal = normalize(normalMatrix * finalNormal);

    vec4 mvPos = viewMatrix * worldPos;
    vViewPosition = -mvPos.xyz;

    gl_Position = projectionMatrix * mvPos;
  }
`;

export const liquidSphereFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uProjectIndex;
  uniform float uShaderMode; // 0: Iridescent Liquid, 1: Neural Lattice, 2: Obsidian Pulse
  uniform vec3 uCursorLightPos;
  uniform float uMouseInfluence;

  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;
  varying float vNoise;
  varying float vMouseRipple;

  // Cosine spectral iridescence palette (Inigo Quilez thin-film phase shift)
  vec3 iridescencePalette(float t) {
    vec3 a = vec3(0.50, 0.50, 0.56);
    vec3 b = vec3(0.48, 0.45, 0.48);
    vec3 c = vec3(1.0, 1.0, 1.0);
    // Tuned phase for Cyan, Turquoise, Magenta, Violet & Pearl-White
    vec3 d = vec3(0.02, 0.33, 0.62);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 WN = normalize(vWorldNormal);

    // Fresnel term for dramatic liquid glass-mercury rim reflections
    float ndotv = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - ndotv, 2.75);
    float deepRim = pow(1.0 - ndotv, 4.8);

    // Flowing organic swirl phase across the surface
    float flow = sin(vLocalPosition.x * 2.1 + uTime * 0.65)
               * cos(vLocalPosition.y * 2.3 - uTime * 0.52)
               + sin(vLocalPosition.z * 2.7 + uTime * 0.48) * 0.5;

    float phase = fresnel * 1.45 + vNoise * 2.8 + flow * 0.34 + uTime * 0.06;

    // Color stops: deep obsidian interior + cyan / turquoise / magenta / violet / pearl-white iridescence
    vec3 obsidianCore = vec3(0.012, 0.015, 0.026);
    vec3 cyan = vec3(0.0, 0.94, 1.0);
    vec3 turquoise = vec3(0.18, 0.84, 0.75);
    vec3 magenta = vec3(0.93, 0.28, 0.60);
    vec3 violet = vec3(0.55, 0.36, 0.96);
    vec3 pearl = vec3(0.96, 0.97, 1.0);

    vec3 spectrum = iridescencePalette(phase);
    // Bias spectrum cleanly toward the signature Cyan + Turquoise + Magenta + Violet + Pearl palette
    vec3 iridTint = mix(
      mix(cyan, turquoise, 0.5 + 0.5 * sin(phase * 3.1)),
      mix(magenta, violet, 0.5 + 0.5 * cos(phase * 2.7)),
      smoothstep(-0.35, 0.65, sin(vLocalPosition.y * 1.9 + uTime * 0.55 + vNoise * 4.5))
    );
    vec3 liquidColor = mix(spectrum, iridTint, 0.62);

    // Project-specific visual transformations
    float p1 = smoothstep(0.0, 1.0, uProjectIndex) * (1.0 - smoothstep(1.0, 2.0, uProjectIndex));
    float p2 = smoothstep(1.0, 2.0, uProjectIndex) * (1.0 - smoothstep(2.0, 3.0, uProjectIndex));
    float p3 = smoothstep(2.0, 3.0, uProjectIndex);

    // Project 01 (ATS): Laser scan bands & precision cyan/pearl tint
    float scanLine = exp(-abs(fract(vLocalPosition.y * 0.35 - uTime * 0.42) - 0.5) * 42.0);
    float microGrid = smoothstep(0.93, 0.98, abs(sin(vLocalPosition.x * 16.0))) +
                      smoothstep(0.93, 0.98, abs(sin(vLocalPosition.y * 16.0)));
    vec3 p1Color = mix(liquidColor, cyan * 0.85 + pearl * 0.25, 0.45) + cyan * scanLine * 0.9 + pearl * microGrid * 0.14;

    // Project 02 (Chatbot): Neural node pulse waves & magenta-cyan synaptic lines
    float neuralRing = smoothstep(0.88, 0.99, sin(vLocalPosition.x * 9.0 + vLocalPosition.z * 9.0 - uTime * 3.5));
    vec3 p2Color = mix(liquidColor, mix(magenta, cyan, 0.5 + 0.5 * sin(uTime)), 0.45) +
                   mix(cyan, magenta, 0.5) * neuralRing * 0.55;

    // Project 03 (Gym Trainer): Biomechanical pose telemetry contour lines & turquoise-violet glow
    float bioContour = smoothstep(0.91, 0.99, cos(length(vLocalPosition.xy) * 14.0 - uTime * 2.8));
    vec3 p3Color = mix(liquidColor, mix(turquoise, violet, 0.45), 0.52) + turquoise * bioContour * 0.6;

    vec3 activePalette = liquidColor;
    activePalette = mix(activePalette, p1Color, p1);
    activePalette = mix(activePalette, p2Color, p2);
    activePalette = mix(activePalette, p3Color, p3);

    // Studio 3-point + Cursor-following specular highlights
    vec3 keyDir = normalize(vec3(-2.6, 3.2, 3.8));
    vec3 fillDir = normalize(vec3(3.4, -1.2, 2.2));
    vec3 rimDir = normalize(vec3(0.0, 2.8, -3.5));
    vec3 cursorDir = normalize(uCursorLightPos - vWorldPosition);

    vec3 H_key = normalize(keyDir + V);
    vec3 H_fill = normalize(fillDir + V);
    vec3 H_cursor = normalize(cursorDir + V);

    float specKey = pow(max(dot(N, H_key), 0.0), 86.0);
    float specFill = pow(max(dot(N, H_fill), 0.0), 42.0);
    float specCursor = pow(max(dot(N, H_cursor), 0.0), 64.0) * (0.45 + uMouseInfluence * 0.75);
    float rimBack = pow(max(dot(-WN, rimDir), 0.0), 2.4);

    // Internal reflection sweep simulating studio softbox + dark ground bounce
    vec3 R = reflect(-V, N);
    float studioBand = smoothstep(0.15, 0.85, R.y) * 0.45 + smoothstep(0.65, 0.98, R.y) * 0.75;
    float groundBounce = smoothstep(-0.1, -0.85, R.y) * 0.35;

    vec3 color = obsidianCore;
    // Liquid chromatic surface body (rich dark center, luminous iridescent mid-bands & edges)
    color += activePalette * (0.14 + fresnel * 0.95 + studioBand * 0.36);
    // Pearl-white key studio softbox reflection
    color += pearl * (specKey * 1.15 + deepRim * 0.52);
    // Magenta & cyan accent speculars
    color += magenta * (specFill * 0.55 + groundBounce * 0.45);
    color += cyan * (specCursor * 0.9 + rimBack * 0.25 + vMouseRipple * 0.45);

    // Interactive Shader Mode 1: Neural Wireframe / Lattice overlay
    float latticeMode = smoothstep(0.5, 1.0, uShaderMode) * (1.0 - smoothstep(1.0, 1.5, uShaderMode));
    if (latticeMode > 0.01) {
      float lat = smoothstep(0.92, 0.99, abs(sin(vLocalPosition.y * 18.0)));
      float lon = smoothstep(0.92, 0.99, abs(sin(atan(vLocalPosition.z, vLocalPosition.x) * 12.0)));
      float gridGlow = max(lat, lon);
      color = mix(color, color * 0.35 + (cyan * 0.85 + pearl * 0.3) * gridGlow * 1.25, latticeMode);
    }

    // Interactive Shader Mode 2: Obsidian Pulse (deep volcanic glass with crisp cyan-pearl contour)
    float obsidianMode = smoothstep(1.5, 2.0, uShaderMode);
    if (obsidianMode > 0.01) {
      float pulseRing = smoothstep(0.9, 0.995, sin(vLocalPosition.y * 12.0 - uTime * 3.4));
      vec3 obs = obsidianCore + pearl * (specKey * 1.4 + deepRim * 0.9) + cyan * pulseRing * 0.9;
      color = mix(color, obs, obsidianMode);
    }

    // Subtle tone compression so highlights look photographic & never clip harshly
    color = color / (color + vec3(0.45));
    color = pow(color, vec3(0.92));

    gl_FragColor = vec4(color, uOpacity);
  }
`;

