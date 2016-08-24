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
  var snakelen;
  var snakeSpeed;
  var levelColor = 'blue';
  var backgroundColor = 'white';
  var speedIncrement;

  function init() {
		snakeLen = 5;
		snakeSpeed = 500;
		direction = "right";
		createSnake(snakeLen);
		createFood();

    score = 0;
		level = 1;
		backgorundColor = "white";
		levelColor = "green";

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, snakeSpeed);
	}
	init();

  function createSnake(len) {
		snakeArray = [];
		for(var i = len-1; i>=0; i--)
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

  function paint(){
    ctx.clearRect(0, 0, w, h);
    paintCell(food);
    for (var i = 0; i < snakeArray.length; i++) {
      paintCell(snakeArray[i]);
      moveCell(snakeArray[i], i > 0 ? snakeArray[i-1] : null);
      outOfBounds(snakeArray[i]);
    }
    var levelText = "Level: " + level;
		ctx.font = "10px sans-serif";
		ctx.fillText(levelText, 5, h - 5);
		var scoreText = "Score: " + score;
		ctx.fillText(scoreText, 5, h - 15);
		var highScoreText = "High Score: " + highScore;
		ctx.fillText(highScoreText, 5, h - 25);
  }

  function paintCell(obj){
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(obj.x*cw, obj.y*cw, cw, cw);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(obj.x*cw, obj.y*cw, cw, cw);
  }

  function moveCell(obj, prev){
    if (!prev) {
      if (direction === 'right') {
        obj.x++;
      }else if (direction === 'down') {
        obj.y++;
      }else if (direction === 'left') {
        obj.x--;
      }else if (direction === 'up') {
        obj.y--;
      }
    }else {
      var locDir = getPrevDirection(obj, prev);
      if (locDir === 'right') {
        obj.x++;
      }else if (locDir === 'down') {
        obj.y++;
      }else if (locDir === 'left') {
        obj.x--;
      }else if (locDir === 'up') {
        obj.y--;
      }
    }
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
        init();
      }
    return false;
  }

  $(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right"){
			direction = "left";
		} else if(key == "38" && direction != "down"){
			direction = "up";
		} else if(key == "39" && direction != "left"){
		 	direction = "right";
		} else if(key == "40" && direction != "up"){
			direction = "down";
		}
	});

});
