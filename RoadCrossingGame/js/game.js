
// create a new scene
let gameScene = new Phaser.Scene('Game');

//initiate scene parameters
gameScene.init = function() {
  this.playerSpeed = 4; 
    
  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 4;
       
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
};

//not terminating
this.isTerminating = false;


// load assets
gameScene.preload = function(){
  // load images
  this.load.image('background', 'assets/bg.png');
  this.load.image('goal','assets/chest.png');
  this.load.image('player', 'assets/horse.png');
  this.load.image('mooseclops', 'assets/mooseclops.png');
  this.load.image('goblin', 'assets/goblin.png');
};

// called once after the preload ends
gameScene.create = function() {
  // create bg sprite
  let bg = this.add.sprite(0, 0, 'background');

  // change the origin to the top-left corner
  //bg.setOrigin(0,0);

  // place sprite in the center
  bg.setPosition(640/2, 360/2);

  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;
    
  this.player = this.add.sprite(50,this.sys.game.config.height/2,'player');
  this.player.depth = 1;
  //this.player.setScale(1.5);
    
  this.goal = this.add.sprite(this.sys.game.config.width-80,this.sys.game.config.height/2,'goal');
  this.goal.depth = 1;
  //this.goal.setScale(1.5);
    
  this.enemies = this.add.group({
      key:'goblin', 
      repeat: 3,
      setXY: {
          x:150,
          y:100,
          stepX: 100,
          stepY:20,
         }
 
  });
    //enemy group speed
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
      
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;
      
  },this);
    

  
    
    
  console.log(gameW, gameH);
    

  console.log(bg);
  console.log(this);
};

gameScene.update = function() {
    
    //if(this.isTerminating) return;
    
    if(this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed;
    }
  
    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect,treasureRect)){
        console.log('You did it!')
        this.scene.restart();
        return;
    };
    
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;
    
    for(let i = 0; i< numEnemies; i ++){
         enemies[i].y += enemies[i].speed;
    
    
        // check we haven't passed min or max Y
        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;
 
        // if we passed the upper or lower limit, reverse
        if(conditionUp || conditionDown) {
            enemies[i].speed *= -1;
    }
    
    let enemyRect = enemies[i].getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
      console.log('Game over!');

      this.gameOver();
      return;
    }
   
  }  
    
};

gameScene.gameOver = function() {
    
  
  // initiated game over sequence
  this.isTerminating = true;
 
  // shake camera
  this.cameras.main.shake(500);
 
  // listen for event completion
  this.cameras.main.on('camerashakecomplete', function(camera, effect){
 
    // fade out
    this.cameras.main.fade(500);
  }, this);
 
  this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
    // restart the Scene
    this.scene.restart();
  }, this);
 
};

// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 640,
  height: 360,
  scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
