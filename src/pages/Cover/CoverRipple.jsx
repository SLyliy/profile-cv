import { useEffect, useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import "./CoverRipple.css";

/**
 * 真实水波（WebGL Shader）
 * - 折射位移：uv += dir * amp * wave * decay
 * - 阻尼：随半径衰减 + 随时间衰减
 * - 轻微高光：模拟波峰反光
 */
const CoverRipple = forwardRef(function CoverRipple(
  { imageSrc, disabled = false },
  ref
) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const texRef = useRef(null);
  const startTimeRef = useRef(performance.now());
  const rafRef = useRef(null);

  // 存最多 8 个波源（够用了）
  const MAX = 8;
  const ripplesRef = useRef(
    Array.from({ length: MAX }, () => ({ x: -10, y: -10, t0: -1 }))
  );

  useImperativeHandle(ref, () => ({
    addRipple(nx, ny) {
      if (disabled) return;
      // 找一个最旧/空的槽位
      const now = performance.now();
      let idx = 0;
      let best = Infinity;
      for (let i = 0; i < MAX; i++) {
        const t0 = ripplesRef.current[i].t0;
        const age = t0 < 0 ? Infinity : now - t0;
        if (age > best) continue;
      }
      // 更简单：优先覆盖最早的
      let oldestIdx = 0;
      let oldestT0 = Infinity;
      for (let i = 0; i < MAX; i++) {
        const t0 = ripplesRef.current[i].t0;
        if (t0 < 0) {
          oldestIdx = i;
          oldestT0 = -1;
          break;
        }
        if (t0 < oldestT0) {
          oldestT0 = t0;
          oldestIdx = i;
        }
      }
      ripplesRef.current[oldestIdx] = { x: nx, y: ny, t0: now };
    },
  }));

  const vertSrc = useMemo(
    () => `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main(){
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `,
    []
  );

  const fragSrc = useMemo(
    () => `
    precision highp float;
    varying vec2 v_uv;

    uniform sampler2D u_tex;
    uniform vec2 u_res;
    uniform float u_time;

    uniform vec3 u_ripples[8]; // (x, y, t0)
    
    // 可调参数（越真实越“克制”）
    float speed = 0.55;      // 波速
    float freq  = 28.0;      // 频率（波峰密度）
    float amp   = 0.010;     // 位移强度（折射感）
    float radialDamp = 2.2;  // 半径阻尼
    float timeDamp   = 1.6;  // 时间阻尼
    float highlight  = 0.06; // 波峰高光强度

    void main(){
      vec2 uv = v_uv;

      // 像素比例补偿（避免拉伸）
      float aspect = u_res.x / u_res.y;
      vec2 uvA = vec2(uv.x * aspect, uv.y);

      vec2 totalOffset = vec2(0.0);
      float totalHi = 0.0;

      for(int i=0;i<8;i++){
        vec3 r = u_ripples[i];
        if(r.z < 0.0) continue; // 未启用

        float t = (u_time - r.z) / 1000.0; // 秒
        if(t < 0.0) continue;

        vec2 c = vec2(r.x * aspect, r.y);
        vec2 d = uvA - c;
        float dist = length(d);

        // 波前：dist - speed*t
        float wavePos = dist - speed * t;

        // 让波在一定范围内比较明显（过远逐渐消失）
        float envelope = exp(-radialDamp * dist) * exp(-timeDamp * t);

        // 正弦波
        float w = sin(freq * wavePos);

        // 让“波峰”更像水：使用幂/阈值让波更尖一点
        float crest = pow(max(w, 0.0), 2.2);

        // 位移方向（沿径向）
        vec2 dir = dist > 0.0001 ? (d / dist) : vec2(0.0);

        // 位移：波峰前后会有折射变化，用 w 而不是 crest
        totalOffset += dir * (amp * w * envelope);

        // 高光：只在波峰附近更明显
        totalHi += crest * envelope;
      }

      // 回到非 aspect 的 uv 空间
      vec2 offset = vec2(totalOffset.x / aspect, totalOffset.y);

      // 采样：折射后的纹理
      vec4 col = texture2D(u_tex, uv + offset);

      // 高光：轻轻提亮（不要太夸张才像真实水）
      col.rgb += totalHi * highlight;

      gl_FragColor = col;
    }
  `,
    []
  );

  const compile = (gl, type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(msg);
    }
    return s;
  };

  const link = (gl, vs, fs) => {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const msg = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error(msg);
    }
    return p;
  };

  const fitCanvas = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(2, Math.floor(rect.width * dpr));
    const h = Math.max(2, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const loadTexture = async (gl, src) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    await img.decode();

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return tex;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    glRef.current = gl;

    let cleanup = () => {};
    let killed = false;

    (async () => {
      try {
        const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
        const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
        const program = link(gl, vs, fs);
        programRef.current = program;

        // Fullscreen quad
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW
        );

        gl.useProgram(program);

        const aPos = gl.getAttribLocation(program, "a_pos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        // uniforms
        const uTex = gl.getUniformLocation(program, "u_tex");
        const uRes = gl.getUniformLocation(program, "u_res");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uRip = gl.getUniformLocation(program, "u_ripples");

        // texture
        const tex = await loadTexture(gl, imageSrc);
        if (killed) return;
        texRef.current = tex;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uTex, 0);

        const render = () => {
          if (killed) return;
          fitCanvas();

          const now = performance.now();
          const w = canvas.width;
          const h = canvas.height;

          gl.useProgram(program);
          gl.uniform2f(uRes, w, h);
          gl.uniform1f(uTime, now);

          // ripples -> vec3 array
          const arr = new Float32Array(8 * 3);
          for (let i = 0; i < 8; i++) {
            const r = ripplesRef.current[i];
            arr[i * 3 + 0] = r.x;
            arr[i * 3 + 1] = r.y;
            arr[i * 3 + 2] = r.t0;
          }
          gl.uniform3fv(uRip, arr);

          gl.drawArrays(gl.TRIANGLES, 0, 6);

          rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        const onResize = () => fitCanvas();
        window.addEventListener("resize", onResize);

        cleanup = () => {
          window.removeEventListener("resize", onResize);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          gl.deleteTexture(tex);
          gl.deleteProgram(program);
        };
      } catch (e) {
        // 如果 WebGL 编译失败，就让页面退回普通背景
        console.error("CoverRipple WebGL error:", e);
      }
    })();

    return () => {
      killed = true;
      cleanup();
    };
  }, [imageSrc, fragSrc, vertSrc]);

  return <canvas className="cover-ripple-canvas" ref={canvasRef} aria-hidden="true" />;
});

export default CoverRipple;
