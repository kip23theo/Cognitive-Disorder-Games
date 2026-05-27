// =======================
// VARIABLES
// =======================
let score = 0;
let level = 1;
let round = 1;
let lives = 5;
let correctAnswer = "";
let timer;
let timeLeft;
let soundEnabled = true;

// =======================
// SOUNDS
// =======================
const soundCorrect = new Audio("sounds/correct.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundReveal = new Audio("sounds/reveal.mp3");
const soundWarning = new Audio("sounds/warning.mp3");
const soundLevelUp = new Audio("sounds/levelup.mp3");

// =======================
// VOLUME
// =======================
soundCorrect.volume = 0.5;
soundWrong.volume = 0.5;
soundReveal.volume = 0.3;
soundWarning.volume = 0.3;
soundLevelUp.volume = 0.5;

// =======================
// START BUTTON
// =======================
document.getElementById("startGameBtn")
.addEventListener("click", function(){

    // Hide intro screen
    document.getElementById("introScreen").style.display = "none";

    // Show game container
    document.getElementById("gameContainer").style.display = "flex";

    // Start game
    startGame();
});

// =======================
// START GAME
// =======================
function startGame(){

    updateTopBar();

    generateRound();
}

// =======================
// UPDATE TOP BAR
// =======================
function updateTopBar(){

    document.getElementById("level").innerText = level;

    document.getElementById("round").innerText = round;

    document.getElementById("score").innerText = score;

    // HEARTS
    let hearts = "";

    for(let i = 0; i < lives; i++){
        hearts += "❤️ ";
    }

    document.getElementById("livesDisplay").innerText = hearts;

    // TIMER
    if(level <= 2){

        document.getElementById("timerDisplay").style.display = "none";
    }
    else{

        document.getElementById("timerDisplay").style.display = "block";
    }
}

// =======================
// GENERATE ROUND
// =======================
function generateRound(){

    clearInterval(timer);

    document.getElementById("instruction").innerText =
    "Which side has the ODD ONE OUT?";

    let leftPanel = document.getElementById("leftPanel");

    let rightPanel = document.getElementById("rightPanel");

    leftPanel.innerHTML = "";

    rightPanel.innerHTML = "";

    leftPanel.classList.remove("large");

    rightPanel.classList.remove("large");

    playSound(soundReveal);

    let oddSide = Math.random() < 0.5 ? "LEFT" : "RIGHT";

    correctAnswer = oddSide;

    let totalShapes = 9;

    // LEVEL 5+
    if(level >= 5){

        totalShapes = 16;

        leftPanel.classList.add("large");

        rightPanel.classList.add("large");
    }

    // CREATE SHAPES
    for(let i = 0; i < totalShapes; i++){

        leftPanel.appendChild(createShape(false));

        rightPanel.appendChild(createShape(false));
    }

    // ODD SHAPE
    let oddIndex = Math.floor(Math.random() * totalShapes);

    let oddShape = createShape(true);

    if(oddSide === "LEFT"){

        leftPanel.children[oddIndex].replaceWith(oddShape);
    }
    else{

        rightPanel.children[oddIndex].replaceWith(oddShape);
    }

    // TIMER
    if(level >= 3){

        let seconds = 8;

        if(level === 4){

            seconds = 6;
        }
        else if(level === 5){

            seconds = 5;
        }
        else if(level >= 6){

            seconds = 4;
        }

        startTimer(seconds);
    }
    else{

        document.getElementById("timerDisplay").innerText =
        "Time: --";
    }
}

// =======================
// CREATE SHAPE
// =======================
function createShape(isOdd){

    let shape = document.createElement("div");

    shape.classList.add("shape");

    let isMobile = window.innerWidth <= 768;

    // LEVEL 1
    if(level === 1){

        if(isOdd){

            shape.classList.add("square");

            shape.classList.add("red");
        }
    }

    // LEVEL 2
    else if(level === 2){

        if(isOdd){

            shape.classList.add("red");
        }
    }

    // LEVEL 3
    else if(level === 3){

        if(isOdd){

            shape.classList.add("small");
        }
    }

    // LEVEL 4
    else if(level === 4){

        shape.style.width = "0";

        shape.style.height = "0";

        shape.style.background = "transparent";

        shape.style.borderRadius = "0%";

        if(isMobile){

            shape.style.borderLeft =
            "11px solid transparent";

            shape.style.borderRight =
            "11px solid transparent";

            shape.style.borderBottom =
            "22px solid #2f84d6";
        }
        else{

            shape.style.borderLeft =
            "32px solid transparent";

            shape.style.borderRight =
            "32px solid transparent";

            shape.style.borderBottom =
            "65px solid #2f84d6";
        }

        if(isOdd){

            shape.classList.add("rotate");
        }
    }

    // LEVEL 5
    else if(level === 5){

        if(isOdd){

            shape.classList.add("outline");
        }
    }

    // LEVEL 6+
    else{

        if(isOdd){

            shape.classList.add("shade");
        }
    }

    return shape;
}

// =======================
// TIMER
// =======================
function startTimer(seconds){

    timeLeft = seconds;

    document.getElementById("timerDisplay").innerText =
    "Time: " + timeLeft;

    timer = setInterval(function(){

        timeLeft--;

        document.getElementById("timerDisplay").innerText =
        "Time: " + timeLeft;

        if(timeLeft === 2){

            playSound(soundWarning);
        }

        if(timeLeft <= 0){

            clearInterval(timer);

            lives--;

            playSound(soundWrong);

            nextRound();
        }

    },1000);
}

// =======================
// CHECK ANSWER
// =======================
function checkAnswer(choice){

    clearInterval(timer);

    if(choice === correctAnswer){

        score += 2;

        playSound(soundCorrect);
    }
    else{

        lives--;

        playSound(soundWrong);
    }

    nextRound();
}

// =======================
// NEXT ROUND
// =======================
function nextRound(){

    round++;

    // LEVEL COMPLETE
    if(round > 15){

        playSound(soundLevelUp);

        alert("Level Complete!");

        level++;

        round = 1;
    }

    // GAME OVER
    if(lives <= 0){

        alert("Game Over! Final Score: " + score);

        location.reload();

        return;
    }

    updateTopBar();

    generateRound();
}

// =======================
// PLAY SOUND
// =======================
function playSound(sound){

    if(!soundEnabled) return;

    sound.pause();

    sound.currentTime = 0;

    sound.play().catch(function(){

        console.log("Sound blocked");
    });
}

// =======================
// BUTTON CONTROLS
// =======================
document.getElementById("leftBtn")
.addEventListener("click", function(){

    checkAnswer("LEFT");
});

document.getElementById("rightBtn")
.addEventListener("click", function(){

    checkAnswer("RIGHT");
});

// =======================
// BACK BUTTON
// =======================

document.getElementById("backBtn")
.addEventListener("click", function(){

    let confirmExit = confirm("Exit the game?");

    if(confirmExit){

        window.location.href = "index.html";

        // OR:
        // history.back();
    }
});

// =======================
// INTRO BACK BUTTON
// =======================

document.getElementById("introBackBtn")
.addEventListener("click", function(){

    let confirmExit = confirm("Exit the game?");

    if(confirmExit){

        window.location.href = "index.html";

        // OR:
        // history.back();
    }
});

// =======================
// SOUND TOGGLE
// =======================

document.getElementById("soundBtn")
.addEventListener("click", function(){

    soundEnabled = !soundEnabled;

    if(soundEnabled){

        this.innerText = "🔊 Sound ON";

    } else {

        this.innerText = "🔇 Sound OFF";
    }
});

// =======================
// KEYBOARD CONTROLS
// =======================
document.addEventListener("keydown", function(e){

    if(e.key === "ArrowLeft"){

        checkAnswer("LEFT");
    }

    if(e.key === "ArrowRight"){

        checkAnswer("RIGHT");
    }
});
