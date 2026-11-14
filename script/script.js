/* 1. CONFIGURAÇÃO: mude as regras aqui, em um lugar só */
const MAX_PARCELAS = 24;          // limite de parcelas
const INICIO_JUROS = 12;          // a partir de Nx cobra juros (troque por 13 para "12x sem juros")
const TAXA_MENSAL = 0.015;        // 1,5% ao mês, multiplicando a cada parcela extra
const PARCELAS_INICIAIS = 10;     // valor em que o seletor começa
const CHAVE_PEDIDO = 'sellcar_pedido';

/* 2. FUNÇÕES */
function formatarReais(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarPorcentagem(valor) {
  return valor.toFixed(1).replace('.', ',') + '%';
}

// Recebe o preço e o número de parcelas e devolve tudo calculado.
// Juros compostos: cada parcela a partir de INICIO_JUROS multiplica o total por (1 + taxa).
function calcularParcelamento(preco, parcelas) {
  const n = Math.min(Math.max(Math.round(parcelas), 1), MAX_PARCELAS);
  const mesesComJuros = Math.max(0, n - (INICIO_JUROS - 1));
  const fator = Math.pow(1 + TAXA_MENSAL, mesesComJuros);
  const total = preco * fator;

  return {
    parcelas: n,
    fator: fator,
    total: total,
    valorParcela: total / n,
    temJuros: mesesComJuros > 0,
    jurosAcumulados: (fator - 1) * 100
  };
}

function textoTotal(r) {
  if (!r.temJuros) {
    return 'Total ' + formatarReais(r.total) + ', sem juros';
  }
  return 'Total ' + formatarReais(r.total) + ' (+' + formatarPorcentagem(r.jurosAcumulados) + ' de juros)';
}

/* 3. CATÁLOGO */
function criarParcelamento(carro, indice) {
  const precoEl = carro.querySelector('.preco');
  const rodape = carro.querySelector('.carro_rodape');
  const botao = carro.querySelector('.btn');
  if (!precoEl || !rodape || !botao) return;

  const preco = Number(precoEl.textContent.replace(/\D/g, ''));   // "R$ 450.000" vira 450000
  const nomeCarro = carro.querySelector('.carro_marca').textContent + ' ' + carro.querySelector('h3').textContent;
  const idCampo = 'parcelas-' + indice;

  const bloco = document.createElement('div');
  bloco.className = 'parcelas';
  bloco.innerHTML =
    '<label for="' + idCampo + '">Parcelar em <output for="' + idCampo + '"></output></label>' +
    '<input type="range" id="' + idCampo + '" min="1" max="' + MAX_PARCELAS + '" step="1" value="' + PARCELAS_INICIAIS + '">' +
    '<p class="parcelas_valor" aria-live="polite"></p>' +
    '<p class="parcelas_aviso"></p>';
  rodape.before(bloco);

  const campo = bloco.querySelector('input');
  const saida = bloco.querySelector('output');
  const valor = bloco.querySelector('.parcelas_valor');
  const aviso = bloco.querySelector('.parcelas_aviso');

  function atualizar() {
    const r = calcularParcelamento(preco, Number(campo.value));
    saida.textContent = r.parcelas + 'x';
    valor.textContent = r.parcelas + 'x de ' + formatarReais(r.valorParcela);
    aviso.textContent = textoTotal(r);
    aviso.classList.toggle('parcelas_aviso--juros', r.temJuros);
  }

  campo.addEventListener('input', atualizar);
  atualizar();

  // ao clicar em "Entrar em contato", guarda a escolha para a próxima página
  botao.addEventListener('click', function () {
    const r = calcularParcelamento(preco, Number(campo.value));
    const pedido = {
      carro: nomeCarro,
      parcelas: r.parcelas,
      valorParcela: r.valorParcela,
      total: r.total,
      temJuros: r.temJuros,
      jurosAcumulados: r.jurosAcumulados
    };
    try {
      localStorage.setItem(CHAVE_PEDIDO, JSON.stringify(pedido));
    } catch (erro) {
      /* sem armazenamento: o link continua funcionando normalmente */
    }
  });
}

document.querySelectorAll('.carro').forEach(criarParcelamento);

/* 4. CONTATO */
const confirmacao = document.querySelector('.confirmacao');

if (confirmacao) {
  let pedido = null;
  try {
    pedido = JSON.parse(localStorage.getItem(CHAVE_PEDIDO));
  } catch (erro) {
    pedido = null;
  }

  const valido = pedido && typeof pedido.carro === 'string' &&
    Number.isFinite(pedido.parcelas) && Number.isFinite(pedido.valorParcela) && Number.isFinite(pedido.total);

  if (valido) {
    const caixa = document.createElement('div');
    caixa.className = 'resumo';

    const titulo = document.createElement('p');
    titulo.className = 'resumo_carro';
    titulo.textContent = pedido.carro;

    const linhaParcelas = document.createElement('p');
    linhaParcelas.textContent = pedido.parcelas + 'x de ' + formatarReais(pedido.valorParcela);

    const linhaTotal = document.createElement('p');
    linhaTotal.className = 'resumo_total';
    linhaTotal.textContent = pedido.temJuros
      ? 'Total ' + formatarReais(pedido.total) + ' (+' + formatarPorcentagem(Number(pedido.jurosAcumulados)) + ' de juros)'
      : 'Total ' + formatarReais(pedido.total) + ', sem juros';

    caixa.append(titulo, linhaParcelas, linhaTotal);
    confirmacao.querySelector('.acoes').before(caixa);
  }
}
