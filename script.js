// 1. Variáveis Globais e Configuração
const gameBoard = document.querySelector('.memory-game');

// Array com os nomes/ícones dos pares de cartas
// Para um jogo 4x3 (12 cartas), precisamos de 6 pares.
const cardIcons = [
    '☕', '🍄', '⭐', '🚀', '💡', '🎸',
    '☕', '🍄', '⭐', '🚀', '💡', '🎸'
];

let hasFlippedCard = false; // Flag: se a primeira carta de um par foi virada
let lockBoard = false; // Bloqueia o tabuleiro para evitar cliques rápidos
let firstCard, secondCard; // Variáveis para armazenar as duas cartas viradas
let matchesFound = 0; // Contador de pares encontrados

// 2. Função para Criar e Renderizar as Cartas
function createCard(icon) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    // Armazena o ícone da carta no dataset para ser acessado no JS
    cardElement.dataset.icon = icon;
    
    // Conteúdo HTML da carta (Frente e Verso)
    cardElement.innerHTML = `
        <div class="front-face">${icon}</div>
        <div class="back-face">?</div>
    `;

    // Adiciona o evento de clique para virar a carta
    cardElement.addEventListener('click', flipCard);
    
    return cardElement;
}

// 3. Função para Virar a Carta
function flipCard() {
    // 3.1. Se o tabuleiro estiver bloqueado ou a carta já foi clicada, ignora
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    // 3.2. Se for a PRIMEIRA carta do par
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // 3.3. Se for a SEGUNDA carta do par
    secondCard = this;
    
    // Checa se as cartas são um par
    checkForMatch();
}

// 4. Função para Checar se as Cartas são Iguais
function checkForMatch() {
    // A condição de "match" é se o atributo `data-icon` é o mesmo.
    const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    // Se forem iguais, desabilita o clique nas cartas; senão, desvira elas.
    isMatch ? disableCards() : unflipCards();
}

// 5. Cartas Combinadas (Match)
function disableCards() {
    // Remove o listener para que não possam ser viradas novamente
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // Adiciona uma classe para indicar que o par foi encontrado
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    
    matchesFound++;
    
    // Verifica se o jogo acabou
    if (matchesFound === cardIcons.length / 2) {
        setTimeout(() => {
            alert('Parabéns! Você encontrou todos os pares!');
            resetGame(); // Reinicia o jogo
        }, 500);
    }
    
    resetBoard();
}

// 6. Cartas Diferentes (No Match)
function unflipCards() {
    lockBoard = true; // Bloqueia o tabuleiro temporariamente

    // Espera um pouco antes de desvirar
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000); // 1 segundo
}

// 7. Resetar o Estado de Virar
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// 8. Função para Embaralhar e Iniciar o Jogo
function shuffleCards() {
    // O "Fisher-Yates (Knuth) shuffle algorithm" é ideal
    cardIcons.sort(() => Math.random() - 0.5);

    // Renderiza as cartas
    cardIcons.forEach(icon => {
        const card = createCard(icon);
        gameBoard.appendChild(card);
    });
}

// 9. Reiniciar o Jogo
function resetGame() {
    // Limpa o tabuleiro
    gameBoard.innerHTML = '';
    matchesFound = 0;
    resetBoard();
    shuffleCards();
}


// Inicia o jogo quando o script carrega
shuffleCards();