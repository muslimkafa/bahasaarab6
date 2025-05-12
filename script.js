
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let lives = 5;
let score = 0;
let gameOver = false;
let currentQuestionIndex = 0;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    speed: 7,
    moveLeft: false,
    moveRight: false
};

const bullets = []; // Array to store bullets
const answers = []; // Array to store falling answers

const questions = [
    {question: "Apa arti kata 'سلام'?", choices: ['Damai', 'Selamat', 'Sukses', 'Bahagia'], correctAnswer: 'Damai'},
    {question: "Apa arti kata 'كتاب'?", choices: ['Buku', 'Meja', 'Kursi', 'Pena'], correctAnswer: 'Buku'},
    {question: "Apa arti kata 'صلاة'?", choices: ['Doa', 'Makan', 'Minum', 'Sholat'], correctAnswer: 'Sholat'},
    {question: "Apa arti kata 'قرآن'?", choices: ['Alkitab', 'Kitab Suci', 'Hadis', 'Jurnal'], correctAnswer: 'Kitab Suci'},
    {question: "Apa arti kata 'الله'?", choices: ['Tuhan', 'Manusia', 'Bumi', 'Malaikat'], correctAnswer: 'Tuhan'},
    {question: "Apa arti kata 'جنة'?", choices: ['Surga', 'Neraka', 'Bumi', 'Langit'], correctAnswer: 'Surga'},
    {question: "Apa arti kata 'حلال'?", choices: ['Diperbolehkan', 'Dilarang', 'Tidak pasti', 'Disarankan'], correctAnswer: 'Diperbolehkan'},
    {question: "Apa arti kata 'حرام'?", choices: ['Dilarang', 'Diperbolehkan', 'Wajib', 'Sunnah'], correctAnswer: 'Dilarang'},
    {question: "Apa arti kata 'رسول'?", choices: ['Nabi', 'Malaikat', 'Jihad', 'Utusan'], correctAnswer: 'Utusan'},
    {question: "Apa arti kata 'إيمان'?", choices: ['Keyakinan', 'Keinginan', 'Kekuatan', 'Ketakutan'], correctAnswer: 'Keyakinan'},
    {question: "Apa arti kata 'صيام'?", choices: ['Puasa', 'Sholat', 'Haji', 'Zakat'], correctAnswer: 'Puasa'},
    {question: "Apa arti kata 'مسجد'?", choices: ['Tempat tinggal', 'Sekolah', 'Rumah ibadah', 'Pasar'], correctAnswer: 'Rumah ibadah'},
    {question: "Apa arti kata 'ذكر'?", choices: ['Doa', 'Pendidikan', 'Makanan', 'Buku'], correctAnswer: 'Doa'},
    {question: "Apa arti kata 'صديق'?", choices: ['Musuh', 'Teman', 'Saudara', 'Guru'], correctAnswer: 'Teman'},
    {question: "Apa arti kata 'مكة'?", choices: ['Madinah', 'Kota Nabi', 'Kota Suci', 'Kota Mekah'], correctAnswer: 'Kota Mekah'},
    {question: "Apa arti kata 'جميل'?", choices: ['Buruk', 'Indah', 'Tua', 'Muda'], correctAnswer: 'Indah'},
    {question: "Apa arti kata 'تقوى'?", choices: ['Ketakwaan', 'Keburukan', 'Kesedihan', 'Kekayaan'], correctAnswer: 'Ketakwaan'},
    {question: "Apa arti kata 'سورة'?", choices: ['Ayat', 'Surah', 'Hadis', 'Alquran'], correctAnswer: 'Surah'},
    {question: "Apa arti kata 'صدق'?", choices: ['Kebenaran', 'Kedustaan', 'Kecurangan', 'Keraguan'], correctAnswer: 'Kebenaran'}
];

function loadNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById("question").innerText = question.question;
        answers.length = 0; // Reset answers
        question.choices.forEach(choice => {
            answers.push({ text: choice, x: Math.random() * canvas.width, y: -50, speed: 2, correct: choice === question.correctAnswer });
        });
        currentQuestionIndex++;
    } else {
        gameOver = true;
        displayGameOver();
    }
}

function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 + 50);
}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    if (player.moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 5
    });
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed; // Move bullet upwards
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }

        // Check if bullet hits an answer
        answers.forEach((answer, answerIndex) => {
            if (bullet.y < answer.y + 30 && bullet.y + 20 > answer.y && bullet.x + 10 > answer.x && bullet.x < answer.x + 100) {
                if (answer.correct) {
                    score += 10;
                } else {
                    lives -= 1;
                    document.getElementById("life-count").innerText = lives;
                }
                answers.splice(answerIndex, 1);
                bullets.splice(index, 1); // Remove bullet
            }
        });
    });
}

function drawAnswers() {
    answers.forEach((answer, index) => {
        answer.y += answer.speed;
        ctx.fillStyle = "blue";
        ctx.fillRect(answer.x, answer.y, 100, 30);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(answer.text, answer.x + 10, answer.y + 20);

        if (answer.y > canvas.height) {
            answers.splice(index, 1);
        }
    });
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawBullets();
    drawAnswers();

    if (lives <= 0) {
        gameOver = true;
        displayGameOver();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") {
        player.moveLeft = true;
    } else if (e.key === "ArrowRight") {
        player.moveRight = true;
    } else if (e.key === " " && !gameOver) {  // Spacebar to shoot
        shoot();
    }
});

document.addEventListener("keyup", function(e) {
    if (e.key === "ArrowLeft") {
        player.moveLeft = false;
    } else if (e.key === "ArrowRight") {
        player.moveRight = false;
    }
});

loadNextQuestion();
gameLoop();
