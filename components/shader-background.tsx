"use client"

import { useEffect, useRef } from "react"

const vertexSource = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`
const fragmentSource = `precision mediump float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  float wave = sin(p.x * 1.8 + time * 0.17) * 0.18;
  wave += sin(p.x * 3.0 - time * 0.12) * 0.08;
  float ribbon = exp(-abs(p.y - wave - 0.35) * 4.0);
  float second = exp(-abs(p.y + wave + 0.5) * 5.0);
  vec2 delta = uv - pointer;
  delta.x *= resolution.x / resolution.y;
  float glow = exp(-dot(delta, delta) * 5.0);
  vec3 color = vec3(0.012, 0.021, 0.052);
  color += vec3(0.025, 0.13, 0.22) * ribbon;
  color += vec3(0.11, 0.035, 0.2) * second;
  color += vec3(0.045, 0.12, 0.19) * glow;
  gl_FragColor = vec4(color, 1.0);
}`

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reducedMotion.matches) return
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" })
    if (!gl) return
    const shaders: WebGLShader[] = []
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
    }
    const vertex = compile(gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    const dispose = () => {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      shaders.forEach(shader => gl.deleteShader(shader))
    }
    if (!vertex || !fragment || !program || !buffer) { dispose(); return }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return }
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const resolution = gl.getUniformLocation(program, "resolution")
    const pointer = gl.getUniformLocation(program, "pointer")
    const time = gl.getUniformLocation(program, "time")
    let frame = 0
    let previous = 0
    let elapsed = 0
    let lost = false
    const target = [0.6, 0.6]
    const current = [...target]
    const resize = () => {
      // Half-resolution rendering keeps a soft atmospheric effect inexpensive.
      const scale = Math.min(window.devicePixelRatio, 1.5) * 0.5
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale))
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolution, canvas.width, canvas.height)
    }
    const render = (now: number) => {
      if (lost || document.hidden || reducedMotion.matches) return
      frame = requestAnimationFrame(render)
      if (now - previous < 32) return
      elapsed += Math.min(now - previous, 50) / 1000
      previous = now
      current[0] += (target[0] - current[0]) * 0.06
      current[1] += (target[1] - current[1]) * 0.06
      gl.uniform2f(pointer, current[0], current[1])
      gl.uniform1f(time, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    const move = (event: PointerEvent) => {
      target[0] = event.clientX / window.innerWidth
      target[1] = 1 - event.clientY / window.innerHeight
    }
    const resume = () => {
      cancelAnimationFrame(frame)
      canvas.style.opacity = reducedMotion.matches ? "0" : "1"
      previous = performance.now()
      if (!document.hidden && !reducedMotion.matches && !lost) frame = requestAnimationFrame(render)
    }
    const contextLost = () => { lost = true; canvas.style.opacity = "0"; cancelAnimationFrame(frame) }
    resize()
    resume()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("visibilitychange", resume)
    reducedMotion.addEventListener("change", resume)
    canvas.addEventListener("webglcontextlost", contextLost)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", move)
      document.removeEventListener("visibilitychange", resume)
      reducedMotion.removeEventListener("change", resume)
      canvas.removeEventListener("webglcontextlost", contextLost)
      dispose()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="shader-background pointer-events-none fixed inset-0 h-full w-full" />
}
