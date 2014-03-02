//BASE
var STAGE = {
	width: 200,
	height: 200
};
var SNAKE = {
	waistline: 10
};

var Snake = function(options) {
	var options = options || {};
	var snake = {
		waistline: options.waistline || 10,
		direction: null, //-1: left, 1: right, -2: up, 2 = down
		maxLength: options.maxLength || 10,
		speed: options.speed || 150,
		body: [],
		timer: null,
		x: options.x || 10,
		y: options.y || 10,
		move: function() {
			this.timer = setInterval(function() {
				bodyTransform(snake);
			}, this.speed);
		},
		stop: function() {
			clearInterval(snake.timer);
			timer = null;
		},
		changeDirection: function(direction) {
			if (-direction === this.direction) {
				return false;
			};
			this.direction = direction;
		},
		bindEvent: function() {
			document.body.addEventListener('keydown', function(e) {
				var _direction;
				switch (e.which) {
					case 37:
						_direction = -1;
						break;
					case 38:
						_direction = -2;
						break;
					case 39:
						_direction = 1;
						break;
					case 40:
						_direction = 2;
						break;
					case 32:
						snake[snake.timer ? 'stop' : 'move']();
					default:
						break;
				};
				snake.changeDirection(_direction);
			});
		},
		init: function() {
			var init_node = new Kinetic.Rect({
				x: snake.x,
				y: snake.y,
				width: snake.waistline,
				height: snake.waistline,
				fill: 'pink', //temporary
				stroke: 'gray',
				strokeWidth: 1
			});
			snake.body.push(init_node);
			arr[snake.x / snake.waistline][snake.y / snake.waistline] = 1;
			layer_snake.add(init_node);
			stage.add(layer_snake);
			this.bindEvent();
		}
	};
	return snake;
};
//布景 canvas
var stage = new Kinetic.Stage({
	container: 'container',
	width: STAGE.width,
	height: STAGE.height
});
//layer_snake相当于PS里面的层
var layer_snake = new Kinetic.Layer();
var layer_bg = new Kinetic.Layer();
var bg = new Kinetic.Rect({
	x: 0,
	y: 0,
	width: STAGE.width,
	height: STAGE.height,
	fill: '#ccc',
	stroke: 'black',
	strokeWidth: 1
});
layer_bg.add(bg);
stage.add(layer_bg);

function ceateStageArr() {
	var stageArr = [];
	for (var i = 0, j = 0, lenX = STAGE.width / SNAKE.waistline, lenY = STAGE.height / SNAKE.waistline; i
< lenX; i++) {
		stageArr[i] = [0];
		for (j = 0; j < lenY; j++) {
			stageArr[i][j] = 0;
		};
	};
	return stageArr;
};
var arr = ceateStageArr();

//判断点的位置
function mapPosition(x, y) {
	var _x = x / SNAKE.waistline,
		_y = y / SNAKE.waistline,
		_action = 'move';
	if (_x < 0 || _y < 0 || _y >= STAGE.height / SNAKE.waistline || _x >= STAGE.width / SNAKE.waistline || arr[_x][_y] == 1) {
		_action = 'die';
	} else if (arr[_x][_y] == 2) {
		_action = 'add';
	};
	return _action;
};

function bodyTransform(snake) {
	var params = drawNode(snake);
	if (params.node) {
		if (params.action == 'move') {
			var removeNode = params.snake.body.pop();
			removeNode.destroy();
			arr[removeNode.attrs.x / snake.waistline][removeNode.attrs.y / snake.waistline] = 0;
		};
		snake.body.unshift(params.node);
		layer_snake.add(params.node);
		stage.add(layer_snake);
	};
};

function drawNode(snake, x, y) {
	var _x = x || 0,
		_y = y || 0,
		_snake_size = snake.body.length,
		_action,
		_o_body_node,
		_color;
	if (_snake_size > 0) {
		_x = snake.body[0].attrs.x;
		_y = snake.body[0].attrs.y;
		switch (snake.direction) {
			case -2:
				_y -= snake.waistline;
				break;
			case 2:
				_y += snake.waistline;
				break;
			case -1:
				_x -= snake.waistline;
				break;
			default:
				_x += snake.waistline;
		};
	};
	_action = mapPosition(_x, _y);
	if (_action == 'move' || _action == 'add') {
		arr[_x / snake.waistline][_y / snake.waistline] = 1;
		_o_body_node = new Kinetic.Rect({
			x: _x,
			y: _y,
			width: snake.waistline,
			height: snake.waistline,
			fill: 'pink', //temporary
			stroke: 'gray',
			strokeWidth: 1
		});
		if (_action == 'add') {
			var s_name = (_x / snake.waistline)+'-'+(_y / snake.waistline);
			food_list[s_name].destroy();
			createFood();
			stage.add(layer_bg);
			stage.add(layer_snake);
		}
	} else {
		snake.stop();
	};
	var params = {
		node: _o_body_node,
		snake: snake,
		action: _action
	};
	return params;
};
//创建食物
var food_list = {};

function createFood() {
	var x = parseInt(Math.random() * (STAGE.width / SNAKE.waistline));
	var y = parseInt(Math.random() * (STAGE.height / SNAKE.waistline));
	arr[x][y] = 2;
	var s_name = x + '-' + y;
	if (food_list.s_name) {
		createFood();
		return false;
	};
	var food = new Kinetic.Rect({
		x: x * SNAKE.waistline,
		y: y * SNAKE.waistline,
		width: SNAKE.waistline,
		height: SNAKE.waistline,
		fill: 'green',
		stroke: 'green',
		strokeWidth: 1
	});
	food_list[s_name] = food;
	layer_bg.add(food);
	stage.add(layer_bg);
	stage.add(layer_snake);
};
var a = new Snake();
a.init(100, 100)
createFood();