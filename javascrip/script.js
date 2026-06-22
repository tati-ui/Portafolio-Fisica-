/* ==========================================================
   PORTAFOLIO DE FÍSICA I
   JavaScript principal para los simuladores interactivos
========================================================== */

/* ==========================================================
   FUNCIONES GENERALES
========================================================== */

function scrollToSection(id) {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function clearCanvas(canvas, ctx) {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Variable global para animaciones */
let animationTime = 0;

/* ==========================================================
   TEMA CLARO / OSCURO
========================================================== */

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeBtn.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
  });
}

/* ==========================================================
   MOVIMIENTO EN 3 DIMENSIONES
========================================================== */

const threeDCanvas = document.getElementById("threeDCanvas");

function draw3DMovementAnimated(time) {
  if (!threeDCanvas) return;

  const ctx = threeDCanvas.getContext("2d");
  clearCanvas(threeDCanvas, ctx);

  const cx = threeDCanvas.width / 2;
  const cy = threeDCanvas.height / 2 + 20;

  ctx.fillStyle = "#07111f";
  ctx.fillRect(0, 0, threeDCanvas.width, threeDCanvas.height);

  /* Ejes 3D */
  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 140, cy + 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 100);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - 130, cy + 65);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText("x", cx + 148, cy + 45);
  ctx.fillText("y", cx + 8, cy - 105);
  ctx.fillText("z", cx - 140, cy + 75);

  ctx.font = "15px Arial";
  ctx.fillText("r(t) = x(t)i + y(t)j + z(t)k", 30, 35);

  /* Trayectoria 3D proyectada */
  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let i = 0; i <= 180; i++) {
    const t = i * 0.06;

    const x = 8 * t;
    const y = 50 * Math.sin(t);
    const z = 45 * Math.cos(t);

    const px = cx - 110 + x * 2.2 - z * 0.7;
    const py = cy - y * 0.55 + z * 0.35;

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.stroke();

  /* Punto animado */
  const t = time % 10.8;

  const x = 8 * t;
  const y = 50 * Math.sin(t);
  const z = 45 * Math.cos(t);

  const px = cx - 110 + x * 2.2 - z * 0.7;
  const py = cy - y * 0.55 + z * 0.35;

  ctx.fillStyle = "#a66cff";
  ctx.beginPath();
  ctx.arc(px, py, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(166,108,255,0.45)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(px, py, 16, 0, Math.PI * 2);
  ctx.stroke();
}

/* ==========================================================
   FUERZA CENTRÍPETA
========================================================== */

const centripetalCanvas = document.getElementById("centripetalCanvas");
const centripetalMassInput = document.getElementById("centripetalMassInput");
const centripetalSpeedInput = document.getElementById("centripetalSpeedInput");
const centripetalRadiusInput = document.getElementById("centripetalRadiusInput");

const centripetalMassValue = document.getElementById("centripetalMassValue");
const centripetalSpeedValue = document.getElementById("centripetalSpeedValue");
const centripetalRadiusValue = document.getElementById("centripetalRadiusValue");
const centripetalResult = document.getElementById("centripetalResult");

function drawCentripetalAnimated(time) {
  if (!centripetalCanvas) return;

  const ctx = centripetalCanvas.getContext("2d");

  const m = Number(centripetalMassInput.value);
  const v = Number(centripetalSpeedInput.value);
  const r = Number(centripetalRadiusInput.value);

  const Fc = (m * v * v) / r;

  centripetalMassValue.textContent = m;
  centripetalSpeedValue.textContent = v;
  centripetalRadiusValue.textContent = r;

  clearCanvas(centripetalCanvas, ctx);

  const cx = centripetalCanvas.width / 2;
  const cy = centripetalCanvas.height / 2 + 10;
  const radius = 65;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  const angle = time * (0.5 + v / 20);

  const ox = cx + radius * Math.cos(angle);
  const oy = cy + radius * Math.sin(angle);

  /* Flecha hacia el centro */
  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  /* Objeto en movimiento circular */
  ctx.fillStyle = "#3498ff";
  ctx.beginPath();
  ctx.arc(ox, oy, 13, 0, Math.PI * 2);
  ctx.fill();

  /* Centro */
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";
  ctx.fillText("Fc = mv²/r", 30, 35);
  ctx.fillText("Fuerza hacia el centro", 30, 60);

  centripetalResult.textContent = `Resultado: Fc = ${Fc.toFixed(2)} N`;
}

/* ==========================================================
   FUERZA DE FRICCIÓN
========================================================== */

const frictionCanvas = document.getElementById("frictionCanvas");
const muInput = document.getElementById("muInput");
const normalInput = document.getElementById("normalInput");

const muValue = document.getElementById("muValue");
const normalValue = document.getElementById("normalValue");
const frictionResult = document.getElementById("frictionResult");

function drawFriction() {
  if (!frictionCanvas) return;

  const ctx = frictionCanvas.getContext("2d");

  const mu = Number(muInput.value);
  const N = Number(normalInput.value);
  const Ff = mu * N;

  muValue.textContent = mu.toFixed(2);
  normalValue.textContent = N;

  clearCanvas(frictionCanvas, ctx);

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 135);
  ctx.lineTo(380, 135);
  ctx.stroke();

  ctx.fillStyle = "#ff9d3d";
  ctx.fillRect(170, 90, 70, 45);

  ctx.strokeStyle = "#ff66c4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(170, 112);
  ctx.lineTo(170 - Math.min(Ff, 150), 112);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.fillText("Ff = μN", 30, 35);
  ctx.fillText("La fricción se opone al movimiento", 30, 58);

  frictionResult.textContent = `Resultado: Ff = ${Ff.toFixed(2)} N`;
}

/* ==========================================================
   TRABAJO MECÁNICO
========================================================== */

const workCanvas = document.getElementById("workCanvas");
const workForceInput = document.getElementById("workForceInput");
const distanceInput = document.getElementById("distanceInput");
const workAngleInput = document.getElementById("workAngleInput");

const workForceValue = document.getElementById("workForceValue");
const distanceValue = document.getElementById("distanceValue");
const workAngleValue = document.getElementById("workAngleValue");
const workResult = document.getElementById("workResult");

function drawWork() {
  if (!workCanvas) return;

  const ctx = workCanvas.getContext("2d");

  const F = Number(workForceInput.value);
  const d = Number(distanceInput.value);
  const angle = Number(workAngleInput.value);
  const radians = angle * Math.PI / 180;

  const W = F * d * Math.cos(radians);

  workForceValue.textContent = F;
  distanceValue.textContent = d;
  workAngleValue.textContent = angle;

  clearCanvas(workCanvas, ctx);

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 135);
  ctx.lineTo(380, 135);
  ctx.stroke();

  ctx.fillStyle = "#66dd66";
  ctx.fillRect(130, 100, 55, 35);

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(190, 118);
  ctx.lineTo(310, 118);
  ctx.stroke();

  ctx.strokeStyle = "#ff9d3d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(160, 100);
  ctx.lineTo(160 + 80 * Math.cos(radians), 100 - 80 * Math.sin(radians));
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.fillText("W = Fd cos(θ)", 30, 35);

  workResult.textContent = `Resultado: W = ${W.toFixed(2)} J`;
}

/* ==========================================================
   ENERGÍA CINÉTICA
========================================================== */

const energyCanvas = document.getElementById("energyCanvas");
const energyCtx = energyCanvas ? energyCanvas.getContext("2d") : null;

const energyMassInput = document.getElementById("energyMassInput");
const energySpeedInput = document.getElementById("energySpeedInput");

const energyMassValue = document.getElementById("energyMassValue");
const energySpeedValue = document.getElementById("energySpeedValue");
const energyResult = document.getElementById("energyResult");

function drawEnergy() {
  if (!energyCanvas) return;

  const m = Number(energyMassInput.value);
  const v = Number(energySpeedInput.value);

  const K = 0.5 * m * v * v;

  energyMassValue.textContent = m;
  energySpeedValue.textContent = v;

  clearCanvas(energyCanvas, energyCtx);

  ctx = energyCtx;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 135);
  ctx.lineTo(380, 135);
  ctx.stroke();

  ctx.fillStyle = "#66dd66";
  ctx.beginPath();
  ctx.arc(80 + v * 7, 135, 16, 0, Math.PI * 2);
  ctx.fill();

  const barWidth = Math.min(K / 12, 300);

  ctx.fillStyle = "#28e0d3";
  ctx.fillRect(40, 40, barWidth, 18);

  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";
  ctx.fillText("K = ½mv²", 40, 25);
  ctx.fillText(`${K.toFixed(2)} J`, 40 + barWidth + 10, 55);

  energyResult.textContent = `Resultado: K = ${K.toFixed(2)} J`;
}

/* ==========================================================
   IMPULSO
========================================================== */

const impulseCanvas = document.getElementById("impulseCanvas");
const impulseForceInput = document.getElementById("impulseForceInput");
const timeInput = document.getElementById("timeInput");

const impulseForceValue = document.getElementById("impulseForceValue");
const timeValue = document.getElementById("timeValue");
const impulseResult = document.getElementById("impulseResult");

function drawImpulse() {
  if (!impulseCanvas) return;

  const ctx = impulseCanvas.getContext("2d");

  const F = Number(impulseForceInput.value);
  const t = Number(timeInput.value);
  const J = F * t;

  impulseForceValue.textContent = F;
  timeValue.textContent = t.toFixed(1);

  clearCanvas(impulseCanvas, ctx);

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 135);
  ctx.lineTo(380, 135);
  ctx.stroke();

  ctx.fillStyle = "#a66cff";
  ctx.beginPath();
  ctx.arc(120, 135, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(145, 135);
  ctx.lineTo(145 + Math.min(J, 200), 135);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.fillText("J = FΔt = Δp", 30, 35);

  impulseResult.textContent = `Resultado: J = ${J.toFixed(2)} N·s`;
}

/* ==========================================================
   COLISIÓN INELÁSTICA
========================================================== */

const momentumCanvas = document.getElementById("momentumCanvas");
const momentumCtx = momentumCanvas ? momentumCanvas.getContext("2d") : null;

const m1Input = document.getElementById("m1Input");
const u1Input = document.getElementById("u1Input");
const m2Input = document.getElementById("m2Input");
const u2Input = document.getElementById("u2Input");

const m1Value = document.getElementById("m1Value");
const u1Value = document.getElementById("u1Value");
const m2Value = document.getElementById("m2Value");
const u2Value = document.getElementById("u2Value");
const momentumResult = document.getElementById("momentumResult");

function drawMomentum() {
  if (!momentumCanvas) return;

  const m1 = Number(m1Input.value);
  const u1 = Number(u1Input.value);
  const m2 = Number(m2Input.value);
  const u2 = Number(u2Input.value);

  const pInicial = m1 * u1 + m2 * u2;
  const vf = pInicial / (m1 + m2);
  const pFinal = (m1 + m2) * vf;

  m1Value.textContent = m1;
  u1Value.textContent = u1;
  m2Value.textContent = m2;
  u2Value.textContent = u2;

  clearCanvas(momentumCanvas, momentumCtx);

  momentumCtx.strokeStyle = "#8aa4c7";
  momentumCtx.lineWidth = 2;
  momentumCtx.beginPath();
  momentumCtx.moveTo(40, 150);
  momentumCtx.lineTo(830, 150);
  momentumCtx.stroke();

  const x1 = 120 + u1 * 8;
  const x2 = 600 - u2 * 8;

  momentumCtx.fillStyle = "#ff66c4";
  momentumCtx.beginPath();
  momentumCtx.arc(x1, 150, 18 + m1, 0, Math.PI * 2);
  momentumCtx.fill();

  momentumCtx.fillStyle = "#3498ff";
  momentumCtx.beginPath();
  momentumCtx.arc(x2, 150, 18 + m2, 0, Math.PI * 2);
  momentumCtx.fill();

  momentumCtx.fillStyle = "#ffffff";
  momentumCtx.font = "15px Arial";
  momentumCtx.fillText("Colisión inelástica: ambos cuerpos quedan unidos", 40, 45);
  momentumCtx.fillText("p inicial = p final", 40, 70);
  momentumCtx.fillText(`vf = ${vf.toFixed(2)} m/s`, 40, 95);

  momentumResult.textContent =
    `Momento inicial = ${pInicial.toFixed(2)} kg·m/s | Momento final = ${pFinal.toFixed(2)} kg·m/s | Velocidad final = ${vf.toFixed(2)} m/s`;
}

/* ==========================================================
   EVENTOS DE LOS SLIDERS
========================================================== */

if (centripetalMassInput) {
  centripetalMassInput.addEventListener("input", () => drawCentripetalAnimated(animationTime));
  centripetalSpeedInput.addEventListener("input", () => drawCentripetalAnimated(animationTime));
  centripetalRadiusInput.addEventListener("input", () => drawCentripetalAnimated(animationTime));
}

if (muInput) {
  muInput.addEventListener("input", drawFriction);
  normalInput.addEventListener("input", drawFriction);
}

if (workForceInput) {
  workForceInput.addEventListener("input", drawWork);
  distanceInput.addEventListener("input", drawWork);
  workAngleInput.addEventListener("input", drawWork);
}

if (energyMassInput) {
  energyMassInput.addEventListener("input", drawEnergy);
  energySpeedInput.addEventListener("input", drawEnergy);
}

if (impulseForceInput) {
  impulseForceInput.addEventListener("input", drawImpulse);
  timeInput.addEventListener("input", drawImpulse);
}

if (m1Input) {
  m1Input.addEventListener("input", drawMomentum);
  u1Input.addEventListener("input", drawMomentum);
  m2Input.addEventListener("input", drawMomentum);
  u2Input.addEventListener("input", drawMomentum);
}

/* ==========================================================
   LOOP DE ANIMACIÓN
========================================================== */

function animate() {
  animationTime += 0.025;

  draw3DMovementAnimated(animationTime);
  drawCentripetalAnimated(animationTime);

  requestAnimationFrame(animate);
}

/* ==========================================================
   INICIALIZACIÓN GENERAL
========================================================== */

drawFriction();
drawWork();
drawEnergy();
drawImpulse();
drawMomentum();
animate();