import {loadBackgroundSprites, loadPlayerSprite,
	loadTableImage, loadSeatImage, loadSeatInImage} from './sprites.js';
import {loadFont} from './font.js';
import {createBackgroundLayer} from './layers.js';
import {correctFrame, correctDirection} from './animationhandler.js';
import {handleKeyDown, handleKeyUp} from './keyhandlers.js';
let screenWidth = document.body.clientWidth;
let screenHeight = document.body.clientHeight;
const move_up = document.getElementById('move_up');
const move_down = document.getElementById('move_down');
const move_left = document.getElementById('move_left');
const move_right = document.getElementById('move_right');
const canvas_container = document.getElementById('canvas_container');
const canvas = document.getElementById('game_canvas');
const preloader = document.getElementById('preloader');
let canvas_container_width = canvas_container.getBoundingClientRect().width;
let canvas_container_height = canvas_container_width/1.7;
let max_width = (canvas_container_width*0.9 - 30) + 'px';
let max_height = (canvas_container_height *0.75 -30) + 'px';
canvas.style.width = max_width;
canvas.style.height = max_height;
let handleKeyDownWrapper = function() {
	handleKeyDown(event, socket, max_width, max_height);
};
let handleKeyUpWrapper = function() {
	handleKeyUp(event, socket);
};
// Canvas context
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;
let gameStart = true;
let initialStart = true;
let tictactoe_occupation = [];


Promise.all([	
	loadBackgroundSprites(),
	loadPlayerSprite(),
	loadTableImage(),
	loadSeatImage(),
	loadSeatInImage(),
	loadFont()

])
.then(([sprites, walker, table, seats, seats_in, font]) => {
	let backgroundBuffer = createBackgroundLayer(sprites);
	// Set up Start Screen
	context.drawImage(backgroundBuffer, 0, 0);
	socket.on('newPosition', (data) => {
		if (gameStart) {
				window.addEventListener('keydown', handleKeyDownWrapper);
				window.addEventListener('keyup', handleKeyUpWrapper);
		

			let positions = data.positions;
            let playerID = data.playerID;

		   for (let i = 0; i < positions.length; ++i) {
				if (playerID === positions[i].id) {

					if (positions[i].table || positions[i].seat) {
						let room = positions[i].room; 
						 window.location ='/tictactoe/?room=' +room;
					    break;
				     }	

     			}
			}

           context.drawImage(backgroundBuffer, 0, 0);
		
			let tictactoe_occupation = data.tictactoe;
			let playerNumber;
			        table.draw('table', context, 40, 80);
					table.draw('table', context, 100, 80);
					table.draw('table', context, 180, 80);
					table.draw('table', context, 238, 80);

				if(tictactoe_occupation[0] =='seat'){
					 seats.draw(tictactoe_occupation[0], context, 40, 40);	
					}
					else{
                      seats_in.draw(tictactoe_occupation[0], context, 40, 40);	
					}

					if(tictactoe_occupation[1] =='seat'){
					 seats.draw(tictactoe_occupation[1], context, 100, 40);	
					}
					else{
                     seats_in.draw(tictactoe_occupation[1], context, 100, 40);	
					}

					if(tictactoe_occupation[2] =='seat'){
					 seats.draw(tictactoe_occupation[2], context, 180, 40);
					}
					else{
                     seats_in.draw(tictactoe_occupation[2], context, 180, 40);	
					}

					if(tictactoe_occupation[3] == 'seat'){
					 seats.draw(tictactoe_occupation[3], context, 240, 40);
					}
					else{
                     seats_in.draw(tictactoe_occupation[3], context, 240, 40);
					}
					if(tictactoe_occupation[4] == 'seat'){
					 seats.draw(tictactoe_occupation[4], context, 40, 120);
					}
					else{
                     seats_in.draw(tictactoe_occupation[4], context, 40, 120);
					}
					if(tictactoe_occupation[5] == 'seat'){
					 seats.draw(tictactoe_occupation[5], context, 100, 120);
					}
					else{
                     seats_in.draw(tictactoe_occupation[5], context, 100, 120);
					}
					if(tictactoe_occupation[6] == 'seat'){
					 seats.draw(tictactoe_occupation[6], context, 180, 120);
					}
					else{
                     seats_in.draw(tictactoe_occupation[6], context, 180, 120);
					}

					if(tictactoe_occupation[7] == 'seat'){
					 seats.draw(tictactoe_occupation[7], context, 240, 120);
					}
					else{
                     seats_in.draw(tictactoe_occupation[7], context, 240, 120);
				   }




			for (let i = 0; i < positions.length; ++i) {
				if (playerID === positions[i].id) {
					
					playerNumber = positions[i].number;
					break;
				}
			}


			for (let i = 0; i < positions.length; i++) {				
				

				walker.draw(correctFrame(positions[i].velX, positions[i].velY, positions[i].distance),
				 context, positions[i].x, positions[i].y, correctDirection(positions[i].direction, positions[i].velX));
                	
                font.print('TIC TAC TOE', context, 20, 10, 1.2);

                let message = positions[i].message;
                let name = positions[i].username;  

                let name_length = name.length*2;
                let message_length = message.length*2;

                font.print(message, context, positions[i].x - message_length, positions[i].y - 8, 1);
                                            
                font.print(name, context, positions[i].x - name_length, positions[i].y +38, 1);

              


			}

	

	
		}

		
				


	});
	preloader.style.display = 'none';
	
});

move_up.addEventListener('click', function(){

		if(player.pos.y<10){
            player.pos.y=10;
			return;
		}



		else if(player.pos.y>310){
            player.pos.y=310;
			return;
		}


	socket.emit('keyPress', {inputID:'up'});
// socket.emit('keyRelease', {inputID:'up'});
});

move_down.addEventListener('click', function(){
	socket.emit('keyPress', {inputID:'down'});
// socket.emit('keyRelease', {inputID:'down'});
});

move_left.addEventListener('click', function(){
	socket.emit('keyPress', {inputID:'left'});
// socket.emit('keyRelease', {inputID:'left'});
});

move_right.addEventListener('click', function(){
	socket.emit('keyPress', {inputID:'right'});
// socket.emit('keyRelease', {inputID:'right'});
});


// reload on resize
function waitResizeFinished(func) {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
}

// recalculating and redrawing cards positions on resize;
window.addEventListener('resize', waitResizeFinished(function (e) {
  location.reload();

}));
if (screenWidth < 376) {
  window.addEventListener('orientationchange', function () {
    location.reload();
  }, false);
}


