import { useEffect, useRef } from "react";

interface FogParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  opacitySpeed: number;
}

export default function FogBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: FogParticle[] = Array.from({ length: 16 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 200 + Math.random() * 350,
      opacity: 0.08 + Math.random() * 0.14,
      speedX: (Math.random() - 0.5) * 1.1,
      speedY: (Math.random() - 0.5) * 0.6,
      opacitySpeed: (Math.random() - 0.5) * 0.0014,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;

        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;
        if (p.opacity < 0.04) p.opacitySpeed = Math.abs(p.opacitySpeed);
        if (p.opacity > 0.26) p.opacitySpeed = -Math.abs(p.opacitySpeed);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(52, 150, 95, ${p.opacity})`);
        grad.addColorStop(0.4, `rgba(30, 90, 55, ${p.opacity * 0.7})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}