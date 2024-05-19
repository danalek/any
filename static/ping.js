//Global Variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];

// the ball
var Ball = {
    new: function (incrementedSpeed) {
        return{
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            v: (this.canvas.height / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 7
        };
    }
};

// the ai
var Ai = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 14
        };
    }
};

var userKeys = {
    "W": false,
    "S": false,
}

var Game = {
    
    initialize: function (){
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 1400;
        this.canvas.height = 1000;

        this.canvas.style.width = (this.canvas.width / 2) + "px"; 
        this.canvas.style.height = (this.canvas.height / 2) + "px";

        this.player = Ai.new.call(this, 'left'); 
        this.ai = Ai.new.call(this, 'right'); 
        this.ball = Ball.new.call(this);

        this.ai.speed = 14;
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = '#8c52ff';

        Ping.menu();
        Ping.listen();
    },
    
    endGameMenu: function (text){
        Ping.context.font = '45px Silkscreen';
        Ping.context.fillStyle = this.color;


        Ping.context.fillRect(
            Ping.canvas.width / 2 - 350,
            Ping.canvas.height / 2 -48,
            700,
            100
        );
        Ping.context.fillStyle = '#ffffff';

        Ping.context.fillText(text,
            Ping.canvas.width / 2,
            Ping.canvas.height / 2 + 15
        );
        if ( confirm("Add your score to score board?") ) {
            window.location.href = "/ping/" + this.round;
        } else {
            setTimeout(function(){
                Ping = Object.assign({}, Game);
                Ping.initialize();
            }, 3000);
        }
    },

    menu: function() {
        Ping.draw();

        this.context.font = '50px Silkscreen';
        this.context.fillStyle = this.color;

        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        this.context.fillStyle = '#ffffff';

        this.context.fillText('Press any key to begin',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    update: function () {
        if (!this.over){
            if (this.ball.x <= 0) Ping._resetTurn.call(this, this.ai, this.player);
            if (this.ball.x >= this.canvas.width - this.ball.width) Ping._resetTurn.call(this, this.player, this.ai);
            if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
            
            if (this.player. move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            if(Ping._turnDelayIsOver.call(this) && this.turn) {
                if(this.player.score != 0){
                    this.round += 10;
                }
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }

            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

            if(this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }

            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;

            // Handle Player-Ball collisions
            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width){
                if(this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y){
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;
                    this.ball.speed += 0.2;
                    this.round += 1;
                }
            }

            // Handle ai-ball collision
            if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x -this.ai.width){
                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y){
                    this.ball.x = (this.ai.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;
                    this.ball.speed += 0.2;
                    this.round += 1;
                }
            }
        }

        if (this.ai.score === 1){
            this.over = true;
            setTimeout(function () { Ping.endGameMenu('Game Over!'); }, 1000);
        }
    },

    draw: function () {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.context.fillStyle = this.color;

        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.context.fillStyle = '#ffffff';

        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height
        );

        if(Ping._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.ball.x,
                this.ball.y,
                this.ball.width,
                this.ball.height
            );
        }

        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 222);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

        this.context.font = '100px Silkscreen';
        this.context.textAlign = 'center';

        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );

        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );

        this.context.fillText(
            'Score ' + (Ping.round),
            (this.canvas.width / 2),
            85
        );

        this.context.font = '40px Silkscreen';

    },

    loop: function () {
        Ping.update();
        Ping.draw();

        if (!Ping.over) requestAnimationFrame(Ping.loop);
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (Ping.running === false) {
                Ping.running = true;
                window.requestAnimationFrame(Ping.loop);
            }

            if (key.keyCode === 38 || key.keyCode === 87) {
                setTimeout(function() {Ping.player.move = DIRECTION.UP}, Number(document.getElementById("pingSlider").value))
            };
            if (key.keyCode === 40 || key.keyCode === 83) {
                setTimeout(function() {Ping.player.move = DIRECTION.DOWN}, Number(document.getElementById("pingSlider").value))
            };
        });

        document.addEventListener('keyup', function (key) { setTimeout(function() {Ping.player.move = DIRECTION.IDLE}, Number(document.getElementById("pingSlider").value)) });
    },

    _resetTurn: function(victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();

        victor.score++;
    },

    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1000);
    },

    _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Ping._generateRoundColor();
        return newColor;
    }
};

var Ping = Object.assign({}, Game);
setTimeout(function(){Ping.initialize()}, 500);