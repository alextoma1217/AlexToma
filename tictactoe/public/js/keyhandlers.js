export function handleKeyDown(event, socket, state, max_width, max_height) {
	const { keyCode } = event;		
	if (keyCode === 39) { 
		socket.emit('keyPress', {inputID:'right', max_width: max_width, max_height: max_height});
	}
	else if (keyCode === 40){
	  event.preventDefault();
      socket.emit('keyPress', {inputID:'down', max_width: max_width, max_height: max_height});
	}  		
	else if (keyCode === 37)  {
		socket.emit('keyPress', {inputID:'left'});
	}
	else if (keyCode === 38) { 
		event.preventDefault();
		socket.emit('keyPress', {inputID:'up'});
	}
}

export function handleKeyUp(event, socket, state) {
	const { keyCode } = event;
	if (keyCode === 39)  { 
		socket.emit('keyRelease', {inputID:'right'});
	} 
	else if (keyCode === 37)  { 
		socket.emit('keyRelease', {inputID:'left'});
	} 
	else if (keyCode === 40)  { 
		socket.emit('keyRelease', {inputID:'down'});
	} 
	else if (keyCode === 38)  { 
		socket.emit('keyRelease', {inputID:'up'});
	}
}


// export function handleButtons(event, socket, state) {
// 	const { keyCode } = event;		
// 	if (keyCode === 39) { 
// 		socket.emit('keyPress', {inputID:'right'});
// 	}
// 	else if (keyCode === 40){
// 	  event.preventDefault();
//       socket.emit('keyPress', {inputID:'down'});
// 	}  		
// 	else if (keyCode === 37)  {
// 		socket.emit('keyPress', {inputID:'left'});
// 	}
// 	else if (keyCode === 38) { 
// 		event.preventDefault();
		
// 	}
// }



// export function handleRevive(event, socket) {
// 	const { keyCode } = event;
// 	if (keyCode === 32) {
// 		socket.emit('revive');
// 	}
// }