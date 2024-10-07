export const createAnimationForEye = async () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const points = 12;
  const radius = 200 * dpr;
  const h = 600 * dpr;
  const w = 600 * dpr;
  const center = {
    x: (w / 2) * dpr,
    y: (h / 2) * dpr,
  };

  const circles = [];
  const rangeMin = 1;
  const rangeMax = 30;

  let mouseY = 0;
  let tick = 0;

  const gradient1 = ctx.createLinearGradient(0, 0, w, 0);
  gradient1.addColorStop(0, "#fff");
  gradient1.addColorStop(1, "#84095f ");

  const gradient2 = ctx.createLinearGradient(0, 0, w, 0);
  gradient2.addColorStop(0, "#505add");
  gradient2.addColorStop(1, "#6f86d6");

  const gradient3 = ctx.createLinearGradient(0, 0, w, 0);
  gradient3.addColorStop(0, "#9795f0");
  gradient3.addColorStop(1, "#df42b1");

  const gradient4 = ctx.createLinearGradient(0, 0, w, 0);
  gradient4.addColorStop(0, "#df42b1");
  gradient4.addColorStop(1, "#9293bc");

  const gradients = [gradient1, gradient2, gradient3, gradient4];

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseY = event.clientY;
    },
    true
  );

  ctx.scale(dpr, dpr);

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  for (let idx = 0; idx <= gradients.length - 1; idx++) {
    let swingpoints = [];
    let radian = 0;
    for (let i = 0; i < points; i++) {
      radian = ((Math.PI * 2) / points) * i;
      let ptX = center.x + radius * Math.cos(radian);
      let ptY = center.y + radius * Math.sin(radian);
      swingpoints.push({
        x: ptX,
        y: ptY,
        radian: radian,
        range: random(rangeMin, rangeMax),
        phase: 0,
      });
    }
    circles.push(swingpoints);
  }

  function swingCircle() {
    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "screen";
    for (let k = 0; k < circles.length; k++) {
      let swingpoints = circles[k];
      for (let i = 0; i < swingpoints.length; i++) {
        swingpoints[i].phase += random(1, 10) * -0.01;
        let phase = 4 * Math.sin(tick / 65);
        if (mouseY !== 0) {
          phase = mouseY / 200 + 1;
        }
        let r =
          radius +
          swingpoints[i].range * phase * Math.sin(swingpoints[i].phase) -
          rangeMax;
        swingpoints[i].radian += Math.PI / 360;
        let ptX = center.x + r * Math.cos(swingpoints[i].radian);
        let ptY = center.y + r * Math.sin(swingpoints[i].radian);
        swingpoints[i] = {
          x: ptX,
          y: ptY,
          radian: swingpoints[i].radian,
          range: swingpoints[i].range,
          phase: swingpoints[i].phase,
        };
      }
      const fill = gradients[k];
      drawCurve(swingpoints, fill);
    }
    tick++;
    requestAnimationFrame(swingCircle);
  }

  requestAnimationFrame(swingCircle);

  function drawCurve(pts, fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(
      (pts[cycle(-1, points)].x + pts[0].x) / 2,
      (pts[cycle(-1, points)].y + pts[0].y) / 2
    );
    for (let i = 0; i < pts.length; i++) {
      ctx.quadraticCurveTo(
        pts[i].x,
        pts[i].y,
        (pts[i].x + pts[cycle(i + 1, points)].x) / 2,
        (pts[i].y + pts[cycle(i + 1, points)].y) / 2
      );
    }
    ctx.closePath();
    ctx.fill();
  }

  function cycle(num1, num2) {
    return ((num1 % num2) + num2) % num2;
  }

  function random(num1, num2) {
    let max = Math.max(num1, num2);
    let min = Math.min(num1, num2);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
