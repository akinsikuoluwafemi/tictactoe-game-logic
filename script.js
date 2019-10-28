//   select the element
var mainBoard;
const me = 'O';
const computer = 'X';
// counting all the boxes, from index 0;
const waysToWin = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const Element = {
    boxes: document.querySelectorAll('.box'),
    endgame: document.querySelector(".endgame"),
    text: document.querySelector(".text")
}

const boxes = document.querySelectorAll('.box');



let  startTheGame =() =>{
	Element.endgame.style.display = "none";
    mainBoard = [...(Array(9).keys())];
        boxes.forEach(element => {
        element.textContent = '';
        element.style.removeProperty('background-color');
        element.addEventListener('click', playerClick, false);
    });
}



let playerClick =(e) => {
	if (typeof mainBoard[e.target.id] == 'number') {
		turn(e.target.id, me)
		if (!checkTheWinner(mainBoard, me) && !checkTie()) turn(sureSpot(), computer);
	}
}

let turn = (squareId, player) =>{
	mainBoard[squareId] = player;
	document.getElementById(squareId).textContent = player;
	let gameIsWon = checkTheWinner(mainBoard, player)
    if (gameIsWon) gameOver(gameIsWon);
}

let checkTheWinner = (board, player) =>{
	let playedIn = board.reduce((acc, el, ind) =>
		(el === player) ? acc.concat(ind) : acc, []);
	let gameIsWon = null;
	for ([index, win] of waysToWin.entries()) {
		if (win.every(elem => playedIn.indexOf(elem) > -1)) {
            gameIsWon = {
                index: index,
                player: player
            };
			break;
		}
	}
	return gameIsWon;
}

let gameOver =(gameIsWon)=> {
	for (let index of waysToWin[gameIsWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameIsWon.player == me ? "blue" : "red";
	}
	for (var i = 0; i < Element.boxes.length; i++) {
		Element.boxes[i].removeEventListener('click', playerClick, false);
	}
	declareWinner(gameIsWon.player == me ? "Winner!" : "You lose.");
}

let declareWinner=(who)=> {
	Element.endgame.style.display = "block";
	Element.text.textContent = who;
}

let squaresWhenEmpty=() => mainBoard.filter(box => typeof box == 'number');


let sureSpot =() => minimax(mainBoard, computer).index;

let checkTie = () =>{
	if (squaresWhenEmpty().length == 0) {
		for (var i = 0; i < Element.boxes.length; i++) {
			Element.boxes[i].style.backgroundColor = "indigo";
			Element.boxes[i].removeEventListener('click', playerClick, false);
		}
        declareWinner("Tie Game!");
		return true;
	}
	return false;
}

let minimax = (newBoard, player)=> {
	var availableSpots = squaresWhenEmpty();

	if (checkTheWinner(newBoard, me)) {
		return {score: -10};
	} else if (checkTheWinner(newBoard, computer)) {
		return {score: 10};
	} else if (availableSpots.length === 0) {
		return {score: 0};
	}
	var movesArr = [];
	for (var i = 0; i < availableSpots.length; i++) {
		var moveObj = {};
		moveObj.index = newBoard[availableSpots[i]];
		newBoard[availableSpots[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, me);
			moveObj.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			moveObj.score = result.score;
		}

		newBoard[availableSpots[i]] = moveObj.index;

		movesArr.push(moveObj);
	}

	var sweetMoves;
	if(player === computer) {
		var highestScore = -10000;
		for(var i = 0; i < movesArr.length; i++) {
			if (movesArr[i].score > highestScore) {
				highestScore = movesArr[i].score;
				sweetMoves = i;
			}
		}
	} else {
		var highestScore = 10000;
		for(var i = 0; i < movesArr.length; i++) {
			if (movesArr[i].score < highestScore) {
				highestScore = movesArr[i].score;
				sweetMoves = i;
			}
		}
	}

	return movesArr[sweetMoves];
}





let init =() => {
    startTheGame();    
}

init();