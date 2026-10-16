// Construção dos Arrays e Objetos.
let servidores = [
    { id: 1, nome: 'Gateway Principal - URI', so: 'Debian', status: 'online', cargaCPU: 35 },
    { id: 2, nome: 'Base de Dados - Laboratório', so: 'Ubuntu', status: 'offline', cargaCPU: 8 },
    { id: 3, nome: 'Plataforma BugCup', so: 'Linux Mint', status: 'online', cargaCPU: 72 },
    { id: 4, nome: 'Firewall de Borda', so: 'Debian', status: 'online', cargaCPU: 20 },
    { id: 5, nome: 'Laboratorio de informatica', so: 'Linux', status: 'online', cargaCPU: 40 },
    { id: 6, nome: 'Banco de dados Livraira', so: 'Debian', status: 'offline', cargaCPU: 60},
    { id: 7, nome: 'Central de pagamentos', so: 'Windows', status: 'online', cargaCPU: 47 },
]

//cria uma variavel para quardas os filtros 
let filtroAtual = "todos";

// renderiza a dinamica
function renderizarDeshboard(listaservidores) {
    const grid = document.getElementById("grid-servidores");

    // Limpa o conteúdo atual para evitar duplicações
    grid.innerHTML = ""


    for (const { nome, so, status, cargaCPU } of listaservidores) {
        //card principal
        const card = document.createElement("div");
        card.className = status === 'online'
            ? "servidor-card status-online"
            : "servidor-card status-offline"

        const titulo = document.createElement("h3");
        titulo.textContent = nome;

        const pSO = document.createElement('p');
        pSO.textContent = "SO: " + so;

        const pCPU = document.createElement('p');
        pCPU.textContent = "CPU: " + cargaCPU + "%";

        const badge = document.createElement("span");
        badge.textContent = status === "online" ? "ONLINE" : "OFFLINE";

        //mostra o card e coloca na tela
        card.appendChild(titulo);
        card.appendChild(pSO);
        card.appendChild(pCPU);
        card.appendChild(badge);
        grid.appendChild(card);
    }
}
renderizarDeshboard(servidores);

//filtros
//eu atualizei por conta propia os aquestão dos filtros pois toda vez que renderizava ele voltava para o "todos"
// mas o certo seria voltar para o filro que ele selecionou
function filtrarServidores(filtro) {
    filtroAtual = filtro;

  const lista = filtro === "todos"
    ? servidores
    : servidores.filter(({ status }) => status === filtro);

  renderizarDeshboard(lista);
}

//botoes do cabeçario

//mudaça tambem no botão todos
document.getElementById("btn-todos").addEventListener("click", () => {
  filtrarServidores("todos");
});

document.getElementById("btn-online").addEventListener("click", () => {
  filtrarServidores("online");
});

document.getElementById("btn-offline").addEventListener("click", () => {
  filtrarServidores("offline");
});


//atualização contunia
async function buscarAtualizaçoes() {
    try {
        //simula o atraso da api
        await new Promise(resolve => setTimeout(resolve, 800));

        //gera uma nova lista, sem mudar os objetivos originais
        servidores = servidores.map(servidor => {
            if (servidor.status === "online") {
                return { ...servidor, cargaCPU: Math.floor(Math.random() * 101) };
            }
            return servidor;
        });

        //alterado para buscar o filtro apos a atualização
        filtrarServidores(filtroAtual);

        // Atualiza o relógio do cabeçalho
        const hora = new Date().toLocaleTimeString("pt-BR");
        document.getElementById("ultima-atualizacao").textContent =
            "Última sincronização: " + hora;
    } catch (erro) {
        console.error("Falha ao buscar atualizações:", erro);
    }
}

document.addEventListener("DOMContentLoaded", () =>{
    renderizarDeshboard(servidores);    //desenha a tela inicial
    buscarAtualizaçoes();               //primeira sincronização inicial
    setInterval(buscarAtualizaçoes, 2000);       
})