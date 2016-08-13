// Gobal variable
let colWidth = 101
let rowHeight = 83;
let baseSpeed = 0.5;
let numCols = 6;
let numRows = 7;

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
var Enemy = function(x, y, speedFactor) {
    Element.call(this, x, y, 'images/enemy-bug.png');
    this.speedFactor = speedFactor;
};

Enemy.prototype = Object.create(Element.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speedFactor * baseSpeed * dt;
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
// States are used to store current player state. we will enable or disable
// ability of player in different state.
var Player = function(x, y, sprite) {
    Element.call(this, x, y, sprite);
    this.original = {
        'x': this.x,
        'y': this.y
    };
    this.dx = 0;
    this.dy = 0;
    this.states = ['Waiting'];
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
    allPlayers.forEach(function(anotherPlayer) {
      if (isCollided(player.x + player.dx, player.y + player.dy, anotherPlayer.x, anotherPlayer.y)) {
          player.dx = 0;
          player.dy = 0;
      }
    });
    this.x += this.dx;
    this.y += this.dy;

    this.dx = 0;
    this.dy = 0;

    allItems.forEach(function(item) {
        if (isCollided(player.x, player.y, item.x, item.y)) {
            allItems.splice(allItems.indexOf(item), 1);
            item.consume();
        }
    });

    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.x >= numCols) {
        this.x = numCols - 1;
    }
    if (this.y >= (numRows - 1) && this.states.indexOf('Waiting') === -1) {
        this.y = numRows - 2;
    }
    if (this.y === 0) {
        // character reached the water, so we can start another turn.
        if (this.states.indexOf('Stopped') === -1) {
            selector.state = 'Active';
        }
        this.states.splice(this.states.indexOf('Active'), 1);
        this.states.push('Stopped')
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
    this.states = ['Waiting'];
    this.x = this.original.x;
    this.y = this.original.y;
    selector.state = 'Active';
}

var Item = function(x, y, sprite, type) {
    Element.call(this, x, y, sprite);

    this.type = type;
}

Item.prototype = Object.create(Element.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function() {
    var item = this;
    var itemIndex = allItems.indexOf(this);
    // remove item from item array if it overllaps with a rock or other item
    allRocks.forEach(function(rock) {
        if (isCollided(item.x, item.y, rock.x, rock.y)) {
            allItems.splice(itemIndex, 1);
        }
    });
    allItems.forEach(function(anotherItem) {
        if (anotherItem === item) {
            return;
        }
        if (isCollided(item.x, item.y, anotherItem.x, anotherItem.y)) {
            allItems.splice(allItems.indexOf(item), 1);
        }
    });
}

Item.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * colWidth, this.y * rowHeight);
};

Item.prototype.consume = function () {
    switch (this.type) {
        case 'Gem Blue':
        // TODO
        break;
        case 'Gem Green':
        // TODO
        break;
        case 'Gem Orange':
        // TODO
        break;
        default:

    }
};

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
                    player.states = ['Active'];
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
        gameEnded = gameEnded && player.states.indexOf('Stopped') > -1;
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

var allEnemies = [];

for (var i = 1; i < numRows - 2; i++) {
    allEnemies.push(new Enemy(-1, i, getRandomInt(2, 7)));
}

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

var allItems = [
    new Item(getRandomInt(0, numCols), getRandomInt(1, numRows - 2), 'images/Gem Blue.png', 'Gem Blue'),
    new Item(getRandomInt(0, numCols), getRandomInt(1, numRows - 2), 'images/Gem Green.png', 'Gem Green'),
    new Item(getRandomInt(0, numCols), getRandomInt(1, numRows - 2), 'images/Gem Orange.png', 'Gem Orange')
];

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
        if (player.states.indexOf('Active') > -1) {
            player.handleInput(allowedKeys[e.keyCode]);
        }
    });

    if (selector.state === 'Active') {
        selector.handleInput(allowedKeys[e.keyCode]);
    }
});
