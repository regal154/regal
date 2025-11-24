/* ===== AUDIO FIX (tidak restart saat tombol lain dipencet) ===== */
let audioEnabled = false;
const audioControl = document.getElementById('audioControl');
const clickSound = document.getElementById('clickSound');
let currentTimeMemory = 0; // simpan waktu agar tidak restart

audioControl.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    audioControl.classList.toggle('active');
    audioControl.innerHTML = audioEnabled 
        ? '<i class="ri-volume-up-line text-xl"></i>' 
        : '<i class="ri-volume-mute-line text-xl"></i>';
    if (audioEnabled) {
        clickSound.volume = 0.25;
        clickSound.currentTime = currentTimeMemory; // lanjutkan dari waktu sebelumnya
        clickSound.play().catch(() => {});
    } else {
        currentTimeMemory = clickSound.currentTime || 0;
        clickSound.pause();
    }
});

function playSound() {
    if (!audioEnabled) return;
    // tidak reset currentTime → audio lanjut, tidak restart
    clickSound.play().catch(() => {});
}

/* ===== LOADING ===== */
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 1500);
    initParticles();
    initSlider();
    initTextRotator();
    initNavigation();
});

/* ===== PARTICLES ===== */
function initParticles() {
    tsParticles.load('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ff1a1a' },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 2, random: true },
            line_linked: { enable: true, distance: 150, color: '#ff1a1a', opacity: 0.1, width: 1 },
            move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
        },
        retina_detect: true
    });
}

/* ===== SLIDER ===== */
function initSlider() {
    const slides = document.querySelectorAll('.slide'); 
    let current = 0;
    function nextSlide() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }
    setInterval(nextSlide, 2000);
}

/* ===== TEXT ROTATOR ===== */
function initTextRotator() {
    document.querySelectorAll('.text-rotator').forEach(rot => {
        const texts = rot.querySelectorAll('.rotator-text'); 
        let idx = 0;
        setInterval(() => {
            texts[idx].classList.remove('active');
            idx = (idx + 1) % texts.length;
            texts[idx].classList.add('active');
        }, 3000);
    });
}

/* ===== NAVIGATION ===== */
function initNavigation() {
    const hamburger = document.getElementById('hamburger'), 
          sidebar = document.getElementById('sidebar'), 
          mainContent = document.getElementById('mainContent');
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-open');
        playSound();
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(item.dataset.page).classList.add('active');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-open');
            }
            playSound();
        });
    });
}

/* ===== PROJECT MODAL ===== */
document.addEventListener('click', e => {
    if (e.target.classList.contains('detail-btn')) {
        playSound();
        const title = e.target.dataset.title || 'Project';
        const desc = e.target.dataset.desc || 'Deskripsi lengkap project akan muncul di sini.';
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">${title}</h3>
                    <button onclick="this.closest('.modal-backdrop').remove()" class="text-red-500 hover:text-red-400"><i class="ri-close-line text-2xl"></i></button>
                </div>
                <p class="text-gray-300 mb-4">${desc}</p>
                <div class="flex gap-2">
                    <button class="cyber-button" onclick="alert('Demo belum tersedia, stay tuned!')">Lihat Demo</button>
                    <button class="cyber-button bg-gray-700" onclick="this.closest('.modal-backdrop').remove()">Tutup</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    playSound();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Mengirim...'; 
    btn.disabled = true;
    setTimeout(() => {
        alert('Pesan terkirim! Kami akan menghubungi Anda segera.');
        e.target.reset();
        btn.textContent = 'Kirim Pesan'; 
        btn.disabled = false;
    }, 1500);
});

/* ===== SOCIAL CARD ===== */
document.querySelectorAll('.social-card').forEach(card => {
    card.addEventListener('click', () => {
        if (card.dataset.link) window.open(card.dataset.link, '_blank');
        playSound();
    });
});

/* ===== GAMES MODULE ===== */
let tttBoard = [], tttCurrentPlayer = 'X', tttDifficulty = 'easy', gameActive = true;
function startGame(type) {
    const cont = document.getElementById('gameContainer'), title = document.getElementById('gameTitle'), content = document.getElementById('gameContent');
    cont.classList.remove('hidden'); playSound();
    if (type === 'tictactoe') {
        title.textContent = 'Cyber Tic-Tac-Toe';
        content.innerHTML = `
            <div class="difficulty-selector"><button class="difficulty-btn active" onclick="setDifficulty('easy')">Easy</button><button class="difficulty-btn" onclick="setDifficulty('medium')">Medium</button><button class="difficulty-btn" onclick="setDifficulty('hard')">Hard</button></div>
            <div class="game-board grid grid-cols-3" id="tttBoard"></div>
            <div class="text-center mt-4"><p class="text-lg mb-2">Giliran: <span id="currentPlayer" class="text-red-500 font-bold">X (Player)</span></p><p class="text-sm mb-2">Mode: <span id="gameMode" class="text-red-500">Easy</span></p><div class="flex gap-2 justify-center"><button onclick="resetGame()" class="cyber-button">Reset Game</button><button onclick="closeGame()" class="cyber-button bg-gray-600">Close</button></div></div>`;
        initTTT();
    }
    if (type === 'memory') initMemory();
    if (type === 'reflex') initReflex();
}
function closeGame(){document.getElementById('gameContainer').classList.add('hidden');playSound();}

/* Tic-Tac-Toe AI */
function initTTT(){tttBoard=Array(9).fill('');tttCurrentPlayer='X';gameActive=true;createTTTBoard();updateTTTDisplay();}
function createTTTBoard(){const board=document.getElementById('tttBoard');board.innerHTML='';for(let i=0;i<9;i++){const cell=document.createElement('button');cell.className='cyber-input game-cell';cell.id=`cell-${i}`;cell.onclick=()=>makeMove(i);board.appendChild(cell);}}
function setDifficulty(d){tttDifficulty=d;document.querySelectorAll('.difficulty-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');document.getElementById('gameMode').textContent=d.charAt(0).toUpperCase()+d.slice(1);resetGame();}
function makeMove(idx){if(tttBoard[idx]===''&&gameActive&&tttCurrentPlayer==='X'){tttBoard[idx]='X';updateTTTDisplay();if(checkWin()){endGame('Player X Wins!');return;}if(checkDraw()){endGame('Draw!');return;}tttCurrentPlayer='O';updateTTTDisplay();setTimeout(()=>makeAIMove(),500);}}
function makeAIMove(){if(!gameActive)return;let move;switch(tttDifficulty){case'easy':move=getRandomMove();break;case'medium':move=Math.random()<0.7?getBestMove():getRandomMove();break;case'hard':move=getBestMove();break;}if(move!==undefined){tttBoard[move]='O';updateTTTDisplay();if(checkWin()){endGame('AI O Wins!');return;}if(checkDraw()){endGame('Draw!');return;}tttCurrentPlayer='X';updateTTTDisplay();}}
function getRandomMove(){const avail=tttBoard.map((c,i)=>c===''?i:null).filter(v=>v!==null);return avail[Math.floor(Math.random()*avail.length)];}
function getBestMove(){return minimax(tttBoard,'O').index;}
function minimax(board,player){const avail=board.map((c,i)=>c===''?i:null).filter(v=>v!==null);if(checkWinForMinimax(board,'X'))return{score:-10};if(checkWinForMinimax(board,'O'))return{score:10};if(avail.length===0)return{score:0};const moves=[];for(let i=0;i<avail.length;i++){const move={};move.index=avail[i];board[avail[i]]=player;if(player==='O'){const res=minimax(board,'X');move.score=res.score;}else{const res=minimax(board,'O');move.score=res.score;}board[avail[i]]='';moves.push(move);}let bestMove;if(player==='O'){let bestScore=-10000;for(let i=0;i<moves.length;i++){if(moves[i].score>bestScore){bestScore=moves[i].score;bestMove=i;}}}else{let bestScore=10000;for(let i=0;i<moves.length;i++){if(moves[i].score<bestScore){bestScore=moves[i].score;bestMove=i;}}}return moves[bestMove];}
function checkWin(){const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];return wins.some(w=>{const[a,b,c]=w;return tttBoard[a]&&tttBoard[a]===tttBoard[b]&&tttBoard[a]===tttBoard[c];});}
function checkWinForMinimax(board,player){const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];return wins.some(w=>{const[a,b,c]=w;return board[a]===player&&board[a]===board[b]&&board[a]===board[c];});}
function checkDraw(){return tttBoard.every(c=>c!=='');}
function endGame(msg){gameActive=false;setTimeout(()=>alert(msg),100);}
function updateTTTDisplay(){tttBoard.forEach((c,i)=>{const cell=document.getElementById(`cell-${i}`);cell.textContent=c;cell.style.color=c==='X'?'#ff1a1a':'#ffffff';cell.className=c?'cyber-input game-cell disabled':'cyber-input game-cell';});document.getElementById('currentPlayer').textContent=tttCurrentPlayer==='X'?'X (Player)':'O (AI)';}
function resetGame(){initTTT();}

/* Memory Game */
let memoryCards=[],memoryFlipped=[],memoryMoves=0;
function initMemory(){
    const symbols=['🎮','🎯','🎲','🎪','🎨','🎭','🎸','🎺'];
    memoryCards=[...symbols,...symbols].sort(()=>Math.random()-0.5);
    memoryFlipped=[];memoryMoves=0;
    const cont=document.getElementById('gameContent');
    cont.innerHTML=`<div class="grid grid-cols-4 gap-2 max-w-md mx-auto" id="memoryGrid"></div><div class="text-center mt-4"><p class="text-lg mb-2">Moves: <span id="moves" class="text-red-500 font-bold">0</span></p><button onclick="resetMemoryGame()" class="cyber-button">Reset Game</button><button onclick="closeGame()" class="cyber-button bg-gray-600 ml-2">Close</button></div>`;
    updateMemoryDisplay();
}
function updateMemoryDisplay(){
    const grid=document.getElementById('memoryGrid');
    grid.innerHTML=memoryCards.map((s,i)=>`<button class="cyber-input h-20 text-2xl" onclick="flipCard(${i})" id="memory-${i}">?</button>`).join('');
    document.getElementById('moves').textContent=memoryMoves;
}
function flipCard(idx){
    if(memoryFlipped.length<2&&!memoryFlipped.includes(idx)){
        memoryFlipped.push(idx);
        document.getElementById(`memory-${idx}`).textContent=memoryCards[idx];
        if(memoryFlipped.length===2){
            memoryMoves++;
            document.getElementById('moves').textContent=memoryMoves;
            setTimeout(()=>{
                const[f,s]=memoryFlipped;
                if(memoryCards[f]===memoryCards[s]){
                    document.getElementById(`memory-${f}`).style.visibility='hidden';
                    document.getElementById(`memory-${s}`).style.visibility='hidden';
                    if(document.querySelectorAll('#memoryGrid button:not([style*="visibility: hidden"])').length===0)setTimeout(()=>alert(`Selamat! Anda menang dalam ${memoryMoves} gerakan!`),100);
                }else{
                    document.getElementById(`memory-${f}`).textContent='?';
                    document.getElementById(`memory-${s}`).textContent='?';
                }
                memoryFlipped=[];
            },1000);
        }
    }
}
function resetMemoryGame(){initMemory();}

/* Reflex Game */
let reflexStartTime,reflexTimeout;
function initReflex(){
    const cont=document.getElementById('gameContent');
    cont.innerHTML=`<div class="text-center"><div id="reflexArea" class="cyber-input h-64 flex items-center justify-center cursor-pointer"><p id="reflexText" class="text-2xl font-bold">Klik untuk mulai!</p></div><div class="mt-4"><p class="text-lg">Waktu Reaksi: <span id="reactionTime" class="text-red-500 font-bold">-</span> ms</p><p class="text-sm text-gray-400 mt-2">Klik saat area berubah warna</p></div></div>`;
    document.getElementById('reflexArea').addEventListener('click',handleReflexClick);
}
function handleReflexClick(){
    const area=document.getElementById('reflexArea'),text=document.getElementById('reflexText'),time=document.getElementById('reactionTime');
    if(text.textContent==='Klik untuk mulai!'){startReflexRound();return;}
    if(area.style.backgroundColor==='rgb(255, 26, 26)'){const end=Date.now(),t=end-reflexStartTime;time.textContent=t;area.style.backgroundColor='';let fb='';if(t<200)fb='Luar biasa! 🚀';else if(t<300)fb='Sangat baik! ⚡';else if(t<400)fb='Bagus! 👍';else if(t<500)fb='Cukup cepat! 👌';else fb='Perlu latihan! 💪';text.textContent=fb;clearTimeout(reflexTimeout);setTimeout(()=>{text.textContent='Klik untuk mulai!';},2000);}else{text.textContent='Terlalu cepat! Tunggu warna merah.';clearTimeout(reflexTimeout);setTimeout(()=>{text.textContent='Klik untuk mulai!';},2000);}
}
function startReflexRound(){const area=document.getElementById('reflexArea'),text=document.getElementById('reflexText');text.textContent='Tunggu warna merah...';area.style.backgroundColor='';const delay=Math.random()*3000+2000;reflexTimeout=setTimeout(()=>{area.style.backgroundColor='#ff1a1a';reflexStartTime=Date.now();text.textContent='Klik sekarang!';},delay);}
