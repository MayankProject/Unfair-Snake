let snakeArr = [ {x:9, y:9}];
let allStatesOfSnake = []

let lastPaintTime = 0;

let lastPlayedTimeMusic = 0; // use it to set loop for musics
let musicDuration = 26;

let lastPowerUpTime = 0;
let powerUpDuration = 5;
let currentPowerup = null;
let powerUpArr = {}
let powerUpInterval = Math.round(5 + (Math.random() * (10 - 5)));
let powerUpsList = ['Life']
let leftLifes = 0;

let lastObstacleTime = 0;
let obstacleTimeInterval = 2;
let obstacleArray = [];

let foodArr = {x:3, y:9};

let speed = 10;
let score = 0;

let screen_rev_x = 30;
let screen_rev_y = 18;


currentMotion = 'Rest';

const startSound = new Audio('music/marioStart.mp3');
const lifeUsed = new Audio('music/lifeUsed.wav');
const foodSound = new Audio('music/marioMove.mp3');
const heartSound = new Audio('music/pickup.mp3');
const gameOverSound = new Audio('music/marioGameOver.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/marioBgm.mp3');

showSnake()
generateFood()
handlePowerUps()
startSound.play()
setTimeout(()=>{
    musicSound.play()
}, 1000)

if (localStorage.getItem('HiScore')===null){
    localStorage.setItem('HiScore', 0)
}

function generateFood(){
    let x_new = Math.round(((screen_rev_x -2)-2)*Math.random() + 2);
    let y_new = Math.round(((screen_rev_y-2)-2)*Math.random() + 2); // final range will be (2, scrren_rev) so it will not pop up on borders
    foodArr['x'] = x_new;
    foodArr['y'] = y_new;
    if (document.querySelector('.food') !== null) {
        document.querySelector('.food').remove();
    }
    let food = document.createElement('div')
    food.classList.add('food');
    food.style.gridColumnStart = foodArr['x'];
    food.style.gridRowStart = foodArr['y'];
    document.querySelector('.board').appendChild(food);
    
    //appanding body to snake
    lastPart = snakeArr[snakeArr.length-1]
    let newSegAfterEat;
    if (currentMotion === 'x+'){
        newSegAfterEat = {x: lastPart['x']-1, y: lastPart['y']} 
    }
    else if (currentMotion === 'x-'){
        newSegAfterEat = {x: lastPart['x']+1, y: lastPart['y']} 
    }
    else if (currentMotion === 'y+'){
        newSegAfterEat = {x: lastPart['x'], y: lastPart['y']-1} 
    }
    else if (currentMotion === 'y-'){
        newSegAfterEat = {x: lastPart['x'], y: lastPart['y']+1} 
    }
    snakeArr.push(newSegAfterEat)
}


function generateObstacles(){
    obstacleArray = []
    if(document.getElementsByClassName('obstacle').length>0){
        Array.from(document.getElementsByClassName('obstacle')).forEach(e=>{
            e.remove();
        })
    }
    for (let i = 0; i < Math.round(Math.random()*10); i++) {    
        let startingCod = 1;
        let randomX = Math.round(startingCod + (Math.random())*(screen_rev_x-startingCod))
        let randomY = Math.round(startingCod + (Math.random())*(screen_rev_y-startingCod))
        let newObs = {x: randomX, y:randomY};
        obstacleArray.push(newObs)
        let obstacle = document.createElement('div')
        obstacle.classList.add('obstacle');
        obstacle.style.gridColumnStart = randomX;
        obstacle.style.gridRowStart = randomY;
        document.querySelector('.board').appendChild(obstacle);
    }
}
function handleScore(){
    document.querySelector('.crtScoreBox').innerHTML = `Current Score : ${score}`
    document.querySelector('.hiScoreBox').innerHTML = `High Score : ${localStorage.getItem('HiScore')}`
}

function showSnake(){
    if(document.getElementsByClassName('segment').length>0){
        Array.from(document.getElementsByClassName('segment')).forEach(e=>{
            e.remove();
        })
    }
    allStatesOfSnake.push(snakeArr)
    snakeArr.forEach((e, index)=>{
        let segment = document.createElement('div')
        segment.classList.add('segment');
        if(index===0){
            segment.classList.add('head')
        }
        segment.style.gridColumnStart = e['x'];
        segment.style.gridRowStart = e['y'];
        document.querySelector('.board').appendChild(segment);
    })
}

function moveSnake(){
    window.addEventListener('keydown', e=>{
        if (e.key === 'ArrowUp' && currentMotion !== 'y+'){ // purpose of Extra CurrentMotion condn is our snake wont move through his body
            currentMotion = 'y-'
            moveSound.play();
        }
        if (e.key === 'ArrowDown' && currentMotion !== 'y-'){
            currentMotion = 'y+'            
            moveSound.play();
        }
        if (e.key === 'ArrowLeft' && currentMotion !== 'x+'){
            currentMotion = 'x-'            
            moveSound.play();
        }
        if (e.key === 'ArrowRight' && currentMotion !== 'x-'){ 
            currentMotion = 'x+'            
            moveSound.play();
        }
    })
    if (currentMotion !== 'Rest') {
        
    let newSnake = [];
    let prevMove;

    snakeArr.forEach((e, index)=>{
        let newSeg;
        if (e!==undefined){
        if (currentMotion === 'x+'){
            newSeg = {x: e['x']+1, y: e['y']} 
        }
        else if (currentMotion === 'x-'){
            newSeg = {x: e['x']-1, y: e['y']} 
        }
        else if (currentMotion === 'y+'){
            newSeg = {x: e['x'], y: e['y']+1} 
        }
        else if (currentMotion === 'y-'){
            newSeg = {x: e['x'], y: e['y']-1} 
        }
        if (newSeg!==undefined){
            if (index === 0){
                newSnake.unshift(newSeg);
            }
            else{
                newSnake.push(prevMove)
            } 
        prevMove = e;
        snakeArr = newSnake;
        showSnake()
        }}
    })
}
}

function handlePowerUps(){
    snoPowerUp = Math.round(Math.random()*(powerUpsList.length-1))
    powerUp = powerUpsList[snoPowerUp]
    if (powerUp === 'Life'){
        currentPowerup = 'Life'
        let x_new = Math.round(((screen_rev_x -2)-2)*Math.random() + 2);
        let y_new = Math.round(((screen_rev_y-2)-2)*Math.random() + 2); // final range will be (2, scrren_rev) so it will not pop up on borders
        powerUpArr['x'] = x_new;
        powerUpArr['y'] = y_new;
        let life = document.createElement('div')
        life.classList.add('lifeOnBoard');
        life.style.gridColumnStart = x_new;
        life.style.gridRowStart = y_new;
        document.querySelector('.board').appendChild(life);
    }
}

function handlePowerUpPassed(ctime){
    if(Object.keys(powerUpArr).length>0){
        if((ctime - lastPowerUpTime)/1000 > 4){
            powerUpArr = {}
            document.querySelector('.lifeOnBoard').remove()
            lastPowerUpTime = ctime;
            currentPowerup = null
        }
        if(powerUpArr['x'] === snakeArr[0]['x'] && powerUpArr['y'] === snakeArr[0]['y']){
            if(currentPowerup === 'Life'){
                leftLifes++;
                powerUpArr = {}
                document.querySelector('.lifeOnBoard').remove()
                let newHeart = document.createElement('div');
                newHeart.classList.add('life');
                document.querySelector('.lifesBox').appendChild(newHeart);
                lastPowerUpTime = ctime;
                currentPowerup = null
        heartSound.play()
        heartSound.currentTime = 0.35;

            }
        }
    }
}

function gameOver(){
    if (leftLifes===0) {
    alert(`Game Over !! Your Score : ${score}`)
    snakeArr = {x:9, x:9}
    gameOverSound.play()
    if (localStorage.getItem('HiScore')<score) {
        localStorage.setItem('HiScore', score)
    }
    musicSound.pause()
    window.location.reload(true)
}
    else if(leftLifes>0){
        if (currentMotion === 'x+'){
            snakeArr.forEach((e, index)=>{
                snakeArr[index]['x'] = snakeArr[index]['x'] - 2;
            })
        }
        else if (currentMotion === 'x-'){
            snakeArr.forEach((e, index)=>{
            snakeArr[index]['x'] = snakeArr[index]['x'] + 2})
        }
        else if (currentMotion === 'y+'){
            snakeArr.forEach((e, index)=>{
                snakeArr[index]['y'] = snakeArr[index]['y'] - 2})
            }
        else if (currentMotion === 'y-'){
            snakeArr.forEach((e, index)=>{
                snakeArr[index]['y'] = snakeArr[index]['y'] + 2})
            }
    showSnake()
    leftLifes--;
    document.querySelector('.head').classList.add('savedByHeart');
    setTimeout(()=>{
        document.querySelector('.head').classList.remove('savedByHeart');
    }, 800)
    lifeUsed.play()
    document.querySelector('.life').remove()
    currentMotion = 'Rest';
        }
        }
        
function handleEatAndSpeed(){
    if (snakeArr[0]['x']===foodArr['x'] && snakeArr[0]['y']===foodArr['y']) {
        score++;
        speed+=0.5;
        generateFood()
        if (foodSound.paused){
            foodSound.play()
            foodSound.currentTime=0.25;
        }
        else{
            foodSound.currentTime=0;
        }
    }
}


function handleCollision(){
    try{
        let head = snakeArr[0];
            //By its very own tail (PS : Pooch se Dhokha) 
            snakeArr.forEach((e, index)=>{
                if(index>2){
                if (e['x'] === head['x'] && e['y'] === head['y'])  {
                    gameOver()
                }
            }            
            })
            //By world Border
            if (head['x']>screen_rev_x || head['y']>screen_rev_y || head['x']<=0 || head['y']<=0 && currentMotion!=='Rest') {
                // snakeArr = {x:9, y:9}
                gameOver()
            }
            //By Obstacle 
            obstacleArray.forEach(e=>{
                if (e['x'] === head['x'] && e['y'] === head['y'])  {
                        gameOver()
                }
            }) 
    }
    catch{}
}

function main(ctime){
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime)/1000 < (1/speed)) {
        return;
    }
    if ((ctime-lastPlayedTimeMusic)/1000 > musicDuration){
        musicSound.play()
    }
    if ((ctime - lastObstacleTime)/1000 > obstacleTimeInterval){
        generateObstacles()
        lastObstacleTime = ctime;
    }
    if ((ctime - lastPowerUpTime)/1000 > Math.round(9 + (Math.random() * (15 - 9))) &&  Object.keys(powerUpArr).length===0){
        handlePowerUps()
        lastPowerUpTime = ctime;
    }
    lastPaintTime = ctime;
    Run(ctime);
}

function Run(ctime) {
    //Moving the snake 
    moveSnake()

    // Handling Eating
    handleEatAndSpeed()

    //Handling Crash
    handleCollision()

    //handle Score
    handleScore()

    //handle power passed
    handlePowerUpPassed(ctime)



}

window.requestAnimationFrame(main)


