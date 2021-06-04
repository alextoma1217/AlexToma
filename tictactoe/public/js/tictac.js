const  cell = document.getElementsByClassName('tictactoe_cell'); 
const message = document.getElementById('message');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const spectators = document.getElementById('spectators');
const user_id = document.getElementById('user_id').innerText.trim();
let player1_id, player2_id, player1_name, player2_name, game_room;
let game_start = false;
let player_number =1;
let player_turn =1;
let player = 'X';
let stepCount = 0;
let  winCombinations = [
    [1, 2, 3], 
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 6, 9],
    [3, 5, 7],
    [4, 5, 6],
    [7, 8, 9]
  ];
  let dataX = [];
  let dataO = [];

  let num;


const socket = io();



for (let i = 0; i < cell.length; i++) {
  if(player_number === player_turn && game_start == true){
    cell[i].addEventListener('click', getEventData);
  } 
}



function getEventData(){
let num = +this.getAttribute('data-cell');

socket.emit('newTictacToeData', {game_room, num, player_number});
}

// function currentStep() {
//   let num = +this.getAttribute('data-cell');
//   if (!this.textContent) {
//     this.innerText = player;
//     player === "X"
//       ? dataX.push(num) && this.classList.add('x')
//       : dataO.push(num) && this.classList.add('o');
//     if (
//       (dataO.length > 2 || dataX.length > 2) &&
//       (checkWin(dataO, num) || checkWin(dataX, num))
//     ) 


//     {
//       for (let i = 0; i < cell.length; i++) {
//         cell[i].removeEventListener('click', currentStep);
//       }
//       return (message.innerText = 'Won ' + player);
//     }
//     changePlayer();
//     stepCount++;
//     stepCount === 9
//       ? (message.innerText = 'The game ended in a draw')
//       : (message.innerText = 'Player move: player ' + player_turn);
//       finishGame();
//   }
// }

function changePlayer() {
  player_turn === 1 ? (player_turn = 2) : (player_turn = 1);       
}

function finishGame(){
  clearInterval(clocktimer);

  alert('Заканчиваю игру ' + currentStep);
 socket.emit('finishTicTacToe', game_room);
setTimeout(function () {
 window.location ='/dashboard';

}, 2000);

}


function updateGameField(dataX, dataO){
   if(dataX.length>0){
    for (let i = 0; i < cell.length; i++) {
       for(let a =0; a<dataX.length; a++){
        let number = cell[i].getAttribute('data-cell');
        if(number == dataX[a]){
        cell[i].classList.add('x');
        cell[i].innerText = 'X';
        }
       }
      }
    }

    if(dataO.length>0){
     for (let i = 0; i < cell.length; i++) {
       for(let a =0; a<dataO.length; a++){
        let number = cell[i].getAttribute('data-cell');
        if(number == dataO[a]){
        cell[i].classList.add('o');
        cell[i].innerText = 'O';
        }
       }
      }
   }

}





function checkWin(arr, number) {
  for (let w = 0, wLen = winCombinations.length; w < wLen; w++) {
    let someWinArr = winCombinations[w],
      count = 0;
    if (someWinArr.indexOf(number) !== -1) {
      for (let k = 0, kLen = someWinArr.length; k < kLen; k++) {
        if (arr.indexOf(someWinArr[k]) !== -1) {
          count++;
          if (count === 3) {
            return true;
          }
        }
      }
      count = 0;
    }
  }
}


 function trim(string) { 
   return string.replace (/\s+/g, " ").replace(/(^\s*)|(\s*)$/g, '');
    }

 let init=0;
 let startDate;
 let clocktimer;

 function clearFields() {
  init = 0;
  clearTimeout(clocktimer);
  document.clockform.clock.value='00:00:00';
  document.clockform.label.value='';
 }

 function clearALL() {
  clearFields();
 }

 function startTIME() { 
  let thisDate = new Date();
  let t = thisDate.getTime() - startDate.getTime();
  let ms = t%1000; 
  t-=ms; 
  t = Math.floor (t/1000);
  let s = t%60; t-=s;
  t = Math.floor (t/60);
  let m = t%60; t-=m;
  t = Math.floor (t/60);
  let h = t%60;
  if (h<10) h='0'+h;
  if (m<10) m='0'+m;
  if (s<10) s='0'+s;

  if (init==1) document.clockform.clock.value = h + ':' + m + ':' + s;
  clocktimer = setTimeout('startTIME()',1000);
 }

 function findTIME() {
  if (init==0) {
   startDate = new Date();
   startTIME();
   init=1;
  } 
 }



window.addEventListener('load', function() {
  const searchString = new URLSearchParams(window.location.search);
  let params = [];
  searchString.forEach((value) => {
  params.push(value); 
});


game_room = params[0];
socket.emit('getGameData', { user_id, game_room});
});

// Listen for chatMessage
  socket.on('gameInitialData', data => {
    if(data.data[0].length>0){
       player1_id = data.data[0][0].id; 
       if(player1_id == user_id){
        player_number =1;
      }
      player1_name = data.data[0][0].name;
      player1.innerText = player1_name;
    }
     if(data.data[1].length>0){
       player2_id = data.data[1][0].id; 
       if(player2_id == user_id){
        player_number =2;
      }
       player2_name = data.data[1][0].name;
      player2.innerText = player2_name;
    }
   
   if(player1_id && player2_id){
     game_start = true;
     findTIME();
   }

   if(user_id!==player1_id || user_id!==player2_id){
     player_number =3; 
   }

   if(player_number ==1 || player_turn ===1){
         
           message.innerText = "Your move!";
       
   else if(player_number === 2 && player_turn === 2){
           message.innerText = "Your move!";
         }
    }

    else if(player_number === 1 || player_number === 2){
          if(player_number!===player_turn){            
           message.innerText = "It's your opponents move";
          }
         }

   else if(player_number ===3){
       message.innerText = 'Next move player: ' + player_turn;
   }


   if(data.data[2].length>0){
     spectators.innerText = data.data[2].length;
   }

      if(data.data[3].length>0){
         dataX = data.data[3];
      }

      if(data.data[4].length>0){
          dataO = data.data[4];
      }
      updateGameField(dataX, dataO);
      currentStep = dataX.length+ dataO.length;
  });


// Listen for chatMessage
  socket.on('gameUpdate', data2 => {
    dataX = data2.newdataX;
    dataO = data2.newdataO;
    num = data2.number;
     updateGameField(dataX, dataO);
     currentStep = dataX.length+ dataO.length;


      if (
      (dataO.length > 2 || dataX.length > 2) &&
      (checkWin(dataO, num) || checkWin(dataX, num))
    ) 
    {
      // for (let i = 0; i < cell.length; i++) {
      //   cell[i].removeEventListener('click', currentStep);
      // }
      message.innerText = 'Won ' + player_turn;
      finishGame();
      return;

    }
    else{
    changePlayer();
    stepCount++;

    if(stepCount ===9){
      message.innerText = 'The game ended in a draw';
        finishGame();
        return;
    }
    else{
      message.innerText = 'Player move ' + player_turn;
    }
  

  }



  });