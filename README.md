# 🦠 Simulador Epidemiológico SEIR

Simulador interativo de dinâmica epidêmica baseado no modelo **SEIR estendido com compartimentos clínicos**, desenvolvido integralmente em HTML, CSS e JavaScript puro, sem dependências de back-end.

---

## 🎓 Contexto Acadêmico

| Campo | Informação |
|---|---|
| **Instituição** | Universidade Federal Rural de Pernambuco (UFRPE) |
| **Curso** | Sistemas de Informação |
| **Disciplina** | Sustentabilidade em Sistemas de Informação |
| **Período** | 1º período |

Este projeto foi desenvolvido como atividade prática da disciplina, com o seguinte objetivo declarado pelo professor:

> *"Ilustrar a **insustentabilidade da mera prática de desenvolvimento de código, per si, como uma atividade da chamada 'escola de cursos superiores'** — e que um estudante, mesmo de 1º semestre, assumido sem conhecimento prévio algum, é capaz de construir e hospedar um código minimamente complexo e que funcione a contento, e que ele não entende nem a complexidade do problema, nem tampouco a do código escrito."*

### Tarefas exigidas

1. Criar conta no [GitHub](https://github.com/) com nome profissional
2. Criar um código para modelar doenças infectocontagiosas usando um **prompt em IA mercadológica** (Claude, Gemini, ChatGPT etc.)
3. Criar um texto em formato de artigo científico explicando o código, também via IA
4. Hospedar código, prompt e texto no GitHub e registrar o link na planilha da turma

### Declaração do estudante

Este código **não foi escrito manualmente**. Foi gerado integralmente por inteligência artificial ([Claude](https://claude.ai), da Anthropic) a partir de um prompt em linguagem natural, disponível na íntegra em [`PROMPT.md`](./PROMPT.md). O autor do trabalho é estudante de 1º semestre e não possui conhecimento prévio de programação, epidemiologia computacional ou modelagem matemática de doenças infecciosas.

O simulador funciona. O estudante não escreveu uma linha sequer do código.  
Esse é exatamente o ponto da atividade.

---

## 📌 O que é este simulador?

Este projeto permite explorar visualmente como doenças infecciosas se propagam em uma população, e como intervenções não-farmacológicas (NPIs) — como distanciamento social, uso de máscaras ou quarentena — afetam a curva epidêmica.

O usuário controla todos os parâmetros do modelo por meio de **sliders interativos** e visualiza, em tempo real, dois gráficos de barras empilhadas:

| Gráfico | Compartimentos |
|---|---|
| **Dinâmica da Transmissão** | Exposto · Infectado · Removido |
| **Dinâmica Clínica** | Fatalidades · Hospitalizados · Recuperados |

---

## 🧮 O Modelo SEIR Estendido

### Compartimentos

| Símbolo | Nome | Descrição |
|---|---|---|
| **S** | Suscetíveis | Indivíduos susceptíveis à infecção |
| **E** | Expostos | Em período de incubação (não infecciosos) |
| **I** | Infectados | Infecciosos e transmissores ativos |
| **H** | Hospitalizados | Casos graves internados |
| **F** | Fatalidades | Óbitos acumulados |
| **Rec** | Recuperados | Recuperados com imunidade adquirida |

### Equações Diferenciais

```
dS/dt   = −β · S · I / N
dE/dt   =  β · S · I / N − σ · E
dI/dt   =  σ · E − γ · I
dH/dt   =  τ · γ · I − α · H
dF/dt   =  δ · α · H
dRec/dt = (1−δ) · α · H + (1−τ) · γ · I
```

### Parâmetros Derivados

| Parâmetro | Fórmula | Descrição |
|---|---|---|
| Rₜ | (1 − θ) × R₀ | Número reprodutivo efetivo |
| β | Rₜ / Tinf | Taxa de transmissão |
| σ | 1 / Tinc | Taxa de progressão da incubação |
| γ | 1 / Tinf | Taxa de remoção infecciosa |
| α | 1 / Thosp | Taxa de saída hospitalar |

### Integração Numérica

O sistema de EDOs é resolvido pelo **Método de Euler** com passo temporal `dt = 0,1 dia`:

```
X(t + dt) = X(t) + dX/dt · dt
```

Todos os compartimentos são limitados a zero (`Math.max(0, X)`) para garantir coerência biológica.

### Condições Iniciais

```
S(0) = N − I₀     E(0) = 0     I(0) = I₀
H(0) = 0          F(0) = 0     Rec(0) = 0
```

---

## 🎛️ Parâmetros Controláveis

### Painel: Dinâmica da Transmissão

| Parâmetro | Intervalo | Padrão | Descrição |
|---|---|---|---|
| N | 1.000 – 1,5 Bi | 1.000.000 | População total |
| I₀ | 1 – 1.000 | 10 | Infectados iniciais |
| T_sim | 2 – 200 dias | 100 | Duração da simulação |
| R₀ | 0,01 – 10 | 2,5 | Número reprodutivo básico |
| θ | 0 – 1 | 0 | Redução na transmissão (NPIs) |
| Tinf | 0,1 – 24 dias | 5,0 | Tempo infeccioso médio |
| Tinc | 0,15 – 24 dias | 5,2 | Período de incubação médio |

### Painel: Dinâmica Clínica

| Parâmetro | Intervalo | Padrão | Descrição |
|---|---|---|---|
| δ | 0 – 100% | 2% | Letalidade (case fatality rate) |
| Tm | 5,8 – 100 dias | 14 | Tempo médio até óbito |
| Tint | 0,1 – 100 dias | 10 | Tempo de internação |
| Trec | 0,1 – 100 dias | 14 | Tempo de recuperação |
| τ | 1 – 100% | 15% | Taxa de hospitalização |
| Thosp | 0,1 – 100 dias | 7 | Tempo de hospitalização |

---

## 🌐 Acesse Online

O simulador está hospedado e disponível publicamente via GitHub Pages:

**👉 https://pollyanasousa.github.io/simulador-epidemico/**

---

## 🚀 Como Rodar Localmente

Não é necessário instalar nada. Basta:

1. **Baixar ou clonar** este repositório:
   ```bash
   git clone https://github.com/seu-usuario/simulador-epidemico.git
   ```

2. **Abrir o arquivo** `index.html` diretamente no navegador:
   ```
   simulador-epidemico/index.html
   ```
   Ou arrastar o arquivo `index.html` para uma aba do navegador.

3. **Interagir** com os sliders — os gráficos atualizam em tempo real.

> ⚠️ **Compatibilidade:** Chrome 90+, Firefox 88+, Edge 90+, Safari 15+.  
> Não requer servidor web, conexão com internet apenas para carregar as bibliotecas CDN (Chart.js, MathJax, Google Fonts).

---

## 🗂️ Estrutura de Arquivos

```
simulador-epidemico/
├── index.html          # Página principal: abas, sliders, canvas dos gráficos, equações
├── css/
│   └── style.css       # Estilo científico: header azul, sliders customizados, layout responsivo
├── js/
│   └── main.js         # Motor SEIR (Euler dt=0.1), lógica dos sliders, gráficos Chart.js
├── ARTIGO.md           # Artigo científico acadêmico descrevendo o simulador e a experiência
├── PROMPT.md           # Prompt integral utilizado para gerar o simulador e o artigo
└── README.md           # Este arquivo
```

---

## 📦 Dependências (via CDN)

| Biblioteca | Versão | Uso |
|---|---|---|
| [Chart.js](https://www.chartjs.org/) | 4.4.1 | Gráficos de barras empilhadas interativos |
| [MathJax](https://www.mathjax.org/) | 3.2.2 | Renderização das equações diferenciais (aba "Sobre") |
| [Google Fonts — Lato](https://fonts.google.com/specimen/Lato) | — | Tipografia profissional |

---

## 🤖 Como este projeto foi criado

### Prompt utilizado

> *"Você é um epidemiologista computacional sênior e desenvolvedor full-stack especialista em dashboards científicos interativos. [...] Modelo SEIR estendido com compartimentos clínicos, usando método de Euler (passo dt=0.1). [...] Os dois gráficos são barras empilhadas (stacked bar): Exposto=verde, Infectado=laranja, Removido=azul / Fatalidades=verde escuro, Hospitalizados=laranja, Recuperados=azul [...]"*

O prompt completo descreveu toda a estrutura de arquivos, os parâmetros epidemiológicos, o visual desejado e os requisitos técnicos (Chart.js via CDN, MathJax, Google Fonts, reatividade total dos sliders).

### IA utilizada

Este projeto foi desenvolvido integralmente com **[Claude](https://claude.ai)** (Anthropic) — modelo **Claude Sonnet 4**, por meio da interface claude.ai.

---

## 📝 Artigo Científico

Como parte da mesma atividade acadêmica, foi produzido um artigo científico em formato acadêmico formal descrevendo o simulador, o modelo SEIR estendido, a implementação técnica e uma reflexão crítica sobre o uso de IA generativa no ensino de programação no ensino superior.

| Campo | Informação |
|---|---|
| **Título** | Simulação Epidemiológica Interativa com Modelo SEIR Estendido: Uma Experiência de Desenvolvimento Mediado por Inteligência Artificial Generativa e suas Implicações para o Ensino de Programação no Ensino Superior |
| **Autora** | Pollyana Sousa |
| **Arquivo** | [`ARTIGO.md`](./ARTIGO.md) |
| **IA utilizada** | Claude Sonnet 4.6 (Anthropic) — https://claude.ai |

O artigo contém: Resumo, Introdução, Fundamentação Teórica, Implementação, Resultados e Discussão, Reflexão Crítica, Conclusão, Referências e dois apêndices com os prompts utilizados para gerar o simulador e o próprio artigo.

Assim como o simulador, **o artigo não foi escrito manualmente** — foi gerado integralmente por IA a partir de um prompt em linguagem natural, com declaração explícita desse fato no próprio texto.

---

## ⚠️ Aviso

Este simulador tem fins **educacionais e exploratórios**. Os resultados não devem ser utilizados para tomada de decisões clínicas, políticas de saúde pública ou qualquer finalidade diagnóstica sem validação por especialistas em saúde pública e epidemiologia.

---

## 📄 Licença

MIT License — livre para uso, modificação e distribuição com atribuição.