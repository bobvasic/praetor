const React = require('react');
const FiberContext = React.createContext(null);
function Canvas({ children, className, style, ...props }) {
  const canvasRef = React.useRef(null);
  const subscribers = React.useRef(new Set());
  const clock = React.useRef({ start: 0, elapsedTime: 0, delta: 0 });
  const context = React.useMemo(() => ({ canvasRef, subscribers }), []);
  React.useEffect(() => {
    let frame = 0;
    let last = performance.now();
    clock.current.start = last;
    const tick = (now) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock.current.delta = delta;
      clock.current.elapsedTime = (now - clock.current.start) / 1000;
      const state = { clock: clock.current, canvas: canvasRef.current, gl: canvasRef.current?.getContext('2d') || null };
      subscribers.current.forEach((subscriber) => subscriber(state, delta));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return React.createElement(FiberContext.Provider, { value: context },
    React.createElement('canvas', { ref: canvasRef, className, style, ...props }),
    children
  );
}
function useFrame(callback) {
  const context = React.useContext(FiberContext);
  React.useEffect(() => {
    if (!context) return undefined;
    context.subscribers.current.add(callback);
    return () => context.subscribers.current.delete(callback);
  }, [context, callback]);
}
module.exports = { Canvas, useFrame };
