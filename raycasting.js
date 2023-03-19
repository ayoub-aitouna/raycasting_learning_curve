// Data
let data = {
	screen: {
		width: 640,
		height: 480,
		halfWidth: null,
		halfHeight: null,
		scale: 1
	},
	projection: {
		width: null,
		height: null,
		halfWidth: null,
		halfHeight: null
	},
	render: {
		delay: 30
	},
	rayCasting: {
		incrementAngle: null,
		precision: 64
	},
	player: {
		fov: 60,
		halfFov: null,
		x: 2,
		y: 2,
		angle: 90,
		speed: {
			movment: .5,
			rotation: 5.0
		}
	},
	map: [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	],
	keys: {
		up: 'KeyW',
		down: 'KeyS',
		left: 'KeyA',
		right: 'KeyD'
	}
}

data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.screen.width;
data.player.halfFov = data.player.fov;


data.projection.width = data.screen.width / data.screen.scale;
data.projection.height = data.screen.height / data.screen.scale;
data.projection.halfWidth = data.projection.width / 2;
data.projection.halfHeight = data.projection.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.projection.width;

// create canvas
const screen = document.createElement('canvas');
screen.width = data.screen.width;
screen.height = data.screen.height;
screen.style.border = '1px solid black';
document.body.style = `
			display: flex;
			align-items: center;
			justify-content: center;`;

document.body.append(screen);

//canvas context
const screen_context = screen.getContext('2d');
screen_context.scale(data.screen.scale, data.screen.scale);
screen_context.translate(.5, .5);
function degree_to_radians(degree) {
	let pi = Math.PI;
	let result = degree * pi / 180;
	//	console.log(`res ${pi}`);
	return result;
}


function drawLine(x1, y1, x2, y2, color) {
	screen_context.strokeStyle = color;
	screen_context.beginPath();
	screen_context.moveTo(x1, y1);
	screen_context.lineTo(x2, y2);
	screen_context.stroke();
}

const cal_cos_sin = (degree) => {
	return result = {
		cos: Math.cos(degree_to_radians(data.player.angle)),
		sin: Math.sin(degree_to_radians(data.player.angle))
	}
}

/**
 * Movement Event
 */
document.addEventListener('keydown', (event) => {
	let keyCode = event.code;
	if (keyCode === data.keys.up) {
		let cos_sin = cal_cos_sin(degree_to_radians(data.player.angle));
		let playerCos = cos_sin.cos * data.player.speed.movment;
		let playerSin = cos_sin.sin * data.player.speed.movment;
		let new_x = data.player.x + playerCos;
		let new_y = data.player.y + playerSin;
		if (data.map[Math.floor(new_y)][Math.floor(new_x)] == 0) {
			data.player.x = new_x;
			data.player.y = new_y;
		}
	} else if (keyCode === data.keys.down) {
		let cos_sin = cal_cos_sin(degree_to_radians(data.player.angle));
		let playerCos = cos_sin.cos * data.player.speed.movment;
		let playerSin = cos_sin.sin * data.player.speed.movment;
		let new_x = data.player.x - playerCos;
		let new_y = data.player.y - playerSin;
		if (data.map[Math.floor(new_y)][Math.floor(new_x)] == 0) {
			data.player.x = new_x;
			data.player.y = new_y;
		}
		console.table({ x: data.player.x, y: data.player.y })
	} else if (keyCode === data.keys.left) {
		data.player.angle -= data.player.speed.rotation;
	} else if (keyCode === data.keys.right) {
		data.player.angle += data.player.speed.rotation;
	}
});

function clearScreen() {
	screen_context.clearRect(0, 0, data.projection.width, data.projection.height);
}

//start main
main();

function main() {
	setInterval(function () {
		clearScreen();
		rayCasting();
	}, data.render.delay);
}


function rayCasting() {
	let rayAngle = data.player.angle - data.player.halfFov;

	for (let rayCount = 0; rayCount < data.projection.width; rayCount++) {
		let ray = {
			x: data.player.x,
			y: data.player.y
		}
		let rayCos = Math.cos(degree_to_radians(rayAngle)) / data.rayCasting.precision;
		let raySin = Math.sin(degree_to_radians(rayAngle)) / data.rayCasting.precision;

		let wall = 0;
		while (wall == 0) {
			ray.x += rayCos;
			ray.y += raySin;
			wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
		}

		let distance = Math.sqrt(Math.pow((-ray.x + data.player.x), 2) + Math.pow((-ray.y + data.player.y), 2));

		// fix eyefixing 
		distance = distance * Math.cos(degree_to_radians(rayAngle - data.player.angle));

		let wallHeight = Math.floor(data.projection.halfHeight / distance);
		drawLine(rayCount, 0, rayCount, data.projection.halfHeight - wallHeight, 'cyan');
		drawLine(rayCount, data.projection.halfHeight - wallHeight, rayCount, data.projection.halfHeight + wallHeight, '#383838');
		drawLine(rayCount, data.projection.halfHeight + wallHeight, rayCount, data.projection.height, 'green');

		rayAngle += data.rayCasting.incrementAngle;
	}
}

