var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var boy, boy_running, boy_collided, boyImage, boy2, boy2_running, boy2_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  ground_image = loadImage("backround.jpg");
  boy_running = loadAnimation("boy.gif");
  boy2_running = loadAnimation("boy2.gif");
  obstacle1 = loadImage("obstacle1.png");
  boy2_idle = loadImage("Stand.png");
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  gameOverImage = loadImage("gameOver-1.png");
  restartImage = loadImage("restart1.png");
  boy_collided = loadImage("Dead (30).png");
  boyImage = loadImage("Idle (1).png");
}

function setup() {
  createCanvas(600, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  boy = createSprite(300, 300, 600, 10);
  boy.addAnimation("boy_running", boy_running);
  boy.addImage("boy_collided", boy_collided);
  boy.addImage("boyImage", boyImage);
  boy.scale = 0.2;
  // boy.velocityX=2;
  boy.debug = false;
  boy.setCollider("rectangle", 0, 0, boy.width, boy.height)


  boy2 = createSprite(50, 300, 600, 10);
  boy2.addAnimation("boy2_running", boy2_running);
  boy2.addAnimation("boy2_attack", boy2_attack);
  boy2.addImage("boy2_idle", boy2_idle);
  boy2.scale = 0.2;
  boy2.debug = false;

  invisible_ground = createSprite(300, 360, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.1;

  restart = createSprite(300, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");


  boy.velocityY = boy.velocityY + 0.8;
  boy.collide(invisible_ground);


  boy2.velocityY = boy2.velocityY + 0.8;
  boy2.collide(invisible_ground);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;

    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(boy2)) {
      boy2.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if ((keyDown("space") && boy.y >= 220)) {
      boy.velocityY = -12;
    }

    if (boy.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    boy.velocityY = 0
    boy2.x = boy.x;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("black");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.changeAnimation("boy_running", boy_running);
  obstaclesGroup.destroyEach();
  score = 0;
  boy2.x = 50;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 340, 10, 40);
    obstacle.velocityX = -6; //+ score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
  }

}