// Gobal variable
var colWidth = 101
var rowHeight = 80;
var baseSpeed = 100;

// Element is the base class of elements, such as player and gem, on the board.
var Element = function(x, y, sprite) {
    // The image/sprite for the element, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

// The sprite of the element contains lots of empty space, which should not be
// used to trigger collision. This function used to get the collidable area of
// the elements.
//i.e. if two elements' collidable area are overlapped, then collision occured.
Element.prototype.collidableArea = function() {
    return {
        'x': this.x,
        'y': this.y,
        'width': colWidth,
        'height': rowHeight
    };
};

Element.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
    if (this.x > ctx.canvas.width) {
        this.x = colWidth * -1;
    }

    // Check collation
    if (isCollided(this, player)) {
        player.reset();
    }
};

// Player has two new fields, original and state.
// Original is a used to save the Player's original position, so we can reset
// the player to it's original position after restart the game or collision.
// State is used to store current player state. we will enable or disable
// ability of player in different state.
var Player = function(x, y) {
    Element.call(this, x, y, 'images/char-boy.png');
    this.original = {
        'x': this.x,
        'y': this.y
    };
    this.state = 'Playing';
};

Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;

Player.prototype.reset = function() {
    this.state = 'Playing';
    this.x = this.original.x;
    this.y = this.original.y;
};

Player.prototype.update = function(dt) {
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.x > 4 * colWidth) {
        this.x = 4 * colWidth;
    }
    if (this.y > 5 * rowHeight) {
        this.y = 5 * rowHeight;
    }
    if (this.y === 0) {
        this.state = 'Finished';
        console.log(this.state);
    }
};

Player.prototype.handleInput = function(allowedKeys) {

    switch (allowedKeys) {
        case 'space':
        // Now we only allow player reset game state after he finished the game.
        if (this.state == 'Finished') {
            this.reset();
        }
        break;
        case 'left':
        if (this.state == 'Playing') {
            this.x -= colWidth;
        }
        break;
        case 'up':
            if (this.state == 'Playing') {
            this.y -= rowHeight;
        }
        break;
        case 'right':
            if (this.state == 'Playing') {
            this.x += colWidth;
        }
        break;
        case 'down':
            if (this.state == 'Playing') {
            this.y += rowHeight;
        }
        break;
        default:

    }
};

// return true if two elements' active area are overllaped; else false.
var isCollided = function(element1, element2) {
    if (element1.collidableArea().x >= element2.collidableArea().x + element2.collidableArea().width) {
        return false;
    } else if (element1.collidableArea().y >= element2.collidableArea().y + element2.collidableArea().height) {
        return false;
    } else if (element2.collidableArea().x >= element1.collidableArea().x + element1.collidableArea().width) {
        return false;
    } else if (element2.collidableArea().y >= element1.collidableArea().y + element1.collidableArea().height) {
        return false;
    } else {
        return true;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
    new Enemy(colWidth * -1, rowHeight * 1, baseSpeed * 3),
    new Enemy(colWidth * -1, rowHeight * 2, baseSpeed * 2),
    new Enemy(colWidth * -1, rowHeight * 3, baseSpeed * 1)
];
var player = new Player(colWidth * 2, rowHeight * 4);

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

    player.handleInput(allowedKeys[e.keyCode]);
});
