const path = require('path');
const http = require('http');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const socketio = require('socket.io');
const favicon = require('serve-favicon');
const formatMessage = require( __dirname +'/public/utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require( __dirname + '/public/utils/users');

let app = express();

let Matrix = require( __dirname + '/server/matrix.js');
let TileCollider = require( __dirname + '/server/tilecollision.js');
let PlayerCollider = require( __dirname + '/server/playercollision.js');
let PlayerClass = require( __dirname + '/server/player.js');

// Passport Config
require( __dirname + '/server/config/passport')(passport);

// DB Config
const db = require('./server/config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true , useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views/'));

// // Express body parser
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
// List to store multiple players
let all_users = {};
let all_players = {};
let numPlayers = 0;

let initialTicTacToeState = [[], [], [], [], []];


let TicTacToePlayers = {
};

TicTacToePlayers.player_set = [
   [
    [{'name': "Tomas", 'id': '60ae7156bc19651f88df67ae'}], [{'name': "Mary", 'id': '4447156bc19651f88df67ae'}],
     [3,4,5,6,7,888], [1,2], [5,7]
   ],

   [
    [], [], [], [], []
   ],
   [
    [], [], [3,4,5,6,7,888], [1,2], [5,7]
   ],
   [
    [], [], [], [], [], []
   ],

];

// Create Tiles
let game_objects = new Matrix();
let tileSetter = function(game_objects, tileType, xStart, xEnd, yStart, yEnd, room, seat) {
	for (let x = xStart; x < xEnd; ++x) {
		for (let y = yStart; y < yEnd; ++y) {
			game_objects.set(x, y, {
				name:tileType,
				room:room, 
				seat: seat
			});
		}
	}
};
// first
tileSetter(game_objects, 'table', 2, 3, 4, 5, 1, 3);
tileSetter(game_objects, 'table', 5, 6, 4, 5,  2, 3);
tileSetter(game_objects, 'table', 9, 10, 4, 5,  3, 3);
tileSetter(game_objects, 'table', 11, 12, 4, 5, 4, 3);

let available = [];

let getGameData = function(){

	available = [];

    for(let i=0; i<TicTacToePlayers.player_set.length; i++){    	
    	if(TicTacToePlayers.player_set[i][0].length==0){
            available.push('seat');
    	}
    	else{
    		available.push('seat_in');
    	}  
    }

    for(let i=0; i<TicTacToePlayers.player_set.length; i++){    	
    	  	if(TicTacToePlayers.player_set[i][1].length==0){
            available.push('seat');
    	}
    else{
    		available.push('seat_in');
    	}
    }
    setSeats();	
}
getGameData();

function setSeats(){
		tileSetter(game_objects, available[0], 2, 3, 1, 2,  1, 1);
		tileSetter(game_objects, available[2], 5, 6, 1, 2, 2, 1);
		tileSetter(game_objects, available[4], 9, 10, 1, 2, 3, 1);
		tileSetter(game_objects, available[6], 11, 12, 1, 2, 4, 1);
		tileSetter(game_objects, available[1], 2, 3, 6, 7,  1, 2);
		tileSetter(game_objects, available[3], 5, 6, 6, 7, 2, 2);
		tileSetter(game_objects, available[5], 9, 10, 6, 7, 3, 2);
		tileSetter(game_objects, available[7], 11, 12, 6, 7, 4, 2);
}

let tileCollider = new TileCollider(game_objects);

let messages_box = {
  collection: ['test', "test2"]
}

const server = http.createServer(app);
const io = socketio(server);


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Run when client connects
io.on('connection', socket => {

let player;
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
      messages: messages_box.collection
    });

        numPlayers++;
	// socket.id = Math.random();
	all_users[socket.id] = socket;
	player = new PlayerClass(socket.id, numPlayers, username);
	all_players[socket.id] = player;

  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    for (let i in all_players) {    	
       if(all_players[i].id== socket.id){
         all_players[i].message= msg;
       } 
    }
    let message = user.username + ': ' + msg;
    messages_box.collection.unshift(message);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });


    socket.on('getGameData', ({ user_id, game_room }) => {
    let data = TicTacToePlayers.player_set[game_room-1];
    const user = { user_id, game_room};
    socket.join(game_room);

    io.to(user.game_room).emit('gameInitialData', {
      data: data
    });
  });




   socket.on('newTictacToeData', ({ game_room, num, player_number }) => {
    let data = TicTacToePlayers.player_set[game_room-1];

    if(player_number == 1){
    	TicTacToePlayers.player_set[game_room-1][3].push(num);
     }
    else{
      TicTacToePlayers.player_set[game_room-1][4].push(num);	
    }

    let data2 = {
      newdataX: TicTacToePlayers.player_set[game_room-1][3],
      newdataO: TicTacToePlayers.player_set[game_room-1][4], 
      number: num
  };

    io.to(game_room).emit('gameUpdate', data2);
  });


  	socket.on('finishTicTacToe', game_room => {
        TicTacToePlayers.player_set[game_room-1] = initialTicTacToeState;

     io.socketsLeave(game_room);
	});




	socket.on('disconnect', () => {
		delete all_users[socket.id];
		numPlayers--;
		if (all_players[socket.id]) {
			delete all_players[socket.id];
			const user = userLeave(socket.id);
     
	      io.to(user.room).emit('roomUsers', {
	        room: user.room,
	        users: getRoomUsers(user.room)
	      });
		} 
		
  });

	socket.on('keyPress', data => {
		if (player.state) {

			let max_height = data.max_height;
			let max_width = data.max_width;

			if (data.inputID === 'left') {
				player.moveLeft();
			} 
			else if (data.inputID === 'right') {
				player.moveRight(max_height);
			}

			else if (data.inputID === 'down') {
				player.moveDown(max_height);

			}
			else if (data.inputID === 'up') {			
				player.moveUp();				
			}
		}
	});

	socket.on('keyRelease', data => {
		if (player.state) {
			if ((data.inputID === 'left') || (data.inputID === 'right'))  {
				player.cancelHorizontal();
			} 

			else if ((data.inputID === 'down') || (data.inputID === 'up')) {
		          player.cancelVertical();				
			}
		}
	});

});

setInterval(() => {
	let positions = [];
	let playerCollider = new PlayerCollider();

	for (let i in all_players) {
		let player = all_players[i];

		player.updateX();
		tileCollider.checkXPlayer(player);

		player.updateY();
		tileCollider.checkYPlayer(player);

		playerCollider.add({
			id: player.id,
			player: player,
			left: player.pos.x + 2,
			right: player.pos.x + player.size.x - 2,
			top: player.pos.y + 2,
			bottom: player.pos.y + player.size.y - 2,
		});
	}

	for (let i in all_players) {
		let player = all_players[i];

		positions.push({
			id: player.id,
			x: player.pos.x,
			y: player.pos.y,
			number: player.number,
			velX: player.vel.x,
			velY: player.vel.y,
			direction: player.direction,
			distance: player.distance,
			message: player.message,
			username: player.username,	
			state: player.state,
			number: player.num,
			seat: player.seat,
		    room:player.room,
		    table:player.table
		});

					if (player.table || player.seat) {
		
						
				     }	
}

	getGameData();

	for (let i in all_users) {
		let socket = all_users[i];
		let pack = {
			playerID: socket.id,
			positions: positions,
			tictactoe: available
		}
		socket.emit('newPosition', pack);
	}

	
}, 1000/48);