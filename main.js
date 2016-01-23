var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.xdraw = null;
}

// tick: how much time since the last time we drew
Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;     // where in the sprite sheet you are printing from
    var yindex = 0;

    xindex = frame % 3;     // 5 images for width of the sprite sheet so % 5
    yindex = Math.floor(frame / 3);

    var sizeMultiplier = 0;
    //
    //if(this.backwards) { this.x = this.ctx.canvas.width; }
    //else {this.x = 0;}

    if(this.reverse) {
        y = y + 600;
        sizeMultiplier = 2;
    } else {
        y = y + 450;
        sizeMultiplier = 1;
    }

    //console.log(frame + " " + xindex + " " + yindex);

    // (spritesheet, which portion of spritesheet you want to paint x, y, how wide, how tall from the spritesheet, where to print x, y, how big do you want to draw w, h)
    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth*sizeMultiplier,
        this.frameHeight*sizeMultiplier);
}

Animation.prototype.currentFrame = function () {    // which frame to draw
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {          // is the animation done or not
    return (this.elapsedTime >= this.totalTime);
}

//function MushroomDude(game, spritesheet) {
//    this.animation = new Animation(spritesheet, 189, 230, 0.05, 14, true, false);
//    this.x = 0;
//    this.y = 0;
//    this.game = game;
//    this.ctx = game.ctx;
//}
//
//MushroomDude.prototype.draw = function () {
////    console.log("drawing");
//    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//}
//
//MushroomDude.prototype.update = function() {
//    this.x += 2;    // how fast the character moves across the screen
//}

//function Cat(game, spritesheet) {
//    this.animation = new Animation(spritesheet, 512, 256, 0.05, 8, true, false);
//    this.x = 0;
//    this.y = 0;
//    this.game = game;
//    this.ctx = game.ctx;
//}
//
//Cat.prototype.draw = function () {
////    console.log("drawing");
//    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//}
//
//Cat.prototype.update = function() {
//    this.x += 0;    // how fast the character moves across the screen
//}

function Camel(game, spritesheet, backwards) {
    //if(backwards) this.animation = new Animation(spritesheet, 80, 67,.5, 3, true, true);
    //else this.animation = new Animation(spritesheet, 80, 67,.5, 3, true, false);
    this.animation = new Animation(spritesheet, 80, 67,.5, 3, true, false);
    if(backwards) this.animation.reverse = true;


    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.jumping = false;
    this.backwards = backwards;
    if(this.backwards) { this.x = this.ctx.canvas.width; }
    else {this.x = 0;}
}

Camel.prototype.update = function() {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        //console.log("space!!");
        //if(this.backwards) {
        //    this.animation.spriteSheet = AM.getAsset("./img/camel.png");
        //    this.backwards = false;
        //} else {
        //    this.animation.spriteSheet = AM.getAsset("./img/camelbackwards.png");
        //    this.backwards = true;
        //}
        this.y -= 2;
        this.animation.frames = 1;
    }

    if(this.backwards) this.x -= 2;    // how fast the character moves across the screen
    else this.x += .5;


}

Camel.prototype.draw = function () {
//    console.log("drawing");
//    this.x -= 2;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.png");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/notthere.png");
AM.queueDownload("./img/camelbackwards.png");
AM.queueDownload("./img/camel.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

//    var img = AM.getAsset("./img/mushroomdude.png");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    //gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    //gameEngine.addEntity(new Cat(gameEngine, AM.getAsset("./img/runningcat.png")));
    gameEngine.addEntity(new Camel(gameEngine, AM.getAsset("./img/camelbackwards.png"), true));
    gameEngine.addEntity(new Camel(gameEngine, AM.getAsset("./img/camel.png"), false));

    console.log("All Done!");
});