let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
const rounds = 5;
const maxTime = 15;
const maxScore = 1000;

async function fetchQuestions() {
    const res = await fetch('https://opentdb.com/api.php?amount='+ rounds +'&type=multiple');
    const data = await res.json();
    questions = data.results.map(q => ({
        question: q.question,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        correct: q.correct_answer
    }));
    startRound();
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    score = 0;
    currentQuestionIndex = 0;
    fetchQuestions();
}

function startRound() {
    if (currentQuestionIndex >= rounds) {
        endGame();
        return;
    }
    let q = questions[currentQuestionIndex];
    document.getElementById('question').innerHTML = q.question;
    let answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    document.getElementById('result').textContent = '';

    q.answers.forEach(answer => {
        let btn = document.createElement('button');
        btn.textContent = answer;
        btn.onclick = () => selectAnswer(answer, q.correct);
        answersDiv.appendChild(btn);
    });
    console.log(q.correct);
    timeLeft = maxTime;
    document.getElementById('timer').textContent = timeLeft;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
        } else {
            clearInterval(timer);
            currentQuestionIndex++;
            startRound();
        }
    }, 1000);
}

function selectAnswer(answer, correct) {
    clearInterval(timer);
    if (answer === correct) {
        document.getElementById('result').textContent = 'Correct!';
        //score += timeLeft * 10;
        Math.round(score += ((timeLeft / maxTime)*maxScore))
        console.log(Math.round(((timeLeft / maxTime)*maxScore)));
    } else {
        document.getElementById('result').textContent = 'Wrong!';
    }
    document.getElementById('score').textContent = Math.round(score);
    setTimeout(() => {
        currentQuestionIndex++;
        startRound();
    }, 1000);
}

function endGame() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('final-score').textContent = Math.round(score);
}
