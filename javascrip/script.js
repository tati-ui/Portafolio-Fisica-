/* ==========================================================
   PORTAFOLIO DE FÍSICA I — AVANCE 2
   Archivo principal de JavaScript

   Este archivo controla:
   - Navegación suave.
   - Tema claro y oscuro.
   - Simuladores interactivos.
   - Dibujos en Canvas.
   - Animaciones del Avance 1 y Avance 2.
========================================================== */


/* ==========================================================
   1. FUNCIONES GENERALES
========================================================== */

/**
 * Desplaza suavemente la página hasta una sección.
 *
 * @param {string} id - Identificador HTML de la sección.
 */
function scrollToSection(id) {
  const section = document.getElementById(id);

  if (!section) {
    console.warn(`No se encontró la sección con id: ${id}`);
    return;
  }

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/**
 * Limpia completamente un elemento Canvas.
 *
 * @param {HTMLCanvasElement} canvas - Canvas que se limpiará.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D del Canvas.
 */
function clearCanvas(canvas, ctx) {
  if (!canvas || !ctx) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}


/**
 * Convierte grados a radianes.
 *
 * @param {number} degrees - Ángulo en grados.
 * @returns {number} Ángulo en radianes.
 */
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}


/**
 * Limita un número entre un mínimo y un máximo.
 *
 * @param {number} value - Valor que se desea limitar.
 * @param {number} min - Valor mínimo permitido.
 * @param {number} max - Valor máximo permitido.
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}


/* ==========================================================
   2. VARIABLE GENERAL DE ANIMACIÓN
========================================================== */

/*
  Esta variable aumenta en cada cuadro de animación.
  Se usa para calcular posiciones que cambian con el tiempo.
*/
let animationTime = 0;


/* ==========================================================
   3. TEMA CLARO Y OSCURO
========================================================== */

const themeBtn = document.getElementById("themeBtn");

/*
  El evento solo se registra si el botón existe en el HTML.
*/
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const lightModeEnabled =
      document.body.classList.contains("light");

    /*
      Se cambia el icono para indicar el tema disponible.
    */
    themeBtn.textContent = lightModeEnabled ? "🌙" : "☀️";

    /*
      Se guarda la preferencia en el navegador.
    */
    localStorage.setItem(
      "physicsPortfolioTheme",
      lightModeEnabled ? "light" : "dark"
    );
  });
}


/*
  Recupera la preferencia guardada cuando se abre la página.
*/
const savedTheme =
  localStorage.getItem("physicsPortfolioTheme");

if (savedTheme === "light") {
  document.body.classList.add("light");

  if (themeBtn) {
    themeBtn.textContent = "🌙";
  }
}


/* ==========================================================
   4. MOVIMIENTO EN TRES DIMENSIONES
   r(t) = x(t)i + y(t)j + z(t)k
========================================================== */

const threeDCanvas =
  document.getElementById("threeDCanvas");


/**
 * Dibuja una trayectoria tridimensional proyectada en un Canvas 2D.
 *
 * El objeto morado se mueve a través de una curva espacial.
 *
 * @param {number} time - Tiempo general de animación.
 */
function draw3DMovementAnimated(time) {
  if (!threeDCanvas) return;

  const ctx = threeDCanvas.getContext("2d");

  if (!ctx) return;

  clearCanvas(threeDCanvas, ctx);

  const width = threeDCanvas.width;
  const height = threeDCanvas.height;

  /*
    Punto central desde el cual se dibujan los ejes.
  */
  const centerX = width / 2;
  const centerY = height / 2 + 20;


  /* --------------------------------------------------------
     Fondo del Canvas
  -------------------------------------------------------- */

  ctx.fillStyle = "#07111f";
  ctx.fillRect(0, 0, width, height);


  /* --------------------------------------------------------
     Título y fórmula
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";
  ctx.fillText(
    "r(t) = x(t)i + y(t)j + z(t)k",
    24,
    30
  );


  /* --------------------------------------------------------
     Ejes tridimensionales proyectados
  -------------------------------------------------------- */

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;

  /*
    Eje X
  */
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + 140, centerY + 40);
  ctx.stroke();

  /*
    Eje Y
  */
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, centerY - 100);
  ctx.stroke();

  /*
    Eje Z
  */
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX - 130, centerY + 65);
  ctx.stroke();


  /* --------------------------------------------------------
     Etiquetas de los ejes
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";

  ctx.fillText(
    "x",
    centerX + 148,
    centerY + 45
  );

  ctx.fillText(
    "y",
    centerX + 8,
    centerY - 105
  );

  ctx.fillText(
    "z",
    centerX - 140,
    centerY + 75
  );


  /* --------------------------------------------------------
     Trayectoria espacial proyectada
  -------------------------------------------------------- */

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let index = 0; index <= 180; index++) {
    /*
      Parámetro matemático utilizado para construir la curva.
    */
    const trajectoryTime = index * 0.06;

    /*
      Coordenadas tridimensionales del objeto.
    */
    const x = 8 * trajectoryTime;
    const y = 50 * Math.sin(trajectoryTime);
    const z = 45 * Math.cos(trajectoryTime);

    /*
      Conversión de coordenadas 3D a una proyección 2D.
    */
    const projectedX =
      centerX -
      110 +
      x * 2.2 -
      z * 0.7;

    const projectedY =
      centerY -
      y * 0.55 +
      z * 0.35;

    if (index === 0) {
      ctx.moveTo(projectedX, projectedY);
    } else {
      ctx.lineTo(projectedX, projectedY);
    }
  }

  ctx.stroke();


  /* --------------------------------------------------------
     Posición animada del objeto
  -------------------------------------------------------- */

  /*
    El operador módulo permite repetir el recorrido.
  */
  const movingTime = time % 10.8;

  const movingX = 8 * movingTime;
  const movingY = 50 * Math.sin(movingTime);
  const movingZ = 45 * Math.cos(movingTime);

  const objectX =
    centerX -
    110 +
    movingX * 2.2 -
    movingZ * 0.7;

  const objectY =
    centerY -
    movingY * 0.55 +
    movingZ * 0.35;


  /* --------------------------------------------------------
     Objeto animado
  -------------------------------------------------------- */

  ctx.fillStyle = "#a66cff";
  ctx.beginPath();
  ctx.arc(
    objectX,
    objectY,
    12,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /*
    Contorno brillante alrededor del objeto.
  */
  ctx.strokeStyle = "rgba(166, 108, 255, 0.45)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(
    objectX,
    objectY,
    16,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}


/* ==========================================================
   5. FUERZA CENTRÍPETA
   Fc = mv² / r
========================================================== */

/*
  Elementos del Canvas y controles de entrada.
*/
const centripetalCanvas =
  document.getElementById("centripetalCanvas");

const centripetalMassInput =
  document.getElementById("centripetalMassInput");

const centripetalSpeedInput =
  document.getElementById("centripetalSpeedInput");

const centripetalRadiusInput =
  document.getElementById("centripetalRadiusInput");


/*
  Elementos donde se muestran los valores actuales.
*/
const centripetalMassValue =
  document.getElementById("centripetalMassValue");

const centripetalSpeedValue =
  document.getElementById("centripetalSpeedValue");

const centripetalRadiusValue =
  document.getElementById("centripetalRadiusValue");

const centripetalResult =
  document.getElementById("centripetalResult");


/**
 * Dibuja un objeto siguiendo una trayectoria circular.
 *
 * También representa el vector de fuerza centrípeta dirigido
 * desde el objeto hacia el centro de la circunferencia.
 *
 * @param {number} time - Tiempo general de animación.
 */
function drawCentripetalAnimated(time) {
  /*
    Se comprueba que todos los elementos necesarios existan.
  */
  if (
    !centripetalCanvas ||
    !centripetalMassInput ||
    !centripetalSpeedInput ||
    !centripetalRadiusInput
  ) {
    return;
  }

  const ctx =
    centripetalCanvas.getContext("2d");

  if (!ctx) return;


  /* --------------------------------------------------------
     Lectura de los controles
  -------------------------------------------------------- */

  const mass =
    Number(centripetalMassInput.value);

  const speed =
    Number(centripetalSpeedInput.value);

  const physicalRadius =
    Number(centripetalRadiusInput.value);


  /* --------------------------------------------------------
     Cálculo de la fuerza centrípeta
     Fc = mv² / r
  -------------------------------------------------------- */

  const centripetalForce =
    (mass * speed * speed) / physicalRadius;


  /* --------------------------------------------------------
     Actualización de etiquetas
  -------------------------------------------------------- */

  if (centripetalMassValue) {
    centripetalMassValue.textContent =
      mass.toFixed(0);
  }

  if (centripetalSpeedValue) {
    centripetalSpeedValue.textContent =
      speed.toFixed(0);
  }

  if (centripetalRadiusValue) {
    centripetalRadiusValue.textContent =
      physicalRadius.toFixed(0);
  }


  /* --------------------------------------------------------
     Limpieza y fondo
  -------------------------------------------------------- */

  clearCanvas(centripetalCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    centripetalCanvas.width,
    centripetalCanvas.height
  );


  /* --------------------------------------------------------
     Configuración visual de la trayectoria
  -------------------------------------------------------- */

  const centerX =
    centripetalCanvas.width / 2;

  const centerY =
    centripetalCanvas.height / 2 + 10;

  /*
    El radio físico se transforma en un radio visual.
  */
  const visualRadius =
    clamp(
      45 + physicalRadius * 3,
      48,
      95
    );


  /* --------------------------------------------------------
     Circunferencia
  -------------------------------------------------------- */

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    visualRadius,
    0,
    Math.PI * 2
  );
  ctx.stroke();


  /* --------------------------------------------------------
     Cálculo del ángulo animado
  -------------------------------------------------------- */

  /*
    Una mayor velocidad produce una rotación más rápida.
  */
  const angularAnimationSpeed =
    0.35 + speed / 18;

  const angle =
    time * angularAnimationSpeed;


  /*
    Posición del objeto en la circunferencia.
  */
  const objectX =
    centerX +
    visualRadius * Math.cos(angle);

  const objectY =
    centerY +
    visualRadius * Math.sin(angle);


  /* --------------------------------------------------------
     Vector de fuerza dirigido hacia el centro
  -------------------------------------------------------- */

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(objectX, objectY);
  ctx.lineTo(centerX, centerY);
  ctx.stroke();


  /*
    Punta de flecha aproximada cerca del centro.
  */
  const arrowPosition = 0.78;

  const arrowX =
    objectX +
    (centerX - objectX) * arrowPosition;

  const arrowY =
    objectY +
    (centerY - objectY) * arrowPosition;

  ctx.fillStyle = "#28e0d3";
  ctx.beginPath();
  ctx.arc(
    arrowX,
    arrowY,
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /* --------------------------------------------------------
     Objeto en movimiento circular
  -------------------------------------------------------- */

  ctx.fillStyle = "#3498ff";
  ctx.beginPath();
  ctx.arc(
    objectX,
    objectY,
    13,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /*
    Brillo alrededor del objeto.
  */
  ctx.strokeStyle = "rgba(52, 152, 255, 0.45)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(
    objectX,
    objectY,
    17,
    0,
    Math.PI * 2
  );
  ctx.stroke();


  /* --------------------------------------------------------
     Centro de la trayectoria
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /* --------------------------------------------------------
     Textos del simulador
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "Fc = mv²/r",
    24,
    30
  );

  ctx.fillText(
    "La fuerza apunta hacia el centro",
    24,
    55
  );


  /* --------------------------------------------------------
     Resultado numérico
  -------------------------------------------------------- */

  if (centripetalResult) {
    centripetalResult.textContent =
      `Resultado: Fc = ${centripetalForce.toFixed(2)} N`;
  }
}

/* ==========================================================
   6. FUERZA DE FRICCIÓN
   Ff = μN
========================================================== */

/*
  Elementos del Canvas y controles.
*/
const frictionCanvas =
  document.getElementById("frictionCanvas");

const muInput =
  document.getElementById("muInput");

const normalInput =
  document.getElementById("normalInput");

const muValue =
  document.getElementById("muValue");

const normalValue =
  document.getElementById("normalValue");

const frictionResult =
  document.getElementById("frictionResult");


/**
 * Dibuja un bloque sobre una superficie y representa
 * la fuerza de fricción opuesta al movimiento.
 */
function drawFriction() {
  if (
    !frictionCanvas ||
    !muInput ||
    !normalInput
  ) {
    return;
  }

  const ctx =
    frictionCanvas.getContext("2d");

  if (!ctx) return;


  /* --------------------------------------------------------
     Lectura de parámetros
  -------------------------------------------------------- */

  const frictionCoefficient =
    Number(muInput.value);

  const normalForce =
    Number(normalInput.value);


  /* --------------------------------------------------------
     Cálculo de la fuerza de fricción
     Ff = μN
  -------------------------------------------------------- */

  const frictionForce =
    frictionCoefficient * normalForce;


  /* --------------------------------------------------------
     Actualización de etiquetas
  -------------------------------------------------------- */

  if (muValue) {
    muValue.textContent =
      frictionCoefficient.toFixed(2);
  }

  if (normalValue) {
    normalValue.textContent =
      normalForce.toFixed(0);
  }


  /* --------------------------------------------------------
     Limpieza y fondo
  -------------------------------------------------------- */

  clearCanvas(frictionCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    frictionCanvas.width,
    frictionCanvas.height
  );


  /* --------------------------------------------------------
     Superficie horizontal
  -------------------------------------------------------- */

  const groundY = 140;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(35, groundY);
  ctx.lineTo(385, groundY);
  ctx.stroke();


  /* --------------------------------------------------------
     Bloque
  -------------------------------------------------------- */

  const blockX = 175;
  const blockY = 95;
  const blockWidth = 70;
  const blockHeight = 45;

  ctx.fillStyle = "#ff9d3d";
  ctx.fillRect(
    blockX,
    blockY,
    blockWidth,
    blockHeight
  );


  /* --------------------------------------------------------
     Flecha de movimiento hacia la derecha
  -------------------------------------------------------- */

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(blockX + blockWidth, blockY + 20);
  ctx.lineTo(blockX + blockWidth + 75, blockY + 20);
  ctx.stroke();

  ctx.fillStyle = "#28e0d3";
  ctx.beginPath();
  ctx.moveTo(
    blockX + blockWidth + 75,
    blockY + 20
  );
  ctx.lineTo(
    blockX + blockWidth + 62,
    blockY + 13
  );
  ctx.lineTo(
    blockX + blockWidth + 62,
    blockY + 27
  );
  ctx.closePath();
  ctx.fill();


  /* --------------------------------------------------------
     Flecha de fricción hacia la izquierda
  -------------------------------------------------------- */

  const frictionArrowLength =
    clamp(frictionForce * 0.7, 20, 130);

  ctx.strokeStyle = "#ff66c4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(blockX, blockY + 25);
  ctx.lineTo(
    blockX - frictionArrowLength,
    blockY + 25
  );
  ctx.stroke();

  ctx.fillStyle = "#ff66c4";
  ctx.beginPath();
  ctx.moveTo(
    blockX - frictionArrowLength,
    blockY + 25
  );
  ctx.lineTo(
    blockX - frictionArrowLength + 13,
    blockY + 18
  );
  ctx.lineTo(
    blockX - frictionArrowLength + 13,
    blockY + 32
  );
  ctx.closePath();
  ctx.fill();


  /* --------------------------------------------------------
     Textos
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";

  ctx.fillText(
    "Ff = μN",
    25,
    30
  );

  ctx.fillText(
    "La fricción se opone al movimiento",
    25,
    55
  );


  /* --------------------------------------------------------
     Resultado
  -------------------------------------------------------- */

  if (frictionResult) {
    frictionResult.textContent =
      `Resultado: Ff = ${frictionForce.toFixed(2)} N`;
  }
}


/* ==========================================================
   7. TRABAJO MECÁNICO
   W = Fd cos(θ)
========================================================== */

const workCanvas =
  document.getElementById("workCanvas");

const workForceInput =
  document.getElementById("workForceInput");

const distanceInput =
  document.getElementById("distanceInput");

const workAngleInput =
  document.getElementById("workAngleInput");

const workForceValue =
  document.getElementById("workForceValue");

const distanceValue =
  document.getElementById("distanceValue");

const workAngleValue =
  document.getElementById("workAngleValue");

const workResult =
  document.getElementById("workResult");


/**
 * Dibuja un bloque, una fuerza aplicada y el desplazamiento.
 * Calcula el trabajo mecánico realizado.
 */
function drawWork() {
  if (
    !workCanvas ||
    !workForceInput ||
    !distanceInput ||
    !workAngleInput
  ) {
    return;
  }

  const ctx =
    workCanvas.getContext("2d");

  if (!ctx) return;


  /* --------------------------------------------------------
     Lectura de parámetros
  -------------------------------------------------------- */

  const force =
    Number(workForceInput.value);

  const distance =
    Number(distanceInput.value);

  const angleDegrees =
    Number(workAngleInput.value);

  const angleRadians =
    degreesToRadians(angleDegrees);


  /* --------------------------------------------------------
     Cálculo del trabajo
     W = Fd cos(θ)
  -------------------------------------------------------- */

  const work =
    force *
    distance *
    Math.cos(angleRadians);


  /* --------------------------------------------------------
     Actualización de etiquetas
  -------------------------------------------------------- */

  if (workForceValue) {
    workForceValue.textContent =
      force.toFixed(0);
  }

  if (distanceValue) {
    distanceValue.textContent =
      distance.toFixed(0);
  }

  if (workAngleValue) {
    workAngleValue.textContent =
      angleDegrees.toFixed(0);
  }


  /* --------------------------------------------------------
     Limpieza y fondo
  -------------------------------------------------------- */

  clearCanvas(workCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    workCanvas.width,
    workCanvas.height
  );


  /* --------------------------------------------------------
     Superficie
  -------------------------------------------------------- */

  const groundY = 140;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(35, groundY);
  ctx.lineTo(385, groundY);
  ctx.stroke();


  /* --------------------------------------------------------
     Bloque
  -------------------------------------------------------- */

  const blockX = 130;
  const blockY = 100;
  const blockWidth = 58;
  const blockHeight = 40;

  ctx.fillStyle = "#66dd66";
  ctx.fillRect(
    blockX,
    blockY,
    blockWidth,
    blockHeight
  );


  /* --------------------------------------------------------
     Vector de desplazamiento
  -------------------------------------------------------- */

  const displacementLength =
    clamp(distance * 4, 50, 145);

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(
    blockX + blockWidth + 5,
    blockY + blockHeight / 2
  );
  ctx.lineTo(
    blockX + blockWidth + 5 + displacementLength,
    blockY + blockHeight / 2
  );
  ctx.stroke();

  ctx.fillStyle = "#28e0d3";
  ctx.beginPath();
  ctx.moveTo(
    blockX + blockWidth + 5 + displacementLength,
    blockY + blockHeight / 2
  );
  ctx.lineTo(
    blockX + blockWidth - 8 + displacementLength,
    blockY + blockHeight / 2 - 7
  );
  ctx.lineTo(
    blockX + blockWidth - 8 + displacementLength,
    blockY + blockHeight / 2 + 7
  );
  ctx.closePath();
  ctx.fill();


  /* --------------------------------------------------------
     Vector de fuerza con ángulo
  -------------------------------------------------------- */

  const forceVisualLength =
    clamp(force * 0.45, 45, 90);

  const forceStartX =
    blockX + blockWidth / 2;

  const forceStartY =
    blockY;

  const forceEndX =
    forceStartX +
    forceVisualLength *
    Math.cos(angleRadians);

  const forceEndY =
    forceStartY -
    forceVisualLength *
    Math.sin(angleRadians);

  ctx.strokeStyle = "#ff9d3d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(
    forceStartX,
    forceStartY
  );
  ctx.lineTo(
    forceEndX,
    forceEndY
  );
  ctx.stroke();

  ctx.fillStyle = "#ff9d3d";
  ctx.beginPath();
  ctx.arc(
    forceEndX,
    forceEndY,
    6,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /* --------------------------------------------------------
     Textos
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";

  ctx.fillText(
    "W = Fd cos(θ)",
    25,
    30
  );

  ctx.fillText(
    `θ = ${angleDegrees.toFixed(0)}°`,
    25,
    55
  );


  /* --------------------------------------------------------
     Resultado
  -------------------------------------------------------- */

  if (workResult) {
    workResult.textContent =
      `Resultado: W = ${work.toFixed(2)} J`;
  }
}


/* ==========================================================
   8. ENERGÍA CINÉTICA
   K = ½mv²
========================================================== */

const energyCanvas =
  document.getElementById("energyCanvas");

const energyMassInput =
  document.getElementById("energyMassInput");

const energySpeedInput =
  document.getElementById("energySpeedInput");

const energyMassValue =
  document.getElementById("energyMassValue");

const energySpeedValue =
  document.getElementById("energySpeedValue");

const energyResult =
  document.getElementById("energyResult");


/**
 * Calcula y representa visualmente la energía cinética.
 */
function drawEnergy() {
  if (
    !energyCanvas ||
    !energyMassInput ||
    !energySpeedInput
  ) {
    return;
  }

  const ctx =
    energyCanvas.getContext("2d");

  if (!ctx) return;


  /* --------------------------------------------------------
     Lectura de parámetros
  -------------------------------------------------------- */

  const mass =
    Number(energyMassInput.value);

  const speed =
    Number(energySpeedInput.value);


  /* --------------------------------------------------------
     Cálculo de la energía cinética
     K = ½mv²
  -------------------------------------------------------- */

  const kineticEnergy =
    0.5 *
    mass *
    speed *
    speed;


  /* --------------------------------------------------------
     Actualización de etiquetas
  -------------------------------------------------------- */

  if (energyMassValue) {
    energyMassValue.textContent =
      mass.toFixed(0);
  }

  if (energySpeedValue) {
    energySpeedValue.textContent =
      speed.toFixed(0);
  }


  /* --------------------------------------------------------
     Limpieza y fondo
  -------------------------------------------------------- */

  clearCanvas(energyCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    energyCanvas.width,
    energyCanvas.height
  );


  /* --------------------------------------------------------
     Barra visual de energía
  -------------------------------------------------------- */

  const barWidth =
    clamp(kineticEnergy / 12, 5, 300);

  ctx.fillStyle = "#28e0d3";
  ctx.fillRect(
    40,
    48,
    barWidth,
    18
  );


  /* --------------------------------------------------------
     Línea de movimiento
  -------------------------------------------------------- */

  const groundY = 140;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, groundY);
  ctx.lineTo(380, groundY);
  ctx.stroke();


  /* --------------------------------------------------------
     Objeto en movimiento
  -------------------------------------------------------- */

  const objectX =
    clamp(
      65 + speed * 7,
      65,
      360
    );

  ctx.fillStyle = "#66dd66";
  ctx.beginPath();
  ctx.arc(
    objectX,
    groundY,
    16,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /* --------------------------------------------------------
     Textos
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "K = ½mv²",
    40,
    28
  );

  ctx.fillText(
    `${kineticEnergy.toFixed(2)} J`,
    40,
    88
  );


  /* --------------------------------------------------------
     Resultado
  -------------------------------------------------------- */

  if (energyResult) {
    energyResult.textContent =
      `Resultado: K = ${kineticEnergy.toFixed(2)} J`;
  }
}


/* ==========================================================
   9. IMPULSO
   J = FΔt = Δp
========================================================== */

const impulseCanvas =
  document.getElementById("impulseCanvas");

const impulseForceInput =
  document.getElementById("impulseForceInput");

const timeInput =
  document.getElementById("timeInput");

const impulseForceValue =
  document.getElementById("impulseForceValue");

const timeValue =
  document.getElementById("timeValue");

const impulseResult =
  document.getElementById("impulseResult");


/**
 * Dibuja el impulso aplicado sobre un objeto.
 */
function drawImpulse() {
  if (
    !impulseCanvas ||
    !impulseForceInput ||
    !timeInput
  ) {
    return;
  }

  const ctx =
    impulseCanvas.getContext("2d");

  if (!ctx) return;


  /* --------------------------------------------------------
     Lectura de parámetros
  -------------------------------------------------------- */

  const force =
    Number(impulseForceInput.value);

  const timeInterval =
    Number(timeInput.value);


  /* --------------------------------------------------------
     Cálculo del impulso
     J = FΔt
  -------------------------------------------------------- */

  const impulse =
    force *
    timeInterval;


  /* --------------------------------------------------------
     Actualización de etiquetas
  -------------------------------------------------------- */

  if (impulseForceValue) {
    impulseForceValue.textContent =
      force.toFixed(0);
  }

  if (timeValue) {
    timeValue.textContent =
      timeInterval.toFixed(1);
  }


  /* --------------------------------------------------------
     Limpieza y fondo
  -------------------------------------------------------- */

  clearCanvas(impulseCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    impulseCanvas.width,
    impulseCanvas.height
  );


  /* --------------------------------------------------------
     Línea de referencia
  -------------------------------------------------------- */

  const groundY = 140;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, groundY);
  ctx.lineTo(380, groundY);
  ctx.stroke();


  /* --------------------------------------------------------
     Objeto
  -------------------------------------------------------- */

  const objectX = 120;

  ctx.fillStyle = "#a66cff";
  ctx.beginPath();
  ctx.arc(
    objectX,
    groundY,
    18,
    0,
    Math.PI * 2
  );
  ctx.fill();


  /* --------------------------------------------------------
     Vector de impulso
  -------------------------------------------------------- */

  const impulseLength =
    clamp(impulse * 1.6, 20, 200);

  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(
    objectX + 25,
    groundY
  );
  ctx.lineTo(
    objectX + 25 + impulseLength,
    groundY
  );
  ctx.stroke();

  ctx.fillStyle = "#28e0d3";
  ctx.beginPath();
  ctx.moveTo(
    objectX + 25 + impulseLength,
    groundY
  );
  ctx.lineTo(
    objectX + 12 + impulseLength,
    groundY - 7
  );
  ctx.lineTo(
    objectX + 12 + impulseLength,
    groundY + 7
  );
  ctx.closePath();
  ctx.fill();


  /* --------------------------------------------------------
     Textos
  -------------------------------------------------------- */

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";

  ctx.fillText(
    "J = FΔt = Δp",
    25,
    30
  );

  ctx.fillText(
    `F = ${force.toFixed(0)} N`,
    25,
    55
  );


  /* --------------------------------------------------------
     Resultado
  -------------------------------------------------------- */

  if (impulseResult) {
    impulseResult.textContent =
      `Resultado: J = ${impulse.toFixed(2)} N·s`;
  }
}
/* ==========================================================
   10. COLISIÓN INELÁSTICA
   m₁u₁ + m₂u₂ = (m₁ + m₂)vf
========================================================== */

const momentumCanvas =
  document.getElementById("momentumCanvas");

const m1Input =
  document.getElementById("m1Input");

const u1Input =
  document.getElementById("u1Input");

const m2Input =
  document.getElementById("m2Input");

const u2Input =
  document.getElementById("u2Input");

const m1Value =
  document.getElementById("m1Value");

const u1Value =
  document.getElementById("u1Value");

const m2Value =
  document.getElementById("m2Value");

const u2Value =
  document.getElementById("u2Value");

const momentumResult =
  document.getElementById("momentumResult");


/**
 * Calcula y representa una colisión perfectamente inelástica.
 *
 * En este tipo de choque, los dos cuerpos quedan unidos
 * después del impacto y se mueven con una velocidad común.
 */
function drawMomentum() {
  if (
    !momentumCanvas ||
    !m1Input ||
    !u1Input ||
    !m2Input ||
    !u2Input
  ) {
    return;
  }

  const ctx =
    momentumCanvas.getContext("2d");

  if (!ctx) return;


  // Leer los valores de masa y velocidad
  const mass1 =
    Number(m1Input.value);

  const initialSpeed1 =
    Number(u1Input.value);

  const mass2 =
    Number(m2Input.value);

  const initialSpeed2 =
    Number(u2Input.value);


  // Calcular el momento lineal inicial
  const initialMomentum =
    mass1 * initialSpeed1 +
    mass2 * initialSpeed2;


  // Calcular la velocidad final común
  const finalSpeed =
    initialMomentum /
    (mass1 + mass2);


  // Calcular el momento lineal final
  const finalMomentum =
    (mass1 + mass2) *
    finalSpeed;


  // Mostrar los valores actuales en el HTML
  if (m1Value) {
    m1Value.textContent =
      mass1.toFixed(0);
  }

  if (u1Value) {
    u1Value.textContent =
      initialSpeed1.toFixed(0);
  }

  if (m2Value) {
    m2Value.textContent =
      mass2.toFixed(0);
  }

  if (u2Value) {
    u2Value.textContent =
      initialSpeed2.toFixed(0);
  }


  // Limpiar el Canvas
  clearCanvas(momentumCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    momentumCanvas.width,
    momentumCanvas.height
  );


  // Dibujar la superficie
  const groundY = 165;

  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, groundY);
  ctx.lineTo(
    momentumCanvas.width - 40,
    groundY
  );
  ctx.stroke();


  // Posiciones visuales de los cuerpos
  const object1X =
    130 + initialSpeed1 * 7;

  const object2X =
    650 - initialSpeed2 * 7;


  // Tamaños visuales relacionados con las masas
  const radius1 =
    17 + mass1 * 1.3;

  const radius2 =
    17 + mass2 * 1.3;


  // Dibujar el primer cuerpo
  ctx.fillStyle = "#ff66c4";
  ctx.beginPath();
  ctx.arc(
    object1X,
    groundY,
    radius1,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Dibujar el segundo cuerpo
  ctx.fillStyle = "#3498ff";
  ctx.beginPath();
  ctx.arc(
    object2X,
    groundY,
    radius2,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Dibujar flecha de velocidad para el cuerpo 1
  const arrow1Length =
    clamp(initialSpeed1 * 5, 10, 100);

  ctx.strokeStyle = "#ff66c4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(
    object1X,
    groundY - radius1 - 12
  );
  ctx.lineTo(
    object1X + arrow1Length,
    groundY - radius1 - 12
  );
  ctx.stroke();


  // Dibujar flecha de velocidad para el cuerpo 2
  const arrow2Length =
    clamp(initialSpeed2 * 5, 0, 100);

  if (arrow2Length > 0) {
    ctx.strokeStyle = "#3498ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(
      object2X,
      groundY - radius2 - 12
    );
    ctx.lineTo(
      object2X + arrow2Length,
      groundY - radius2 - 12
    );
    ctx.stroke();
  }


  // Textos explicativos
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "Colisión perfectamente inelástica",
    35,
    32
  );

  ctx.fillText(
    "Los cuerpos quedan unidos después del choque",
    35,
    58
  );

  ctx.fillText(
    `vf = ${finalSpeed.toFixed(2)} m/s`,
    35,
    85
  );


  // Resultado numérico
  if (momentumResult) {
    momentumResult.textContent =
      `Momento inicial = ${initialMomentum.toFixed(2)} kg·m/s | ` +
      `Momento final = ${finalMomentum.toFixed(2)} kg·m/s | ` +
      `Velocidad final = ${finalSpeed.toFixed(2)} m/s`;
  }
}


/* ==========================================================
   11. CONSERVACIÓN DEL MOMENTO ANGULAR
   L = Iω
   I₁ω₁ = I₂ω₂
========================================================== */

const angularCanvas =
  document.getElementById("angularCanvas");

const angularInertiaInput =
  document.getElementById("angularInertiaInput");

const angularSpeedInput =
  document.getElementById("angularSpeedInput");

const finalInertiaInput =
  document.getElementById("finalInertiaInput");

const angularInertiaValue =
  document.getElementById("angularInertiaValue");

const angularSpeedValue =
  document.getElementById("angularSpeedValue");

const finalInertiaValue =
  document.getElementById("finalInertiaValue");

const angularResult =
  document.getElementById("angularResult");


/**
 * Representa la conservación del momento angular.
 *
 * Si no existe torque externo:
 *
 * I₁ω₁ = I₂ω₂
 */
function drawAngularMomentum(time) {
  if (
    !angularCanvas ||
    !angularInertiaInput ||
    !angularSpeedInput ||
    !finalInertiaInput
  ) {
    return;
  }

  const ctx =
    angularCanvas.getContext("2d");

  if (!ctx) return;


  // Leer los valores del usuario
  const initialInertia =
    Number(angularInertiaInput.value);

  const initialAngularSpeed =
    Number(angularSpeedInput.value);

  const finalInertia =
    Number(finalInertiaInput.value);


  // Calcular el momento angular inicial
  const angularMomentum =
    initialInertia *
    initialAngularSpeed;


  // Usar conservación del momento angular
  const finalAngularSpeed =
    angularMomentum /
    finalInertia;


  // Actualizar los valores mostrados
  if (angularInertiaValue) {
    angularInertiaValue.textContent =
      initialInertia.toFixed(1);
  }

  if (angularSpeedValue) {
    angularSpeedValue.textContent =
      initialAngularSpeed.toFixed(1);
  }

  if (finalInertiaValue) {
    finalInertiaValue.textContent =
      finalInertia.toFixed(1);
  }


  // Limpiar el Canvas
  clearCanvas(angularCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    angularCanvas.width,
    angularCanvas.height
  );


  const centerX =
    angularCanvas.width / 2;

  const centerY =
    angularCanvas.height / 2 + 18;


  // El radio visual cambia con el momento de inercia
  const visualRadius =
    clamp(
      30 + finalInertia * 5,
      38,
      85
    );


  // Calcular el ángulo de rotación
  const angle =
    time *
    finalAngularSpeed *
    0.35;


  // Dibujar la trayectoria circular
  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    visualRadius,
    0,
    Math.PI * 2
  );
  ctx.stroke();


  // Dibujar una barra que gira
  ctx.strokeStyle = "#28e0d3";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(
    centerX,
    centerY
  );
  ctx.lineTo(
    centerX +
    visualRadius *
    Math.cos(angle),

    centerY +
    visualRadius *
    Math.sin(angle)
  );
  ctx.stroke();


  // Posición de la masa giratoria
  const massX =
    centerX +
    visualRadius *
    Math.cos(angle);

  const massY =
    centerY +
    visualRadius *
    Math.sin(angle);


  // Dibujar la masa giratoria
  ctx.fillStyle = "#a66cff";
  ctx.beginPath();
  ctx.arc(
    massX,
    massY,
    12,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Brillo alrededor de la masa
  ctx.strokeStyle =
    "rgba(166, 108, 255, 0.45)";

  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(
    massX,
    massY,
    16,
    0,
    Math.PI * 2
  );
  ctx.stroke();


  // Dibujar el eje central
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    6,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Textos
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "L = Iω",
    25,
    30
  );

  ctx.fillText(
    "I₁ω₁ = I₂ω₂",
    25,
    55
  );


  // Resultado
  if (angularResult) {
    angularResult.textContent =
      `Momento angular L = ${angularMomentum.toFixed(2)} kg·m²/s | ` +
      `Velocidad angular final ω₂ = ${finalAngularSpeed.toFixed(2)} rad/s`;
  }
}


/* ==========================================================
   12. TORQUE
   τ = rF sen(θ)
========================================================== */

const torqueCanvas =
  document.getElementById("torqueCanvas");

const torqueForceInput =
  document.getElementById("torqueForceInput");

const torqueRadiusInput =
  document.getElementById("torqueRadiusInput");

const torqueAngleInput =
  document.getElementById("torqueAngleInput");

const torqueForceValue =
  document.getElementById("torqueForceValue");

const torqueRadiusValue =
  document.getElementById("torqueRadiusValue");

const torqueAngleValue =
  document.getElementById("torqueAngleValue");

const torqueResult =
  document.getElementById("torqueResult");


/**
 * Calcula y representa el torque producido por una fuerza.
 *
 * τ = rF sen(θ)
 */
function drawTorque() {
  if (
    !torqueCanvas ||
    !torqueForceInput ||
    !torqueRadiusInput ||
    !torqueAngleInput
  ) {
    return;
  }

  const ctx =
    torqueCanvas.getContext("2d");

  if (!ctx) return;


  // Leer parámetros
  const force =
    Number(torqueForceInput.value);

  const radius =
    Number(torqueRadiusInput.value);

  const angleDegrees =
    Number(torqueAngleInput.value);

  const angleRadians =
    degreesToRadians(angleDegrees);


  // Calcular el torque
  const torque =
    radius *
    force *
    Math.sin(angleRadians);


  // Actualizar etiquetas
  if (torqueForceValue) {
    torqueForceValue.textContent =
      force.toFixed(0);
  }

  if (torqueRadiusValue) {
    torqueRadiusValue.textContent =
      radius.toFixed(1);
  }

  if (torqueAngleValue) {
    torqueAngleValue.textContent =
      angleDegrees.toFixed(0);
  }


  // Limpiar el Canvas
  clearCanvas(torqueCanvas, ctx);

  ctx.fillStyle = "#07111f";
  ctx.fillRect(
    0,
    0,
    torqueCanvas.width,
    torqueCanvas.height
  );


  // Punto de giro
  const pivotX = 75;
  const pivotY = 160;


  // Longitud visual de la barra
  const barLength =
    clamp(
      80 + radius * 45,
      100,
      270
    );


  // Dibujar el eje
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(
    pivotX,
    pivotY,
    8,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Dibujar la barra
  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(
    pivotX,
    pivotY
  );
  ctx.lineTo(
    pivotX + barLength,
    pivotY
  );
  ctx.stroke();


  // Punto donde se aplica la fuerza
  const forceStartX =
    pivotX + barLength;

  const forceStartY =
    pivotY;


  // Longitud visual de la fuerza
  const forceLength =
    clamp(
      force * 0.45,
      40,
      90
    );


  // Posición final del vector de fuerza
  const forceEndX =
    forceStartX +
    forceLength *
    Math.cos(angleRadians);

  const forceEndY =
    forceStartY -
    forceLength *
    Math.sin(angleRadians);


  // Dibujar el vector de fuerza
  ctx.strokeStyle = "#ff9d3d";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(
    forceStartX,
    forceStartY
  );
  ctx.lineTo(
    forceEndX,
    forceEndY
  );
  ctx.stroke();


  // Punta del vector
  ctx.fillStyle = "#ff9d3d";
  ctx.beginPath();
  ctx.arc(
    forceEndX,
    forceEndY,
    7,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Dibujar un arco para representar el ángulo
  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    forceStartX,
    forceStartY,
    30,
    -angleRadians,
    0
  );
  ctx.stroke();


  // Textos
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "τ = rF sen(θ)",
    25,
    30
  );

  ctx.fillText(
    `θ = ${angleDegrees.toFixed(0)}°`,
    25,
    55
  );


  // Resultado
  if (torqueResult) {
    torqueResult.textContent =
      `Resultado: τ = ${torque.toFixed(2)} N·m`;
  }
}


/* ==========================================================
   13. SATÉLITE ARTIFICIAL
   v = √(GM/r)
========================================================== */

const satelliteCanvas =
  document.getElementById("satelliteCanvas");

const satelliteAltitudeInput =
  document.getElementById("satelliteAltitudeInput");

const satelliteAltitudeValue =
  document.getElementById("satelliteAltitudeValue");

const satelliteResult =
  document.getElementById("satelliteResult");


/*
  Constantes aproximadas de la Tierra.
*/
const EARTH_RADIUS_KM = 6371;

const EARTH_GRAVITATIONAL_PARAMETER =
  398600.4418;


/**
 * Calcula y representa una órbita circular alrededor de la Tierra.
 */
function drawSatellite(time) {
  if (
    !satelliteCanvas ||
    !satelliteAltitudeInput
  ) {
    return;
  }

  const ctx =
    satelliteCanvas.getContext("2d");

  if (!ctx) return;


  // Leer la altura del satélite
  const altitude =
    Number(satelliteAltitudeInput.value);


  // Calcular el radio orbital total
  const orbitalRadius =
    EARTH_RADIUS_KM +
    altitude;


  // Calcular la velocidad orbital
  const orbitalSpeed =
    Math.sqrt(
      EARTH_GRAVITATIONAL_PARAMETER /
      orbitalRadius
    );


  // Calcular el periodo orbital
  const orbitalPeriodSeconds =
    2 *
    Math.PI *
    Math.sqrt(
      Math.pow(orbitalRadius, 3) /
      EARTH_GRAVITATIONAL_PARAMETER
    );


  // Actualizar la etiqueta
  if (satelliteAltitudeValue) {
    satelliteAltitudeValue.textContent =
      altitude.toFixed(0);
  }


  // Limpiar el Canvas
  clearCanvas(satelliteCanvas, ctx);

  ctx.fillStyle = "#020617";
  ctx.fillRect(
    0,
    0,
    satelliteCanvas.width,
    satelliteCanvas.height
  );


  // Dibujar algunas estrellas
  ctx.fillStyle = "#ffffff";

  const stars = [
    [35, 40],
    [90, 85],
    [155, 35],
    [315, 45],
    [365, 90],
    [70, 205],
    [340, 215],
    [270, 70],
    [215, 25]
  ];

  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(
      star[0],
      star[1],
      1.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });


  const centerX =
    satelliteCanvas.width / 2;

  const centerY =
    satelliteCanvas.height / 2 + 12;


  // Tamaño visual de la Tierra
  const earthRadiusVisual = 43;


  // El radio visual aumenta con la altura
  const orbitRadiusVisual =
    clamp(
      75 + altitude / 500,
      78,
      120
    );


  // Dibujar la órbita
  ctx.strokeStyle = "#8aa4c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    orbitRadiusVisual,
    0,
    Math.PI * 2
  );
  ctx.stroke();


  // Crear gradiente para la Tierra
  const earthGradient =
    ctx.createRadialGradient(
      centerX - 15,
      centerY - 15,
      5,
      centerX,
      centerY,
      earthRadiusVisual
    );

  earthGradient.addColorStop(
    0,
    "#7dd3fc"
  );

  earthGradient.addColorStop(
    0.55,
    "#2563eb"
  );

  earthGradient.addColorStop(
    1,
    "#082f49"
  );


  // Dibujar la Tierra
  ctx.fillStyle = earthGradient;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    earthRadiusVisual,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Velocidad visual de la animación
  const animationSpeed =
    clamp(
      orbitalSpeed / 5,
      0.3,
      1.8
    );


  // Ángulo del satélite
  const angle =
    time *
    animationSpeed;


  // Posición del satélite
  const satelliteX =
    centerX +
    orbitRadiusVisual *
    Math.cos(angle);

  const satelliteY =
    centerY +
    orbitRadiusVisual *
    Math.sin(angle);


  // Dibujar cuerpo del satélite
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(
    satelliteX - 9,
    satelliteY - 7,
    18,
    14
  );


  // Dibujar paneles solares
  ctx.fillStyle = "#52f7ff";

  ctx.fillRect(
    satelliteX - 25,
    satelliteY - 5,
    13,
    10
  );

  ctx.fillRect(
    satelliteX + 12,
    satelliteY - 5,
    13,
    10
  );


  // Textos
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "Órbita circular terrestre",
    25,
    30
  );

  ctx.fillText(
    "v = √(GM/r)",
    25,
    55
  );


  // Resultado
  if (satelliteResult) {
    satelliteResult.textContent =
      `Velocidad orbital ≈ ${orbitalSpeed.toFixed(2)} km/s | ` +
      `Periodo orbital ≈ ${(orbitalPeriodSeconds / 3600).toFixed(2)} horas`;
  }
}


/* ==========================================================
   14. VELOCIDAD DE ESCAPE
   ve = √(2GM/R)
========================================================== */

const escapeCanvas =
  document.getElementById("escapeCanvas");

const planetMassInput =
  document.getElementById("planetMassInput");

const planetRadiusInput =
  document.getElementById("planetRadiusInput");

const rocketSpeedInput =
  document.getElementById("rocketSpeedInput");

const planetMassValue =
  document.getElementById("planetMassValue");

const planetRadiusValue =
  document.getElementById("planetRadiusValue");

const rocketSpeedValue =
  document.getElementById("rocketSpeedValue");

const escapeResult =
  document.getElementById("escapeResult");


/**
 * Calcula la velocidad de escape de un planeta
 * comparándola con la velocidad inicial del cohete.
 */
function drawEscape(time) {
  if (
    !escapeCanvas ||
    !planetMassInput ||
    !planetRadiusInput ||
    !rocketSpeedInput
  ) {
    return;
  }

  const ctx =
    escapeCanvas.getContext("2d");

  if (!ctx) return;


  // Leer los valores relativos del planeta
  const relativeMass =
    Number(planetMassInput.value);

  const relativeRadius =
    Number(planetRadiusInput.value);

  const rocketSpeed =
    Number(rocketSpeedInput.value);


  /*
    La velocidad de escape de la Tierra es aproximadamente
    11.186 km/s.

    Se ajusta usando:
    ve = 11.186 √(masa relativa / radio relativo)
  */
  const escapeSpeed =
    11.186 *
    Math.sqrt(
      relativeMass /
      relativeRadius
    );


  // Determinar si el cohete logra escapar
  const canEscape =
    rocketSpeed >=
    escapeSpeed;


  // Actualizar etiquetas
  if (planetMassValue) {
    planetMassValue.textContent =
      relativeMass.toFixed(1);
  }

  if (planetRadiusValue) {
    planetRadiusValue.textContent =
      relativeRadius.toFixed(1);
  }

  if (rocketSpeedValue) {
    rocketSpeedValue.textContent =
      rocketSpeed.toFixed(1);
  }


  // Limpiar el Canvas
  clearCanvas(escapeCanvas, ctx);

  ctx.fillStyle = "#020617";
  ctx.fillRect(
    0,
    0,
    escapeCanvas.width,
    escapeCanvas.height
  );


  // Dibujar estrellas
  ctx.fillStyle = "#ffffff";

  const stars = [
    [30, 35],
    [85, 70],
    [145, 25],
    [280, 45],
    [360, 35],
    [385, 115],
    [55, 130],
    [320, 125]
  ];

  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(
      star[0],
      star[1],
      1.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });


  const planetX =
    escapeCanvas.width / 2;

  const planetY =
    escapeCanvas.height + 10;


  // Radio visual del planeta
  const planetRadiusVisual =
    clamp(
      45 + relativeRadius * 18,
      48,
      95
    );


  // Crear gradiente para el planeta
  const planetGradient =
    ctx.createRadialGradient(
      planetX - 20,
      planetY - planetRadiusVisual,
      5,
      planetX,
      planetY,
      planetRadiusVisual
    );

  planetGradient.addColorStop(
    0,
    "#fde68a"
  );

  planetGradient.addColorStop(
    0.55,
    "#f97316"
  );

  planetGradient.addColorStop(
    1,
    "#7c2d12"
  );


  // Dibujar parte superior del planeta
  ctx.fillStyle = planetGradient;
  ctx.beginPath();
  ctx.arc(
    planetX,
    planetY,
    planetRadiusVisual,
    Math.PI,
    Math.PI * 2
  );
  ctx.fill();


  /*
    La altura visual del cohete depende de si logra escapar.
  */
  let rocketHeight;

  if (canEscape) {
    rocketHeight =
      55 +
      (time * rocketSpeed * 2) % 170;
  } else {
    rocketHeight =
      40 +
      Math.abs(
        Math.sin(time * 1.2)
      ) * 90;
  }


  const rocketY =
    planetY -
    planetRadiusVisual -
    rocketHeight;


  // Dibujar el cohete
  ctx.fillStyle = "#e5e7eb";
  ctx.beginPath();
  ctx.moveTo(
    planetX,
    rocketY - 20
  );
  ctx.lineTo(
    planetX - 10,
    rocketY + 15
  );
  ctx.lineTo(
    planetX + 10,
    rocketY + 15
  );
  ctx.closePath();
  ctx.fill();


  // Dibujar ventanas del cohete
  ctx.fillStyle = "#3498ff";
  ctx.beginPath();
  ctx.arc(
    planetX,
    rocketY,
    4,
    0,
    Math.PI * 2
  );
  ctx.fill();


  // Dibujar fuego del cohete
  ctx.fillStyle =
    canEscape
      ? "#52f7ff"
      : "#ff9d3d";

  ctx.beginPath();
  ctx.moveTo(
    planetX - 5,
    rocketY + 15
  );
  ctx.lineTo(
    planetX,
    rocketY + 31
  );
  ctx.lineTo(
    planetX + 5,
    rocketY + 15
  );
  ctx.closePath();
  ctx.fill();


  // Texto de la fórmula
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial";

  ctx.fillText(
    "ve = √(2GM/R)",
    25,
    30
  );


  // Mensaje visual
  ctx.fillStyle =
    canEscape
      ? "#66dd66"
      : "#ff9d3d";

  ctx.font = "bold 15px Arial";

  ctx.fillText(
    canEscape
      ? "El cohete puede escapar"
      : "El cohete regresará al planeta",
    25,
    57
  );


  // Resultado final
  if (escapeResult) {
    escapeResult.textContent =
      `Velocidad de escape ≈ ${escapeSpeed.toFixed(2)} km/s | ` +
      `Velocidad del cohete = ${rocketSpeed.toFixed(1)} km/s | ` +
      `${canEscape ? "Escape alcanzado" : "Escape no alcanzado"}`;
  }
}

/* ==========================================================
   15. EVENTOS DE LOS CONTROLES
========================================================== */

/*
  Cada vez que el usuario mueve un slider se vuelve
  a calcular el simulador correspondiente.
*/

/* ---------- Fuerza centrípeta ---------- */

centripetalMassInput?.addEventListener("input", () => {
  drawCentripetalAnimated(animationTime);
});

centripetalSpeedInput?.addEventListener("input", () => {
  drawCentripetalAnimated(animationTime);
});

centripetalRadiusInput?.addEventListener("input", () => {
  drawCentripetalAnimated(animationTime);
});


/* ---------- Fricción ---------- */

muInput?.addEventListener("input", drawFriction);
normalInput?.addEventListener("input", drawFriction);


/* ---------- Trabajo ---------- */

workForceInput?.addEventListener("input", drawWork);
distanceInput?.addEventListener("input", drawWork);
workAngleInput?.addEventListener("input", drawWork);


/* ---------- Energía ---------- */

energyMassInput?.addEventListener("input", drawEnergy);
energySpeedInput?.addEventListener("input", drawEnergy);


/* ---------- Impulso ---------- */

impulseForceInput?.addEventListener("input", drawImpulse);
timeInput?.addEventListener("input", drawImpulse);


/* ---------- Colisión ---------- */

m1Input?.addEventListener("input", drawMomentum);
u1Input?.addEventListener("input", drawMomentum);
m2Input?.addEventListener("input", drawMomentum);
u2Input?.addEventListener("input", drawMomentum);


/* ---------- Momento Angular ---------- */

angularInertiaInput?.addEventListener("input", () => {
    drawAngularMomentum(animationTime);
});

angularSpeedInput?.addEventListener("input", () => {
    drawAngularMomentum(animationTime);
});

finalInertiaInput?.addEventListener("input", () => {
    drawAngularMomentum(animationTime);
});


/* ---------- Torque ---------- */

torqueForceInput?.addEventListener("input", drawTorque);
torqueRadiusInput?.addEventListener("input", drawTorque);
torqueAngleInput?.addEventListener("input", drawTorque);


/* ---------- Satélite ---------- */

satelliteAltitudeInput?.addEventListener("input", () => {
    drawSatellite(animationTime);
});


/* ---------- Velocidad de Escape ---------- */

planetMassInput?.addEventListener("input", () => {
    drawEscape(animationTime);
});

planetRadiusInput?.addEventListener("input", () => {
    drawEscape(animationTime);
});

rocketSpeedInput?.addEventListener("input", () => {
    drawEscape(animationTime);
});


/* ==========================================================
   16. ANIMACIÓN GENERAL
========================================================== */

/*
  Esta función se ejecuta aproximadamente 60 veces
  por segundo mediante requestAnimationFrame().
*/

function animate() {

    /*
      Incrementar el tiempo de animación.
    */
    animationTime += 0.025;


    /* -------------------------------
       Simuladores animados
    -------------------------------- */

    draw3DMovementAnimated(animationTime);

    drawCentripetalAnimated(animationTime);

    drawAngularMomentum(animationTime);

    drawSatellite(animationTime);

    drawEscape(animationTime);


    /*
      Solicitar el siguiente cuadro.
    */
    requestAnimationFrame(animate);
}


/* ==========================================================
   17. INICIALIZACIÓN DEL PORTAFOLIO
========================================================== */

/*
  Se ejecuta una única vez cuando termina de cargar
  todo el documento HTML.
*/

window.addEventListener("load", () => {

    /* ---------------------------------
       Simuladores estáticos
    ---------------------------------- */

    drawFriction();

    drawWork();

    drawEnergy();

    drawImpulse();

    drawMomentum();

    drawTorque();


    /* ---------------------------------
       Simuladores animados
    ---------------------------------- */

    draw3DMovementAnimated(0);

    drawCentripetalAnimated(0);

    drawAngularMomentum(0);

    drawSatellite(0);

    drawEscape(0);


    /* ---------------------------------
       Iniciar animación
    ---------------------------------- */

    animate();

});


/* ==========================================================
   FIN DEL ARCHIVO
========================================================== */

/*
    Proyecto:
    Portafolio Física I Aplicada al Software

    Universidad CENFOTEC

    Avance 2

    Simuladores incluidos:

    ✓ Movimiento en 3D
    ✓ Movimiento circular uniforme
    ✓ Fuerza centrípeta
    ✓ Fuerza de fricción
    ✓ Trabajo mecánico
    ✓ Energía cinética
    ✓ Impulso
    ✓ Colisión inelástica
    ✓ Conservación del momento angular
    ✓ Torque
    ✓ Satélites artificiales
    ✓ Velocidad de escape

    Desarrollado por:
    Tatiana Solís
*/
