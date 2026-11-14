# SellCar

Loja online de **clássicos e raros carros JDM** (*Japanese Domestic Market*) dos anos 80 e 90. O projeto é o front-end de um catálogo de carros com vídeo, cadastro de cliente, simulador de parcelas e solicitação de contato com o vendedor.

Desenvolvido por **Eduardo França** como projeto integrador de front-end, usando apenas **HTML, CSS e JavaScript puro**, sem frameworks nem bibliotecas.

## Funcionalidades

- **Página inicial** com apresentação da loja e vídeo em destaque.
- **Cadastro** com nome, e-mail e telefone, com validação nativa do navegador (campos obrigatórios e formato de e-mail).
- **Catálogo** com 8 carros divididos em 3 categorias (Cupê, Sedã e Hatch), cada um com **vídeo**, marca, modelo, ano, quilometragem e preço.
- **Simulador de parcelas** em cada carro, de 1x a 24x, com juros compostos a partir de 12x.
- **Confirmação de contato** que mostra o carro e o plano de pagamento escolhidos.
- Layout **responsivo**, do celular ao computador, sem media queries (Flexbox e Grid adaptáveis).

---

## Simulador de parcelas

Cada card do catálogo recebe, via JavaScript, um **controle deslizante** de 1x a 24x logo acima do botão de contato. O valor da parcela e o total são recalculados em tempo real.

### Regras

| Parcelas | Condição |
|---|---|
| 1x a 11x | **Sem juros**: total igual ao preço do carro |
| 12x a 24x | **Com juros compostos**: cada parcela a partir da 12ª multiplica o total por `1 + taxa` |
| acima de 24x | **Não permitido**: o controle vai até 24 e a função de cálculo também limita a 24 |

### Fórmula

```
meses com juros = max(0, parcelas − 11)
fator           = (1 + 0,015) ^ meses com juros
total           = preço × fator
valor da parcela = total ÷ parcelas
```

### Exemplo: carro de R$ 450.000

| Parcelas | Valor da parcela | Total | Juros acumulados |
|---|---|---|---|
| 10x | R$ 45.000,00 | R$ 450.000,00 | sem juros |
| 11x | R$ 40.909,09 | R$ 450.000,00 | sem juros |
| 12x | R$ 38.062,50 | R$ 456.750,00 | +1,5% |
| 18x | R$ 27.746,12 | R$ 499.430,21 | +11,0% |
| 24x | R$ 22.754,11 | R$ 546.098,60 | +21,4% |

### Configuração

As regras ficam no topo de `js/script.js`, em um lugar só:

```js
const MAX_PARCELAS = 24;// limite de parcelas
const INICIO_JUROS = 12;// a partir de Nx cobra juros (use 13 para "12x sem juros")
const TAXA_MENSAL = 0.015;// 1,5% ao mês, composto
const PARCELAS_INICIAIS = 10;// valor em que o seletor começa
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica (`header`, `main`, `section`, `article`, `nav`, `footer`, `form`, `fieldset`) |
| **CSS3** | Variáveis CSS, Flexbox, Grid, `clamp()`, `aspect-ratio`, `object-fit` |
| **JavaScript (ES6+)** | Manipulação do DOM, eventos, `localStorage`, `Intl`/`toLocaleString` |
| **Google Fonts** | Barlow Condensed (títulos) e Inter (texto) |

Sem dependências, sem build e sem instalação.

---

## Como executar

Não há nada para instalar.

1. Clone o repositório:
   ```bash
   git clone https://github.com/ndu-xl/projeto-integrador-frontend-eduardo-franca.git
   ```
2. Entre na pasta e abra o `index.html` no navegador (duplo clique).

## Design

Conceito: **uma garagem japonesa à noite**. Fundo escuro para que o carro seja o protagonista, e um vermelho só, que lembra o sol da bandeira do Japão.

---

## Acessibilidade e responsividade

- `lang="pt-BR"` em todas as páginas e estrutura semântica de títulos (um `h1` por página).
- Todo campo de formulário tem `label` associado, `autocomplete` adequado e `type` correto (`email`, `tel`).
- Os vídeos têm `aria-label` descrevendo o carro.
- Cada botão "Entrar em contato" tem `aria-label` com o nome do carro.
- O resultado do simulador usa `aria-live="polite"`, então leitores de tela anunciam a nova parcela.
- Foco do teclado visível em todos os elementos interativos (`:focus-visible`).
- Contraste de cor alto entre texto e fundo.
- Layout fluido: `flex-wrap` e `grid-template-columns: repeat(auto-fill, minmax(...))` fazem os blocos se reorganizarem de acordo com a largura da tela. Tamanhos em `rem` e títulos com `clamp()`.

---

## Limitações

- **Não há back-end.** O cadastro não é salvo em lugar nenhum: o formulário apenas envia o usuário para o catálogo. Os dados de contato também ficam só no navegador (`localStorage`).
- **O catálogo não é protegido.** Qualquer pessoa pode abrir `pageMain.html` direto, sem se cadastrar.
- **Os dados dos carros são fixos no HTML** e fictícios.
- **Taxa de juros ilustrativa:** 1,5% ao mês foi escolhida para demonstração e não representa uma simulação de financiamento real.
