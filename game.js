const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 10;
const playerHeight = 60;
const ballSize = 10;
const playerSpeed = 5;
const jumpSpeed = 10;
const kickRange = 15;
const ballSpeed = 3;
const gravity = 0.5; // Simple gravity effect
const friction = 0.8; // Friction to slow down player movement
const goalWidth = 60;
const goalHeight = canvas.height / 5;
const goalBuffer = 5; // Buffer area around the goal

let leftPlayer = { 
    x: 20, 
    y: canvas.height - playerHeight, 
    width: playerWidth, 
    height: playerHeight, 
    vx: 0, 
    vy: 0, 
    jumping: false,
    grounded: true
};
let rightPlayer = { 
    x: canvas.width - 30 - playerWidth, 
    y: canvas.height - playerHeight, 
    width: playerWidth, 
    height: playerHeight, 
    vx: 0, 
    vy: 0, 
    jumping: false,
    grounded: true
};
let ball = { 
    x: canvas.width / 2, 
    y: canvas.height / 2, 
    radius: ballSize / 2, 
    dx: ballSpeed, 
    dy: ballSpeed 
};

let leftScore = 0; // Score for the left player
let rightScore = 0; // Score for the right player

function drawPlayer(player, color) {
    ctx.fillStyle = color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawGoal() {
    // Draw goals
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, canvas.height - goalHeight, goalWidth, goalHeight); // Left goal
    ctx.fillRect(canvas.width - goalWidth, canvas.height - goalHeight, goalWidth, goalHeight); // Right goal
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Left Player: ${leftScore}`, 20, 30);
    ctx.fillText(`Right Player: ${rightScore}`, canvas.width - 140, 30);
}

function update() {
    // Apply friction
    leftPlayer.vx *= friction;
    rightPlayer.vx *= friction;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with players
    if (ball.x - ball.radius < leftPlayer.x + leftPlayer.width &&
        ball.y > leftPlayer.y && ball.y < leftPlayer.y + leftPlayer.height) {
        ball.dx *= -1;
        ball.dy += (Math.random() - 0.5) * 2;
    }

    if (ball.x + ball.radius > rightPlayer.x &&
        ball.y > rightPlayer.y && ball.y < rightPlayer.y + rightPlayer.height) {
        ball.dx *= -1;
        ball.dy += (Math.random() - 0.5) * 2;
    }

    // Ball collision with goals
    if (ball.x - ball.radius < goalWidth + goalBuffer &&
        ball.y > canvas.height - goalHeight - goalBuffer) {
        // Ball is in left goal area (Right player scores)
        rightScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width - goalWidth - goalBuffer &&
        ball.y > canvas.height - goalHeight - goalBuffer) {
        // Ball is in right goal area (Left player scores)
        leftScore++;
        resetBall();
    }

    // Apply gravity and update player position
    [leftPlayer, rightPlayer].forEach(player => {
        player.vy += gravity; // Apply gravity
        player.y += player.vy; // Update y position

        // Check if player is grounded
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.vy = 0;
            player.jumping = false;
            player.grounded = true;
        } else {
            player.grounded = false;
        }
        
        // Update player x position
        player.x += player.vx;
        
        // Keep player within bounds
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    });
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(leftPlayer, 'blue');
    drawPlayer(rightPlayer, 'green');
    drawBall();
    drawGoal();
    drawScore(); // Draw scores
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Handle player movement
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            if (leftPlayer.grounded && !leftPlayer.jumping) {
                leftPlayer.vy = -jumpSpeed;
                leftPlayer.jumping = true;
            }
            break;
        case 's':
            leftPlayer.vy = 0; // Stop jumping if going down
            break;
        case 'a':
            leftPlayer.vx = -playerSpeed;
            break;
        case 'd':
            leftPlayer.vx = playerSpeed;
            break;
        case 'ArrowUp':
            if (rightPlayer.grounded && !rightPlayer.jumping) {
                rightPlayer.vy = -jumpSpeed;
                rightPlayer.jumping = true;
            }
            break;
        case 'ArrowDown':
            rightPlayer.vy = 0; // Stop jumping if going down
            break;
        case 'ArrowLeft':
            rightPlayer.vx = -playerSpeed;
            break;
        case 'ArrowRight':
            rightPlayer.vx = playerSpeed;
            break;
    }
});

// Handle ball kick
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case ' ':
            if (Math.abs(ball.x - leftPlayer.x) < kickRange &&
                ball.y > leftPlayer.y && ball.y < leftPlayer.y + leftPlayer.height) {
                ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
                ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
            }
            break;
        case 'Enter':
            if (Math.abs(ball.x - rightPlayer.x) < kickRange &&
                ball.y > rightPlayer.y && ball.y < rightPlayer.y + rightPlayer.height) {
                ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
                ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
            }
            break;
    }
});

gameLoop();
