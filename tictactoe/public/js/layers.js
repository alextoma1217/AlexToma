function drawBackground(sprites, context) {
	for (let x = 0; x < 62; ++x) {
		for (let y = 0; y < 51; ++y) {
			sprites.drawTile('field', context, x, y);
		}
	}

}


export function drawTables(sprites, context) {
	for (let x = 2; x < 29; ++x) {
		for (let y = 16; y < 18; ++y) {
			sprites.drawTile('table', context, x, y);
		}
	}

}
export function createBackgroundLayer(sprites) {


	const buffer = document.createElement('canvas');
		buffer.width = 2048;
	buffer.height = 410;

	drawBackground(sprites, buffer.getContext('2d'));

	return buffer;
}