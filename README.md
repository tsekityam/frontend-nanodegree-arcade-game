frontend-nanodegree-arcade-game
===============================
This is one of [Udacity Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) projects. It is my implementation of classic arcade game Frogger.

The project is used to demonstrate my learning outcomes on [Object Oriented JavaScript](https://classroom.udacity.com/courses/ud015), [HTML5 Canvas](https://www.udacity.com/course/ud292-nd) and [Writing READMEs](https://www.udacity.com/course/ud777).

## How to run

The game is hosted on [GitHub Pages](https://pages.github.com). You can play the game [here](https://tsekityam.github.io/frontend-nanodegree-arcade-game/).

Or you can run it on your machine via following steps:

### Prerequisite
* git 2.7.4
* python 2.7.10

### Step-by-step giude
1. `$ git clone https://github.com/tsekityam/frontend-nanodegree-arcade-game.git`

2. `$ cd frontend-nanodegree-arcade-game/`

3. `$ python -m SimpleHTTPServer`

4. Play the game at [http://0.0.0.0:8000](http://0.0.0.0:8000)

## How to play

1. Pick a character from the bottom of grasses.

2. Move the character from grasses to the river.

3. Repeat step 1 and 2 until all 5 characters are in the river.

### Goal

Move Princess and her guards from the grasses to the river.

### Controls

* Use _Arrow keys_ to move.

* Use _Space_ to confirm.

### Characters

* Princess Lilith and her guards

  ![Boy](images/char-boy.png) ![Cat Girl](images/char-cat-girl.png) ![Horn Girl](images/char-horn-girl.png) ![Pink Girl](images/char-pink-girl.png) ![Princess Girl](images/char-princess-girl.png)

  Princess Lilith and her guards are looking for water. They are closed to the river, however, there is obstacles between them and the river...

* Bugs

  ![Bug](images/enemy-bug.png)

  Bugs are trained by the witch. These bugs will teleport everyone that they caught to the grasses. So, **Don't touch them!**. One more thing, the witch will summon another bug if she knows that Princess Lilith and her guards are reaching the water.

### Items

* Rock

  ![Rock](images/Rock.png)

  Rocks are there since the beginning of the time. Rock stops most of us, but not the one who is **unstoppable**.

* Gem Blue

  ![Gem Blue](images/Gem Blue.png)

  Bugs hate the smelling of the gem and will never touch it. In order word, the one who owns the gem is **unbeatable**.

* Gem Green

  ![Gem Green](images/Gem Green.png)

  The one who owns the gem is **unstoppable**. No one or rocks can block his path.

* Gem Orange

  ![Gem Orange](images/Gem Orange.png)

  If the power within the gem is released, the speed of bugs on the board will be halved.
