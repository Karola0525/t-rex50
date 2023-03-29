var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var PLAY=1
var END=0;
var gameState=PLAY;
var gameOverImg,restartImg,gameOver,restart


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartImg=loadImage("restart.png")
  gameOverImg=loadImage("gameOver.png")
  sound1= loadSound("jump.mp3")
  sound2=loadSound("die.mp3")
  sound3=loadSound("checkpoint.mp3")

  
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  var message=("Esto es un mensaje")
  console.log(message)
  
  trex = createSprite(50,height-40 ,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.addAnimation("collided",trex_collided);
  
 ground = createSprite(width/2,height-10,width,125);  
 ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-5,width,1);  
  invisibleGround.visible = false;
  
  console.log("Hello" + 5);
  
  score = 0;
  obstaclesGroup=createGroup();
  cloudsGroup=createGroup();

  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  gameOver.visible=false;


  restart=createSprite(width/2,height/2)  
  restart.addImage(restartImg)
  restart.scale=0.5;
  restart.visible=false;

  //trex.setCollider("circle",0,0,40)
  trex.setCollider("rectangle",0,0,120,trex.height)
  trex.debug=true;
}

function draw() {
  background(180);
  //var message=("Esto es un mensaje")
  //console.log(message)
  text("Puntuación:"+score,width-100,50);
  if(gameState===PLAY){

  score = score + Math.round(frameCount/60);
  if(score>0 && score%100===0){
    sound3.play();
  }
 //revisar piso 
  ground.velocityX = -(4+3*score/100)
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
 if((touches.length>0 || keyDown("space"))&& trex.y >= height-100) {
      trex.velocityY = -10;
      sound1.play();
      touches=[];
    }
  
  trex.velocityY = trex.velocityY + 0.8
  
  
  //aparecer nubes
  spawnClouds();
  
  //aparecer obstáculos en el suelo
  spawnObstacles();
  if(obstaclesGroup.isTouching(trex)){
    //cambiar 
  trex.changeAnimation("collided",trex_collided)
   gameState=END;
   //trex.velocityY=-10
   sound2.play();
  }
  }

  else if(gameState===END){
    //cambiar la velocidad del piso
    ground.velocityX = 0;
    trex.velocityY=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //Hacer visible gameover
     gameOver.visible=true;
    restart.visible=true;
    if((touches.length>0 || mousePressedOver(restart))){
      console.log("Reinicia el juego")
      reset();
      touches=[];
    } 

    if(mousePressedOver(restart)){
      console.log("Reinicia el juego")

      reset();
    } 
  

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }
  

 
  trex.collide(invisibleGround);
  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  //hasta aquí revisar
  trex.changeAnimation("running",trex_running)
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
  var obstacle=createSprite(width/2,height-20,width,125);
   obstacle.velocityX = -(6+score/100);

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle)
 }
}




function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 60 === 0) {
    cloud=createSprite(width/2,100,40,10);
    cloud.y = Math.round(random(10,height-200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud)
  }
  
}
