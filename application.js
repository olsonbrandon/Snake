$(document).ready(function(){
  var canvas = $('#snake')[0];
  var ctx = canvas.getContext('2d');
  var w = $('#snake').width();
  var h = $('#snake').height();
  var cw = 10;
  var snakeArray = [];
  var direction;
	var food;
	var score;
	var level;
	var highScore = 0;
  var snakeLen;
  var snakeSpeed;
  var backgroundColor = 'white';
  var speedIncrement = 25;
  var bytesLevelUp = 2;
  var hasMoved = false;

  function init() {
		snakeLen = 5;
		snakeSpeed = 400;
		direction = "right";
		createSnake(snakeLen);
		createFood();

    score = 0;
		level = 1;
		backgorundColor = "white";

    if(typeof gameLoop != "undefined") clearInterval(gameLoop);
		gameLoop = setInterval(paint, snakeSpeed);
	}

	init();

  function createSnake(len) {
		snakeArray = [];
		for(var i = len; i >= 0; i--)
		{
			snakeArray.push({x: i, y:0});
		}
	}

  function createFood() {
		food = {
			x: Math.round(Math.random()*( w - cw)/cw),
			y: Math.round(Math.random()*( h - cw)/cw),
		};
	}

  function nextLevel(){
		snakeSpeed -= speedIncrement;
		level++;
		backgorundColor = getRandomColor();

		clearInterval(gameLoop);
		gameLoop = setInterval(paint, snakeSpeed);
	}

  function paint(){
    ctx.clearRect(0, 0, w, h);
    paintCell(food);
    hasMoved = false;
    var previousSnakeArray = JSON.parse(JSON.stringify(snakeArray));
    var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;

    var tail;

    if(checkCollision(nx, ny, snakeArray))
		{
			init();
      return;
		}

    if(nx == food.x && ny == food.y) {
      tail = {x: nx, y: ny};
      score++;

      if(score > highScore) {
        highScore = score;
      }
      if (score >= bytesLevelUp*level) {
        nextLevel();
      }
      createFood();
    }
      else {
        tail = snakeArray.pop();
        tail.x = nx; tail.y = ny;
      }

      snakeArray.unshift(tail);

    for (var i = 0; i < snakeArray.length; i++) {
      if (outOfBounds(snakeArray[i])) {
        init();
        return;
      }
      paintCell(snakeArray[i]);
      moveCell(snakeArray[i], i > 0 ? previousSnakeArray[i-1] : null);

      }

    // var levelText = "Level: " + level;
		// ctx.font = "10px sans-serif";
		// ctx.fillText(levelText, 5, h - 5);
		// var scoreText = "Score: " + score;
		// ctx.fillText(scoreText, 5, h - 15);
		// var highScoreText = "High Score: " + highScore;
		// ctx.fillText(highScoreText, 5, h - 25);

    var textLevel = $('.level').text("level: " + level);
    var textScore = $('.score').text("Score: " + score);
    var textHighScore = $('.highScore').text("High Score: " + highScore);
  }

  function paintCell(obj){
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(obj.x*cw, obj.y*cw, cw, cw);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(obj.x*cw, obj.y*cw, cw, cw);
  }

  function getPrevDirection(curr, prev){
    if (curr.x > prev.x) {
      return 'left';
    } else if (curr.x < prev.x) {
      return 'right';
    } else if (curr.y >  prev.y) {
      return 'up';
    } else if (curr.y < prev.y) {
      return 'down';
    }
  }

  function moveCell(obj, prev){
    if (!prev) {
      if (direction === 'right') {
        obj.x++;
      } else if (direction === 'down') {
        obj.y++;
      } else if (direction === 'left') {
        obj.x--;
      } else if (direction === 'up') {
        obj.y--;
      }
    } else {
      var locDir = getPrevDirection(obj, prev);
      if (locDir === 'right') {
        obj.x++;
      } else if (locDir === 'down') {
        obj.y++;
      } else if (locDir === 'left') {
        obj.x--;
      } else if (locDir === 'up') {
        obj.y--;
      }
    }
  }

  function getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function outOfBounds(obj){
      if (obj.x >= (w+1)/cw || obj.y >= (h+1)/cw || obj.x < 0 || obj.y < 0)  {
        return true;
      }
    return false;
  }

  function checkCollision(x, y) {
		for(var i = 1; i < snakeArray.length; i++)
		{
			if(snakeArray[i].x == x && snakeArray[i].y == y){
			 	return true;
			}
		}
		return false;
	}

  $(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right" && !hasMoved){
			direction = "left";
      hasMoved = true;
		} else if(key == "38" && direction != "down" && !hasMoved){
			direction = "up";
      hasMoved = true;
		} else if(key == "39" && direction != "left" && !hasMoved){
		 	direction = "right";
      hasMoved = true;
		} else if(key == "40" && direction != "up" && !hasMoved){
			direction = "down";
      hasMoved = true;
		}
	});
});
