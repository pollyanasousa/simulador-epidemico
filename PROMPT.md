# Prompt Utilizado para Geração deste Projeto

## Metadados

| Campo | Valor |
|---|---|
| **IA utilizada** | Claude (Anthropic) — modelo Claude Sonnet 4.6 |
| **Interface** | claude.ai |
| **Data** | maio de 2025 |
| **Idioma do prompt** | Português (pt-BR) |

---

## Prompt Completo (literal, sem alterações)

> Você é um epidemiologista computacional sênior e desenvolvedor full-stack especialista em dashboards científicos interativos. Antes de escrever qualquer código, me diga:
>
> 1. A estrutura completa de pastas e arquivos do projeto, assim:
>
> ```
> simulador-epidemico/
> ├── index.html
> ├── css/
> │   └── style.css
> ├── js/
> │   └── main.js
> └── README.md
> ```
>
> 1. Para cada arquivo, explique em uma linha o que ele faz. Depois, um arquivo por vez, aguardando eu digitar "próximo" para avançar, me entregue o código completo de cada arquivo na seguinte ordem:
>
> **Arquivo 1 — index.html:** Página principal com duas abas: "Início" e "Sobre o modelo". A aba Início contém dois painéis: "Dinâmica da Transmissão" (com sliders de parâmetros populacionais e R₀ + gráfico de barras empilhadas com Exposto/Infectado/Removido) e "Dinâmica Clínica" (com sliders de mortalidade, recuperação e assistência + gráfico de barras empilhadas com Fatalidades/Hospitalizados/Recuperados). A aba "Sobre o modelo" exibe as equações diferenciais do modelo SEIR renderizadas com MathJax e a lista de parâmetros.
>
> **Arquivo 2 — css/style.css:** Visual limpo e científico. Header azul escuro (`#1B3A6B`) com texto branco. Sliders estilizados em azul mostrando valor mínimo à esquerda, valor atual destacado no centro e valor máximo à direita. Layout em 3 colunas responsivo. Tipografia profissional com Google Fonts (Lato). Fundo branco. Rodapé discreto.
>
> **Arquivo 3 — js/main.js:** Todo o cálculo epidemiológico em JavaScript puro. Modelo SEIR estendido com compartimentos clínicos, usando método de Euler (passo dt=0.1). Parâmetros: população (1.000 a 1.500.000.000), infectados iniciais (1 a 1.000), R₀ (0,01 a 10), tempo de simulação (2 a 200 dias), redução na transmissão θ (0 a 1), Tinf (0 a 24 dias), Tinc (0,15 a 24 dias), letalidade δ (0 a 100%), Tm (5,8 a 100 dias), Tint (0,1 a 100 dias), Trec (0,1 a 100 dias), taxa hospitalização τ (1 a 100%), Thosp (0,1 a 100 dias). Rt = (1-θ) × R₀. Os dois gráficos Chart.js atualizam em tempo real ao mover qualquer slider. Garantir Math.max(0, valor) em todos os compartimentos.
>
> **Arquivo 4 — README.md:** Documentação do projeto explicando: o que é o simulador, o modelo SEIR utilizado, como rodar localmente (abrir index.html no navegador), o prompt utilizado para criar o projeto e a IA utilizada (Claude).
>
> **Requisitos gerais:**
> - Referenciar o CSS e JS corretamente no index.html com caminhos relativos
> - Gráficos com Chart.js via CDN (cdnjs.cloudflare.com)
> - Equações matemáticas com MathJax via CDN
> - Google Fonts via CDN
> - Os dois gráficos são barras empilhadas (stacked bar): Exposto=verde, Infectado=laranja, Removido=azul / Fatalidades=verde escuro, Hospitalizados=laranja, Recuperados=azul
> - Tooltip interativo ao passar o mouse nos gráficos
> - Reatividade total: qualquer slider recalcula tudo imediatamente
>
> Comece pela estrutura de pastas. Aguarde eu digitar "próximo" para entregar o primeiro arquivo.

---

## Como a Interação Ocorreu

O prompt acima foi enviado de uma única vez ao Claude. A IA respondeu com a estrutura de pastas e aguardou comandos sequenciais. Para cada arquivo, o usuário digitou **"próximo"** e o Claude entregou o código completo do arquivo seguinte, na ordem:

1. `index.html` — após digitar "próximo" (1ª vez)
2. `css/style.css` — após digitar "próximo" (2ª vez)
3. `js/main.js` — após digitar "próximo" (3ª vez)
4. `README.md` — após digitar "próximo" (4ª vez)
5. `PROMPT.md` — este arquivo, gerado após o usuário informar o prompt completo ao Claude e pedir sua documentação explícita

**Nenhuma linha de código foi escrita manualmente pelo usuário.**  
Todo o conteúdo técnico foi gerado pela IA a partir da descrição em linguagem natural acima.