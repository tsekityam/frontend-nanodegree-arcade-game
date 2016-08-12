// Gobal variable
var colWidth = 101
var rowHeight = 83;
var baseSpeed = 1;
var numCols = 5;
var numRows = 6;

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
    if (this.x > 5) {
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
// State is used to store current player state. we will enable or disable
// ability of player in different state.
var Player = function(x, y, sprite) {
    Element.call(this, x, y, sprite);
    this.original = {
        'x': this.x,
        'y': this.y
    };
    this.state = 'Waiting';
};

Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
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
    let player = this;

    switch (allowedKeys) {
        case 'left':
        if (this.state == 'Active') {
            this.x -= 1;
            allRocks.forEach(function(rock) {
                if (isCollided(player.x, player.y, rock.x, rock.y)) {
                    player.x += 1;
                }
            });
        }
        break;
        case 'up':
            if (this.state == 'Active') {
            this.y -= 1;
            allRocks.forEach(function(rock) {
                if (isCollided(player.x, player.y, rock.x, rock.y)) {
                    player.y += 1;
                }
            });
        }
        break;
        case 'right':
            if (this.state == 'Active') {
            this.x += 1;
            allRocks.forEach(function(rock) {
                if (isCollided(player.x, player.y, rock.x, rock.y)) {
                    player.x -= 1;
                }
            });
        }
        break;
        case 'down':
            if (this.state == 'Active') {
            this.y += 1;
            allRocks.forEach(function(rock) {
                if (isCollided(player.x, player.y, rock.x, rock.y)) {
                    player.y -= 1;
                }
            });
        }
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
    Element.call(this, 0, 5, 'images/Selector.png');

    // Selector has three state,
    // 1. 'Active': the selector is on and user are selecting character.
    // 2. 'Waiting': user is controling a character, and selector is waiting
    //               for next activation
    this.state = 'Active';
}

Selector.prototype = Object.create(Element.prototype);
Selector.prototype.constructor = Selector;

Selector.prototype.update = function(dt) {
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > 4) {
        this.x = 4;
    }
    if (this.y !== 5) {
        this.y = 5;
    }
};

Selector.prototype.handleInput = function(allowedKeys) {

    switch (allowedKeys) {
        case 'left':
        if (this.state == 'Active') {
            this.x -= 1;
        }
        break;
        case 'right':
        if (this.state == 'Active') {
            this.x += 1;
        }
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
    new Player(0, 5, 'images/char-boy.png'),
    new Player(1, 5, 'images/char-cat-girl.png'),
    new Player(2, 5, 'images/char-horn-girl.png'),
    new Player(3, 5, 'images/char-pink-girl.png'),
    new Player(4, 5, 'images/char-princess-girl.png')
];

var selector = new Selector();

var message = new Message();

var allRocks = [
    new Rock(0, 3),
    new Rock(2, 2),
    new Rock(4, 1)
]

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
