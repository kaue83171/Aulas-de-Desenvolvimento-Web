// 1. Tipos Estruturais e Constantes (ES6+)[cite: 14, 15]
const produtosBase = [
{ id: 1, nome: 'Placa de Vídeo RTX 4060', preco: 2500, categoria: 'Hardware' },
{ id: 2, nome: 'Teclado Mecânico Switch Blue', preco: 350, categoria: 'Periféricos' },
{ id: 3, nome: 'Monitor Gamer 144Hz', preco: 1200, categoria: 'Monitores' }
];


// 2. Operador Spread (...)[cite: 20]
// Simulando a adição de um novo produto ao catálogo mantendo a imutabilidade do array original.
const produtos = [...produtosBase, { id: 4, nome: 'Mouse Ultra Leve', preco: 150, categoria:
'Periféricos' }];

// 3. Closures (Escopo Léxico)
// Utilizado para encapsular o estado do carrinho, impedindo modificações diretas de fora.
function gerenciarCarrinho() {
let itens = []; // Variável protegida pelo escopo
return {
adicionar: (produto) => {
itens = [...itens, produto]; // Spread array destructuring[cite: 19, 20]
salvarNoStorage(itens);
console.log(`${produto.nome} adicionado!`);
},
obterTotal: () => itens.reduce((acc, item) => acc + item.preco, 0),
limpar: () => {
itens = [];
localStorage.removeItem('carrinho_loja');
},
listar: () => itens
};
}
const carrinho = gerenciarCarrinho();

// 4. Web Storage API[cite: 8]
// Persistência de dados locais para não perder o carrinho ao atualizar a página.
const salvarNoStorage = (dados) => {
localStorage.setItem('carrinho_loja', JSON.stringify(dados));
};

// 5. O Document Object Model (DOM) e Destructuring[cite: 6, 19]
function renderizarProdutos() {
// Selecionando o elemento principal via DOM

const container = document.getElementById('lista-produtos');
// Iteradores Modernos (for...of)
for (const produto of produtos) {
// Destructuring Assignment para extrair propriedades de forma concisa[cite: 19]
const { id, nome, preco } = produto;
// Manipulação dinâmica via scripts[cite: 6]
const div = document.createElement('div');
div.classList.add('produto-card');
div.innerHTML = `
<h3>${nome}</h3>
<p>R$ ${preco.toFixed(2)}</p>
<button id="btn-${id}">Adicionar ao Carrinho</button>
`;
container.appendChild(div);
// Ouvindo eventos[cite: 6]
document.getElementById(`btn-${id}`).addEventListener('click', () => {
carrinho.adicionar(produto);
atualizarInterfaceCarrinho();
});
}
}
function atualizarInterfaceCarrinho() {
const painelTotal = document.querySelector('#total-carrinho');
painelTotal.textContent = `Total: R$ ${carrinho.obterTotal().toFixed(2)}`; // Arrow function de
retorno implícito[cite: 16]
}

// 6. Operador Rest (...)[cite: 20]
// Condensa múltiplos valores de frete passados como argumento em um único array.
const calcularFrete = (...taxas) => {
return taxas.reduce((total, taxa) => total + taxa, 0);
};

// 7. Async / Await e Fetch API[cite: 8, 25]
// Simulação de requisição HTTP assíncrona para buscar um cupom de desconto[cite: 24].
async function validarCupom(codigo) {
try {
console.log('Buscando validação no servidor...');
// Simulação de Fetch em uma API real[cite: 8]
// const resposta = await fetch(`https://api.loja.com/cupons/${codigo}`);
// const dados = await resposta.json();[cite: 24]
// Simulando atraso de rede (Web APIs / Task Queue)[cite: 7]
await new Promise(resolve => setTimeout(resolve, 1000));

if (codigo === 'PROMO10') {
const desconto = 0.10;
const novoTotal = carrinho.obterTotal() * (1 - desconto);
document.querySelector('#total-carrinho').textContent = `Total c/ Desconto: R$ $
{novoTotal.toFixed(2)}`;
alert('Cupom aplicado com sucesso!');
} else {
throw new Error('Cupom inválido ou expirado.'); // Cai direto no catch
}
} catch (erro) {
console.error('Falha na requisição:', erro.message);[cite: 25]
alert(erro.message);
} finally {
console.log('Operação de cupom finalizada.');[cite: 24]
}
}
// Inicialização da Loja
document.addEventListener('DOMContentLoaded', () => {
renderizarProdutos();
// Evento de simulação do cupom
document.getElementById('btn-cupom').addEventListener('click', () => {
const codigoInput = document.getElementById('input-cupom').value;
validarCupom(codigoInput);
});
});