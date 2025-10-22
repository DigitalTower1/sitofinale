uniform float offset;
uniform float darkness;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 position = uv - vec2(0.5);
  float len = length(position);
  float vignette = smoothstep(offset, offset + 0.5, len);
  gl_FragColor = vec4(vec3(1.0 - vignette * darkness), 1.0);
}
