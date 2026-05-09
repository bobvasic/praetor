class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x; this.y = y; this.z = z;
  }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  clone() { return new Vector3(this.x, this.y, this.z); }
}
class Color {
  constructor(value = '#ffffff') { this.value = value; }
  set(value) { this.value = value; return this; }
  getStyle() { return String(this.value); }
}
const MathUtils = {
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  degToRad: (degrees) => degrees * Math.PI / 180,
  lerp: (x, y, t) => x + (y - x) * t,
  mapLinear: (x, a1, a2, b1, b2) => b1 + ((x - a1) * (b2 - b1)) / (a2 - a1),
  smoothstep: (x, min, max) => {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  },
};
module.exports = { Vector3, Color, MathUtils, AdditiveBlending: 'AdditiveBlending', DoubleSide: 'DoubleSide' };
