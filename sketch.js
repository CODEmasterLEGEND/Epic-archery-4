const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var palyer, playerBase;
var computer, computerBase;

//Declare an array for arrows playerArrows = [ ]
var playerArrows = [];

var arrow;


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, random(450, height - 300), 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120
  );

  computerBase = new ComputerBase(
    width - 300,
    random(450, height - 300),
    180,
    150
  );
  computer = new Computer(
    width - 280,
    computerBase.body.position.y - 153,
    50,
    180
  );
  computerArcher = new ComputerArcher(
    width - 340,
    computerBase.body.position.y - 180,
    120,
    120
  );
  
 


}

function draw() {
  background(180);

  Engine.update(engine);

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

 
  playerBase.display();
  player.display();
  

  computerBase.display();
  computer.display();
  
  playerArcher.display();
  computerArcher.display()

 // Uncomment and use correct for loop to display arrow using showArrow() function
 for (var i=0; i<playerArrows.length; i++) 
 {
 showArrows(i, playerArrows);
 }

}



function keyPressed() {
  if(keyCode === 32){
    // create an arrow object and add into an array ; set its angle same as angle of playerArcher
    var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle+PI/2;
    var arrow = new PlayerArrow(posX, posY, 100, 10);
    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);
  }
}

function keyReleased () {

  if(keyCode === 32){
    //call shoot() function for each arrow in an array playerArrows
    if (playerArrows.length) {
      var angle = playerArcher.body.angle+PI/2;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }

}
//Display arrow and Tranjectory
function showArrows(index, arrows) {
  arrows[index].display();
  if (
    arrows[index].body.position.x > width ||
    arrows[index].body.position.y > height
  ) {
    if (!arrows[index].isRemoved) {
      arrows[index].remove(index, arrows);
    } else {
      arrows[index].trajectory = [];
    }
  }
    
  
 

}

function handlePlayerArrowCollision() {
  for (var i = 0; i < playerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computerBase.body
    );

     var computerCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computer.body
    );

    var computerArcherCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computerArcher.body
    );

    if (
      baseCollision.collided ||
      computerArcherCollision.collided ||
      computerCollision.collided
    ) {

      
      playerArcherLife -= 1;
      player.reduceLife(playerArcherLife);

      if (computerArcherLife <= 0) {
        computerArcher.collapse = true;
        Matter.Body.setStatic(computerArcher.body, false);
        Matter.Body.setStatic(computer.body, false);
        Matter.Body.setPosition(computer.body, {
          x: width - 100,
          y: computer.body.position.y
        });
      }
    }
  }
}

function handleComputerArrowCollision() {
  for (var i = 0; i < computerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerBase.body
    );

    var playerCollision = Matter.SAT.collides(
      computerArrows[i].body,
      player.body
    );

    var playerArcherCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerArcher.body
    );

    if (
      baseCollision.collided ||
      playerCollision.collided||
      playerArcherCollision.collided
    ) {
      playerArcherLife -= 1;
      player.reduceLife(playerArcherLife);
      if (playerArcherLife <= 0) {
        playerArcher.collapse = true;
        Matter.Body.setStatic(playerArcher.body, false);
        Matter.Body.setStatic(player.body, false);
        Matter.Body.setPosition(player.body, {
          x: 100,
          y: player.body.position.y
        });
      }
    }
  }
}