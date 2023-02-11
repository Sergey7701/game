// Начало
const size = 64;
var score = 0;
var stop = false;
var end = false;
let maxWidth = 0, maxHeight = 0;
var timer;
$('#screenWelcome').children().css({
	opacity: 1,
	transition: 'all 2s ease-in-out',
});

$('#screenLoss').hide();
$('#screenRating').hide();
$('#welcomeForm').children('input').on('keyup', () => {
	if ($('#welcomeForm').children('input')[0].value) {
		$('#welcomeForm').children('button').removeAttr('disabled');
	} else {
		$('#welcomeForm').children('button').attr('disabled', 'disabled');
	}
});
$('#welcomeForm').on('submit', (event) => {
	event.preventDefault();
//	$('#welcomeForm').children('input')[0].attr('disabled', 'disabled');
	prepareGame();
	setField();
	play();
});


function prepareGame() {
	$('#screenWelcome').hide();
	$('#hudUsername').text($('#welcomeForm').children('input')[0].value);
	$('#hudTime1').attr('id', 'hudTime');
	let hudTime = 0;
	timer = setInterval(() => {
		let seconds = hudTime % 60;
		seconds = (seconds > 9) ? seconds : '0' + (seconds);
		let minutes = Math.floor(hudTime / 60);
		minutes = (minutes > 9) ? minutes : '0' + (minutes);
		$('#hudTime').text(minutes + ':' + seconds);
		hudTime++;
	}, 1000);
	$('.cell').remove('');
}

function setField() {
	const width = Math.floor($('.field').width() / 64);
	const height = Math.floor($('.field').height() / 64);
	let  cells = [];
	let count = 0;
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (!count) {
				cells.push('');
			} else if (count < 11) {
				cells.push('stone');
			} else if (count > 10 && count < 21) {
				cells.push('heart');
			} else {
				cells.push('ground');
			}
			count++;
		}
	}
	let j, temp;
	for (let k = cells.length - 1; k > 0; k--) {
		j = Math.floor(Math.random() * (k + 1));
		temp = cells[j];
		cells[j] = cells[k];
		cells[k] = temp;
	}
	count = 0;
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (!count) {
				temp = cells[count];
				cells[count] = 'player';
			}
			if (cells[count] === '') {
				cells[count] = temp;
			}
			if (i * size > maxWidth) {
				maxWidth = i * size// + size;
			}
			if (j * size > maxHeight) {
				maxHeight = j * size + size;
			}
			$('.field').append('<div class="cell ' + cells[count++] + '" style="left: ' + (i * size) + 'px; top: ' + (j * size) + 'px;" id="' + (i * size) + '-' + (j * size) + '"></div>');
		}
	}
}

function play() {
	document.addEventListener('keyup', (event) => {
		let top = Number($('.player').css('top').split('px')[0]);
		let left = Number($('.player').css('left').split('px')[0]);
		let canMove;

		switch (event.keyCode) {
			// up
			case 38:
				if (top - size > -1) {
					top -= size;
					canMove = true;
				}
				break;
				// down	
			case 40:
				if ((top + size) <= (maxHeight - size)) {
					top += size;
					canMove = true;
				}
				break;
				// left
			case 37:
				if ((left - size) > -1) {
					left -= size;
					canMove = true;
				}
				break;
				//right	
			case 39:
				if ((left + size) <= maxWidth) {
					left += size;
					canMove = true;
				}
				break;
		}
		if (canMove) {
			const next = $('#' + left + '-' + top);
			if (next) {
				if (next.hasClass('ground')) {
					next.remove();
				}
				if (next.hasClass('heart')) {
					next.remove();
					score++;
				}
				if (next.hasClass('stone')) {
					canMove = false;
				}
			}
		}
		if (end) {
			canMove = false;
		}
		if (canMove) {
			$('.player').css({
				top: top + 'px',
				left: left + 'px',
			});
			$('.player').attr('id', left + '-' + top)
		}
		$('#hudHearts').text(score + '/10');
		if (score === 10) {
			end = true;
			$('#hudTime').attr('id', 'hudTime1');
			win();
		}
		if ($('#' + left + '-' + (top - size)) && $('#' + left + '-' + (top - size)).hasClass('stone')) {
			setTimeout(stoneDown, 1000, left, top - size);
		}
	});
}

function win() {
	$('#screenRating').show();
	$('#screenRating').children('.box-wrapper').css({
		opacity: 1,
	});
	timer = null;
	$('.start-over').on('click', () => {
		window.location = window.location;
	});
}

function lose() {
	$('#screenLoss').show();
	$('#screenLoss').children('.box-wrapper').css({
		opacity: 1,
	});
	$('.start-over').on('click', () => {
		window.location = window.location;
	});
}

function stoneDown(left, top) {
	if ($('#' + left + '-' + (top - size)) && $('#' + left + '-' + (top - size)).hasClass('stone')) {
		setTimeout(stoneDown, 125, left, top - size);
	}	
	$('#' + left + '-' + top).css({
		top: (top + size),
		transition: 'all 0.25s linear',
		transform: 'top',
	});
	if ($('#' + left + '-' + (top + size)).hasClass('player')){
		end = true;
		$('#hudTime').attr('id', 'hudTime1');
		lose();
	}
	$('#' + left + '-' + top).attr('id', left + '-' + (top + size));
	if ((top + 2 * size) < maxHeight && (!$('#' + left + '-' + (top + size + size)).hasClass("cell") || $('#' + left + '-' + (top + size + size)).hasClass("player"))) {
		setTimeout(stoneDown, 250, left, top + size);
	}
}
