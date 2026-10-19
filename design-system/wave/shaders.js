// This is an independently written shader study of the ribbon on stripe.com.
// Change geometry and motion in main.js, and surface treatment here.
export const vertexShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDisplaceX;
  uniform float uDisplaceZ;
  uniform float uDisplaceAmount;
  uniform vec3 uTwist;
  uniform vec3 uTwistPower;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.,0.)), u.x),
               mix(hash21(i + vec2(0.,1.)), hash21(i + vec2(1.,1.)), u.x), u.y) * 2.0 - 1.0;
  }
  mat3 rotateAxis(vec3 axis, float angle) {
    axis = normalize(axis);
    float c = cos(angle), s = sin(angle), d = 1.0 - c;
    return mat3(
      c + axis.x*axis.x*d, axis.x*axis.y*d + axis.z*s, axis.x*axis.z*d - axis.y*s,
      axis.y*axis.x*d - axis.z*s, c + axis.y*axis.y*d, axis.y*axis.z*d + axis.x*s,
      axis.z*axis.x*d + axis.y*s, axis.z*axis.y*d - axis.x*s, c + axis.z*axis.z*d
    );
  }
  float edgeFalloff(float x, float power) {
    return exp2(-exp2(power) * pow(max(x, 0.0), max(power, 0.01)));
  }
  void main() {
    vUv = uv;
    float drift = uTime * uSpeed;
    vec3 p = position;
    p.y += uDisplaceAmount * noise2(vec2(p.x * uDisplaceX + drift,
                                               p.z * uDisplaceZ + drift));
    p = rotateAxis(vec3(.5,0.,.5), uTwist.y * edgeFalloff(uv.x, uTwistPower.y)) * p;
    p = rotateAxis(vec3(0.,.5,.5), uTwist.x * edgeFalloff(uv.y, uTwistPower.x)) * p;
    p = rotateAxis(vec3(.5,0.,.5), uTwist.z * edgeFalloff(uv.y, uTwistPower.z)) * p;
    vPosition = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uPalette;
  uniform int uPaletteMode;
  uniform vec3 uGradientColors[3];
  uniform vec2 uResolution;
  uniform float uGrain;
  uniform float uFibers;
  uniform float uGlow;
  uniform float uSaturation;
  uniform float uContrast;
  uniform float uHue;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash21(i), hash21(i+vec2(1.,0.)), u.x),
               mix(hash21(i+vec2(0.,1.)), hash21(i+vec2(1.,1.)), u.x), u.y);
  }
  vec3 hueRotate(vec3 color, float angle) {
    vec3 axis = vec3(.57735027);
    return color*cos(angle) + cross(axis,color)*sin(angle)
           + axis*dot(axis,color)*(1.0-cos(angle));
  }
  void main() {
    float position = clamp(vUv.x, 0.0, 1.0);
    vec3 gradient = position < 0.5
      ? mix(uGradientColors[0], uGradientColors[1], position * 2.0)
      : mix(uGradientColors[1], uGradientColors[2], (position - 0.5) * 2.0);
    vec3 color = uPaletteMode == 1 ? gradient : texture2D(uPalette, vUv).rgb;
    float broad = noise2(vUv * vec2(2.0, .8));
    float fiber = noise2(vec2(vUv.x * (620.0 + broad * 190.0),
                              vUv.y * 4.0 + broad * 2.0));
    float shape = pow(max(0.0, 4.0*vUv.x*(1.0-vUv.x)), 2.1);
    float facing = clamp(.5 + dFdy(vUv.y) * uResolution.y * uGlow * .3, 0.0, 1.0);
    color += (fiber-.48) * uFibers * shape * facing * (1.0 - color.b*.55);
    color = (color-.5)*uContrast+.5;
    float luma = dot(color, vec3(.299,.587,.114));
    color = mix(vec3(luma), color, uSaturation);
    color = hueRotate(color, uHue);
    color += (1.0-facing) * .12;
    float grain = hash21(gl_FragCoord.xy + floor(uTime * 23.0));
    color += (grain-.5) * uGrain;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
