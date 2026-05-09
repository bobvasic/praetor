export class Vector3 {
  constructor(x?: number, y?: number, z?: number);
  x: number;
  y: number;
  z: number;
  set(x: number, y: number, z: number): this;
  clone(): Vector3;
}
export class Color {
  constructor(value?: string | number);
  value: string | number;
  set(value: string | number): this;
  getStyle(): string;
}
export const MathUtils: {
  clamp(value: number, min: number, max: number): number;
  degToRad(degrees: number): number;
  lerp(x: number, y: number, t: number): number;
  mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
  smoothstep(x: number, min: number, max: number): number;
};
export const AdditiveBlending: string;
export const DoubleSide: string;
