#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uColor;
uniform vec3 uFresnelColor;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDir;

float fresnel(vec3 viewDir, vec3 normal, float power) {
  return pow(1.0 - dot(viewDir, normal), power);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);

  float fres = fresnel(viewDir, normal, 1.5);
  vec3 base = uColor;
  vec3 sheen = mix(vec3(0.1), uFresnelColor, fres);

  float grain = fract(sin(dot(vWorldPosition.xz + uTime * 0.2, vec2(12.9898, 78.233))) * 43758.5453);
  base += (grain - 0.5) * 0.06;

  vec3 color = mix(base, sheen, 0.45);
  gl_FragColor = vec4(color, 1.0);
}
