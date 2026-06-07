/**
 * Game & Tech Experiência 2026
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initCountdown();
  initAudioSystem();
  initSunflowerCanvas();
  initSumoBotSimulator();
  initTimelineFilter();
  initRobotTrackGame();
  initFAQAccordion();
  initGiraBotChat();
});

/* ==========================================================================
   1. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('header nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  if (!toggleBtn || !navMenu) return;
  
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Fecha a gaveta do menu quando o usuário clica em qualquer link âncora
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ==========================================================================
   1B. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('header');
  const body = document.body;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 150) {
      body.classList.add('scrolled-down');
    } else {
      body.classList.remove('scrolled-down');
    }
  });
}

/* ==========================================================================
   2. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Set date: October 12, 2026
  const targetDate = new Date('Oct 12, 2026 09:00:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.querySelector('.countdown-container').innerHTML = "<div class='countdown-num' style='grid-column: 1/-1;'>O EVENTO JÁ COMEÇOU! 🚀</div>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   3. WEB AUDIO API - PROCEDURAL AUDIO SYNTHESIS
   ========================================================================== */
function initAudioSystem() {
  let audioCtx = null;
  let beatInterval = null;
  let droneNode = null;
  let isBeatPlaying = false;
  let isDronePlaying = false;

  const btnBeat = document.getElementById('btn-beat');
  const btnDrone = document.getElementById('btn-drone');

  if (!btnBeat || !btnDrone) return;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesis: Synthesizes a space synth chord pluck
  function playSynthPluck(freq, time, duration) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(1200, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(150, time + duration);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Synthesis: Synthesizes a deep sub bass kick drum
  function playBassKick(time) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.32);
  }

  // Start the beat loop synthesizer
  function startBeatLoop() {
    const ctx = getAudioContext();
    isBeatPlaying = true;
    btnBeat.classList.add('active');
    btnBeat.textContent = '🔊 Beat Ativo';

    let step = 0;
    const tempo = 110; // BPM
    const stepTime = 60 / tempo / 2; // Eighth note
    let nextNoteTime = ctx.currentTime;

    const chords = [
      [130.81, 196.00, 261.63], // C3, G3, C4
      [146.83, 220.00, 293.66], // D3, A3, D4
      [116.54, 174.61, 233.08], // Bb2, F3, Bb3
      [103.83, 155.56, 207.65]  // Ab2, Eb3, Ab3
    ];

    beatInterval = setInterval(() => {
      const currentTime = ctx.currentTime;
      while (nextNoteTime < currentTime + 0.1) {
        // Play Kick on steps 0, 4, 8, 12 (4/4 time)
        if (step % 4 === 0) {
          playBassKick(nextNoteTime);
        }

        // Play Synth Chords on steps 0, 3, 6, 8, 11, 14
        if ([0, 3, 6, 8, 11, 14].includes(step % 16)) {
          const chordIndex = Math.floor(step / 16) % chords.length;
          const currentChord = chords[chordIndex];
          currentChord.forEach(freq => {
            playSynthPluck(freq, nextNoteTime, 0.6);
          });
        }

        nextNoteTime += stepTime;
        step = (step + 1) % 64;
      }
    }, 25);
  }

  function stopBeatLoop() {
    isBeatPlaying = false;
    clearInterval(beatInterval);
    btnBeat.classList.remove('active');
    btnBeat.textContent = '🎵 Ambient Beat Loop';
  }

  // Start the deep background synth drone
  function startSynthDrone() {
    const ctx = getAudioContext();
    isDronePlaying = true;
    btnDrone.classList.add('active');
    btnDrone.textContent = '⚡ Drone Ativo';

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 55; // A1
    
    osc2.type = 'sawtooth';
    osc2.frequency.value = 55.5; // Detuned

    filter.type = 'lowpass';
    filter.frequency.value = 110;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();

    droneNode = { osc1, osc2, gainNode, filter };
  }

  function stopSynthDrone() {
    isDronePlaying = false;
    btnDrone.classList.remove('active');
    btnDrone.textContent = '⚡ Ativar Synth Drone';

    if (droneNode) {
      const ctx = getAudioContext();
      droneNode.gainNode.gain.setValueAtTime(droneNode.gainNode.gain.value, ctx.currentTime);
      droneNode.gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
      setTimeout(() => {
        try {
          droneNode.osc1.stop();
          droneNode.osc2.stop();
        } catch(e){}
        droneNode = null;
      }, 1100);
    }
  }

  btnBeat.addEventListener('click', () => {
    if (isBeatPlaying) stopBeatLoop();
    else startBeatLoop();
  });

  btnDrone.addEventListener('click', () => {
    if (isDronePlaying) stopSynthDrone();
    else startSynthDrone();
  });
}

/* ==========================================================================
   4. DOHYO VIRTUAL - SUMOBOT BATTLE SIMULATOR
   ========================================================================== */
function initSumoBotSimulator() {
  const arena = document.getElementById('dohyo-arena');
  const botGaedicke = document.getElementById('bot-gaedicke');
  const botRival = document.getElementById('bot-rival');
  const btnCombat = document.getElementById('btn-combat');
  const btnReset = document.getElementById('btn-reset');

  const speedGaedickeEl = document.getElementById('speed-gaedicke');
  const tempGaedickeEl = document.getElementById('temp-gaedicke');
  const speedRivalEl = document.getElementById('speed-rival');
  const tempRivalEl = document.getElementById('temp-rival');
  const scoreGaedickeEl = document.getElementById('score-gaedicke');
  const scoreRivalEl = document.getElementById('score-rival');
  const roundNameEl = document.getElementById('round-name');

  const selectBehavior = document.getElementById('gaedicke-behavior');

  if (!arena || !botGaedicke || !botRival || !btnCombat) return;

  const arenaRadius = 150; // Arena is 300px diameter, radius is 150
  const botRadius = 14;

  let isFighting = false;
  let fightInterval = null;

  let scoreGaedicke = 0;
  let scoreRival = 0;
  let roundCount = 1;

  // Physics state
  let gState = { x: -60, y: 0, vx: 0, vy: 0, speed: 0, temp: 32 };
  let rState = { x: 60, y: 0, vx: 0, vy: 0, speed: 0, temp: 34 };

  const historyRounds = document.querySelectorAll('.round-marker');

  function updateBotPositions() {
    // Translate from center coordinates (0,0) to top/left values in CSS (center at 150px)
    botGaedicke.style.left = `${150 + gState.x - botRadius}px`;
    botGaedicke.style.top = `${150 + gState.y - botRadius}px`;

    botRival.style.left = `${150 + rState.x - botRadius}px`;
    botRival.style.top = `${150 + rState.y - botRadius}px`;
  }

  function resetPositions() {
    gState.x = -80;
    gState.y = 0;
    gState.vx = 0;
    gState.vy = 0;
    gState.speed = 0;
    gState.temp = 32;

    rState.x = 80;
    rState.y = 0;
    rState.vx = 0;
    rState.vy = 0;
    rState.speed = 0;
    rState.temp = 34;

    updateBotPositions();
    updateTelemetryHTML();
  }

  function updateTelemetryHTML() {
    speedGaedickeEl.textContent = `${Math.round(gState.speed * 8)} cm/s`;
    tempGaedickeEl.textContent = `${Math.round(gState.temp)}°C`;
    speedRivalEl.textContent = `${Math.round(rState.speed * 8)} cm/s`;
    tempRivalEl.textContent = `${Math.round(rState.temp)}°C`;
    scoreGaedickeEl.textContent = scoreGaedicke;
    scoreRivalEl.textContent = scoreRival;
    roundNameEl.textContent = `ROUND#${roundCount}`;
  }

  function triggerExplosion(x, y) {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.left = `${150 + x - 10}px`;
    flash.style.top = `${150 + y - 10}px`;
    flash.style.width = '20px';
    flash.style.height = '20px';
    flash.style.borderRadius = '50%';
    flash.style.background = 'white';
    flash.style.boxShadow = '0 0 15px 5px white, 0 0 25px 10px var(--primary-yellow)';
    flash.style.opacity = '1';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '5';
    flash.style.transition = 'all 0.4s ease-out';
    arena.appendChild(flash);

    setTimeout(() => {
      flash.style.transform = 'scale(2.5)';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 400);
    }, 20);
  }

  function recordRoundResult(winner) {
    stopCombat();
    if (winner === 'gaedicke') {
      scoreGaedicke++;
      if (historyRounds[roundCount - 1]) {
        historyRounds[roundCount - 1].classList.add('green');
        historyRounds[roundCount - 1].textContent = 'W';
      }
    } else {
      scoreRival++;
      if (historyRounds[roundCount - 1]) {
        historyRounds[roundCount - 1].classList.add('red');
        historyRounds[roundCount - 1].textContent = 'L';
      }
    }
    
    roundCount++;
    if (roundCount > 10) {
      alert(`Fim do Torneio! Placar Final: Gaedicke Alpha ${scoreGaedicke} x ${scoreRival} Giga Core`);
      roundCount = 1;
      scoreGaedicke = 0;
      scoreRival = 0;
      historyRounds.forEach(marker => {
        marker.className = 'round-marker';
        marker.textContent = marker.dataset.round;
      });
    }

    updateTelemetryHTML();
    setTimeout(resetPositions, 1000);
  }

  function startCombat() {
    isFighting = true;
    btnCombat.textContent = '⏸️ Pausar Simulação';
    btnCombat.style.background = '#e11d48';

    fightInterval = setInterval(() => {
      // Choose target acceleration based on behaviors
      let gBehavior = selectBehavior.value; // orbitary, offensive, defensive
      
      // Calculate vectors pointing toward opponent
      const dx = rState.x - gState.x;
      const dy = rState.y - gState.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let gax = 0, gay = 0; // Gaedicke acceleration
      let rax = 0, ray = 0; // Rival acceleration

      // Rival simple AI: always attacks directly
      rax = (dx / (dist || 1)) * 0.45;
      ray = (dy / (dist || 1)) * 0.45;

      // Gaedicke behavior strategy logic
      if (gBehavior === 'offensive') {
        // Full attack
        gax = (dx / (dist || 1)) * 0.55;
        gay = (dy / (dist || 1)) * 0.55;
      } else if (gBehavior === 'defensive') {
        // Avoid borders of Dohyo
        const distToCenter = Math.sqrt(gState.x * gState.x + gState.y * gState.y);
        if (distToCenter > 100) {
          // Accelerate back to center
          gax = -(gState.x / distToCenter) * 0.5;
          gay = -(gState.y / distToCenter) * 0.5;
        } else {
          // Cautious attack
          gax = (dx / (dist || 1)) * 0.35;
          gay = (dy / (dist || 1)) * 0.35;
        }
      } else {
        // Orbitary (Fuga rápida + Flange)
        // Move perpendicular to rival, then attack
        const perpX = -dy;
        const perpY = dx;
        const perpDist = Math.sqrt(perpX * perpX + perpY * perpY);
        
        gax = (perpX / (perpDist || 1)) * 0.4 + (dx / (dist || 1)) * 0.25;
        gay = (perpY / (perpDist || 1)) * 0.4 + (dy / (dist || 1)) * 0.25;
      }

      // Add random thermal variations
      gState.temp += 0.05 + Math.random() * 0.05;
      rState.temp += 0.05 + Math.random() * 0.05;

      // Physics Integration (Euler)
      gState.vx += gax;
      gState.vy += gay;
      rState.vx += rax;
      rState.vy += ray;

      // Friction
      gState.vx *= 0.95;
      gState.vy *= 0.95;
      rState.vx *= 0.95;
      rState.vy *= 0.95;

      gState.x += gState.vx;
      gState.y += gState.vy;
      rState.x += rState.vx;
      rState.y += rState.vy;

      gState.speed = Math.sqrt(gState.vx * gState.vx + gState.vy * gState.vy);
      rState.speed = Math.sqrt(rState.vx * rState.vx + rState.vy * rState.vy);

      // Collision checks: Bot vs Bot
      const finalDist = Math.sqrt((rState.x - gState.x)**2 + (rState.y - gState.y)**2);
      if (finalDist < botRadius * 2) {
        // Elastic collision response
        const collisionX = (rState.x + gState.x) / 2;
        const collisionY = (rState.y + gState.y) / 2;
        triggerExplosion(collisionX, collisionY);

        // Push away
        const nx = (rState.x - gState.x) / finalDist;
        const ny = (rState.y - gState.y) / finalDist;

        // Relative velocity
        const kx = gState.vx - rState.vx;
        const ky = gState.vy - rState.vy;
        const p = 2 * (kx * nx + ky * ny) / 2;

        gState.vx -= p * nx;
        gState.vy -= p * ny;
        rState.vx += p * nx;
        rState.vy += p * ny;

        // Heat spike on collision
        gState.temp += 3.5;
        rState.temp += 3.8;
      }

      // Border checks: Bot vs Dohyo Edge
      const gDistCenter = Math.sqrt(gState.x * gState.x + gState.y * gState.y);
      const rDistCenter = Math.sqrt(rState.x * rState.x + rState.y * rState.y);

      if (gDistCenter > arenaRadius - botRadius) {
        // Gaedicke fell out
        recordRoundResult('rival');
      } else if (rDistCenter > arenaRadius - botRadius) {
        // Rival fell out
        recordRoundResult('gaedicke');
      }

      updateBotPositions();
      updateTelemetryHTML();
    }, 1000 / 30); // 30 FPS
  }

  function stopCombat() {
    isFighting = false;
    clearInterval(fightInterval);
    btnCombat.textContent = '⚔️ Iniciar Combate';
    btnCombat.style.background = 'var(--primary-yellow)';
  }

  btnCombat.addEventListener('click', () => {
    if (isFighting) stopCombat();
    else startCombat();
  });

  btnReset.addEventListener('click', () => {
    stopCombat();
    resetPositions();
  });

  resetPositions();
}

/* ==========================================================================
   5. TIMELINE FILTER (CRONOGRAMA)
   ========================================================================== */
function initTimelineFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (filterButtons.length === 0 || timelineItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter; // all, torneios, oficinas, eventos

      timelineItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          setTimeout(() => { item.style.opacity = '1'; }, 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. ROBOT-TRACK - INTERACTIVE GRID GAME
   ========================================================================== */
function initRobotTrackGame() {
  const board = document.getElementById('grid-board');
  const scoreEl = document.getElementById('chips-collected');
  const movesEl = document.getElementById('steps-moved');
  const batteryEl = document.getElementById('battery-level');
  const integrityEl = document.getElementById('integrity-level');
  const btnStart = document.getElementById('btn-connect-robot');
  
  const dPadUp = document.getElementById('dpad-up');
  const dPadDown = document.getElementById('dpad-down');
  const dPadLeft = document.getElementById('dpad-left');
  const dPadRight = document.getElementById('dpad-right');

  const chassisTabs = document.querySelectorAll('.chassis-tab-btn');

  if (!board || !btnStart) return;

  const gridSize = 5;
  let robotPos = { x: 0, y: 0 };
  let chipPos = { x: 3, y: 3 };
  let score = 0;
  let moves = 0;
  let battery = 100;
  let integrity = 100;
  let isConnected = false;
  let cells = [];

  // Chassis config options
  let config = {
    dischargeRate: 1.0,
    resilienceMultiplier: 1.0
  };

  // Build grid cell divs
  function createBoardHTML() {
    board.innerHTML = '';
    cells = [];
    for (let r = 0; r < gridSize; r++) {
      cells[r] = [];
      for (let c = 0; c < gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        board.appendChild(cell);
        cells[r][c] = cell;
      }
    }
  }

  function renderGame() {
    // Clear previous positions
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        cells[r][c].innerHTML = '';
        cells[r][c].classList.remove('active-path');
      }
    }

    if (!isConnected) {
      cells[2][2].innerHTML = `<div style="font-size:0.75rem; text-align:center; color:var(--text-secondary);">CONEXÃO OFFLINE</div>`;
      return;
    }

    // Path highlights
    cells[robotPos.y][robotPos.x].classList.add('active-path');

    // Render Robot
    const robotDiv = document.createElement('div');
    robotDiv.className = 'game-robot';
    robotDiv.textContent = '🌻';
    cells[robotPos.y][robotPos.x].appendChild(robotDiv);

    // Render Chip
    const chipDiv = document.createElement('div');
    chipDiv.className = 'game-chip';
    cells[chipPos.y][chipPos.x].appendChild(chipDiv);

    // Update HTML Telemetry values
    scoreEl.textContent = `${score} / 3`;
    movesEl.textContent = `${moves} passos`;
    batteryEl.textContent = `${Math.max(0, Math.round(battery))}%`;
    integrityEl.textContent = `${integrity}%`;
  }

  function generateNewChip() {
    let newX, newY;
    do {
      newX = Math.floor(Math.random() * gridSize);
      newY = Math.floor(Math.random() * gridSize);
    } while (newX === robotPos.x && newY === robotPos.y);

    chipPos.x = newX;
    chipPos.y = newY;
  }

  function moveRobot(dx, dy) {
    if (!isConnected || battery <= 0) return;

    let targetX = robotPos.x + dx;
    let targetY = robotPos.y + dy;

    // Boundary / Collision Check
    if (targetX < 0 || targetX >= gridSize || targetY < 0 || targetY >= gridSize) {
      // Collision with wall
      integrity -= Math.round(10 * config.resilienceMultiplier);
      if (integrity <= 0) {
        integrity = 0;
        isConnected = false;
        alert("Integridade crítica! Robô inativo.");
      }
      renderGame();
      return;
    }

    robotPos.x = targetX;
    robotPos.y = targetY;
    moves++;
    
    // Battery consumption
    battery -= 2 * config.dischargeRate;
    if (battery <= 0) {
      battery = 0;
      isConnected = false;
      alert("Bateria zerada! Conexão interrompida.");
    }

    // Collecting Chip check
    if (robotPos.x === chipPos.x && robotPos.y === chipPos.y) {
      score++;
      generateNewChip();
      if (score >= 3) {
        alert("Parabéns! Protocolo Robot-Track completo com sucesso! 🏆");
        score = 0;
      }
    }

    renderGame();
  }

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (!isConnected) return;
    if (e.key === 'w' || e.key === 'ArrowUp') { e.preventDefault(); moveRobot(0, -1); }
    if (e.key === 's' || e.key === 'ArrowDown') { e.preventDefault(); moveRobot(0, 1); }
    if (e.key === 'a' || e.key === 'ArrowLeft') { e.preventDefault(); moveRobot(-1, 0); }
    if (e.key === 'd' || e.key === 'ArrowRight') { e.preventDefault(); moveRobot(1, 0); }
  });

  // D-Pad Touch / Click controls
  dPadUp.addEventListener('click', () => moveRobot(0, -1));
  dPadDown.addEventListener('click', () => moveRobot(0, 1));
  dPadLeft.addEventListener('click', () => moveRobot(-1, 0));
  dPadRight.addEventListener('click', () => moveRobot(1, 0));

  // Connection trigger button
  btnStart.addEventListener('click', () => {
    if (isConnected) {
      isConnected = false;
      btnStart.textContent = 'CONECTAR E INICIAR';
      btnStart.style.background = 'rgba(255,255,255,0.05)';
    } else {
      isConnected = true;
      score = 0;
      moves = 0;
      battery = 100;
      integrity = 100;
      robotPos = { x: 0, y: 0 };
      generateNewChip();
      btnStart.textContent = 'DESCONECTAR ROBÔ';
      btnStart.style.background = '#e11d48';
    }
    renderGame();
  });

  // Chassis configs selectors
  chassisTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chassisTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.dataset.chassis; // hover, crawler, rover
      if (mode === 'hover') {
        config.dischargeRate = 0.5; // Discharge is slow
        config.resilienceMultiplier = 1.0;
      } else if (mode === 'crawler') {
        config.dischargeRate = 1.0;
        config.resilienceMultiplier = 0.5; // High resilience (damage halved)
      } else {
        config.dischargeRate = 0.2; // Sonar Scan is highly efficient
        config.resilienceMultiplier = 1.2;
      }
    });
  });

  createBoardHTML();
  renderGame();
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. GIRABOT INTERACTIVE CHAT WIDGET
   ========================================================================== */
function initGiraBotChat() {
  const widgetBtn = document.getElementById('girabot-widget-btn');
  const windowEl = document.getElementById('girabot-window');
  const chatBody = document.getElementById('girabot-body');
  const inputEl = document.getElementById('girabot-input');
  const sendBtn = document.getElementById('girabot-send');
  const quickReplies = document.querySelectorAll('.quick-reply-btn');
  const avatarEl = document.getElementById('sunbot-header-avatar');
  const muteBtn = document.getElementById('sunbot-mute-btn');

  if (!widgetBtn || !windowEl || !inputEl || !sendBtn) return;

  let revertTimeout = null;
  let isMuted = false;

  // Toggle voice mute state
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering header click events
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? '🔇' : '🔊';
      muteBtn.title = isMuted ? "Ativar Voz" : "Desativar Voz";
      if (isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
  }

  // Speak function using SpeechSynthesis
  function speak(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop any currently playing speech
    window.speechSynthesis.cancel();
    
    // Clean emojis, markdown, and special characters for natural voice reading
    const cleanText = text
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
      .replace(/\*+/g, "")
      .replace(/[-➔💡🕺🤖🌻🏆🎮🧠⚙️📍👤]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    
    // Look up Portuguese voices
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }
    
    utterance.pitch = 1.15; // Robotic/Chibi friendly pitch
    utterance.rate = 1.05;  // Slightly faster speed
    
    window.speechSynthesis.speak(utterance);
  }

  // Toggle chatbot window visibility
  widgetBtn.addEventListener('click', () => {
    windowEl.classList.toggle('active');
  });

  function setAvatarExpression(expression) {
    if (!avatarEl) return;
    avatarEl.src = `assets/sunbot_${expression}.png`;
  }

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    
    // Auto scroll down
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getSunBotResponse(userMsg) {
    const msg = userMsg.toLowerCase();
    
    // Greetings
    if (msg.includes('olá') || msg.includes('oi') || msg.includes('conversar') || msg.includes('saudação')) {
      return {
        text: "Olá, parceiro orgânico! 🌻🤖 Sou o SunBot, assistente oficial do Game & Tech Experiência 2026. Estou super carregado e pronto para ajudar! Pergunte-me sobre a 'programação', 'palestrantes', 'patrocinadores', 'SumoBot' ou peça uma 'dica'!",
        expression: "boas_vindas"
      };
    }
    
    // Dance
    if (msg.includes('dançar') || msg.includes('danca') || msg.includes('coreografia')) {
      return {
        text: "Girando minhas pétalas solares em 360 graus! 🌻🕺 *beep-boop* Dançando o robô-code com estilo! *tump-tump-tump*",
        expression: "comemorando"
      };
    }
    
    // Programação / Horários / Cronograma
    if (msg.includes('programação') || msg.includes('cronograma') || msg.includes('agenda') || msg.includes('horário') || msg.includes('palestra')) {
      if (msg.includes('manhã') || msg.includes('manha')) {
        return {
          text: "Na parte da manhã teremos: às 08:30 a Abertura Cyber na Quadra Principal. Às 09:30, a Oficina de Games 2D no Laboratório 1. E às 10:45 o Torneio Especial de FIFA 23 no Pátio!",
          expression: "empolgado"
        };
      }
      if (msg.includes('tarde')) {
        return {
          text: "Na parte da tarde teremos: às 13:30 a oficina de IAs Generativas no Lab de Robótica. Às 14:15, a palestra de Desenho Industrial com o Pablo. Às 15:00, a palestra do Elias sobre Hardware. E o encerramento com prêmios às 16:30 na Quadra!",
          expression: "empolgado"
        };
      }
      return {
        text: "O evento começa às 08:30 com a Abertura Cyber. Teremos oficinas de Games 2D (09:30) e IAs Generativas (13:30), torneio de FIFA (10:45), palestras de Desenho/CNC (14:15) e Empreendedorismo (15:00), e encerramento às 16:30! Quer saber os detalhes da 'manhã' ou 'tarde'?",
        expression: "feliz"
      };
    }

    // Palestrantes (Elias and Pablo)
    if (msg.includes('palestrante') || msg.includes('palestra') || msg.includes('elias') || msg.includes('pablo') || msg.includes('niruma') || msg.includes('jc')) {
      if (msg.includes('elias') || msg.includes('jc')) {
        return {
          text: "O palestrante Elias da JC Informática vai falar às 15:00 no Auditório Central! Ele abordará manutenção de computadores, hardware corporativo e a realidade empreendedora na área de TI.",
          expression: "apontando"
        };
      }
      if (msg.includes('pablo') || msg.includes('niruma')) {
        return {
          text: "O palestrante Pablo da Niruma Móveis vai falar às 14:15 no Auditório Central! Ele mostrará como o desenho industrial em 3D vira realidade com programação de máquinas CNC na indústria moderna.",
          expression: "apontando"
        };
      }
      return {
        text: "Temos dois grandes palestrantes convidados na Arena Tech: o Pablo (Niruma Móveis, às 14:15) falando sobre CNC/Desenho Industrial, e o Elias (JC Informática, às 15:00) falando sobre Hardware e TI. Quem você quer pesquisar?",
        expression: "feliz"
      };
    }

    // SumoBot
    if (msg.includes('sumobot') || msg.includes('combate') || msg.includes('dohyo') || msg.includes('robô') || msg.includes('gaedicke alpha')) {
      return {
        text: "No Dohyo Virtual, o robô Gaedicke Alpha duela contra o rival Giga Core! Calibre o Gaedicke Alpha na estratégia 'Orbitária' (velocidade de fuga + ataque lateral) para dominar a arena e vencer as bordas!",
        expression: "empolgado"
      };
    }

    // Robot-Track
    if (msg.includes('robot-track') || msg.includes('estufa') || msg.includes('chassi') || msg.includes('chassis') || msg.includes('jogo') || msg.includes('chip')) {
      return {
        text: "O Robot-Track é o nosso simulador 2D de estufa inteligente! Mova o robô com W-A-S-D para coletar 3 chips. Dica de engenharia: use o chassi 'Crawler' para absorver 50% mais dano nas colisões!",
        expression: "feliz"
      };
    }

    // Escola / Gaedicke / Guedes
    if (msg.includes('escola') || msg.includes('gaedicke') || msg.includes('guedes') || msg.includes('augusto') || msg.includes('guilherme') || msg.includes('vale verde') || msg.includes('petrópolis')) {
      return {
        text: "A Escola Municipal Augusto Guilherme Gaedicke, localizada no bairro Vale Verde em Nova Petrópolis (RS), oferece ensino fundamental com foco em qualidade e inclusão, com 35 anos de história.",
        expression: "feliz"
      };
    }

    // Inscrição / Preço / Certificado
    if (msg.includes('inscrição') || msg.includes('cadastro') || msg.includes('certificado') || msg.includes('grátis') || msg.includes('pagar') || msg.includes('valor')) {
      return {
        text: "O evento é 100% gratuito e aberto para todos! Ao fazer seu cadastro presencial e registrar presença nos totens da Escola Gaedicke, você receberá um Certificado Digital de Imersão Tecnológica diretamente em seu e-mail!",
        expression: "feliz"
      };
    }

    // Patrocinadores / Apoio
    if (msg.includes('patrocinador') || msg.includes('patrocínio') || msg.includes('apoio') || msg.includes('realização') || msg.includes('parceiro')) {
      return {
        text: "Nossos grandes apoiadores e patrocinadores oficiais são a JC Informática (especialista em TI e hardware) e a Niruma Móveis (referência em móveis sob medida e automação CNC). Graças a eles, o evento é gratuito!",
        expression: "boas_vindas"
      };
    }
    
    // Tips (dica)
    if (msg.includes('dica') || msg.includes('ajuda') || msg.includes('conselho') || msg.includes('sugestão')) {
      const tips = [
        "Procure pela oficina de Games 2D às 09:30 no Laboratório 1! É excelente para aprender lógica.",
        "No SumoBot Virtual, configure o Gaedicke Alpha na estratégia 'Orbitária'. Ela é a mais equilibrada para empurrar o rival!",
        "Não perca a palestra do Elias às 15:00 no Auditório Central se você quer trabalhar com hardware ou montar computadores.",
        "Se for jogar o Robot-Track, use o chassi Crawler para ter maior resiliência física nas bordas.",
        "Experimente o visualizador 3D do Girassol na página inicial. Você pode interagir com ele arrastando o mouse!"
      ];
      return {
        text: tips[Math.floor(Math.random() * tips.length)],
        expression: "apontando"
      };
    }
    
    return {
      text: "Entrada de sinal recebida! 🌻🤖 Não entendi perfeitamente seu comando. Pergunte-me sobre a 'programação', 'palestrantes', 'patrocinadores', peça uma 'dica' ou peça para eu 'dançar'!",
      expression: "pensativo"
    };
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputEl.value = '';

    // Clear any pending expression revert
    if (revertTimeout) clearTimeout(revertTimeout);

    // Set avatar to thinking/listening face
    setAvatarExpression('pensando');

    // SunBot replies after a short delay
    setTimeout(() => {
      const response = getSunBotResponse(text);
      addMessage(response.text, 'gira');
      setAvatarExpression(response.expression);
      
      // Speak the text out loud if not muted
      if (!isMuted) {
        speak(response.text);
      }
      
      // Revert back to happy face after 6 seconds
      revertTimeout = setTimeout(() => {
        setAvatarExpression('feliz');
      }, 6000);
    }, 700);
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Handle clicking quick replies
  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      const replyText = btn.textContent;
      addMessage(replyText, 'user');

      if (revertTimeout) clearTimeout(revertTimeout);
      setAvatarExpression('pensando');
      
      setTimeout(() => {
        const response = getSunBotResponse(replyText);
        addMessage(response.text, 'gira');
        setAvatarExpression(response.expression);
        
        if (!isMuted) {
          speak(response.text);
        }
        
        revertTimeout = setTimeout(() => {
          setAvatarExpression('feliz');
        }, 6000);
      }, 600);
    });
  });
}

/* ==========================================================================
   9. PROCEDURAL 3D SUNFLOWER CANVAS ANIMATION (FALLBACK)
   ========================================================================== */
function initSunflowerCanvas() {
  const canvas = document.getElementById('sunflower-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angleOffset = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;
    const c = 7.5; // scaling factor
    
    // Draw neon particles forming a mathematical sunflower (phyllotaxis spiral)
    const numPoints = 200;
    
    for (let i = 0; i < numPoints; i++) {
      // Golden ratio angle: ~137.5 degrees (2.39996 radians)
      const angle = i * 2.39996 + angleOffset;
      const r = c * Math.sqrt(i);
      
      if (r > maxRadius) continue;

      // Project onto a tilted plane to simulate 3D rotation
      const cosAngle = Math.cos(angleOffset * 0.4);
      const sinAngle = Math.sin(angleOffset * 0.4);
      
      // Rotate around the Y-axis & tilt slightly
      const x3d = r * Math.cos(angle);
      const y3d = r * Math.sin(angle);
      const z3d = r * Math.sin(angle + angleOffset * 2);
      
      const scale = 1 + z3d / 400; // perspective depth scale
      const xProj = centerX + (x3d * cosAngle - z3d * sinAngle) * scale;
      const yProj = centerY + y3d * scale * 0.75; // tilt down

      // Particle size based on depth and position
      const size = (2 + (i / numPoints) * 3.5) * scale;
      
      // Color gradient: Neon Emerald green in center/back, Sunflower Yellow/Gold outer petals
      const ratio = i / numPoints;
      let color;
      if (ratio < 0.25) {
        color = `rgba(16, 185, 129, ${0.45 + 0.55 * (ratio / 0.25)})`; // Neon Green
      } else {
        color = `rgba(251, 191, 36, ${0.8 - 0.4 * ((ratio - 0.25) / 0.75)})`; // Sunflower Yellow
      }

      ctx.beginPath();
      ctx.arc(xProj, yProj, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      
      // Enable glows
      if (ratio >= 0.25) {
        ctx.shadowColor = 'rgba(251, 191, 36, 0.75)';
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowColor = 'rgba(16, 185, 129, 0.75)';
        ctx.shadowBlur = 5;
      }
      
      ctx.fill();
    }
    
    ctx.shadowBlur = 0; // reset shadow for performance
    angleOffset += 0.006;
    requestAnimationFrame(draw);
  }

  draw();
}

// ==========================================================================
// 10. MODAL REGISTRATION & TICKET SYSTEM LOGIC
// ==========================================================================
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbzbUdD6ZKuztMD9gQYFg_gKs57efVe7a14tvgHR6o3wf_5uGffQGHjwxsYhCTjhL_g4/exec";

// Modal Audio Effects
const ModalAudio = {
  ctx: null,
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {}
  },
  playBeep(freq, type = 'sine', duration = 0.1, volume = 0.1) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  playClick() {
    this.playBeep(980, 'square', 0.12, 0.05);
  },
  playSuccess() {
    this.playBeep(523.25, 'sine', 0.1, 0.08); // C5
    setTimeout(() => this.playBeep(659.25, 'sine', 0.1, 0.08), 80); // E5
    setTimeout(() => this.playBeep(783.99, 'sine', 0.1, 0.08), 160); // G5
    setTimeout(() => this.playBeep(1046.50, 'sine', 0.2, 0.1), 240); // C6
  },
  playCrash() {
    this.playBeep(150, 'sawtooth', 0.35, 0.15);
  }
};

window.openModal = function() {
    ModalAudio.playClick();
    document.getElementById('registration-modal').classList.add('active');
    document.getElementById('registration-ticket').style.display = 'none';
    document.getElementById('registration-form-content').style.display = 'block';
    document.getElementById('arena-form').reset();
}

window.closeModal = function() {
    ModalAudio.playClick();
    document.getElementById('registration-modal').classList.remove('active');
}

window.openAdminModal = function() {
    ModalAudio.playClick();
    updateAdminTable();
    document.getElementById('admin-modal').classList.add('active');
}

window.closeAdminModal = function() {
    ModalAudio.playClick();
    document.getElementById('admin-modal').classList.remove('active');
}

function updateAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let list = [];
    try {
        const existing = localStorage.getItem('arena_registrations');
        if (existing) {
            list = JSON.parse(existing);
        }
    } catch(err) {
        console.error("Erro ao ler inscritos do localStorage", err);
    }
    
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 30px; text-align: center; color: var(--text-secondary);">
                    Nenhum registro encontrado. Faça a primeira inscrição para preencher os dados!
                </td>
            </tr>
        `;
        return;
    }
    
    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        tr.innerHTML = `
            <td style="padding: 12px; font-weight: 500; text-transform: uppercase;">${item.name}</td>
            <td style="padding: 12px;">${item.grade}</td>
            <td style="padding: 12px;"><span style="color: ${item.activity === 'Jogos' ? 'var(--primary-yellow)' : 'var(--primary-green)'}; font-weight: 600;">${item.activity.toUpperCase()}</span></td>
            <td style="padding: 12px; font-family: var(--font-title); color: var(--primary-yellow); font-size: 11px;">${item.uuid}</td>
            <td style="padding: 12px; color: var(--text-secondary); font-size: 12px;">${item.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.clearRegistrations = function() {
    if (confirm("Tem certeza que deseja apagar permanentemente todas as inscrições salvas localmente?")) {
        localStorage.removeItem('arena_registrations');
        ModalAudio.playCrash();
        updateAdminTable();
    }
}

window.exportRegistrationsToCSV = function() {
    ModalAudio.playClick();
    let list = [];
    try {
        const existing = localStorage.getItem('arena_registrations');
        if (existing) {
            list = JSON.parse(existing);
        }
    } catch(err) {
        console.error(err);
    }
    
    if (list.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }
    
    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += "Nome,Turma,Atividade,UUID,Data/Hora Registro\n";
    
    list.forEach(item => {
        const name = item.name.replace(/"/g, '""');
        const grade = item.grade.replace(/"/g, '""');
        const activity = item.activity.replace(/"/g, '""');
        const uuid = item.uuid.replace(/"/g, '""');
        const date = item.date.replace(/"/g, '""');
        csvContent += `"${name}","${grade}","${activity}","${uuid}","${date}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inscritos_game_tech_experience_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.handleFormSubmit = function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const grade = document.getElementById('grade').value;
    const activity = document.getElementById('activity').value;
    
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.innerHTML = 'AUTENTICANDO...';
    submitBtn.disabled = true;
    
    ModalAudio.playClick();
    
    setTimeout(() => {
        ModalAudio.playSuccess();
        
        const randomID = Math.floor(1000 + Math.random() * 9000);
        const uuidHex = Math.random().toString(16).substring(2, 6).toUpperCase();
        const finalUUID = `GT-${randomID}-${uuidHex}`;
        
        document.getElementById('ticket-name').innerText = name.toUpperCase();
        document.getElementById('ticket-grade').innerText = grade.toUpperCase();
        document.getElementById('ticket-activity').innerText = activity.toUpperCase();
        document.getElementById('ticket-uuid').innerText = `UUID: ${finalUUID}`;
        
        const badge = document.getElementById('ticket-badge');
        if (activity === 'Jogos') {
            badge.innerText = 'COMPETIDOR ARENA';
            badge.style.color = 'var(--primary-yellow)';
            badge.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        } else {
            badge.innerText = 'CONVIDADO VIP';
            badge.style.color = 'var(--primary-green)';
            badge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        }
        
        document.getElementById('registration-form-content').style.display = 'none';
        document.getElementById('registration-ticket').style.display = 'block';
        submitBtn.innerHTML = 'ENVIAR ASSINATURA';
        submitBtn.disabled = false;

        const registrant = {
            name: name,
            grade: grade,
            activity: activity,
            uuid: finalUUID,
            date: new Date().toLocaleString('pt-BR')
        };
        let list = [];
        try {
            const existing = localStorage.getItem('arena_registrations');
            if (existing) {
                list = JSON.parse(existing);
            }
        } catch(err) {
            console.error("Erro ao ler localStorage", err);
        }
        list.push(registrant);
        localStorage.setItem('arena_registrations', JSON.stringify(list));

        if (GOOGLE_SHEETS_API_URL !== "") {
            fetch(GOOGLE_SHEETS_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrant)
            })
            .then(() => console.log("Dados enviados para a nuvem com sucesso!"))
            .catch(err => console.error("Erro ao enviar dados para a nuvem:", err));
        }
    }, 2000);
}

window.printTicket = function() {
    window.print();
}

window.downloadTicket = function() {
    const name = document.getElementById('ticket-name').innerText;
    const grade = document.getElementById('ticket-grade').innerText;
    const activity = document.getElementById('ticket-activity').innerText;
    const uuidText = document.getElementById('ticket-uuid').innerText;
    const isCompetitor = document.getElementById('ticket-badge').innerText === 'COMPETIDOR ARENA';
    const badgeColor = isCompetitor ? '#F59E0B' : '#10B981';
    const badgeTitle = isCompetitor ? 'COMPETIDOR ARENA' : 'CONVIDADO VIP';
    
    // Escape special XML characters to prevent parsing errors (like xmlParseEntityRef)
    const esc = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Shorten long activity names to prevent overlap on SVG render
    const displayActivity = activity.toUpperCase() === 'APENAS OFICINAS E DEMONSTRAÇÕES' 
        ? 'OFICINAS & DEMONS.' 
        : activity.toUpperCase();
    const activityFontSize = displayActivity.length > 18 ? 12 : 15;
    
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 300" width="450" height="300">
        <rect width="450" height="300" rx="16" fill="#080c1c" stroke="#F59E0B" stroke-width="3"/>
        <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F59E0B" stroke-width="0.5" opacity="0.1"/>
            </pattern>
        </defs>
        <rect width="450" height="300" rx="16" fill="url(#grid)" />
        
        <text x="30" y="50" font-family="'MakesRegular', sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="1">GAME &amp; TECH EXPERIENCE</text>
        <text x="30" y="75" font-family="'MakesRegular', sans-serif" font-weight="700" font-size="12" fill="${badgeColor}" letter-spacing="2">${esc(badgeTitle)}</text>
        <line x1="30" y1="90" x2="420" y2="90" stroke="#F59E0B" stroke-width="1" opacity="0.3"/>
        
        <text x="30" y="125" font-family="'Outfit', sans-serif" font-size="10" fill="#F59E0B" letter-spacing="1">NOME</text>
        <text x="30" y="145" font-family="'Outfit', sans-serif" font-weight="600" font-size="15" fill="#ffffff">${esc(name)}</text>
        
        <text x="250" y="125" font-family="'Outfit', sans-serif" font-size="10" fill="#F59E0B" letter-spacing="1">CLASSE</text>
        <text x="250" y="145" font-family="'Outfit', sans-serif" font-weight="600" font-size="15" fill="#ffffff">${esc(grade)}</text>
        
        <text x="30" y="190" font-family="'Outfit', sans-serif" font-size="10" fill="#F59E0B" letter-spacing="1">TORNEIO / ACESSO</text>
        <text x="30" y="210" font-family="'Outfit', sans-serif" font-weight="600" font-size="${activityFontSize}" fill="#ffffff">${esc(displayActivity)}</text>
        
        <text x="250" y="190" font-family="'Outfit', sans-serif" font-size="10" fill="#F59E0B" letter-spacing="1">DATA EVENTO</text>
        <text x="250" y="210" font-family="'Outfit', sans-serif" font-weight="600" font-size="15" fill="#ffffff">12 OUT 2026</text>
        
        <rect x="30" y="240" width="220" height="25" fill="#ffffff" rx="2"/>
        <path d="M40 242 v21 M43 242 v21 M48 242 v21 M50 242 v21 M55 242 v21 M62 242 v21 M64 242 v21 M68 242 v21 M74 242 v21 M78 242 v21 M84 242 v21 M90 242 v21 M93 242 v21 M98 242 v21 M100 242 v21 M105 242 v21 M112 242 v21 M114 242 v21 M118 242 v21 M124 242 v21 M128 242 v21 M134 242 v21 M140 242 v21 M143 242 v21 M148 242 v21 M150 242 v21 M155 242 v21 M162 242 v21 M164 242 v21 M168 242 v21 M174 242 v21 M178 242 v21 M184 242 v21 M190 242 v21 M193 242 v21 M198 242 v21 M200 242 v21 M205 242 v21 M212 242 v21 M214 242 v21 M218 242 v21 M224 242 v21 M228 242 v21 M234 242 v21 M240 242 v21" stroke="#000000" stroke-width="2"/>
        
        <text x="270" y="258" font-family="'MakesRegular', sans-serif" font-size="10" fill="#F59E0B">${esc(uuidText)}</text>
    </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arena-Passport-${name.replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
