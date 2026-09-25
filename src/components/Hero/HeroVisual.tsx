import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { AHMAD_PORTRAITS } from '../../assets/images';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

/* ─── GLSL Shaders ───────────────────────────────────────────────────────── */

// 1. Blob Ping-Pong Simulation Shader
const BLOB_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BLOB_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float time;
  uniform float dTime;
  uniform float aspect;
  uniform float pointerDown;
  uniform float pointerRadius;
  uniform float pointerDuration;
  uniform vec2 pointer;
  uniform sampler2D prevFrame;
  varying vec2 vUv;

  float hash(vec2 p) { 
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
  }

  float noise(vec2 p) {
    vec2 i = floor(p); 
    vec2 f = fract(p); 
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); 
    float b = hash(i + vec2(1.0, 0.0)); 
    float c = hash(i + vec2(0.0, 1.0)); 
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float rVal = texture2D(prevFrame, vUv).r;
    
    // Controlled decay over pointerDuration seconds
    rVal -= clamp(dTime / pointerDuration, 0.0, 0.05);
    rVal = clamp(rVal, 0.0, 1.0);
    
    float f = 0.0;
    if (pointerDown > 0.005) {
      vec2 uv = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
      vec2 mouse = pointer * vec2(aspect, 1.0);
      vec2 toMouse = uv - mouse;
      float angle = atan(toMouse.y, toMouse.x);
      float dist = length(toMouse);
      
      // Multi-frequency harmonic noise modulation for organic fluid edges
      float noiseVal = noise(vec2(angle * 3.0 + time * 0.5, dist * 5.0));
      float noiseVal2 = noise(vec2(angle * 5.0 - time * 0.3, dist * 3.0 + time));
      float radiusVariation = 0.7 + noiseVal * 0.5 + noiseVal2 * 0.3;
      float organicRadius = pointerRadius * radiusVariation;
      
      f = 1.0 - smoothstep(organicRadius * 0.05, organicRadius * 1.2, dist);
      f *= 0.8 + noiseVal * 0.2;
      f *= pointerDown;
    }
    
    rVal += f * 0.25;
    rVal = clamp(rVal, 0.0, 1.0);
    
    gl_FragColor = vec4(vec3(rVal), 1.0);
  }
`;

// 2. Procedural Torn Paper & Topographic Contours (Intermediate Layer)
const BG_PLANE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec4 vPosProj;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vPosProj = gl_Position;
  }
`;

const BG_PLANE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D texBlob;
  uniform float time;
  uniform vec3 colorBg;
  uniform vec3 colorSoftShape;
  uniform vec3 colorLine;
  varying vec2 vUv;
  varying vec4 vPosProj;

  float hash(vec2 p) { 
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
  }

  float noise(vec2 p) {
    vec2 i = floor(p); 
    vec2 f = fract(p); 
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); 
    float b = hash(i + vec2(1.0, 0.0)); 
    float c = hash(i + vec2(0.0, 1.0)); 
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.1;
      amplitude *= 0.3;
    }
    return value;
  }

  void main() {
    vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
    vec4 blobData = texture2D(texBlob, blobUV);
    
    if (blobData.r < 0.02) discard;

    vec2 uv = vUv * 3.5;
    vec2 distortionField = vUv * 2.0;
    float distortion = fbm(distortionField + time * 0.2);
    float distortionStrength = 0.7;
    vec2 warpedUv = uv + (distortion - 0.5) * distortionStrength;
    float n = fbm(warpedUv);

    float softShapeMix = smoothstep(0.1, 0.9, sin(n * 3.0));
    vec3 baseColor = mix(colorBg, colorSoftShape, softShapeMix);
    float linePattern = fract(n * 15.0);
    float lineMix = 1.0 - smoothstep(0.48, 0.52, linePattern);
    vec3 finalColor = mix(baseColor, colorLine, lineMix);

    // Subtle Swiss Red hairline accent contour at the torn paper perimeter
    float edgeHighlight = smoothstep(0.02, 0.055, blobData.r) * (1.0 - smoothstep(0.055, 0.11, blobData.r));
    vec3 swissRed = vec3(0.784, 0.063, 0.180); // #C8102E
    finalColor = mix(finalColor, swissRed, edgeHighlight * 0.35);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// 3. Reveal Image Shader (Top Layer: Ahmad Badawi with Sunglasses)
const REVEAL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec4 vPosProj;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vPosProj = gl_Position;
  }
`;

const REVEAL_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D texBlob;
  uniform sampler2D map;
  varying vec2 vUv;
  varying vec4 vPosProj;

  void main() {
    vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
    vec4 blobData = texture2D(texBlob, blobUV);
    
    if (blobData.r < 0.02) discard;

    vec4 texColor = texture2D(map, vUv);
    
    // Discard transparent background in PNG so the procedural paper plane shows
    if (texColor.a < 0.02) discard;

    // Organic micro-feathering at the boundary
    float alphaMod = smoothstep(0.02, 0.07, blobData.r);
    gl_FragColor = vec4(texColor.rgb, texColor.a * alphaMod);
  }
`;

/* ─── Ping-Pong FBO Simulation Class ─────────────────────────────────────── */

class BlobSimulation {
  renderer: THREE.WebGLRenderer;
  rtOutput: THREE.WebGLRenderTarget;
  prevRenderTarget: THREE.WebGLRenderTarget;
  rtScene: THREE.Scene;
  rtCamera: THREE.Camera;
  uniforms: {
    pointer: { value: THREE.Vector2 };
    pointerDown: { value: number };
    pointerRadius: { value: number };
    pointerDuration: { value: number };
    prevFrame: { value: THREE.Texture };
    time: { value: number };
    dTime: { value: number };
    aspect: { value: number };
  };
  blobMaterial: THREE.ShaderMaterial;
  currentTexture: THREE.Texture;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number, aspectVal: number) {
    this.renderer = renderer;
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      generateMipmaps: false,
    };

    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));

    this.rtOutput = new THREE.WebGLRenderTarget(w, h, rtOptions);
    this.prevRenderTarget = new THREE.WebGLRenderTarget(w, h, rtOptions);
    this.currentTexture = this.prevRenderTarget.texture;

    this.uniforms = {
      pointer: { value: new THREE.Vector2(10, 10) },
      pointerDown: { value: 0 },
      pointerRadius: { value: 0.36 },
      pointerDuration: { value: 2.2 },
      prevFrame: { value: this.prevRenderTarget.texture },
      time: { value: 0 },
      dTime: { value: 0 },
      aspect: { value: aspectVal },
    };

    this.blobMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: BLOB_VERTEX_SHADER,
      fragmentShader: BLOB_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
    });

    this.rtScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.blobMaterial);
    this.rtScene.add(quad);
    this.rtCamera = new THREE.Camera();
  }

  resize(width: number, height: number, aspectVal: number) {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    this.rtOutput.setSize(w, h);
    this.prevRenderTarget.setSize(w, h);
    this.uniforms.aspect.value = aspectVal;
  }

  render(time: number, dTime: number) {
    this.uniforms.time.value = time;
    this.uniforms.dTime.value = dTime;

    this.renderer.setRenderTarget(this.rtOutput);
    this.renderer.render(this.rtScene, this.rtCamera);
    this.renderer.setRenderTarget(null);

    const temp = this.prevRenderTarget;
    this.prevRenderTarget = this.rtOutput;
    this.rtOutput = temp;

    this.currentTexture = this.prevRenderTarget.texture;
    this.uniforms.prevFrame.value = this.currentTexture;
  }

  dispose() {
    this.rtOutput.dispose();
    this.prevRenderTarget.dispose();
    this.blobMaterial.dispose();
    this.rtScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    });
  }
}

/* ─── Hero Visual Component ──────────────────────────────────────────────── */

export const HeroVisual: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const bgPlaneMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [hasWebGLFallback, setHasWebGLFallback] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [reducedMotionActiveImage, setReducedMotionActiveImage] = useState<0 | 1>(0);

  // Runtime interaction and animation state held in refs for 60fps execution without React re-renders
  const stateRef = useRef({
    targetPointer: { x: 10, y: 10, down: 0 },
    currentPointer: { x: 10, y: 10, down: 0 },
    isPointerInside: false,
    isVisible: true,
    isTabActive: true,
    introProgress: 0,
    introDone: false,
    pulseActive: false,
    pulseTime: 0,
  });

  // Listen to prefers-reduced-motion media query
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Main Three.js Scene, Pipeline, and Event Binding
  useEffect(() => {
    const container = containerRef.current;
    const canvasContainer = canvasContainerRef.current;
    if (!container || !canvasContainer) return;

    if (prefersReducedMotion) return;

    let isDisposed = false;
    let animationId: number;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 508;
    const aspect = width / height;

    // 1. WebGL Renderer with transparent clear color
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0); // 100% transparent background
    } catch {
      setHasWebGLFallback(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    canvasContainer.appendChild(renderer.domElement);

    // 2. Camera & Scene
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000
    );
    camera.position.z = 1;

    const scene = new THREE.Scene();

    // 3. Ping-Pong Fluid Blob Simulation
    const blob = new BlobSimulation(renderer, width, height, aspect);

    // Color theme vectors
    const getColorVectors = (isDark: boolean) => {
      if (isDark) {
        return {
          bg: new THREE.Vector3(0.047, 0.039, 0.035),      // #0c0a09
          soft: new THREE.Vector3(0.110, 0.098, 0.090),    // #1c1917
          line: new THREE.Vector3(0.200, 0.180, 0.170),    // #292524
        };
      }
      return {
        bg: new THREE.Vector3(0.980, 0.980, 0.976),        // #fafaf9
        soft: new THREE.Vector3(0.961, 0.961, 0.961),      // #f5f5f4
        line: new THREE.Vector3(0.850, 0.840, 0.830),      // #d6d3d1
      };
    };

    const initialColors = getColorVectors(theme === 'dark');

    // 4. Textures & Shaders
    const textureLoader = new THREE.TextureLoader();

    // Secondary portrait texture (Ahmad Badawi with sunglasses)
    const revealTexture = textureLoader.load(AHMAD_PORTRAITS.secondary, () => {
      if (!isDisposed) {
        updatePlanes(container.clientWidth || width, container.clientHeight || height);
      }
    });
    revealTexture.colorSpace = THREE.SRGBColorSpace;
    revealTexture.minFilter = THREE.LinearMipmapLinearFilter;
    revealTexture.magFilter = THREE.LinearFilter;
    revealTexture.generateMipmaps = true;

    // Calculate exact object-fit: cover plane geometry
    // Known native aspect ratio of portraits: 2676 / 1492 = 1.79356 (or 669 / 373 = 1.79356)
    const naturalW = 2676;
    const naturalH = 1492;
    const initialScale = Math.max(width / naturalW, height / naturalH);
    const initialPlaneW = naturalW * initialScale;
    const initialPlaneH = naturalH * initialScale;

    // Layer 1: Procedural Torn Paper & Topographic Contours Shader (Intermediate Plane)
    const bgPlaneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texBlob: { value: blob.currentTexture },
        time: { value: 0 },
        colorBg: { value: initialColors.bg },
        colorSoftShape: { value: initialColors.soft },
        colorLine: { value: initialColors.line },
      },
      vertexShader: BG_PLANE_VERTEX_SHADER,
      fragmentShader: BG_PLANE_FRAGMENT_SHADER,
      transparent: true,
      depthTest: true,
    });
    bgPlaneMaterialRef.current = bgPlaneMaterial;

    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), bgPlaneMaterial);
    bgMesh.position.z = 0.05;
    bgMesh.renderOrder = 1;
    scene.add(bgMesh);

    // Layer 2: Reveal Portrait Mesh (Ahmad Badawi with Sunglasses, Top Plane)
    const revealImageMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texBlob: { value: blob.currentTexture },
        map: { value: revealTexture },
      },
      vertexShader: REVEAL_VERTEX_SHADER,
      fragmentShader: REVEAL_FRAGMENT_SHADER,
      transparent: true,
      depthTest: true,
    });

    const revealMesh = new THREE.Mesh(new THREE.PlaneGeometry(initialPlaneW, initialPlaneH), revealImageMaterial);
    revealMesh.position.z = 0.1;
    revealMesh.renderOrder = 2;
    scene.add(revealMesh);

    const updatePlanes = (w: number, h: number) => {
      const scale = Math.max(w / naturalW, h / naturalH);
      const planeWidth = naturalW * scale;
      const planeHeight = naturalH * scale;

      revealMesh.geometry.dispose();
      revealMesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

      bgMesh.geometry.dispose();
      bgMesh.geometry = new THREE.PlaneGeometry(w, h);
    };

    // 5. Responsive Resize Observer
    const handleResize = () => {
      if (!container || isDisposed) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth <= 0 || newHeight <= 0) return;

      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      const newAspect = newWidth / newHeight;
      blob.resize(newWidth, newHeight, newAspect);

      updatePlanes(newWidth, newHeight);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // 6. Visibility and Intersection Observers for GPU power-saving
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        stateRef.current.isVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const handleVisibility = () => {
      stateRef.current.isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 7. Interaction Event Handlers
    const setPointerFromEvent = (clientX: number, clientY: number, isDown: number) => {
      const rect = container.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((clientY - rect.top) / rect.height) * 2 + 1;

      stateRef.current.targetPointer.x = Math.max(-1.1, Math.min(1.1, nx));
      stateRef.current.targetPointer.y = Math.max(-1.1, Math.min(1.1, ny));
      stateRef.current.targetPointer.down = isDown;
      stateRef.current.isPointerInside = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      setPointerFromEvent(e.clientX, e.clientY, 1.0);
    };

    const onPointerEnter = (e: PointerEvent) => {
      setPointerFromEvent(e.clientX, e.clientY, 1.0);
    };

    const onPointerLeave = () => {
      stateRef.current.isPointerInside = false;
      stateRef.current.targetPointer.down = 0.0;
      stateRef.current.targetPointer.x = 10;
      stateRef.current.targetPointer.y = 10;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setPointerFromEvent(touch.clientX, touch.clientY, 1.0);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setPointerFromEvent(touch.clientX, touch.clientY, 1.0);
      }
    };

    const onTouchEnd = () => {
      onPointerLeave();
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerenter', onPointerEnter, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // 8. Animation & Physics Loop
    const clock = new THREE.Clock();
    let totalTime = 0;

    const animate = () => {
      if (isDisposed) return;

      animationId = requestAnimationFrame(animate);

      // Skip GPU render when hero is scrolled out of viewport or tab is inactive
      if (!stateRef.current.isVisible || !stateRef.current.isTabActive) {
        clock.getDelta(); // flush clock delta to prevent jump when waking
        return;
      }

      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.1); // clamp to prevent delta explosion on lag spike
      totalTime += dt;

      const state = stateRef.current;

      // Subtle intro gesture (gentle single sweep across eyes on initial mount)
      if (!state.introDone) {
        state.introProgress += dt * 0.75;
        if (state.introProgress < 1.0) {
          const tNorm = state.introProgress;
          const sweepX = -0.35 + Math.sin(tNorm * Math.PI) * 0.7;
          const sweepY = 0.18 + Math.cos(tNorm * Math.PI * 2.0) * 0.04;
          blob.uniforms.pointer.value.set(sweepX, sweepY);
          blob.uniforms.pointerDown.value = Math.sin(tNorm * Math.PI) * 0.85;
        } else {
          state.introDone = true;
          blob.uniforms.pointerDown.value = 0.0;
          blob.uniforms.pointer.value.set(10, 10);
        }
      } else if (state.pulseActive) {
        // Tap/click radiating wave animation
        state.pulseTime += dt * 1.5;
        if (state.pulseTime < 1.2) {
          const p = state.pulseTime;
          const radius = 0.2 + p * 0.45;
          const angle = p * Math.PI * 4.0;
          const px = Math.cos(angle) * (radius * 0.35);
          const py = 0.15 + Math.sin(angle) * (radius * 0.35);
          blob.uniforms.pointer.value.set(px, py);
          blob.uniforms.pointerDown.value = Math.max(0, 1.0 - p);
        } else {
          state.pulseActive = false;
          blob.uniforms.pointerDown.value = 0.0;
          blob.uniforms.pointer.value.set(10, 10);
        }
      } else {
        // High-precision pointer smoothing (lerp factor 0.22)
        if (state.targetPointer.down > 0.005) {
          if (state.currentPointer.down < 0.01) {
            state.currentPointer.x = state.targetPointer.x;
            state.currentPointer.y = state.targetPointer.y;
          } else {
            state.currentPointer.x += (state.targetPointer.x - state.currentPointer.x) * 0.22;
            state.currentPointer.y += (state.targetPointer.y - state.currentPointer.y) * 0.22;
          }
        }
        state.currentPointer.down += (state.targetPointer.down - state.currentPointer.down) * 0.16;

        blob.uniforms.pointer.value.set(state.currentPointer.x, state.currentPointer.y);
        blob.uniforms.pointerDown.value = state.currentPointer.down;
      }

      // Step procedural simulation
      blob.render(totalTime, dt);

      // Pass updated textures and uniforms to scene shaders
      bgPlaneMaterial.uniforms.texBlob.value = blob.currentTexture;
      bgPlaneMaterial.uniforms.time.value = totalTime;
      revealImageMaterial.uniforms.texBlob.value = blob.currentTexture;

      // Render composite Three.js scene (transparent clear color)
      renderer.render(scene, camera);
    };

    // Render immediately on mount
    renderer.render(scene, camera);
    animate();

    // 9. Teardown & Full Resource Disposal
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationId);
      bgPlaneMaterialRef.current = null;

      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);

      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);

      if (canvasContainer.contains(renderer.domElement)) {
        canvasContainer.removeChild(renderer.domElement);
      }

      renderer.dispose();
      blob.dispose();
      revealTexture.dispose();
      bgPlaneMaterial.dispose();
      revealImageMaterial.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, [prefersReducedMotion]);

  // Synchronize dynamic theme colors with WebGL shaders without reloading the scene
  useEffect(() => {
    if (prefersReducedMotion || !bgPlaneMaterialRef.current) return;
    const isDark = theme === 'dark';
    const mat = bgPlaneMaterialRef.current;
    if (isDark) {
      mat.uniforms.colorBg.value.set(0.047, 0.039, 0.035);
      mat.uniforms.colorSoftShape.value.set(0.110, 0.098, 0.090);
      mat.uniforms.colorLine.value.set(0.200, 0.180, 0.170);
    } else {
      mat.uniforms.colorBg.value.set(0.980, 0.980, 0.976);
      mat.uniforms.colorSoftShape.value.set(0.961, 0.961, 0.961);
      mat.uniforms.colorLine.value.set(0.850, 0.840, 0.830);
    }
  }, [theme, prefersReducedMotion]);

  // Handle tap / click / keyboard burst trigger
  const handleInteractionTrigger = useCallback(() => {
    if (prefersReducedMotion || hasWebGLFallback) {
      setReducedMotionActiveImage((prev) => (prev === 0 ? 1 : 0));
      return;
    }
    stateRef.current.pulseActive = true;
    stateRef.current.pulseTime = 0;
  }, [prefersReducedMotion, hasWebGLFallback]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteractionTrigger();
    }
  };

  const useFallback = prefersReducedMotion || hasWebGLFallback;

  return (
    <div
      ref={containerRef}
      id="hero-focal-photo"
      role="button"
      tabIndex={0}
      aria-label="Ahmad Badawi interactive portrait - Hover, drag, or tap to trigger organic liquid reveal"
      onClick={handleInteractionTrigger}
      onKeyDown={handleKeyDown}
      className="relative w-full h-full max-h-full mx-auto select-none cursor-pointer focus:outline-hidden touch-pan-y"
      style={{
        // Editorial gradient feathering: seamlessly dissolves bottom into the section boundary
        maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
      }}
    >
      {/* Base Portrait Layer: Instant hardware-accelerated image display */}
      <img
        src={AHMAD_PORTRAITS.primary}
        alt="Ahmad Badawi - Software Developer"
        className="w-full h-full object-cover block select-none pointer-events-none"
        style={{
          opacity: useFallback && reducedMotionActiveImage === 1 ? 0 : 1,
          transition: useFallback ? 'opacity 0.5s ease' : 'none',
        }}
      />

      {/* Interactive Lorenzo Three.js Canvas Layer */}
      {!useFallback && (
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Reduced Motion & WebGL Fallback Overlay */}
      {useFallback && (
        <img
          src={AHMAD_PORTRAITS.secondary}
          alt="Ahmad Badawi alternate perspective"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none"
          style={{ opacity: reducedMotionActiveImage === 1 ? 1 : 0 }}
        />
      )}
    </div>
  );
};
