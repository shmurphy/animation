

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();   // () calls the function and then assigns what is returned from the function to the variable

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();

    this.timer = new Timer();
    console.log('game initialized');

    alert("Hit the space bar to watch the camels fly!");

}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;    // that is referring to GameEngine. this would refer to gameLoop when it's called below
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();               // define the function and then call the function
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {      // function that handles the event. e is the event
        if (String.fromCharCode(e.which) === ' ') that.space = true;
        //console.log(e);
        e.preventDefault();         // don't do the default event that the webpage will do
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();                         // stores all of the globals to remember them
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);    // changes the state of the globals
    }
    this.ctx.restore();                     // puts the globals back to whatever state they were saved in
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    //for (var i = 0; i < entitiesCount; i++) {
    //    var entity = this.entities[i];
    //
    //    entity.update();
    //}

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {  // if the entity is removed from the game already you don't need to update it
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1); // remove from the list
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = null;
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;       // how long its been since the last time we did an update
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);  // full circle
        this.game.ctx.stroke();     // actually does the drawing
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');     // document = webpage
    var size = Math.max(image.width, image.height);             // creates a square based on the size of the image
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');        // context
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);     // moves the origin point (0,0) to the middle
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}       // you would check your map to see if you already have this image rotated and saved already, but if you don't
        // you would call this method and rotate and save it in the map.