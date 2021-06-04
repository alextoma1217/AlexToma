class TileIdentifier {
	constructor(matrix, tileSize = 20) {
		this.matrix = matrix;
		this.tileSize = tileSize;
	}

	toIndex(pos) {
		return Math.floor(pos / this.tileSize);
	}

	toIndexRange(pos1, pos2) {
		const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
		const range= [];
		let pos = pos1;
		do {
			range.push(this.toIndex(pos));
			pos += this.tileSize;
		} 
		while (pos < pMax);
		return range;
	}

	getByIndex(indexX, indexY) {
		const tileType = this.matrix.get(indexX, indexY);
		if (tileType) {
			const y1 = indexY * this.tileSize;
			const y2 = y1 + this.tileSize;
			const x1 = indexX * this.tileSize;
			const x2 = x1 + this.tileSize;
			return {
				tileType,
				y1,
				y2,
				x1,
				x2,
			};
		}
	}

	tileTypeByPos(posX, posY) {
		return this.getByIndex(
			this.toIndex(posX),
			this.toIndex(posY));
	}

	tileTypeByRange(x1, x2, y1, y2) {
		const matches = [];
		this.toIndexRange(x1, x2).forEach(indexX => {
			this.toIndexRange(y1, y2).forEach(indexY => {
				const match = this.getByIndex(indexX, indexY);
				if (match) {
					matches.push(match);
				}
			});
		});

		return matches;
	}
}

class TileCollider {
	constructor(tileMatrix) {
	this.tiles = new TileIdentifier(tileMatrix);
	}

	checkYPlayer(player) {

		if(player.pos.y<10){
            player.pos.y=10;
			return;
		}


		let y;
		if (player.vel.y > 0) {
			y = player.pos.y + player.size.y;
		} 

		else if (player.vel.y < 0) {
			y = player.pos.y;
		} 
		else {
			return;
		}

		const matches = this.tiles.tileTypeByRange(
			player.pos.x, player.pos.x + player.size.x, 
			y, y);
 // console.log('matchesXXXXXXXXXXXXXX');
	// 	console.log(matches);

		matches.forEach(match => {
			if (!match) {
			return;
			}

			 console.log(match.tileType.name);


			 if (match.tileType.name === 'seat_in') {
			 	return;
			}






		
			if (match.tileType.name === 'seat') {

				let room = player.room;
				let seat = player.seat;

				// console.log('seattat in Y');

				// socket.emit('createGame', { username, room, seat, user_id });

				player.seat = match.tileType.seat;
				player.room = match.tileType.room;
				return;
			}


		    if (match.tileType.name === 'table') {

		    	let room = player.room;
				let seat = player.seat;

				 // console.log('tableeee in Y');
				// socket.emit('createGame', { username, room, seat, user_id });

		    	

				

				player.seat = match.tileType.seat;
				player.table = true;
				player.room = match.tileType.room;
				return;
			}

	
			if (player.vel.y > 0) {

				if (player.pos.y + player.size.y > match.y1) {
					
					player.pos.y = match.y1 - player.size.y;
					player.vel.y = 0;
					// player.alreadyJumped = false;
				}
			} 
			else if (player.vel.y < 0) {

				if (player.pos.y < match.y2) {
					player.pos.y = match.y2;
					player.vel.y = 0;
				}
			}
		});
		
	}

	checkXPlayer(player,) {
		if(player.pos.x<10){
			player.pos.x=10;
			return;
		}
		let x;
		if (player.vel.x > 0) {
			x = player.pos.x + player.size.x;
		} 

		else if (player.vel.x < 0) {
			x = player.pos.x;
		} 
		else {
			return;
		}

		const matches = this.tiles.tileTypeByRange(
			x, x, 
			player.pos.y, player.pos.y + player.size.y);

   //            console.log('matches');
			// console.log(matches);

		matches.forEach(match => {
			if (!match) {
			return;
			}
		  console.log(match.tileType.name);


		 	 if (match.tileType.name === 'seat_in') {
			 	return;
			}



		
			if (match.tileType.name === 'seat') {

    	        let room = player.room;
				let seat = player.seat;

				// console.log('seaaaaaaaaaaaaaaaaaaaaat in X');

				// socket.emit('createGame', { username, room, seat, user_id });

				player.seat = match.tileType.seat;
				player.room = match.tileType.room;
				return;
			}


					if (match.tileType.name === 'table') {

				let room = player.room;
				let seat = player.seat;

				 // console.log('tableeee in X');

				// socket.emit('createGame', { username, room, seat, user_id });

				player.seat = match.tileType.seat;
				player.table = true;
				player.room = match.tileType.room;
				return;
			}



			if (player.vel.x > 0) {
				if (player.pos.x + player.size.x > match.x1) {
					player.pos.x = match.x1 - player.size.x;
					player.vel.x = 0;
				}
			} 
			else if (player.vel.x < 0) {
				if (player.pos.x < match.x2) {
					player.pos.x = match.x2;
					player.vel.x = 0;
				}
			}
		});
		
	}
}

module.exports = TileCollider;