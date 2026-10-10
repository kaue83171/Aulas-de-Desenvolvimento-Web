// Construção dos Arrays e Objetos.
const servidores = [
    {id: 1, nome: 'Gateway Principal - URI', so: 'Debian', status: 'online', cargaCPU: 35 },
    {id: 2, nome: 'Base de Dados - Laboratório', so: 'Ubuntu', status: 'offline', cargaCPU: 8 },
    {id: 3, nome: 'Plataforma BugCup', so: 'Linux Mint', status: 'online', cargaCPU: 72 },
    {id: 4, nome: 'Firewall de Borda', so: 'Debian', status: 'online', cargaCPU: 20 },
]

// renderiza a dinamica
function renderizarDeshboard(listaservidores) {
    const grid = document.getElementById("grid-servidores");
    
    // Limpa o conteúdo atual para evitar duplicações
    grid.innerHTML = ""


    for (const { nome, so, status, cargaCPU} of listaservidores){
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

        const badge =document.createElement("span");
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
