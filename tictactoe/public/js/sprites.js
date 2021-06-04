import {loadImage} from './loaders.js';
import SpriteSheet from './SpriteSheet.js';

export function loadBackgroundSprites() {
	return loadImage('/img/brown.jpg')
	.then(image => {
		const sprites = new SpriteSheet(image, 16, 16);		  
		sprites.defineTile('field', 0, 0, 42, 48);
		return sprites;
	});
}

export function loadTableImage() {
	return loadImage('/img/table.png')
	.then(image => {
		const sprites = new SpriteSheet(image, 25, 26);		  
		sprites.defineTile('table', 0, 0, 25, 26);		
		return sprites;
	});
}

export function loadSeatImage() {
	return loadImage('/img/place.jpg')
	.then(image => {
		const sprites = new SpriteSheet(image, 20, 20);		  
		sprites.defineTile('seat', 0, 0, 20, 20);		
		return sprites;
	});
}

export function loadSeatInImage() {
	return loadImage('/img/seat_in.png')
	.then(image => {
		const sprites = new SpriteSheet(image, 20, 22);		  
		sprites.defineTile('seat_in', 0, 0, 20, 22);		
		return sprites;
	});
}

export function loadPlayerSprite() {
	return loadImage('/img/player.png')
	.then(image => {
		const sprites = new SpriteSheet(image, 22, 29);
		sprites.define('idle', 0, 0, 22, 29);
		return sprites;
	});
}

