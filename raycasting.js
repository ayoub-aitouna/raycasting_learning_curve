// Data
let data = {
    screen: {
        width: 640,
        height: 480,
        halfWidth: null,
        halfHeight: null
    },
    render: {
        delay: 3000
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
        angle: 90
    },
    map: [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,0,1,0,0,1],
        [1,0,0,1,0,0,1,0,0,1],
        [1,0,0,1,0,0,1,0,0,1],
        [1,0,0,1,0,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1],
    ]
}

data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.screen.width;
data.player.halfFov = data.player.fov;

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



function degree_to_radians( degree )
{
	let pi = Math.PI;
	let result = degree * pi / 180;
//	console.log(`res ${pi}`);
	return result;
}


function drawLine(x1, y1, x2, y2, color)
{
	screen_context.strokeStyle = color;
	screen_context.beginPath();
	screen_context.moveTo(x1, y1);
	screen_context.lineTo(x2, y2);
	screen_context.stroke();
}


function clearScreen()
{
	screen_context.clearRect(0,0, data.screen.width, data.screen.height);
}

//start main
main();

function main()
{
	setInterval(function()
		{
			console.log('cyle');
			clearScreen();
			rayCasting();
		}, 1 * 1000);
}


function rayCasting()
{
	let rayAngle = data.player.angle - data.player.halfFov;	

	for(let rayCount = 0; rayCount < data.screen.width; rayCount++)
	{

		let ray = {
			x : data.player.x,
			y : data.player.y
		}
//		console.log(`calCos = ${Math.cos(degree_to_radians(rayAngle))} rayAngle = ${rayAngle}`);
		let rayCos = Math.cos(degree_to_radians(rayAngle)) / data.rayCasting.precision;
		let raySin = Math.sin(degree_to_radians(rayAngle)) / data.rayCasting.precision;
		
		let wall = 0;
		while(wall == 0)
		{
			ray.x += rayCos;
			ray.y += raySin;
			//console.log(`rayCos: ${rayCos}, y: ${raySin} `);
			wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
		}
		
		let distance = Math.sqrt(Math.pow((-ray.x + data.player.x), 2) + Math.pow((-ray.y +data.player.y), 2));
	//	console.log(distance);
		let wallHeight = Math.floor(data.screen.halfHeight / distance);
		console.log(wallHeight);
		drawLine(rayCount, 0, rayCount, data.screen.halfHeight - wallHeight, 'cyan');
		drawLine(rayCount, data.screen.halfHeight - wallHeight , rayCount, data.screen.halfHeight + wallHeight, 'red');
		drawLine(rayCount, data.screen.halfHeight + wallHeight, rayCount, data.screen.height , 'green');
		
		rayAngle += data.rayCasting.incrementAngle;
	}
}

