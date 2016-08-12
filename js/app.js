// Gobal variable
let colWidth = 101
let rowHeight = 83;
let baseSpeed = 1;
let numCols = 5;
let numRows = 6;

let getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Element is the base class of elements, such as player and gem, on the board.
var Element = function(x, y, sprite) {
    // The image/sprite for the element, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

Element.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * colWidth, this.y * rowHeight);
};

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    Element.call(this, x, y, 'images/enemy-bug.png');
    this.speed = speed;
};

Enemy.prototype = Object.create(Element.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x >= numCols) {
        this.x = -1;
    }

    // Check collation
    var enemy = this;
    allPlayers.forEach(function(player) {
        if (isCollided(enemy.x, enemy.y, player.x, player.y)) {
            player.reset();
        }
    });
};

// Player has two new fields, original and state.
// Original is a used to save the Player's original position, so we can reset
// the player to it's original position after restart the game or collision.
// dx and dy is the user input on the chaneg of player coordinates. We will
// try to update player by these value in update()
// State is used to store current player state. we will enable or disable
// ability of player in different state.
var Player = function(x, y, sprite) {
    Element.call(this, x, y, sprite);
    this.original = {
        'x': this.x,
        'y': this.y
    };
    this.dx = 0;
    this.dy = 0;
    this.state = 'Waiting';
};

Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {

    var player = this;
    allRocks.forEach(function(rock) {
      if (isCollided(player.x + player.dx, player.y + player.dy, rock.x, rock.y)) {
          player.dx = 0;
          player.dy = 0;
      }
    });
    this.x += this.dx;
    this.y += this.dy;

    this.dx = 0;
    this.dy = 0;

    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.x >= numCols) {
        this.x = numCols - 1;
    }
    if (this.y >= (numRows - 1) && this.state !== 'Waiting') {
        this.y = numRows - 2;
    }
    if (this.y === 0) {
        // character reached the water, so we can start another turn.
        if (this.state !== 'Stopped') {
            selector.state = 'Active';
        }
        this.state = 'Stopped';
    }
};

Player.prototype.handleInput = function(allowedKeys) {

    switch (allowedKeys) {
        case 'left':
            this.dx = -1;
        break;
        case 'up':
            this.dy = -1;
        break;
        case 'right':
            this.dx = 1;
        break;
        case 'down':
            this.dy = 1;
        break;
        default:

    }
};

Player.prototype.reset = function() {
    this.state = 'Waiting';
    this.x = this.original.x;
    this.y = this.original.y;
    selector.state = 'Active';
}

var Selector = function() {
    Element.call(this, 0, numRows - 1, 'images/Selector.png');

    // Selector has three state,
    // 1. 'Active': the selector is on and user are selecting character.
    // 2. 'Waiting': user is controling a character, and selector is waiting
    //               for next activation
    this.state = 'Active';

    // dx is the user input on updating selector x coordinate, we will update
    // selector's x coordinate with this value during update()
    this.dx = 0;
}

Selector.prototype = Object.create(Element.prototype);
Selector.prototype.constructor = Selector;

Selector.prototype.update = function(dt) {

    this.x += this.dx;
    this.dx = 0;

    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x >= numCols) {
        this.x = numCols - 1;
    }
    if (this.y !== numRows - 1) {
        this.y = numRows - 1;
    }
};

Selector.prototype.handleInput = function(allowedKeys) {

    switch (allowedKeys) {
        case 'left':
            this.dx = -1;
        break;
        case 'right':
            this.dx = 1;
        break;
        case 'space':
        if (this.state == 'Active') {
            var selector = this;
            allPlayers.forEach(function(player) {
                if (isCollided(selector.x, selector.y, player.x, player.y)) {
                    player.state = 'Active';
                    player.handleInput('up');
                    selector.state = 'Paused';
                }
            });
        }
        break;
        default:

    }
};

Selector.prototype.render = function() {
    if (this.state === 'Active') {
        ctx.drawImage(Resources.get(this.sprite), this.x * colWidth, this.y * rowHeight);
    }
};

var Rock = function(x, y) {
    Element.call(this, x, y, 'images/Rock.png');
}

Rock.prototype = Object.create(Element.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * colWidth, this.y * rowHeight);
}

var Message = function() {
    this.shouldShow = false;
};

Message.prototype.update = function() {
    var gameEnded = true;
    allPlayers.forEach(function(player) {
        gameEnded = gameEnded && player.state === 'Stopped';
    });
    if (gameEnded) {
        this.shouldShow = true;
    }
};

Message.prototype.render = function() {
    if (this.shouldShow) {
        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mession Completed!', ctx.canvas.width / 2, 40);
    }
};

// input are the coordinates of the elements.
// return true if two elements are overllaped; else false.
var isCollided = function(x1, y1, x2, y2) {
    if (x1 >= x2 + 1) {
        return false;
    } else if (y1 >= y2 + 1) {
        return false;
    } else if (x2 >= x1 + 1) {
        return false;
    } else if (y2 >= y1 + 1) {
        return false;
    } else {
        return true;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
    new Enemy(-1, 1, baseSpeed * 3),
    new Enemy(-1, 2, baseSpeed * 2),
    new Enemy(-1, 3, baseSpeed * 1)
];
var allPlayers = [
    new Player(0, numRows - 1, 'images/char-boy.png'),
    new Player(1, numRows - 1, 'images/char-cat-girl.png'),
    new Player(2, numRows - 1, 'images/char-horn-girl.png'),
    new Player(3, numRows - 1, 'images/char-pink-girl.png'),
    new Player(4, numRows - 1, 'images/char-princess-girl.png')
];

var selector = new Selector();

var message = new Message();

var allRocks = [];

for (var i = 1; i < numRows - 2; i++) {
    allRocks.push(new Rock(getRandomInt(0, numCols), i));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    allPlayers.forEach(function(player) {
        if (player.state === 'Active') {
            player.handleInput(allowedKeys[e.keyCode]);
        }
    });

    if (selector.state === 'Active') {
        selector.handleInput(allowedKeys[e.keyCode]);
    }
});
