// got the collision code from chatgtp 



// getting html elements
const container = document.getElementById('container');
const box1 = document.getElementById('box1');
const box2 = document.getElementById('box2');
const treasure = document.getElementById("treasure");

// want to keep track of keys being used 
let keys = {};

// box speed 
const boxSpeed = 2; 
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

// update position of the boxes 
function updatePositions() {
    box1.style.transform = `translate(${box1PositionX}px, ${box1PositionY}px)`;
    box2.style.transform = `translate(${box2PositionX}px, ${box2PositionY}px)`;
}

// Your existing counter variables
let treasure_collected_counter_box1 = 0;
let treasure_collected_counter_box2 = 0;

//Added this new function eeee
// Function to check for collisions
function isColliding(rect, newX, newY, walls) {
    for (const wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        if (
            newX < wallRect.right &&
            newX + rect.width > wallRect.left &&
            newY < wallRect.bottom &&
            newY + rect.height > wallRect.top
        ) {
            return true; // Colliding with a wall
        }
    }
    return false; // No collision
}

// Function to check for collisions with treasures
function checkTreasureCollisions(boxRect, boxX, boxY, treasure) {
    const treasureRect = treasure.getBoundingClientRect();
    if (
        boxX < treasureRect.right &&
        boxX + boxRect.width > treasureRect.left &&
        boxY < treasureRect.bottom &&
        boxY + boxRect.height > treasureRect.top
    ) {
        return true; // Colliding with treasure
    }
    return false; // No collision
}


function moveBoxes() {
    let box1Rect = box1.getBoundingClientRect();
    let box2Rect = box2.getBoundingClientRect();
    const walls = document.querySelectorAll('.wall');
    // Check for collisions with treasures
    const treasureElements = document.querySelectorAll('.treasure');

    // Code for moving player 1
    if (keys['ArrowUp'] && box1PositionY - boxSpeed >= 0 && !isColliding(box1Rect, box1PositionX, box1PositionY - boxSpeed, walls)) 
        box1PositionY -= boxSpeed;
    
    if (keys['ArrowDown'] && box1PositionY + boxSpeed + box1.clientHeight <= containerHeight && !isColliding(box1Rect, box1PositionX, box1PositionY + boxSpeed, walls)) 
        box1PositionY += boxSpeed;
    
    if (keys['ArrowLeft'] && box1PositionX - boxSpeed >= 0 && !isColliding(box1Rect, box1PositionX - boxSpeed, box1PositionY, walls))
        box1PositionX -= boxSpeed;
    
    if (keys['ArrowRight'] && box1PositionX + boxSpeed + box1.clientWidth <= containerWidth && !isColliding(box1Rect, box1PositionX + boxSpeed, box1PositionY, walls)) 
        box1PositionX += boxSpeed;
    

    // Code for moving player 2
    if (keys['w'] && box2PositionY - boxSpeed >= 0 && !isColliding(box2Rect, box2PositionX, box2PositionY - boxSpeed, walls)) 
        box2PositionY -= boxSpeed;
    
    if (keys['s'] && box2PositionY + boxSpeed + box2.clientHeight <= containerHeight && !isColliding(box2Rect, box2PositionX, box2PositionY + boxSpeed, walls)) 
        box2PositionY += boxSpeed;
    
    if (keys['a'] && box2PositionX - boxSpeed >= 0 && !isColliding(box2Rect, box2PositionX - boxSpeed, box2PositionY, walls)) 
        box2PositionX -= boxSpeed;
    
    if (keys['d'] && box2PositionX + boxSpeed + box2.clientWidth <= containerWidth && !isColliding(box2Rect, box2PositionX + boxSpeed, box2PositionY, walls)) 
        box2PositionX += boxSpeed;
    

    for (const treasureElement of treasureElements) {
        if (checkTreasureCollisions(box1Rect, box1PositionX, box1PositionY, treasureElement)) {
            // Collision with box1, update counter and remove treasure
            treasureElement.remove();
            treasure_collected_counter_box1 += 1;
            updateCounter('p1counter', treasure_collected_counter_box1);
        }

        if (checkTreasureCollisions(box2Rect, box2PositionX, box2PositionY, treasureElement)) {
            // Collision with box2, update counter and remove treasure
            treasureElement.remove();
            treasure_collected_counter_box2 += 1;
            updateCounter('p2counter', treasure_collected_counter_box2);
        }
    }
    updatePositions(); 
}


const totalTreasures = 13; // Assuming there are 3 treasures for each player

function updateCounter(counterId, count) {
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
        counterElement.textContent = `${counterId} collected: ${count}`;

        // Check for the winning condition
        if (count === totalTreasures) {
            announceWinner(counterId);
            const winnerMessage = document.getElementById('winner');
            if (winnerMessage) 
                winnerMessage.textContent = `player ${playerId} has won!`;
        }
    }
}

// Announce the winner
function announceWinner(playerId) {
    const winnerMessage = document.getElementById('winner');
    if (winnerMessage) 
        winnerMessage.textContent = `player ${playerId} has won!`;
}

// Update player 1's counter
updateCounter('1', treasure_collected_counter_box1);

// Update player 2's counter
updateCounter('2', treasure_collected_counter_box2);



document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;

});

let box1PositionX = 0;
let box1PositionY = 0;
let box2PositionX = 0;
let box2PositionY = 0;

function gameLoop() {
    requestAnimationFrame(gameLoop);
    moveBoxes();
}

gameLoop();