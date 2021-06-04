let Vector = require( __dirname + '/vector.js');

class PlayerClass {
	constructor(id, playerNumber, username) {
		this.id = id;
		this.username = username;
		// this.hp = 3;
		this.size = new Vector(14, 16);
		this.number = "" + Math.floor(10 * Math.random());
		this.vel = new Vector(0, 0);
		this.distance = 0;
		this.seat = null;
		this.room = null;
		this.table = null;
		this.state = true;
		this.num = playerNumber;		
		this.message = '';
		this.max_width = 900;
		this.max_height = 460

		// Get random spawn location
		 let num = this.number % 4;
		 // let num = 3;

		if (num === 0) {
			this.pos = new Vector(48, 180);
			this.direction = 1;
		} 
		else if (num === 1) {
			this.pos = new Vector(424, 180);
			this.direction = -1;
		} 
		else if (num === 2) {
			this.pos = new Vector(160, 132);
			this.direction = 1;
		} 
		else {
			this.pos = new Vector(288, 132);
			this.direction = -1;
		}
		
	}

 	moveRight() {
 		if(this.pos.x>this.max_width - 16){
            this.pos.x = this.max_width - 17;
 			return;
 		}

 		this.vel.set(2, this.vel.y);
 		this.direction = 1;
 	}

 	moveLeft() {
 		this.vel.set(-2, this.vel.y);
 		this.direction = -1;
 	}

 	moveUp() {

 	 		this.vel.set(this.vel.x, -2);
 	 }

 	moveDown() {
 		if(this.pos.y> this.max_height - 80){
            this.pos.y = this.max_height - 81;
 			return;
 		}
  		this.vel.set(this.vel.x, +2);
 	}


 	cancelHorizontal() {
 		this.vel.set(0, this.vel.y);
 	}


 	cancelVertical() {
 		this.vel.set(this.vel.x, 0);
 	}


	updateX() {
		this.pos.x += this.vel.x;
		this.distance += Math.abs(this.vel.x);
	}

	updateY() {
		this.pos.y += this.vel.y;
		this.distance += Math.abs(this.vel.y);
	}

	// hit() {
	// 	this.hp--;
	// }


}

module.exports = PlayerClass;
