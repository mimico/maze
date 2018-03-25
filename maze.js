/*
* Copyright 2018 Tiffany Antopolski
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as
* published by the Free Software Foundation, either version 3 of the
* licence, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this program. If not, see
* <http://www.gnu.org/licenses/>.
*/

var SIZE = 300; //canvas size
var width; //number of walls+cells in a row
var height; //number of walls+cells in a col
var width_min = 9;
var height_min = 9;
var dot_size; //in pixels
var size = width * dot_size;
var visited; //array of visited state of each dot.
var game_over = false;
var congrats = false;
var audio_step = new Audio('step.mp3');
var audio_win = new Audio('tada.mp3');

/* Test to see whether the window has loaded.
 * When it has, call eventWindowLoaded*/

window.addEventListener ('load', eventWindowLoaded, false);

var Debugger = function () { };
Debugger.log = function (message) {
  try {
      console.log(message);
  } catch (exception) {
      return;
  }
}


function eventWindowLoaded () {
  generateEasy (); //generate a maze onload, because it looks better.
  canvasApp ();
}

/*
function canvasSupport () {
    return Modernizr.canvas;
}
*/

/* test a dummy canvas created for the sole purpose of seeing whether
 * browser support exists. */
function canvasSupport () {
  return !!document.createElement ('testcanvas').getContext;
}

function canvasApp () {
//  if (!canvasSupport) {
//    return;
//  }

  var theCanvas = document.getElementById ("canvasOne");
  var context = theCanvas.getContext ("2d");
  theCanvas.addEventListener ('mouseup', eventMouseUp, false);
  var dude = new Object (); //player square
  dude.colour = '#0000FF'; //the dude is blue
  dude.x = dot_size+dot_size / 4; //current x position (left side)
  dude.y = dot_size+dot_size / 4; //current y position (top side)
  dude.cell_x = 1; //x value of square the dude is currently in
  dude.cell_y = 1; //y value of square the dude is currently in

  Debugger.log("Drawing Canvas");

  function drawScreen () {
    var x=0;
    var y=0;

    /*Background*/
    context.fillStyle = "#e9967a";
    context.fillRect(0, 0, SIZE, SIZE);

    /*draw the maze*/
    context.fillStyle = "#000";
    context.font = '12px _sans';
    for (x=0; x < width; x++) {
      for (y=0; y < height; y++) {
        if (!visited[x][y]) {
          context.fillRect(x*dot_size, y*dot_size, dot_size, dot_size);
        }
      }
    }

    /*draw the dude if there is a maze*/
    if (visited[width-1][height-2]) {
      context.fillStyle = dude.colour;
      context.fillRect(dude.x, dude.y, dot_size / 2, dot_size / 2);
    }

    if (game_over) {
      dude.colour = "#736F6E"; //make the dude grey when game is over
      context.fillStyle = dude.colour;
      context.fillRect(dude.x, dude.y, dot_size / 2, dot_size / 2);
      if (!congrats) {
        congrats = true;
        audio_win.play();
        setTimeout(function(){alert('Congratulations!')}, 500);
      }
    }
  } //end drawscreen


  drawScreen();

  /*if the dude is in the exit square, the game is over.*/
  function checkStatus(){
    if (dude.cell_x == width - 1 && dude.cell_y == height - 2){
      game_over = true;
    }
  }

  /*The following two functions are needed, because captured
   * coordinates in canvas don't seem to do what they are
   * supposed to. So the code converts coordinates to canvas
   * coordinates.
   * Source: http://blog.webagesolutions.com/archives/135 */
  function toCanvasX (c,e) {
    var posx = 0;
    if (e.pageX) {
      posx = e.pageX;
    }
    else if (e.clientX) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    posx = posx - c.offsetLeft;
    return posx;
  }

  function toCanvasY (c,e) {
    var posy = 0;
    if (e.pageY) {
      posy = e.pageY;
    }
    else if (e.clientY) {
     posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    posy = posy - c.offsetTop;
    return posy;
  }

  /* function eventMouseUp allows for the
   * Maze to be played in phone browser and the
   * Kobo Touch browser! */

  function eventMouseUp (e) {
    var posx = toCanvasX(theCanvas, e) - dot_size / 4;
    var posy = toCanvasY(theCanvas, e) - dot_size / 4;
    var dx = Math.abs (posx - dude.x);
    var dy = Math.abs (posy - dude.y);

    /* x direction move */
    if (dx > dy) {
      /* right */
      if (posx > dude.x && visited[dude.cell_x + 1][dude.cell_y]) {
        dude.x = dude.x + dot_size;
        dude.cell_x = dude.cell_x + 1;
      }

      /* left */
      else if (!game_over && posx < dude.x && visited[dude.cell_x - 1][dude.cell_y]) {
        dude.x = dude.x - dot_size;
        dude.cell_x = dude.cell_x - 1;
      }
    }

    /* y direction move */
    else {
      /* down */
      if (posy > dude.y && visited[dude.cell_x][dude.cell_y + 1]) {
        dude.y = dude.y + dot_size;
        dude.cell_y = dude.cell_y + 1;
      }
      /* up */
      else if (posy < dude.y && visited[dude.cell_x][dude.cell_y - 1]) {
        dude.y = dude.y - dot_size;
        dude.cell_y = dude.cell_y - 1;
      }
    }

    checkStatus ();
    drawScreen ();
  }//end eventMouseUp

  /*check key press and act accordingly*/
  document.onkeydown = function (e) {
    switch (e.keyCode) {

    /*down key pressed*/
    case 40:
      if (visited[dude.cell_x][dude.cell_y + 1]) {
        dude.y = dude.y + dot_size;
        dude.cell_y = dude.cell_y + 1;
        audio_step.currentTime = 0;
        audio_step.play();
        checkStatus();
      }
      break;

    /*up key pressed*/
    case 38:
    if (visited[dude.cell_x][dude.cell_y - 1]) {
      dude.y = dude.y - dot_size;
      dude.cell_y = dude.cell_y - 1;
      audio_step.play();
      checkStatus ();
    }
    break;

    /*left key pressed*/
    case 37:
    if (!game_over && visited[dude.cell_x - 1][dude.cell_y]) {
      dude.x = dude.x - dot_size;
      dude.cell_x = dude.cell_x - 1;
      audio_step.play();
      checkStatus();
    }
    break;

    /*right key pressed*/
    case 39:
    if (visited[dude.cell_x + 1][dude.cell_y]) {
      dude.x = dude.x + dot_size;
      dude.cell_x = dude.cell_x + 1;
      audio_step.play();
      checkStatus();
    }
    break;

    }// end switch

    drawScreen ();
  }// end onkeydown
} //end canvasApp

function showHelp () {
  alert ('You can start a new maze at any point.');
}

function showAbout () {
  alert ('Maze v1.2' + '\n\n' + 'A simple game to play for a few' + '\n' + 'minutes at a time while taking' +'\n'+ 'a small break from studying for exams.' + '\n\n' + 'Copyright 2018 Tiffany Antopolski');
}

/* This is where all the work happens. This function is based on the dfs maze
 * generation algorithm given in en.wikipedia.org/wiki/Maze_generation_algorithm */

function visit (x,y) {
  visited[x][y] = true;
  var dir; //direction (up:=0, down:=1, left:=2, right:=3)

  /*randomly choose a direction*/
  dir = Math.floor (Math.random () * 4);
  switch (dir)
  {
    /*up*/
    case 0:
      if (y > 1 && !visited[x][y-2]) {
        visited[x][y-1]=true;
        visit (x, y-2);
      }

    /*down*/
    case 1:
      if (y < height-2 && !visited[x][y+2]) {
        visited[x][y+1] = true;
        visit (x, y+2);
      }

    /*left*/
    case 2:
      if (x > 1 && !visited[x-2][y]) {
        visited[x-1][y] = true;
        visit (x-2, y);
      }

    /*right*/
    case 3:
      if (x < width - 2 && !visited[x+2][y]) {
        visited[x+1][y] = true;
        visit (x+2, y);
      }

    /*try up again*/
    if (y > 1 && !visited[x][y-2]) {
      visited[x][y-1]=true;
      visit (x, y-2);
    }

    /*try down again*/
    if (y < height - 2 && !visited[x][y+2]) {
      visited[x][y+1]=true;
      visit (x, y+2);
    }

    /*try left again*/
    if (x > 1 && !visited[x-2][y]) {
      visited[x-1][y]=true;
      visit (x-2, y);
    }
  }
}


function generateEasy () {
  width = width_min + 4;
  height = height_min + 4;
  dot_size = Math.floor (SIZE / width);
  generateMaze ();
}

function generateMedium () {
  width = width_min + 2 * 4;
  height= width_min + 2 * 4;
  dot_size = Math.floor (SIZE / width);
  generateMaze ();
}

function generateHard () {
  width = width_min + 4 * 4;
  height = height_min + 4 * 4;
  dot_size = Math.floor (SIZE / width);
  generateMaze ();
}

function generateOMG () {
  width = width_min + 12 * 4;
  height = width_min + 12 * 4;
  dot_size = Math.floor (SIZE / width);
  generateMaze ();
}

function generateMaze () {
  game_over = false; //reset
  congrats = false;
  visited = new Array (width);
  var i; //array index
  for (i = 0; i < width; i++) {
    visited[i] = new Array (height);
  }

  /* set all the elements to false (not visited) */
  i = 0;
  var j;
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      visited[i][j] = false;
    }
  }

  visit (width - 2,height - 2);
  visited[width - 1][height - 2] = true; //exit
  canvasApp ();
}
