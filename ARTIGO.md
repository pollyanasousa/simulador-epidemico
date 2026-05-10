# Simulação Epidemiológica Interativa com Modelo SEIR Estendido: Uma Experiência de Desenvolvimento Mediado por Inteligência Artificial Generativa e suas Implicações para o Ensino de Programação no Ensino Superior

**Universidade Federal Rural de Pernambuco (UFRPE)**  
**Curso de Sistemas de Informação**  
**Disciplina: Sustentabilidade em Sistemas de Informação**  

**Autora:** Pollyana Sousa  
**Período:** 1.º semestre — 2025

---

## Resumo

Este artigo descreve o desenvolvimento de um simulador epidemiológico interativo baseado no modelo SEIR estendido (Suscetível–Exposto–Infectado–Removido) com compartimentos clínicos adicionais (Hospitalizados, Fatalidades e Recuperados), implementado integralmente em HTML, CSS e JavaScript puro, sem dependências de back-end. O simulador foi gerado por inteligência artificial generativa — especificamente o modelo Claude Sonnet, da Anthropic — a partir de um único prompt em linguagem natural elaborado por uma estudante do primeiro semestre do curso de Sistemas de Informação da Universidade Federal Rural de Pernambuco (UFRPE), sem conhecimento prévio de programação ou epidemiologia computacional. A integração numérica emprega o método de Euler com passo temporal dt = 0,1 dia, e o sistema expõe 13 parâmetros ajustáveis por meio de sliders interativos, com visualização em tempo real via gráficos de barras empilhadas (Chart.js). O trabalho foi concebido como atividade da disciplina Sustentabilidade em Sistemas de Informação, cujo objetivo declarado pelo docente é evidenciar a insustentabilidade da mera prática de codificação como fim em si mesmo na formação superior. Ao relatar a experiência de produção — tanto do simulador quanto deste próprio artigo — por meio de IA, este texto reflete sobre as implicações pedagógicas, epistemológicas e éticas dessa mediação tecnológica para o ensino de programação no ensino superior, questionando os limites entre autoria, compreensão e competência técnica.

**Palavras-chave:** modelo SEIR; simulação epidemiológica; inteligência artificial generativa; ensino de programação; JavaScript; Chart.js; Euler.

---

## 1. Introdução

A modelagem matemática de doenças infecciosas é uma das ferramentas mais poderosas da epidemiologia moderna. Desde os trabalhos pioneiros de Kermack e McKendrick (1927), os modelos compartimentais — em especial o modelo SIR e suas extensões — têm sido empregados para compreender a dinâmica de transmissão de patógenos, estimar o número reprodutivo básico R₀ e avaliar o impacto de intervenções não farmacológicas (Hethcote, 2000). A pandemia de COVID-19 reacendeu o interesse público e científico nessas ferramentas, tornando simuladores epidemiológicos interativos objetos de grande relevância pedagógica e comunicativa.

Paralelamente, a emergência de modelos de linguagem de grande escala (LLMs), como o GPT-4 da OpenAI e o Claude da Anthropic, tem transformado radicalmente as práticas de desenvolvimento de software. Pesquisas recentes indicam que desenvolvedores assistidos por IA são significativamente mais produtivos em determinadas tarefas (Chen et al., 2021; Vaithilingam et al., 2022), ao mesmo tempo em que surgem questões profundas sobre o papel da compreensão humana no processo de criação técnica.

É nesse contexto que se insere a presente experiência: uma estudante de primeiro semestre de Sistemas de Informação, sem qualquer formação prévia em programação ou epidemiologia, produziu um simulador epidemiológico funcional e publicamente hospedado — e este artigo que o descreve — exclusivamente por meio de prompts em linguagem natural dirigidos ao Claude (Anthropic). A tarefa foi proposta pelo professor da disciplina Sustentabilidade em Sistemas de Informação da UFRPE com objetivo explicitamente provocativo: demonstrar que a capacidade de produzir código não equivale, necessariamente, à competência técnica ou ao entendimento conceitual subjacente.

Este trabalho relata essa experiência e analisa suas implicações, estruturando-se da seguinte maneira: a Seção 2 apresenta a fundamentação teórica do modelo SEIR estendido; a Seção 3 descreve a implementação técnica do simulador; a Seção 4 discute os resultados observáveis; a Seção 5 desenvolve a reflexão crítica sobre IA e ensino; a Seção 6 conclui o artigo; e o Apêndice documenta os prompts utilizados.

---

## 2. Fundamentação Teórica

### 2.1 O Modelo SEIR Clássico

Os modelos compartimentais de doenças infecciosas dividem a população em grupos mutuamente exclusivos segundo o estado epidemiológico de cada indivíduo. O modelo SIR, proposto por Kermack e McKendrick (1927), considera três compartimentos: Suscetíveis (S), Infectados (I) e Removidos (R). O modelo SEIR adiciona o compartimento de Expostos (E), representando indivíduos que foram infectados mas ainda se encontram no período de incubação e não são infecciosos (Hethcote, 2000).

O sistema de equações diferenciais ordinárias (EDOs) do modelo SEIR clássico é dado por:

```
dS/dt = −β · S · I / N
dE/dt =  β · S · I / N − σ · E
dI/dt =  σ · E − γ · I
dR/dt =  γ · I
```

onde N = S + E + I + R é a população total (assumida constante), β é a taxa de transmissão, σ = 1/Tinc é a taxa de progressão da incubação e γ = 1/Tinf é a taxa de remoção infecciosa. O número reprodutivo básico R₀ = β/γ representa o número médio de casos secundários gerados por um único indivíduo infeccioso numa população inteiramente suscetível (Hethcote, 2000).

### 2.2 Extensão com Compartimentos Clínicos

O simulador implementado neste trabalho estende o modelo SEIR com três compartimentos clínicos adicionais: Hospitalizados (H), Fatalidades (F) e Recuperados (Rec). Essa extensão, comum em estudos de COVID-19 e outras doenças com impacto hospitalar significativo (Bertozzi et al., 2020), permite modelar a carga sobre o sistema de saúde e os desfechos clínicos individuais. O sistema completo de EDOs é:

```
dS/dt   = −β · S · I / N
dE/dt   =  β · S · I / N − σ · E
dI/dt   =  σ · E − γ · I
dH/dt   =  τ · γ · I − α · H
dF/dt   =  δ · α · H
dRec/dt = (1 − δ) · α · H + (1 − τ) · γ · I
```

onde τ é a taxa de hospitalização, δ é a letalidade hospitalar (case fatality rate), α = 1/Thosp é a taxa de saída hospitalar e Rₜ = (1 − θ) · R₀ é o número reprodutivo efetivo, modulado pelo parâmetro de redução na transmissão θ (que representa a eficácia de intervenções não farmacológicas).

**Tabela 1. Parâmetros do Simulador Epidemiológico SEIR Estendido.**

| Parâmetro | Intervalo | Padrão | Descrição |
|---|---|---|---|
| N | 1.000 – 1,5 Bi | 1.000.000 | População total |
| I₀ | 1 – 1.000 | 10 | Infectados iniciais |
| T_sim | 2 – 200 dias | 100 | Duração da simulação |
| R₀ | 0,01 – 10 | 2,5 | Número reprodutivo básico |
| θ | 0 – 1 | 0 | Redução na transmissão (NPIs) |
| Tinf | 0,1 – 24 dias | 5,0 | Tempo infeccioso médio |
| Tinc | 0,15 – 24 dias | 5,2 | Período de incubação médio |
| δ | 0 – 100% | 2% | Letalidade (case fatality rate) |
| Tm | 5,8 – 100 dias | 14 | Tempo médio até óbito |
| Tint | 0,1 – 100 dias | 10 | Tempo de internação |
| Trec | 0,1 – 100 dias | 14 | Tempo de recuperação |
| τ | 1 – 100% | 15% | Taxa de hospitalização |
| Thosp | 0,1 – 100 dias | 7 | Tempo de hospitalização |

### 2.3 Integração Numérica pelo Método de Euler

Dado que o sistema de EDOs não possui solução analítica fechada na forma geral, sua resolução é feita numericamente. O simulador emprega o método de Euler explícito, o mais simples dos métodos de integração numérica. Para um sistema genérico dX/dt = f(X, t), a atualização a cada passo é:

```
X(t + dt) = X(t) + f(X, t) · dt
```

com dt = 0,1 dia. Embora o método de Euler seja menos preciso que métodos de ordem superior como Runge-Kutta de quarta ordem (RK4), ele é suficiente para fins exploratórios e pedagógicos quando o passo temporal é suficientemente pequeno. Uma salvaguarda essencial é a restrição de todos os compartimentos a valores não-negativos (`Math.max(0, X)`), evitando inconsistências biológicas.

---

## 3. Implementação

### 3.1 Arquitetura Técnica

O simulador é composto por três arquivos principais, organizados segundo a separação clássica de responsabilidades em desenvolvimento web:

- **`index.html`** — Documento HTML5 que estrutura a interface: duas abas (Início e Sobre o Modelo), dois painéis de controle com sliders, dois elementos canvas para os gráficos e a aba com as equações matemáticas renderizadas por MathJax.
- **`css/style.css`** — Folha de estilos com layout responsivo em três colunas, tipografia profissional via Google Fonts (Lato), cabeçalho em azul escuro (`#1B3A6B`) e sliders customizados que exibem valor mínimo, valor atual e valor máximo simultaneamente.
- **`js/main.js`** — Motor epidemiológico em JavaScript puro: implementação do método de Euler, cálculo dos seis compartimentos, atualização reativa dos dois gráficos Chart.js a cada interação com qualquer slider.

Todas as dependências são carregadas via CDN: Chart.js 4.4.1 (gráficos), MathJax 3.2.2 (renderização de equações LaTeX) e Google Fonts. O projeto não requer servidor web ou instalação de dependências — basta abrir `index.html` em um navegador moderno.

### 3.2 Visualização

O simulador oferece dois gráficos de barras empilhadas atualizados em tempo real:

- **Painel Dinâmica da Transmissão:** exibe, em cada barra (correspondente a um instante de tempo), os compartimentos Exposto (verde), Infectado (laranja) e Removido (azul), permitindo visualizar a evolução temporal da epidemia.
- **Painel Dinâmica Clínica:** exibe Fatalidades (verde escuro), Hospitalizados (laranja) e Recuperados (azul), permitindo avaliar a carga hospitalar e os desfechos clínicos ao longo do tempo.

Ambos os gráficos são interativos: ao passar o cursor sobre qualquer barra, um tooltip exibe os valores exatos de cada compartimento naquele instante. A reatividade é total — qualquer alteração em qualquer slider recalcula toda a simulação e re-renderiza ambos os gráficos imediatamente.

### 3.3 Processo de Desenvolvimento Mediado por IA

O simulador foi gerado integralmente por um único prompt em linguagem natural enviado ao Claude Sonnet (Anthropic) pela autora, disponível na íntegra no Apêndice A deste artigo. O prompt especificou, em português, a estrutura de arquivos desejada, todos os parâmetros epidemiológicos, os requisitos visuais e as bibliotecas a serem utilizadas. A IA entregou os arquivos sequencialmente, aguardando confirmação entre cada entrega.

Nenhuma linha de código foi escrita manualmente pela autora. Igualmente, este artigo foi redigido integralmente por meio de prompt dirigido ao mesmo modelo de IA (ver Apêndice B), com base nos arquivos do projeto e nas instruções do docente.

---

## 4. Resultados e Discussão

### 4.1 Funcionalidade do Simulador

O simulador produzido encontra-se publicamente acessível em https://pollyanasousa.github.io/simulador-epidemico/ e funciona conforme especificado. A partir dos parâmetros padrão (N = 1.000.000, I₀ = 10, R₀ = 2,5, Tinf = 5 dias, Tinc = 5,2 dias, T_sim = 100 dias, δ = 2%, τ = 15%, Thosp = 7 dias), o gráfico de transmissão exibe a curva epidêmica característica do modelo SEIR: crescimento exponencial inicial, pico e declínio, com a curva de Expostos precedendo a de Infectados. O gráfico clínico mostra o correspondente pico de hospitalizações e a acumulação de fatalidades e recuperados.

A reatividade dos sliders é satisfatória: ao aumentar R₀ para 4,0, o pico epidêmico ocorre mais cedo e é mais pronunciado; ao aumentar θ (redução na transmissão) para 0,5, o Rₜ efetivo cai para 2,0 e a curva achatada ilustra visualmente o efeito das intervenções não farmacológicas — fenômeno amplamente comunicado durante a pandemia de COVID-19 como o "achatamento da curva".

### 4.2 Limitações do Modelo

O simulador, embora funcional e pedagogicamente valioso, apresenta limitações intrínsecas ao modelo SEIR clássico e à sua implementação específica. Em primeiro lugar, assume população fechada e homogeneamente misturada, desconsiderando heterogeneidades espaciais, etárias e comportamentais relevantes na transmissão real de doenças (Bertozzi et al., 2020). Em segundo lugar, o método de Euler com dt = 0,1 pode produzir instabilidades numéricas em combinações extremas de parâmetros — especialmente taxas muito altas e populações muito grandes — embora a salvaguarda `Math.max(0, X)` mitigue inconsistências biológicas. Em terceiro lugar, os parâmetros do modelo são constantes ao longo do tempo, sem capacidade de modelar dinâmicas de intervenção variável ou heterogeneidade de contatos.

Essas limitações são esperadas e aceitáveis para um simulador de propósito pedagógico e exploratório. A autora, contudo, não as identificou de forma autônoma: foram detectadas apenas após análise subsequente do código e da literatura, mediada novamente pela IA.

---

## 5. Reflexão Crítica

### 5.1 IA Generativa como Ferramenta de Desenvolvimento

A experiência relatada neste artigo é, em si mesma, um experimento sobre os limites e possibilidades da inteligência artificial generativa como mediadora do desenvolvimento de software. Chen et al. (2021) demonstraram que modelos de linguagem treinados em código são capazes de resolver problemas de programação de nível competitivo, e Vaithilingam et al. (2022) mostraram que ferramentas de autocompletar baseadas em IA aumentam significativamente a velocidade de desenvolvimento — mas não necessariamente a compreensão do código produzido. A presente experiência radicaliza esse fenômeno: não há sequer o autocompletar. O código emerge diretamente de uma descrição em linguagem natural.

O que se observa, portanto, é uma dissociação quase completa entre produção e compreensão. A autora foi capaz de especificar, em linguagem natural, o que desejava — mas não é capaz de explicar, sem auxílio, por que o código funciona, o que cada linha faz, ou quais são as consequências de modificar um parâmetro fora dos intervalos esperados. Essa dissociação não é necessariamente problemática em todos os contextos: um epidemiologista especialista que usa a IA para implementar um modelo que domina conceitualmente está em posição epistemicamente distinta de uma estudante de primeiro semestre que usa a IA para produzir algo que não compreende. A ferramenta é a mesma; a relação com o conhecimento é radicalmente diferente.

### 5.2 Implicações para o Ensino de Programação

O objetivo declarado pelo professor desta disciplina é provocar exatamente essa reflexão. Ao propor que um estudante de primeiro semestre, sem conhecimento prévio, produza e hospede um sistema funcional e relativamente complexo por meio de IA, a atividade evidencia uma tensão central no ensino contemporâneo de computação: se qualquer pessoa pode produzir código funcional com um prompt, o que justifica anos de formação técnica?

A resposta mais imediata — e mais conservadora — é que a formação técnica desenvolve a capacidade de compreender, depurar, adaptar e criticar o código produzido. Um estudante treinado não apenas produz código: entende por que ele funciona, identifica quando e por que falha, e é capaz de modificá-lo de forma intencional. A IA, nessa perspectiva, é uma ferramenta poderosa nas mãos de quem já tem o substrato conceitual — e uma ilusão de competência nas mãos de quem não o tem.

Uma perspectiva mais radical, defendida por alguns pesquisadores em educação em computação, é que a emergência das ferramentas de IA exige uma reformulação dos objetivos de aprendizagem. Se a sintaxe e a implementação podem ser delegadas à máquina, o ensino deveria concentrar-se na especificação, na avaliação crítica e na verificação dos outputs — competências que, paradoxalmente, exigem um entendimento profundo dos domínios de aplicação, não apenas da programação em si (Wing, 2006). Nessa leitura, a atividade proposta pelo professor é não apenas um experimento crítico, mas um antecipador de um novo paradigma de competência técnica.

### 5.3 A Questão da Autoria e da Ética Acadêmica

Este artigo coloca em relevo uma questão adicional: o que significa autoria quando tanto o objeto de estudo (o simulador) quanto o texto que o descreve foram produzidos por IA? A autora contribuiu com a concepção, a especificação e o julgamento sobre o que era adequado ao contexto acadêmico — mas não com a implementação técnica nem com a erudição disciplinar. Essa forma de autoria é análoga à do engenheiro que especifica um sistema para sua equipe, ou do arquiteto que projeta sem executar a obra. Ela é, contudo, qualitativamente distinta da autoria esperada em trabalhos acadêmicos tradicionais.

O fato de que esta experiência é declarada explicitamente — tanto no README do projeto quanto neste artigo e em seu apêndice — distingue-a do uso não declarado de IA, que levanta questões éticas mais sérias. A transparência é, aqui, não apenas um valor acadêmico, mas o próprio conteúdo pedagógico da atividade: o ponto não é fingir que o código foi escrito manualmente, mas examinar o que significa o fato de que não o foi.

---

## 6. Conclusão

Este trabalho relatou o desenvolvimento de um simulador epidemiológico interativo baseado no modelo SEIR estendido, produzido integralmente por inteligência artificial generativa a partir de um prompt em linguagem natural elaborado por uma estudante de primeiro semestre de Sistemas de Informação. O simulador é funcional, publicamente hospedado e cobre adequadamente os objetivos pedagógicos para os quais foi proposto.

A experiência evidencia três achados principais. Primeiro, modelos de linguagem de grande escala são capazes de produzir código funcional e relativamente sofisticado a partir de descrições em linguagem natural, mesmo em domínios técnicos especializados como epidemiologia computacional. Segundo, essa capacidade de produção não transfere, por si só, compreensão ao usuário — a dissociação entre produção e entendimento é real e pedagogicamente significativa. Terceiro, essa dissociação não invalida necessariamente o uso de IA no ensino; ao contrário, quando utilizada de forma transparente e reflexiva, ela pode ser o objeto da aprendizagem, não apenas um meio para outros fins.

As implicações para o ensino de programação no ensino superior são profundas e ainda amplamente abertas. O que se pode afirmar com segurança é que a capacidade de produzir código — que sempre foi apenas um meio para outros fins — tornou-se ainda menos o foco adequado da formação técnica de nível superior. O que deve estar no centro é a capacidade de compreender problemas, especificá-los com precisão, avaliar criticamente soluções e situá-las em seus contextos éticos, sociais e epistêmicos. Essas são competências que a IA, por ora, não substitui.

Que este artigo tenha sido ele mesmo produzido por IA — a pedido explícito da autora e com declaração pública desse fato — é a ilustração mais direta dessa reflexão.

---

## Referências

BERTOZZI, A. L. et al. **The challenges of modeling and forecasting the spread of COVID-19.** *Proceedings of the National Academy of Sciences,* v. 117, n. 29, p. 16732–16738, 2020. DOI: 10.1073/pnas.2006520117.

CHEN, M. et al. **Evaluating large language models trained on code.** *arXiv preprint,* arXiv:2107.03374, 2021. Disponível em: https://arxiv.org/abs/2107.03374.

HETHCOTE, H. W. **The mathematics of infectious diseases.** *SIAM Review,* v. 42, n. 4, p. 599–653, 2000. DOI: 10.1137/S0036144500371907.

KERMACK, W. O.; McKENDRICK, A. G. **A contribution to the mathematical theory of epidemics.** *Proceedings of the Royal Society of London. Series A,* v. 115, n. 772, p. 700–721, 1927. DOI: 10.1098/rspa.1927.0118.

VAITHILINGAM, P. et al. **Expectation vs. experience: evaluating the usability of code generation tools powered by large language models.** In: *CHI Conference on Human Factors in Computing Systems Extended Abstracts,* 2022, New Orleans. Anais... New York: ACM, 2022. DOI: 10.1145/3491101.3519665.

WING, J. M. **Computational thinking.** *Communications of the ACM,* v. 49, n. 3, p. 33–35, 2006. DOI: 10.1145/1118178.1118215.

---

## Apêndice A — Prompt Utilizado para Gerar o Simulador

O prompt abaixo foi enviado, de uma única vez e sem alterações, ao Claude Sonnet (Anthropic) pela autora, em maio de 2025, por meio da interface claude.ai:

---

> *"Você é um epidemiologista computacional sênior e desenvolvedor full-stack especialista em dashboards científicos interativos. Antes de escrever qualquer código, me diga:*
>
> *1. A estrutura completa de pastas e arquivos do projeto [...]*
> *2. Para cada arquivo, explique em uma linha o que ele faz. Depois, um arquivo por vez, aguardando eu digitar 'próximo' para avançar, me entregue o código completo de cada arquivo na seguinte ordem:*
>
> *Arquivo 1 — index.html: Página principal com duas abas [...] Arquivo 2 — css/style.css: Visual limpo e científico [...] Arquivo 3 — js/main.js: Todo o cálculo epidemiológico em JavaScript puro. Modelo SEIR estendido com compartimentos clínicos, usando método de Euler (passo dt=0.1). Parâmetros: população (1.000 a 1.500.000.000), infectados iniciais (1 a 1.000), R₀ (0,01 a 10), tempo de simulação (2 a 200 dias), redução na transmissão θ (0 a 1), Tinf (0 a 24 dias), Tinc (0,15 a 24 dias), letalidade δ (0 a 100%), Tm (5,8 a 100 dias), Tint (0,1 a 100 dias), Trec (0,1 a 100 dias), taxa hospitalização τ (1 a 100%), Thosp (0,1 a 100 dias). Rt = (1-θ) × R₀. Os dois gráficos Chart.js atualizam em tempo real ao mover qualquer slider. Garantir Math.max(0, valor) em todos os compartimentos. Arquivo 4 — README.md: Documentação do projeto. [...]"*

---

O prompt integral está disponível no arquivo [`PROMPT.md`](./PROMPT.md) do repositório.

**IA utilizada:** Claude Sonnet (Anthropic) — https://claude.ai

---

## Apêndice B — Prompt Utilizado para Gerar Este Artigo

Este artigo foi gerado por meio do seguinte prompt enviado ao Claude Sonnet (Anthropic), acompanhado dos arquivos do projeto (`main.js`, `index.html`, `README.md` e `PROMPT.md`):

---

> *"Você é um epidemiologista computacional sênior e especialista em escrita científica acadêmica. Escreva um artigo científico completo em português (Brasil), em formato acadêmico formal, com as seguintes seções: Resumo (com palavras-chave), Introdução, Fundamentação Teórica, Implementação, Resultados e Discussão, Reflexão Crítica, Conclusão e Referências. O artigo deve explicar um simulador epidemiológico interativo baseado no modelo SEIR estendido [...] implementado em HTML, CSS e JavaScript puro com integração numérica pelo método de Euler (dt = 0,1 dia), com 13 parâmetros ajustáveis por sliders interativos e gráficos de barras empilhadas em tempo real via Chart.js. O artigo é uma atividade acadêmica da disciplina Sustentabilidade em Sistemas de Informação da Universidade Federal Rural de Pernambuco (UFRPE), curso de Sistemas de Informação, 1º período. A autora é Pollyana Sousa, estudante do 1º semestre sem conhecimento prévio de programação. O simulador está disponível publicamente em: https://pollyanasousa.github.io/simulador-epidemico/ [...] Inclua um apêndice com este prompt exato e a IA utilizada."*

---

**IA utilizada:** Claude Sonnet 4.6 (Anthropic) — https://claude.ai  
**Data:** maio de 2025