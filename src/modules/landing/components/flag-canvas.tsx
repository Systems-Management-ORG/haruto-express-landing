"use client";

import { useEffect, useRef, useState } from "react";

// The towed banner. The server HTML carries a still picture of the cloth, so crawlers, visitors
// without JavaScript and visitors who prefer reduced motion see the full scene and nothing else
// runs for them. For everyone else, once the banner is on screen and the browser is idle, a
// WebGL2 canvas takes over and waves the cloth: a strip of thin quads bent along a sine wave that
// runs from the tow bar (right edge) to the loose end (left edge). The GPU smooths the edges
// (MSAA) and the picture is mipmapped, so neither outline nor lettering shows stair steps.
// Nothing is set up during page load, the loop only runs while the banner is visible and the
// tab is in front, and the GPU context is released when the component unmounts.

const SRC = "/images/haruto/sky-banner/co-haruto-express.webp";
const SRC_W = 1983;
const SRC_H = 293;
const HEADROOM = 0.25; // canvas extends this share of the cloth height above and below it
const WAVES = 1.8; // waves along the cloth
const PERIOD_MS = 1600; // one up-and-down of a point on the cloth
const AMPLITUDE = 0.17; // of the cloth height, at the loose end
const SEGMENTS = 160;

const VERT = `#version 300 es
in vec2 a_uv;
uniform float u_phase, u_amp, u_waves, u_head;
out vec2 v_uv;
out float v_shade;
void main() {
  float c = 1.0 / (1.0 + 2.0 * u_head);           // cloth height as a share of the canvas
  float d = 1.0 - a_uv.x;                          // 0 at the bar, 1 at the loose end
  float angle = u_phase - 6.2831853 * u_waves * d;
  float wave = u_amp * c * pow(d, 0.85) * sin(angle);
  float y = u_head * c + a_uv.y * c + wave;        // 0 = top of the canvas
  gl_Position = vec4(a_uv.x * 2.0 - 1.0, 1.0 - 2.0 * y, 0.0, 1.0);
  v_uv = a_uv;
  v_shade = 0.1 + 0.14 * cos(angle) * min(1.0, d * 4.0);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec2 v_uv;
in float v_shade;
uniform sampler2D u_tex;
out vec4 outColor;
void main() {
  vec4 t = texture(u_tex, v_uv);
  vec3 fold = vec3(0.059, 0.172, 0.098);           // deep green, for the shaded folds
  vec3 rgb = mix(t.rgb, fold, clamp(v_shade, 0.0, 1.0));
  outColor = vec4(rgb * t.a, t.a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

type Renderer = { draw: (time: number) => void; dispose: () => void };

// Builds the WebGL renderer, or returns null when WebGL2 is unavailable.
function createRenderer(canvas: HTMLCanvasElement, img: HTMLImageElement): Renderer | null {
  const gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: true, alpha: true });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // triangle strip: for each column, bottom then top vertex
  const verts = new Float32Array((SEGMENTS + 1) * 4);
  for (let i = 0; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS;
    verts.set([u, 1, u, 0], i * 4);
  }
  const buffer = gl.createBuffer();
  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_uv");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.uniform1f(gl.getUniformLocation(prog, "u_waves"), WAVES);
  gl.uniform1f(gl.getUniformLocation(prog, "u_head"), HEADROOM);
  gl.uniform1f(gl.getUniformLocation(prog, "u_amp"), AMPLITUDE);
  gl.uniform1i(gl.getUniformLocation(prog, "u_tex"), 0);
  const uPhase = gl.getUniformLocation(prog, "u_phase");

  let w = 0;
  let h = 0;
  return {
    draw(time) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const nh = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (nw !== w || nh !== h) {
        canvas.width = w = nw;
        canvas.height = h = nh;
        gl.viewport(0, 0, w, h);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uPhase, (time / PERIOD_MS) * Math.PI * 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, (SEGMENTS + 1) * 2);
    },
    dispose() {
      gl.deleteTexture(tex);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

const whenIdle = (fn: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
};

export function FlagCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: Renderer | null = null;
    let raf = 0;
    let visible = false;
    let cancelIdle: (() => void) | null = null;
    let disposed = false;

    const loop = (time: number) => {
      renderer?.draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (renderer && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Set up only once: on screen, picture decoded, and the browser idle.
    const setUp = () => {
      if (renderer || cancelIdle || disposed) return;
      cancelIdle = whenIdle(async () => {
        try {
          await img.decode();
        } catch {
          return; // picture failed: keep the still one
        }
        if (disposed) return;
        renderer = createRenderer(canvas, img);
        if (!renderer) return; // no WebGL2: keep the still picture
        renderer.draw(performance.now());
        setLive(true);
        start();
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) return stop();
      setUp();
      start();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      stop();
      cancelIdle?.();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer?.dispose();
    };
  }, []);

  return (
    <>
      {/* A plain <img>, not next/image: the same file is the WebGL texture, so it downloads once. */}
      <img
        ref={imgRef}
        src={SRC}
        width={SRC_W}
        height={SRC_H}
        alt=""
        loading="lazy"
        decoding="async"
        className="sky-tow__still"
        style={live ? { visibility: "hidden" } : undefined}
      />
      <canvas ref={canvasRef} className="sky-tow__canvas" style={live ? undefined : { visibility: "hidden" }} />
    </>
  );
}
