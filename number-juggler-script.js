// ==========================
// GAME VARIABLES
// ==========================

let score = 0;
let level = 1;
let roundsInLevel = 0;
let totalIncorrect = 0;
let correctAnswer = "";
let timer = null;
let timeLeft = 0;
let soundEnabled = true;
let gameStarted = false;

// ==========================
// ELEMENTS
// ==========================

const startGameBtn = document.getElementById("startGameBtn");
const introScreen = document.getElementById("introScreen");

const backBtn = document.getElementById("backBtn");
const introBackBtn = document.getElementById("introBackBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const soundBtn = document.getElementById("soundBtn");

const instruction = document.getElementById("instruction");
const mainDisplay = document.getElementById("mainDisplay");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const timerDisplay = document.getElementById("timerDisplay");


// ==========================
// SOUNDS
// ==========================

const soundCorrect = new Audio("sounds/correct.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundReveal = new Audio("sounds/reveal.mp3");
const soundWarning = new Audio("sounds/warning.mp3");
const soundLevelUp = new Audio("sounds/levelup.mp3");

[
    soundCorrect,
    soundWrong,
    soundReveal,
    soundWarning,
    soundLevelUp
].forEach(sound => {
    sound.volume = 0.5;
});


// ==========================
// PLAY SOUND
// ==========================

function playSound(sound){

    if(!soundEnabled) return;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(() => {});
}


// ==========================
// START GAME BUTTON
// ==========================

if(startGameBtn){

    startGameBtn.addEventListener("click", () => {

        gameStarted = true;

        if(introScreen){
            introScreen.style.display = "none";
        }

        startGame();
    });
}


// ==========================
// START GAME
// ==========================

function startGame(){

    score = 0;
    level = 1;
    roundsInLevel = 0;
    totalIncorrect = 0;

    updateLives();

    nextRound();
}


// ==========================
// UPDATE LIVES
// ==========================

function updateLives(){

    let remaining = 5 - totalIncorrect;

    let hearts = "";

    for(let i = 0; i < remaining; i++){
        hearts += "❤️ ";
    }

    const livesElement =
    document.querySelector(".top-bar-lives");

    if(livesElement){
        livesElement.innerText = hearts;
    }
}


// ==========================
// NEXT ROUND
// ==========================

function nextRound(){

    clearInterval(timer);

    roundsInLevel++;

    // LEVEL COMPLETE

    if(roundsInLevel > 15){

        playSound(soundLevelUp);

        alert("Level Complete!");

        level++;
        roundsInLevel = 1;
    }

    // GAME OVER

    if(totalIncorrect >= 5){

        alert("Game Over! Final Score: " + score);

        location.reload();

        return;
    }

    // UPDATE UI

    if(levelElement){
        levelElement.innerText = level;
    }

    if(scoreElement){
        scoreElement.innerText = score;
    }

    updateLives();

    // ==========================
    // TIMER SETTINGS
    // ==========================

    if(level >= 4){

        if(timerDisplay){
            timerDisplay.style.display = "block";
        }

        if(level === 4){

            startTimer(10);

        } else if(level === 5){

            startTimer(8);

        } else {

            startTimer(6);
        }

    } else {

        if(timerDisplay){
            timerDisplay.style.display = "none";
        }
    }

    // ==========================
    // LEVEL GAME MODES
    // ==========================

    if(level === 1){

        generateOddEven(20);

    } else if(level === 2){

        generateComparison(50);

    } else if(level === 3){

        if(Math.random() < 0.5){

            generateArithmetic(20);

        } else {

            generateOddEven(50);
        }

    } else if(level === 4){

        let r = Math.random();

        if(r < 0.33){

            generateOddEven(100);

        } else if(r < 0.66){

            generateComparison(200);

        } else {

            generateArithmetic(50);
        }

    } else {

        let r = Math.random();

        if(r < 0.33){

            generateOddEven(999);

        } else if(r < 0.66){

            generateComparison(999);

        } else {

            generateArithmetic(100);
        }
    }
}


// ==========================
// TIMER
// ==========================

function startTimer(seconds){

    clearInterval(timer);

    timeLeft = seconds;

    if(timerDisplay){
        timerDisplay.innerText = "Time: " + timeLeft;
    }

    timer = setInterval(() => {

        timeLeft--;

        if(timerDisplay){
            timerDisplay.innerText =
            "Time: " + timeLeft;
        }

        if(timeLeft === 2){
            playSound(soundWarning);
        }

        if(timeLeft <= 0){

            clearInterval(timer);

            totalIncorrect++;

            playSound(soundWrong);

            nextRound();
        }

    }, 1000);
}


// ==========================
// CHECK ANSWER
// ==========================

function checkAnswer(choice){

    if(!gameStarted) return;

    clearInterval(timer);

    if(choice === correctAnswer){

        score += 2;

        playSound(soundCorrect);

    } else {

        totalIncorrect++;

        playSound(soundWrong);
    }

    nextRound();
}


// ==========================
// ODD / EVEN MODE
// ==========================

function generateOddEven(range){

    playSound(soundReveal);

    let num = Math.floor(Math.random() * range) + 1;

    instruction.innerText =
    "Is the number Odd or Even?";

    mainDisplay.innerHTML = num;

    leftBtn.innerText = "ODD";
    rightBtn.innerText = "EVEN";

    correctAnswer =
    (num % 2 === 0) ? "RIGHT" : "LEFT";
}


// ==========================
// COMPARISON MODE
// ==========================

function generateComparison(range){

    playSound(soundReveal);

    let num1 =
    Math.floor(Math.random() * range) + 1;

    let num2 =
    Math.floor(Math.random() * range) + 1;

    while(num1 === num2){

        num2 =
        Math.floor(Math.random() * range) + 1;
    }

    let askBigger = Math.random() < 0.5;

    instruction.innerText = askBigger
        ? "Tap the BIGGER number side"
        : "Tap the SMALLER number side";

    mainDisplay.innerHTML = `
        <div class="option-container">
            <div>${num1}</div>
            <div>${num2}</div>
        </div>
    `;

    leftBtn.innerText = "LEFT";
    rightBtn.innerText = "RIGHT";

    if(askBigger){

        correctAnswer =
        (num1 > num2) ? "LEFT" : "RIGHT";

    } else {

        correctAnswer =
        (num1 < num2) ? "LEFT" : "RIGHT";
    }
}


// ==========================
// ARITHMETIC MODE
// ==========================

function generateArithmetic(range){

    playSound(soundReveal);

    let num1 =
    Math.floor(Math.random() * range) + 1;

    let num2 =
    Math.floor(Math.random() * range) + 1;

    let answer = num1 + num2;

    let wrongAnswer = answer + 2;

    let leftSide;
    let rightSide;

    if(Math.random() < 0.5){

        leftSide = answer;
        rightSide = wrongAnswer;

        correctAnswer = "LEFT";

    } else {

        leftSide = wrongAnswer;
        rightSide = answer;

        correctAnswer = "RIGHT";
    }

    instruction.innerText =
    "What is the correct answer?";

    mainDisplay.innerHTML = `
        <div class="arithmetic-container">
            <div class="equation">
                ${num1} + ${num2} = ?
            </div>

            <div class="choices">
                <div>${leftSide}</div>
                <div>${rightSide}</div>
            </div>
        </div>
    `;

    leftBtn.innerText = "FIRST";
    rightBtn.innerText = "SECOND";
}


// ==========================
// BUTTON EVENTS
// ==========================

if(leftBtn){

    leftBtn.addEventListener("click", () => {

        checkAnswer("LEFT");
    });
}

if(rightBtn){

    rightBtn.addEventListener("click", () => {

        checkAnswer("RIGHT");
    });
}


// ==========================
// BACK BUTTON
// ==========================

function exitGame(){

    clearInterval(timer);

    let confirmExit =
    confirm("Exit the game?");

    if(confirmExit){

        window.location.href = "index.html";
    }
}

if(backBtn){

    backBtn.addEventListener("click", exitGame);
}

if(introBackBtn){

    introBackBtn.addEventListener("click", exitGame);
}


// ==========================
// SOUND TOGGLE
// ==========================

if(soundBtn){

    soundBtn.addEventListener("click", function(){

        soundEnabled = !soundEnabled;

        this.innerText = soundEnabled
            ? "🔊 Sound ON"
            : "🔇 Sound OFF";
    });
}


// ==========================
// KEYBOARD SUPPORT
// ==========================

document.addEventListener("keydown", function(e){

    if(!gameStarted) return;

    if(e.key === "ArrowLeft"){

        checkAnswer("LEFT");
    }

    if(e.key === "ArrowRight"){

        checkAnswer("RIGHT");
    }
});
