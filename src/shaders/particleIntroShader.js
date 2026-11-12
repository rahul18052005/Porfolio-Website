// Custom GLSL shaders for the Particle Explosion & Sphere Assembly Intro
// Thousands of tiny luminous particles begin scattered in a cosmic nebula vortex,
// spiral inward via curl/orbital forces, and smoothly assemble onto the sphere shell.

export const particleAssemblyVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;     // 0.0 = exploded nebula, 1.0 = assembled sphere shell
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uProjectIndex;

  attribute vec3 aScatterPos;
  attribute vec3 aSpherePos;
  attribute float aRandom;
  attribute float aColorMix;

  varying float vAlpha;
  varying float vColorMix;
  varying float vRandom;

  // Rotation matrix around Y axis for swirling assembly vortex
  vec3 rotateY(vec3 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c);
  }

  void main() {
    vColorMix = aColorMix;
    vRandom = aRandom;

    // Stagger particle convergence slightly by aRandom so assembly feels organic
    float localProg = clamp((uProgress * 1.24) - aRandom * 0.24, 0.0, 1.0);
    float eased = localProg * localProg * (3.0 - 2.0 * localProg);

    // Swirling vortex during transition
    float swirlAngle = (1.0 - eased) * (3.2 + aRandom * 2.5);
    vec3 swirledScatter = rotateY(aScatterPos, swirlAngle);

    // Target sphere shell with subtle breathing orbit once assembled
    vec3 orbTarget = aSpherePos * (1.0 + 0.04 * sin(uTime * 1.4 + aRandom * 6.283));
    orbTarget = rotateY(orbTarget, uTime * 0.14);

    // Subtle expansion into ambient orbital halo after full assembly
    vec3 haloPos = orbTarget * (1.06 + aRandom * 0.85);
    haloPos.y += sin(uTime * 0.7 + aRandom * 10.0) * 0.14;

    vec3 pos = mix(swirledScatter, orbTarget, eased);
    // Keep outer constellation particles gently floating around the sphere after assembly
    float isHalo = step(0.72, aRandom);
    pos = mix(pos, haloPos, eased * isHalo);

    // Mouse subtle parallax repulsion
    pos.x += uMouse.x * 0.28 * (0.4 + aRandom * 0.6);
    pos.y += uMouse.y * 0.22 * (0.4 + aRandom * 0.6);

    // Subtle vertical spread during project modes
    pos *= 1.0 + smoothstep(0.5, 3.0, uProjectIndex) * 0.12 * isHalo;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float baseSize = mix(24.0, 13.0, eased) * (0.55 + aRandom * 0.9);
    gl_PointSize = clamp(baseSize * uPixelRatio / max(-mvPosition.z, 0.5), 1.5, 11.0);

    // Inner particles fade slightly as solid liquid sphere materializes, halo particles remain crisp
    float shellFade = mix(1.0, mix(0.18, 0.88, isHalo), smoothstep(0.78, 1.0, eased));
    float introFadeIn = smoothstep(0.0, 0.08, uProgress + 0.05);
    vAlpha = shellFade * introFadeIn;
  }
`;

export const particleAssemblyFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uProjectIndex;

  varying float vAlpha;
  varying float vColorMix;
  varying float vRandom;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Soft glowing core + exponential halo
    float core = smoothstep(0.5, 0.0, dist);
    core = pow(core, 2.2);

    vec3 cyan = vec3(0.0, 0.94, 1.0);
    vec3 turquoise = vec3(0.18, 0.84, 0.75);
    vec3 magenta = vec3(0.93, 0.28, 0.60);
    vec3 pearl = vec3(0.96, 0.97, 1.0);

    vec3 col = mix(cyan, magenta, smoothstep(0.2, 0.8, vColorMix));
    col = mix(col, turquoise, 0.25 * sin(uTime + vRandom * 6.28) + 0.25);
    col = mix(col, pearl, step(0.84, vRandom) * 0.65);

    // Shift slightly toward project accents when exploring projects
    float p2 = smoothstep(1.2, 2.0, uProjectIndex) * (1.0 - smoothstep(2.0, 2.8, uProjectIndex));
    float p3 = smoothstep(2.2, 3.0, uProjectIndex);
    col = mix(col, magenta * 0.9 + cyan * 0.3, p2 * 0.35);
    col = mix(col, turquoise * 1.05, p3 * 0.4);

    gl_FragColor = vec4(col, core * vAlpha);
  }
`;

