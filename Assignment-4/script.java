const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");

let score = 0;
let time = 30;
let gameRunning = false;

function moveBox() {

    const maxX = gameArea.clientWidth - box.clientWidth;
    const maxY = gameArea.clientHeight - box.clientHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    box.style.left = x + "px";
    box.style.top = y + "px";

    const colors = [
        "red",
        "blue",
        "green",
        ];

    box.style.background =
        colors[Math.floor(Math.random() * colors.length)];
}

box.addEventListener("click", function () {

    if (!gameRunning) return;

    score++;
    scoreDisplay.textContent = score;

    moveBox();
});

startBtn.addEventListener("click", function () {

    score = 0;
    time = 30;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;

    gameRunning = true;

    box.style.display = "block";

    moveBox();

    startBtn.disabled = true;

    const moveInterval = setInterval(() => {

        if (!gameRunning) {
            clearInterval(moveInterval);
            return;
        }

        moveBox();

    }, 1000);

    const timer = setInterval(() => {

        time--;
        timeDisplay.textContent = time;

        if (time <= 0) {

            clearInterval(timer);
            clearInterval(moveInterval);

            gameRunning = false;

            box.style.display = "none";

            alert("Game Over!\nYour Score: " + score);

            startBtn.disabled = false;

        }

    }, 1000);

});
