const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var ground;
var groungimg;
var tower;
var towerimg;
var bgimg;
var balls = [];
var boat;
var boats = [];
var boatanimation = [];
var boatspritedata;
var boatspritesheet;
var boatframes;
var BBanimation=[];
var BBspritedata;
var BBspritesheet;
var BBframes = [];
var gameover = false;
var fondomusica;
var explotion;
var water;
var pirate;
var isLaughing = false


function preload() {
  //groundimg = loadImage("./assets/background.gif");
  towerimg = loadImage("./assets/tower.png");
  bgimg = loadImage("./assets/background.gif");
  boatspritedata = loadJSON("./boat/boat.json");
  boatspritesheet = loadImage("./boat/boat.png");
  BBspritedata = loadJSON("./boat/brokenBoat.json");
  BBspritesheet = loadImage("./boat/brokenBoat.png");
  fondomusica = loadSound("./assets/background_music.mp3");
  explotion = loadSound("./assets/cannon_explosion.mp3");
  water = loadSound("./assets/cannon_water.mp3");
  pirate = loadSound("./assets/pirate_laugh.mp3");
} 

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  angleMode(DEGREES);
  angle = 15;

  var groundoptions = {
  isStatic: true
  }

  

  ground = Bodies.rectangle(0, height -1, width *2, 1, groundoptions);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, groundoptions);
  World.add(world, tower);

  cannon = new Cannon(180, 110, 180, 150, angle);
  //cannonball = new Cannonball(cannon.x, cannon.y);

  boatframes = boatspritedata.frames;
  for(var i=0; i < boatframes.length; i++){
    var pos = boatframes[i].position;
    var img = boatspritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatanimation.push(img);
  }
 

  BBframes = BBspritedata.frames;
  for(var i=0; i < BBframes.length; i++){
    var pos = BBframes[i].position;
    var img = BBspritesheet.get(pos.x, pos.y, pos.w, pos.h);
    BBanimation.push(img);
  }

}

function draw() {
  background(189);
  image(bgimg, 0, 0, width, height);
  if(!fondomusica.isPlaying()){
    fondomusica.play();
    fondomusica.setVolume(0.1);
  }

  Engine.update(engine);
  push();
  imageMode(CENTER);
  image(towerimg, tower.position.x, tower.position.y, 160, 310);
  pop();
  rect(ground.position.x, ground.position.y, width *2, 1);
  //rect(tower.position.x, tower.position.y, 160, 310);
  


  showboats();

  for(var i=0; i < balls.length; i++){
    showballs(balls[i]);
    collitionboat(i);
  }

  
  cannon.display();
}


function keyPressed(){
  if(keyCode === DOWN_ARROW){
   var cannonball = new Cannonball(cannon.x, cannon.y);
   Matter.Body.setAngle(cannonball.body, cannon.angle);
   balls.push(cannonball);
  }
}


function showballs(ball, index){
  if(ball){
    ball.display();
    if(ball.body.position.x >= width || ball.body.position.y >= height -50){
      ball.remove[index];
      //water.play();
    }
  }
}

function showboats(){
  if(boats.length > 0){
    if(
      boats[boats.length -1] === undefined || 
      boats[boats.length -1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      boat = new Boat (width, height -100, 170, 170, position, boatanimation);
      boats.push(boat);
    }

    for(var i=0; i < boats.length; i++){

      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });
      boats[i].display();
      boats[i].animate();
      var collition = Matter.SAT.collides(tower, boats[i].body);

      if(collition.collided && !boats[i].isBroken){
        gameover = true;
        findeljuego();
      }
      }
      else{
        boats[i];
      }
     }
    }
     else{
      boat = new Boat(width -79, height -60, 170, 170, -80, boatanimation);
      boats.push(boat);
     }
}



function keyReleased(){
  if(keyCode === DOWN_ARROW){
    //explotion.play();
    balls[balls.length - 1].shot();
  }
}

function collitionboat(index){
  for(var i=0; i<boats.length; i++){
    if(balls[index] !== undefined && boats[i] !== undefined){
      var collition = Matter.SAT.collides(balls[index].body, boats[i].body);
      if(collition.collided){
        boats[i].remove(i);
        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}



function findeljuego(){
  //pirate.play();
  swal(
    {
      title: "fin del juego",
      text: "gracias por jugar",
      imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "100 x 100",
      confirmButtonText: "volver a jugar"
    },
    function (isConfirm){
      if(isConfirm){
        location.reload();
      }
    }
  );  
}