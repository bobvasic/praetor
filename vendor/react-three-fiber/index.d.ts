import type { CanvasHTMLAttributes, ReactNode } from 'react';
export type ThreeFrameState = {
  clock: { start: number; elapsedTime: number; delta: number };
  canvas: HTMLCanvasElement | null;
  gl: CanvasRenderingContext2D | null;
};
export function Canvas(props: CanvasHTMLAttributes<HTMLCanvasElement> & { children?: ReactNode; gl?: unknown; camera?: unknown; dpr?: number | [number, number] }): JSX.Element;
export function useFrame(callback: (state: ThreeFrameState, delta: number) => void): void;
