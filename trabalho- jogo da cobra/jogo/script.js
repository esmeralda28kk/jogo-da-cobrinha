const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const btnStart = document.getElementById('btn-start');
const selectDifficulty = document.getElementById('difficulty');


const GRID_SIZE = 20; 
const TILE_COUNT = canvas.width / GRID_SIZE;

let cobra = [];
let comida = { x: 0, y: 0 };
let dx = GRID_SIZE; 
let dy = 0;         
let pontuacao = 0;
let loopJogo = null;
let proximaDirecao = { dx: GRID_SIZE, dy: 0 };


function iniciarJogo() {
    if (loopJogo) clearInterval(loopJogo);

    
    cobra = [
        { x: 10 * GRID_SIZE, y: 10 * GRID_SIZE },
        { x: 9 * GRID_SIZE,  y: 10 * GRID_SIZE },
        { x: 8 * GRID_SIZE,  y: 10 * GRID_SIZE }
    ];

    dx = GRID_SIZE;
    dy = 0;
    proximaDirecao = { dx: GRID_SIZE, dy: 0 };
    pontuacao = 0;
    scoreElement.textContent = pontuacao;

    gerarComida();

    const velocidade = parseInt(selectDifficulty.value);
    loopJogo = setInterval(atualizarJogo, velocidade);
}


function gerarComida() {
    comida.x = Math.floor(Math.random() * TILE_COUNT) * GRID_SIZE;
    comida.y = Math.floor(Math.random() * TILE_COUNT) * GRID_SIZE;

    
    const colidiuComCobra = cobra.some(segmento => segmento.x === comida.x && segmento.y === comida.y);
    if (colidiuComCobra) {
        gerarComida();
    }
}


function atualizarJogo() {
    dx = proximaDirecao.dx;
    dy = proximaDirecao.dy;

    const novaCabeca = { x: cobra[0].x + dx, y: cobra[0].y + dy };

    if (novaCabeca.x < 0 || novaCabeca.x >= canvas.width || novaCabeca.y < 0 || novaCabeca.y >= canvas.height) {
        fimDeJogo();
        return;
    }

  
    if (cobra.some(segmento => segmento.x === novaCabeca.x && segmento.y === novaCabeca.y)) {
        fimDeJogo();
        return;
    }

 
    cobra.unshift(novaCabeca);


    if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
        pontuacao += 10;
        scoreElement.textContent = pontuacao;
        gerarComida();
    } else {
       
        cobra.pop();
    }

    desenhar();
}


function desenhar() {
 
    ctx.fillStyle = '#181825';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   
    cobra.forEach((segmento, index) => {
        ctx.fillStyle = index === 0 ? '#a6e3a1' : '#94e2d5'; 
        ctx.fillRect(segmento.x, segmento.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });

  
    ctx.fillStyle = '#f38ba8';
    ctx.fillRect(comida.x, comida.y, GRID_SIZE - 2, GRID_SIZE - 2);
}


function fimDeJogo() {
    clearInterval(loopJogo);
    alert(`Fim de Jogo! Sua pontuação final foi: ${pontuacao}`);
}


document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) proximaDirecao = { dx: 0, dy: -GRID_SIZE };
            break;
        case 'ArrowDown':
            if (dy === 0) proximaDirecao = { dx: 0, dy: GRID_SIZE };
            break;
        case 'ArrowLeft':
            if (dx === 0) proximaDirecao = { dx: -GRID_SIZE, dy: 0 };
            break;
        case 'ArrowRight':
            if (dx === 0) proximaDirecao = { dx: GRID_SIZE, dy: 0 };
            break;
    }
});

btnStart.addEventListener('click', iniciarJogo);