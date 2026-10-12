// =====================================================
// 1. DADOS E LOCALSTORAGE
// =====================================================

// Chaves usadas no localStorage
const CHAVES = {
  produtos: 'bar_produtos',
  carrinho: 'bar_carrinho',
  fiados: 'bar_fiados',
  vendas: 'bar_vendas'
};

// Cardápio inicial (só é usado na primeira vez que o sistema abre)
const produtosPadrao = [
  { id: 1,  categoria: 'Cervejas',    nome: 'Cerveja Pilsen 600ml',   preco: 12.00 },
  { id: 2,  categoria: 'Porções',     nome: 'Porção de Fritas',       preco: 25.00 },
  { id: 3,  categoria: 'Cervejas',    nome: 'Cerveja Long Neck',      preco: 8.50 },
  { id: 4,  categoria: 'Cervejas',    nome: 'Chopp 400ml',            preco: 9.00 },
  { id: 5,  categoria: 'Cervejas',    nome: 'Cerveja Artesanal IPA',  preco: 18.00 },
  { id: 6,  categoria: 'Porções',     nome: 'Calabresa Acebolada',    preco: 32.00 },
  { id: 7,  categoria: 'Porções',     nome: 'Isca de Peixe',          preco: 38.00 },
  { id: 8,  categoria: 'Porções',     nome: 'Pastel (6 unidades)',    preco: 22.00 },
  { id: 9,  categoria: 'Drinks',      nome: 'Caipirinha',             preco: 16.00 },
  { id: 10, categoria: 'Drinks',      nome: 'Gin Tônica',             preco: 22.00 },
  { id: 11, categoria: 'Drinks',      nome: 'Batida de Maracujá',     preco: 18.00 },
  { id: 12, categoria: 'Sem álcool',  nome: 'Refrigerante Lata',      preco: 6.00 },
  { id: 13, categoria: 'Sem álcool',  nome: 'Água Mineral',           preco: 4.00 }
];

// Lê um valor do localStorage (ou devolve o padrão se não existir / der erro)
function lerStorage(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto ? JSON.parse(texto) : padrao;
  } catch (erro) {
    console.error('Erro ao ler o localStorage:', erro);
    return padrao;
  }
}

// Salva um valor no localStorage
function salvarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.error('Erro ao salvar no localStorage:', erro);
  }
}

// Estado do sistema (carregado do localStorage)
let produtos = lerStorage(CHAVES.produtos, null);
if (!Array.isArray(produtos) || produtos.length === 0) {
  produtos = produtosPadrao;
  salvarStorage(CHAVES.produtos, produtos);
}

// carrinho: [{ id, quantidade }]  (mantém só itens que ainda existem no cardápio)
let carrinho = lerStorage(CHAVES.carrinho, []).filter((item) =>
  produtos.some((produto) => produto.id === item.id)
);

// clientesFiado: [{ nome, saldoDevedor }]
let clientesFiado = lerStorage(CHAVES.fiados, []);

// vendas: histórico de vendas registradas
let vendas = lerStorage(CHAVES.vendas, []);


// =====================================================
// 2. FUNÇÕES AUXILIARES
// =====================================================

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatarMoeda(valor) {
  return formatadorMoeda.format(valor);
}

// Evita erros de centavos do JavaScript (ex.: 0.1 + 0.2)
function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function buscarProduto(id) {
  return produtos.find((produto) => produto.id === id);
}

function calcularTotal() {
  const soma = carrinho.reduce((total, item) => {
    const produto = buscarProduto(item.id);
    return total + produto.preco * item.quantidade;
  }, 0);
  return arredondar(soma);
}

function calcularTotalFiado() {
  const soma = clientesFiado.reduce((total, cliente) => total + cliente.saldoDevedor, 0);
  return arredondar(soma);
}

// Elementos da página
const elCardapio = document.getElementById('cardapio');
const elListaComanda = document.getElementById('lista-comanda');
const elTotalComanda = document.getElementById('total-comanda');
const elTotalBarra = document.getElementById('total-barra');
const elBtnFechar = document.getElementById('btn-fechar');
const elTotalFiado = document.getElementById('total-fiado');

const elModalFechamento = document.getElementById('modal-fechamento');
const elTotalFechamento = document.getElementById('total-fechamento');
const elOpcoes = document.getElementById('opcoes-pagamento');
const elFormFiado = document.getElementById('form-fiado');
const elNomeCliente = document.getElementById('nome-cliente');
const elListaClientes = document.getElementById('lista-clientes');

const elModalCaderneta = document.getElementById('modal-caderneta');
const elListaFiados = document.getElementById('lista-fiados');
const elTotalAberto = document.getElementById('total-aberto');


// =====================================================
// 3. CARDÁPIO
// =====================================================

function renderizarCardapio() {
  elCardapio.innerHTML = '';

  // Descobre as categorias na ordem em que aparecem
  const categorias = [];
  for (const produto of produtos) {
    if (!categorias.includes(produto.categoria)) {
      categorias.push(produto.categoria);
    }
  }

  for (const categoria of categorias) {
    const secao = document.createElement('section');
    secao.classList.add('categoria');

    const titulo = document.createElement('h3');
    titulo.textContent = categoria;

    const grade = document.createElement('div');
    grade.classList.add('produtos');

    const daCategoria = produtos.filter((produto) => produto.categoria === categoria);

    for (const produto of daCategoria) {
      const { id, nome, preco } = produto;

      const cartao = document.createElement('article');
      cartao.classList.add('produto');

      const info = document.createElement('div');

      const nomeEl = document.createElement('h4');
      nomeEl.classList.add('produto__nome');
      nomeEl.textContent = nome;

      const precoEl = document.createElement('p');
      precoEl.classList.add('produto__preco');
      precoEl.textContent = formatarMoeda(preco);

      info.append(nomeEl, precoEl);

      const botao = document.createElement('button');
      botao.type = 'button';
      botao.classList.add('btn', 'btn--principal');
      botao.textContent = 'Adicionar';
      botao.setAttribute('aria-label', `Adicionar ${nome} à comanda`);
      botao.addEventListener('click', () => adicionarAoCarrinho(id));

      cartao.append(info, botao);
      grade.appendChild(cartao);
    }

    secao.append(titulo, grade);
    elCardapio.appendChild(secao);
  }
}


// =====================================================
// 4. CARRINHO / COMANDA
// =====================================================

function salvarCarrinho() {
  salvarStorage(CHAVES.carrinho, carrinho);
}

function adicionarAoCarrinho(id) {
  const existente = carrinho.find((item) => item.id === id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ id, quantidade: 1 });
  }

  salvarCarrinho();
  renderizarComanda();
}

// delta = +1 ou -1. Se a quantidade chegar a zero, o item sai da comanda.
function alterarQuantidade(id, delta) {
  const item = carrinho.find((i) => i.id === id);
  if (!item) return;

  item.quantidade += delta;

  if (item.quantidade <= 0) {
    removerDoCarrinho(id);
    return;
  }

  salvarCarrinho();
  renderizarComanda();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter((item) => item.id !== id);
  salvarCarrinho();
  renderizarComanda();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderizarComanda();
}

function criarBotaoMini(texto, rotulo, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.classList.add('mini');
  botao.textContent = texto;
  botao.setAttribute('aria-label', rotulo);
  botao.addEventListener('click', aoClicar);
  return botao;
}

function renderizarComanda() {
  elListaComanda.innerHTML = '';

  if (carrinho.length === 0) {
    const vazio = document.createElement('li');
    vazio.classList.add('comanda__vazio');
    vazio.textContent = 'Nenhum item ainda. Toque em "Adicionar" no cardápio.';
    elListaComanda.appendChild(vazio);
  }

  for (const { id, quantidade } of carrinho) {
    const produto = buscarProduto(id);

    const linha = document.createElement('li');
    linha.classList.add('item');

    const nome = document.createElement('span');
    nome.classList.add('item__nome');
    nome.textContent = produto.nome;

    const subtotal = document.createElement('span');
    subtotal.classList.add('item__subtotal');
    subtotal.textContent = formatarMoeda(produto.preco * quantidade);

    const controles = document.createElement('div');
    controles.classList.add('item__controles');

    const menos = criarBotaoMini('−', `Diminuir ${produto.nome}`, () => alterarQuantidade(id, -1));

    const qtd = document.createElement('span');
    qtd.classList.add('item__qtd');
    qtd.textContent = quantidade;

    const mais = criarBotaoMini('+', `Aumentar ${produto.nome}`, () => alterarQuantidade(id, 1));

    const remover = criarBotaoMini('Remover', `Remover ${produto.nome} da comanda`, () => removerDoCarrinho(id));
    remover.classList.add('mini--remover');

    controles.append(menos, qtd, mais, remover);
    linha.append(nome, subtotal, controles);
    elListaComanda.appendChild(linha);
  }

  const total = formatarMoeda(calcularTotal());
  elTotalComanda.textContent = total;
  elTotalBarra.textContent = total;
  elBtnFechar.disabled = carrinho.length === 0;
}


// =====================================================
// 5. FECHAMENTO DO PEDIDO
// =====================================================

function abrirFechamento() {
  if (carrinho.length === 0) return;

  elTotalFechamento.textContent = formatarMoeda(calcularTotal());
  elOpcoes.hidden = false;
  elFormFiado.hidden = true;
  elFormFiado.reset();
  atualizarListaClientes();

  elModalFechamento.showModal();
}

// Registra a venda no histórico (localStorage)
function registrarVenda(forma, cliente) {
  const venda = {
    data: new Date().toISOString(),
    forma,
    cliente: cliente || null,
    total: calcularTotal(),
    itens: carrinho.map(({ id, quantidade }) => {
      const { nome, preco } = buscarProduto(id);
      return { nome, preco, quantidade };
    })
  };

  vendas.push(venda);
  salvarStorage(CHAVES.vendas, vendas);
}

function pagarAgora() {
  const total = formatarMoeda(calcularTotal());

  registrarVenda('imediato');
  limparCarrinho();
  elModalFechamento.close();

  alert(`Pagamento registrado com sucesso! Total: ${total}`);
}

function mostrarCampoFiado() {
  elOpcoes.hidden = true;
  elFormFiado.hidden = false;
  elNomeCliente.focus();
}

function deixarFiado(evento) {
  evento.preventDefault();

  const nome = elNomeCliente.value.trim();
  if (nome === '') {
    elNomeCliente.focus();
    return;
  }

  const total = calcularTotal();

  // Procura o cliente na caderneta (sem diferenciar maiúsculas de minúsculas)
  const cliente = clientesFiado.find(
    (c) => c.nome.toLowerCase() === nome.toLowerCase()
  );

  if (cliente) {
    cliente.saldoDevedor = arredondar(cliente.saldoDevedor + total);
  } else {
    clientesFiado.push({ nome, saldoDevedor: total });
  }

  salvarStorage(CHAVES.fiados, clientesFiado);
  registrarVenda('fiado', nome);
  limparCarrinho();
  elModalFechamento.close();
  renderizarFiados();

  alert(`${formatarMoeda(total)} anotados na caderneta de ${nome}.`);
}

// Sugere nomes de clientes que já devem no bar
function atualizarListaClientes() {
  elListaClientes.innerHTML = '';
  for (const { nome } of clientesFiado) {
    const opcao = document.createElement('option');
    opcao.value = nome;
    elListaClientes.appendChild(opcao);
  }
}


// =====================================================
// 6. CADERNETA DE FIADOS
// =====================================================

function renderizarFiados() {
  elListaFiados.innerHTML = '';

  if (clientesFiado.length === 0) {
    const vazio = document.createElement('li');
    vazio.classList.add('fiados__vazio');
    vazio.textContent = 'Ninguém está devendo no momento.';
    elListaFiados.appendChild(vazio);
  }

  for (const cliente of clientesFiado) {
    const { nome, saldoDevedor } = cliente;

    const linha = document.createElement('li');
    linha.classList.add('fiado');

    const nomeEl = document.createElement('span');
    nomeEl.classList.add('fiado__nome');
    nomeEl.textContent = nome;

    const valorEl = document.createElement('span');
    valorEl.classList.add('fiado__valor');
    valorEl.textContent = formatarMoeda(saldoDevedor);

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.classList.add('btn', 'btn--contorno');
    botao.textContent = 'Quitar Dívida';
    botao.setAttribute('aria-label', `Quitar dívida de ${nome}`);
    botao.addEventListener('click', () => quitarDivida(cliente));

    linha.append(nomeEl, valorEl, botao);
    elListaFiados.appendChild(linha);
  }

  const total = formatarMoeda(calcularTotalFiado());
  elTotalAberto.textContent = total;
  elTotalFiado.textContent = total;
}

function quitarDivida(cliente) {
  const confirmou = confirm(
    `Quitar a dívida de ${cliente.nome} (${formatarMoeda(cliente.saldoDevedor)})?`
  );
  if (!confirmou) return;

  // Zerou a conta: o cliente sai da caderneta
  clientesFiado = clientesFiado.filter((c) => c !== cliente);
  salvarStorage(CHAVES.fiados, clientesFiado);
  renderizarFiados();
}


// =====================================================
// 7. INICIALIZAÇÃO
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  renderizarCardapio();
  renderizarComanda();
  renderizarFiados();

  elBtnFechar.addEventListener('click', abrirFechamento);
  document.getElementById('btn-pagar').addEventListener('click', pagarAgora);
  document.getElementById('btn-fiado').addEventListener('click', mostrarCampoFiado);
  elFormFiado.addEventListener('submit', deixarFiado);

  document.getElementById('btn-caderneta').addEventListener('click', () => {
    renderizarFiados();
    elModalCaderneta.showModal();
  });

  // Botões "×" fecham a janela em que estão
  document.querySelectorAll('[data-fechar]').forEach((botao) => {
    botao.addEventListener('click', () => botao.closest('dialog').close());
  });

  // Clicar fora da janela (no fundo escuro) também fecha
  document.querySelectorAll('dialog').forEach((janela) => {
    janela.addEventListener('click', (evento) => {
      if (evento.target === janela) janela.close();
    });
  });
});