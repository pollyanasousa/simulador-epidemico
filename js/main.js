/* ═══════════════════════════════════════════════════════════════
   SIMULADOR EPIDEMIOLÓGICO SEIR — main.js
   Modelo SEIR estendido com compartimentos clínicos
   Integração numérica: Método de Euler (dt = 0.1 dia)
   Gráficos: Chart.js (barras empilhadas, atualização em tempo real)
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────────────────────────
   1. UTILITÁRIOS
─────────────────────────────────────────────────────────────── */

/** Formata número grande com separador de milhar (pt-BR) */
function fmtN(v) {
  if (v >= 1e9)  return (v / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' Bi';
  if (v >= 1e6)  return (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' M';
  if (v >= 1e3)  return (v / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' k';
  return Math.round(v).toLocaleString('pt-BR');
}

/** Formata número decimal com vírgula (pt-BR) */
function fmtD(v, dec = 2) {
  return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** Garante valor não-negativo */
const nn = v => Math.max(0, v);

/** Atualiza a trilha preenchida (fill %) de um slider */
function updateSliderFill(input) {
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  const val = parseFloat(input.value);
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', pct.toFixed(1) + '%');
}

/* ───────────────────────────────────────────────────────────────
   2. LEITURA DE PARÂMETROS DOS SLIDERS
─────────────────────────────────────────────────────────────── */

function getParams() {
  return {
    N:     parseFloat(document.getElementById('N').value),
    I0:    parseFloat(document.getElementById('I0').value),
    Tsim:  parseFloat(document.getElementById('Tsim').value),
    R0:    parseFloat(document.getElementById('R0').value),
    theta: parseFloat(document.getElementById('theta').value),
    Tinf:  parseFloat(document.getElementById('Tinf').value),
    Tinc:  parseFloat(document.getElementById('Tinc').value),
    delta: parseFloat(document.getElementById('delta').value) / 100,  // % → fração
    Tm:    parseFloat(document.getElementById('Tm').value),
    Tint:  parseFloat(document.getElementById('Tint').value),
    Trec:  parseFloat(document.getElementById('Trec').value),
    tau:   parseFloat(document.getElementById('tau').value) / 100,    // % → fração
    Thosp: parseFloat(document.getElementById('Thosp').value),
  };
}

/* ───────────────────────────────────────────────────────────────
   3. MOTOR SEIR ESTENDIDO — MÉTODO DE EULER (dt = 0.1)
─────────────────────────────────────────────────────────────── */

/**
 * Compartimentos:
 *   S   — Suscetíveis
 *   E   — Expostos (incubando)
 *   I   — Infectados infecciosos
 *   H   — Hospitalizados
 *   F   — Fatalidades acumuladas
 *   Rec — Recuperados acumulados
 *
 * Equações (por passo dt):
 *   dS   = -β·S·I/N
 *   dE   =  β·S·I/N − σ·E
 *   dI   =  σ·E − γ·I
 *   dH   =  τ·γ·I − α·H
 *   dF   =  δ·α·H
 *   dRec =  (1−δ)·α·H + (1−τ)·γ·I
 *
 * Parâmetros derivados:
 *   Rt = (1−θ)·R0
 *   β  = Rt / Tinf
 *   σ  = 1 / Tinc
 *   γ  = 1 / Tinf
 *   α  = 1 / Thosp
 */
function runSEIR(p) {
  const dt   = 0.1;
  const steps = Math.ceil(p.Tsim / dt);

  // Parâmetros derivados
  const Rt   = (1 - p.theta) * p.R0;
  const beta  = Rt / p.Tinf;
  const sigma = 1 / p.Tinc;
  const gamma = 1 / p.Tinf;
  const alpha = 1 / p.Thosp;
  const delta = p.delta;   // já em fração
  const tau   = p.tau;     // já em fração

  // Condições iniciais
  let S   = nn(p.N - p.I0);
  let E   = 0;
  let I   = nn(p.I0);
  let H   = 0;
  let F   = 0;
  let Rec = 0;

  // Arrays de saída — um ponto por DIA (decimado)
  const days  = [];
  const arrE  = [], arrI  = [], arrRem = [];
  const arrH  = [], arrF  = [], arrRec = [];

  let dayCounter = 0;
  let nextRecord = 0;  // próximo dia inteiro a registrar

  for (let step = 0; step <= steps; step++) {
    const t = step * dt;

    // Registra no primeiro passo e a cada dia inteiro
    if (step === 0 || t >= nextRecord - 1e-9) {
      days.push(Math.round(t));
      arrE.push(nn(E));
      arrI.push(nn(I));
      // Removidos = H + F + Rec (todos que saíram de I)
      arrRem.push(nn(H + F + Rec));
      arrH.push(nn(H));
      arrF.push(nn(F));
      arrRec.push(nn(Rec));
      nextRecord = Math.floor(t) + 1;
    }

    // Derivadas
    const newInfections = beta * S * I / p.N;
    const dS   = -newInfections;
    const dE   =  newInfections - sigma * E;
    const dI   =  sigma * E - gamma * I;
    const dH   =  tau * gamma * I - alpha * H;
    const dF   =  delta * alpha * H;
    const dRec =  (1 - delta) * alpha * H + (1 - tau) * gamma * I;

    // Euler
    S   = nn(S   + dS   * dt);
    E   = nn(E   + dE   * dt);
    I   = nn(I   + dI   * dt);
    H   = nn(H   + dH   * dt);
    F   = nn(F   + dF   * dt);
    Rec = nn(Rec + dRec * dt);
  }

  return { days, arrE, arrI, arrRem, arrH, arrF, arrRec, Rt };
}

/* ───────────────────────────────────────────────────────────────
   4. CONFIGURAÇÃO DOS GRÁFICOS CHART.JS
─────────────────────────────────────────────────────────────── */

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 120 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(27,58,107,0.92)',
      titleColor: '#A8C4E0',
      bodyColor: '#FFFFFF',
      borderColor: 'rgba(74,144,217,0.4)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 6,
      titleFont: { family: 'Lato', weight: 'bold', size: 12 },
      bodyFont:  { family: 'Lato', size: 12 },
      callbacks: {
        title: items => `Dia ${items[0].label}`,
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: { color: 'rgba(214,228,240,0.6)' },
      ticks: {
        color: '#6B7A8D',
        font: { family: 'Lato', size: 11 },
        maxTicksLimit: 12,
        callback: function(val, idx) { return 'Dia ' + this.getLabelForValue(val); }
      },
      title: {
        display: true,
        text: 'Tempo (dias)',
        color: '#6B7A8D',
        font: { family: 'Lato', size: 11 }
      }
    },
    y: {
      stacked: true,
      grid: { color: 'rgba(214,228,240,0.6)' },
      ticks: {
        color: '#6B7A8D',
        font: { family: 'Lato', size: 11 },
        callback: v => fmtN(v)
      },
      title: {
        display: true,
        text: 'Indivíduos',
        color: '#6B7A8D',
        font: { family: 'Lato', size: 11 }
      }
    }
  }
};

/* ── Gráfico 1: Transmissão ── */
const ctxT = document.getElementById('chartTransmissao').getContext('2d');
const chartTransmissao = new Chart(ctxT, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Exposto',
        data: [],
        backgroundColor: 'rgba(39,174,96,0.82)',
        borderColor: 'rgba(39,174,96,1)',
        borderWidth: 0,
        stack: 'seir'
      },
      {
        label: 'Infectado',
        data: [],
        backgroundColor: 'rgba(230,126,34,0.82)',
        borderColor: 'rgba(230,126,34,1)',
        borderWidth: 0,
        stack: 'seir'
      },
      {
        label: 'Removido',
        data: [],
        backgroundColor: 'rgba(41,128,185,0.82)',
        borderColor: 'rgba(41,128,185,1)',
        borderWidth: 0,
        stack: 'seir'
      }
    ]
  },
  options: {
    ...CHART_DEFAULTS,
    plugins: {
      ...CHART_DEFAULTS.plugins,
      tooltip: {
        ...CHART_DEFAULTS.plugins.tooltip,
        callbacks: {
          ...CHART_DEFAULTS.plugins.tooltip.callbacks,
          label: ctx => ` ${ctx.dataset.label}: ${fmtN(ctx.parsed.y)}`
        }
      }
    }
  }
});

/* ── Gráfico 2: Clínico ── */
const ctxC = document.getElementById('chartClinico').getContext('2d');
const chartClinico = new Chart(ctxC, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Fatalidades',
        data: [],
        backgroundColor: 'rgba(26,92,56,0.85)',
        borderColor: 'rgba(26,92,56,1)',
        borderWidth: 0,
        stack: 'clin'
      },
      {
        label: 'Hospitalizados',
        data: [],
        backgroundColor: 'rgba(211,84,0,0.82)',
        borderColor: 'rgba(211,84,0,1)',
        borderWidth: 0,
        stack: 'clin'
      },
      {
        label: 'Recuperados',
        data: [],
        backgroundColor: 'rgba(31,97,141,0.82)',
        borderColor: 'rgba(31,97,141,1)',
        borderWidth: 0,
        stack: 'clin'
      }
    ]
  },
  options: {
    ...CHART_DEFAULTS,
    plugins: {
      ...CHART_DEFAULTS.plugins,
      tooltip: {
        ...CHART_DEFAULTS.plugins.tooltip,
        callbacks: {
          ...CHART_DEFAULTS.plugins.tooltip.callbacks,
          label: ctx => ` ${ctx.dataset.label}: ${fmtN(ctx.parsed.y)}`
        }
      }
    }
  }
});

/* ───────────────────────────────────────────────────────────────
   5. ATUALIZAÇÃO COMPLETA (simulação + UI + gráficos)
─────────────────────────────────────────────────────────────── */

function update() {
  const p = getParams();
  const r = runSEIR(p);

  // ── Rt badge ──
  const rtVal = document.getElementById('rt-value');
  const rtBadge = document.getElementById('rt-display');
  rtVal.textContent = fmtD(r.Rt, 2);
  rtBadge.style.background = r.Rt > 1 ? '#8B1A1A' : '#1A5C38';

  // ── Gráfico 1: Transmissão ──
  chartTransmissao.data.labels = r.days;
  chartTransmissao.data.datasets[0].data = r.arrE;
  chartTransmissao.data.datasets[1].data = r.arrI;
  chartTransmissao.data.datasets[2].data = r.arrRem;
  chartTransmissao.update();

  // ── Gráfico 2: Clínico ──
  chartClinico.data.labels = r.days;
  chartClinico.data.datasets[0].data = r.arrF;
  chartClinico.data.datasets[1].data = r.arrH;
  chartClinico.data.datasets[2].data = r.arrRec;
  chartClinico.update();
}

/* ───────────────────────────────────────────────────────────────
   6. CONFIGURAÇÃO DOS SLIDERS
─────────────────────────────────────────────────────────────── */

/** Mapeamento: id do slider → função de formatação do label */
const SLIDER_FMT = {
  N:     v => fmtN(parseFloat(v)),
  I0:    v => Math.round(v).toLocaleString('pt-BR'),
  Tsim:  v => Math.round(v) + ' d',
  R0:    v => fmtD(v, 2),
  theta: v => fmtD(v, 2),
  Tinf:  v => fmtD(v, 1) + ' d',
  Tinc:  v => fmtD(v, 1) + ' d',
  delta: v => fmtD(v, 1) + '%',
  Tm:    v => fmtD(v, 1) + ' d',
  Tint:  v => fmtD(v, 1) + ' d',
  Trec:  v => fmtD(v, 1) + ' d',
  tau:   v => Math.round(v) + '%',
  Thosp: v => fmtD(v, 1) + ' d',
};

function initSliders() {
  Object.keys(SLIDER_FMT).forEach(id => {
    const input  = document.getElementById(id);
    const valEl  = document.getElementById(id + '-val');
    if (!input || !valEl) return;

    // Estado inicial
    updateSliderFill(input);
    valEl.textContent = SLIDER_FMT[id](input.value);

    // Evento de mudança
    input.addEventListener('input', () => {
      updateSliderFill(input);
      valEl.textContent = SLIDER_FMT[id](input.value);
      update();
    });
  });
}

/* ───────────────────────────────────────────────────────────────
   7. NAVEGAÇÃO DE ABAS
─────────────────────────────────────────────────────────────── */

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Botões
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Conteúdo
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById('tab-' + target).classList.add('active');

      // Re-renderiza MathJax ao trocar para aba "sobre"
      if (target === 'sobre' && window.MathJax) {
        MathJax.typesetPromise && MathJax.typesetPromise();
      }

      // Redimensiona gráficos se voltar para início
      if (target === 'inicio') {
        setTimeout(() => {
          chartTransmissao.resize();
          chartClinico.resize();
        }, 50);
      }
    });
  });
}

/* ───────────────────────────────────────────────────────────────
   8. INICIALIZAÇÃO
─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSliders();
  update();  // Renderiza a simulação com os valores padrão
});