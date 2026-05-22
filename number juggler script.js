// ==========================
// GAME VARIABLES
// ==========================

let score = 0;
let level = 1;
let roundsInLevel = 0;
let totalIncorrect = 0;
let correctAnswer = "";
let timer;
let timeLeft;

// ==========================
// SOUNDS
// ==========================

const soundCorrect = new Audio("sounds/correct.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundReveal = new Audio("sounds/reveal.mp3");
const soundWarning = new Audio("sounds/warning.mp3");
const soundLevelUp = new Audio("sounds/levelup.mp3");

soundCorrect.volume = 0.5;
soundWrong.volume = 0.5;
soundReveal.volume = 0.3;
soundWarning.volume = 0.3;
soundLevelUp.volume = 0.5;

// ==========================
// PLAY SOUND
// ==========================

function playSound(sound){
    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(()=>{
        console.log("Sound blocked");
    });
}

// ==========================
// START GAME BUTTON
// ==========================

document.getElementById("startGameBtn")
.addEventListener("click", function(){

    document.getElementById("introScreen").style.display = "none";

    startGame();
});

// ==========================
// START GAME
// ==========================

function startGame(){

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

    document.querySelector(".top-bar-lives").innerText = hearts;
}
// ==========================
// NEXT ROUND
// ==========================

function nextRound(){

    clearInterval(timer);

    roundsInLevel++;

    if(roundsInLevel > 15){

        playSound(soundLevelUp);

        alert("Level Complete!");

        level++;
        roundsInLevel = 1;
    }

    if(totalIncorrect >= 5){

        alert("Game Over! Final Score: " + score);

        location.reload();

        return;
    }

    document.getElementById("level").innerText = level;

    document.getElementById("score").innerText = score;

    updateLives();

    // ==========================
    // TIMER SETTINGS
    // ==========================

    if(level >= 4){

        document.getElementById("timerDisplay").style.display = "block";

        if(level === 4){
            startTimer(10);
        }
        else if(level === 5){
            startTimer(8);
        }
        else{
            startTimer(6);
        }

    } else {

        document.getElementById("timerDisplay").style.display = "none";
    }

    // ==========================
    // LEVEL SETTINGS
    // ==========================

    // LEVEL 1
    // Odd / Even (1–20)

    if(level === 1){

        generateOddEven(20);
    }

    // LEVEL 2
    // Comparison (1–50)

    else if(level === 2){

        generateComparison(50);
    }

    // LEVEL 3
    // Arithmetic + Odd/Even

    else if(level === 3){

        if(Math.random() < 0.5){

            generateArithmetic(20);

        } else {

            generateOddEven(50);
        }
    }

    // LEVEL 4
    // Medium difficulty

    else if(level === 4){

        let r = Math.random();

        if(r < 0.33){

            generateOddEven(100);

        }
        else if(r < 0.66){

            generateComparison(200);

        }
        else{

            generateArithmetic(50);
        }
    }

    // LEVEL 5+
    // HARD MODE with 3-digit numbers

    else{

        let r = Math.random();

        if(r < 0.33){

            // ODD / EVEN 1–999
            generateOddEven(999);

        }
        else if(r < 0.66){

            // 3-digit comparisons
            generateComparison(999);

        }
        else{

            // harder arithmetic
            generateArithmetic(100);
        }
    }
}
// ==========================
// TIMER
// ==========================

function startTimer(seconds){

    timeLeft = seconds;

    let timerElement = document.getElementById("timerDisplay");

    timerElement.innerText = "Time: " + timeLeft;

    timer = setInterval(function(){

        timeLeft--;

        timerElement.innerText = "Time: " + timeLeft;

        if(timeLeft === 2){
            playSound(soundWarning);
        }

        if(timeLeft <= 0){

            clearInterval(timer);

            totalIncorrect++;

            playSound(soundWrong);

            nextRound();
        }

    },1000);
}

// ==========================
// CHECK ANSWER
// ==========================

function checkAnswer(choice){

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
// ODD EVEN MODE
// ==========================

function generateOddEven(range){

    playSound(soundReveal);

    let num = Math.floor(Math.random() * range) + 1;

    document.getElementById("instruction").innerText =
    "Is the number Odd or Even?";

    document.getElementById("mainDisplay").innerHTML = num;

    document.getElementById("leftBtn").innerText = "ODD";
    document.getElementById("rightBtn").innerText = "EVEN";

    if(num % 2 === 0){
        correctAnswer = "RIGHT";
    } else {
        correctAnswer = "LEFT";
    }
}

// ==========================
// COMPARISON MODE
// ==========================

// ==========================
// GAME MODE: COMPARISON
// ==========================
function generateComparison(range) {

    playSound(soundReveal);

    let num1 = Math.floor(Math.random() * range) + 1;
    let num2 = Math.floor(Math.random() * range) + 1;

    while (num1 === num2) {
        num2 = Math.floor(Math.random() * range) + 1;
    }

    let askBigger = Math.random() < 0.5;

    // ACCESSIBLE INSTRUCTION
    if (askBigger) {
        document.getElementById("instruction").innerText =
            "Tap the BIGGER number side";
    } else {
        document.getElementById("instruction").innerText =
            "Tap the SMALLER number side";
    }

    // SHOW NUMBERS
    document.getElementById("mainDisplay").innerHTML = `
        <div class="option-container">
            <div>${num1}</div>
            <div>${num2}</div>
        </div>
    `;

    // BUTTON LABELS
    let leftBtn = document.getElementById("leftBtn");
    let rightBtn = document.getElementById("rightBtn");

    leftBtn.innerText = "LEFT";
    rightBtn.innerText = "RIGHT";

    leftBtn.className = "";
    rightBtn.className = "";

    // CORRECT ANSWER LOGIC
    if (askBigger) {
        correctAnswer = (num1 > num2) ? "LEFT" : "RIGHT";
    } else {
        correctAnswer = (num1 < num2) ? "LEFT" : "RIGHT";
    }
}
// ==========================
// ARITHMETIC MODE
// ==========================

function generateArithmetic(range){

    playSound(soundReveal);

    let num1 = Math.floor(Math.random() * range) + 1;
    let num2 = Math.floor(Math.random() * range) + 1;

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

    document.getElementById("instruction").innerText =
    "What is the correct answer?";

    document.getElementById("mainDisplay").innerHTML = `
        <div class="arithmetic-container">
            <div class="equation">${num1} + ${num2} = ?</div>

            <div class="choices">
                <div>${leftSide}</div>
                <div>${rightSide}</div>
            </div>
        </div>
    `;

    document.getElementById("leftBtn").innerText = "FIRST";
document.getElementById("rightBtn").innerText = "SECOND";
}

// ==========================
// RANDOM MODE
// ==========================

function pickRandomType(range){

    let r = Math.random();

    if(r < 0.33){
        generateOddEven(range);
    }
    else if(r < 0.66){
        generateComparison(range);
    }
    else{
        generateArithmetic(20);
    }
}

// ==========================
// BUTTON EVENTS
// ==========================

document.getElementById("leftBtn")
.addEventListener("click", function(){

    checkAnswer("LEFT");

});

document.getElementById("rightBtn")
.addEventListener("click", function(){

    checkAnswer("RIGHT");

});

// ==========================
// KEYBOARD SUPPORT
// ==========================

document.addEventListener("keydown", function(e){

    if(e.key === "ArrowLeft"){
        checkAnswer("LEFT");
    }

    if(e.key === "ArrowRight"){
        checkAnswer("RIGHT");
    }
});