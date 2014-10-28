$(document).ready(function() {
	
	$(function() {
            $(this).bind("contextmenu", function(e) {
                e.preventDefault();
            });
    });
	
	$('#flagLabel').html('<img src="f/flag.png" height="41px" width="41px" />');
	$('#timeLabel').html('<img src="f/clock.png" height="41px" width="41px" />');
	
	$('#popup').hide();
	
	$('#popup').fadeIn(1500);
	
	var board = $('#board');
	var gameType;
	var height;
	var width;
	var numMines;
	var flagKey;
	var multiplier;
	var mines = [];
	var flagsLeft;
	var borderSize = 2;
	var screenWidth = $('#board').css('width');
	var time = 0;
	var firstClick = false;
	var lose = false;
	var win = false;
	var genned = false;
	
	function con3(input) {
		var temp = String(input);
		var neg;
		if(input < 0) {
			temp = temp.substr(1);
			neg = true;
		}
		switch(temp.length) {
			
			case 1: 
				temp = '00' + temp;
				break;
			
			case 2:
				temp = '0' + temp;
				break;
				
		}
		if(neg) {
			temp = '-' + temp;
		}
		return temp;
	}
	
	function timer() {
		if(firstClick && time < 999){
			$('#timer').html(con3(++time));
		} else if(time >= 1000) {
			time++;
		}
	}
	
	window.setInterval(function(){
		timer();
	}, 1000);
	
	function check (array, checker) {
		var increment = 0;
		for (var x in array) {
			if($('#' + array[x]).hasClass(checker)) {
				increment++;
			}
		}
		return increment;
	}
	
	function decode(x) {
		var t = x - width;
		var r = x + 1;
		var b = x + width;
		var l = x - 1;
		var tr = (x-width) + 1;
		var tl = (x-width) - 1;
		var br = (x+width) + 1;
		var bl = (x+width) - 1;
		var c = [];
		switch(x) {
			
			case 0:
				c = [r, br, b];
				break;
				
			case width - 1:
				c = [l, bl, b];
				break;
			
			case ((height - 1)*width):
				c = [t, tr, r];
				break;
			
			case ((height * width) - 1):
				c = [t, tl, l];
				break;
				
			default:
				if(x%width === 0) {
					c = [t, tr, r, br, b];
				}else if(x%width === (width - 1)) {
					c = [t, tl, l, bl, b];
				}else if(x < width) {
					c = [l, bl, b, br, r];
				}else if(x > width * (height - 1)) {
					c = [l, tl, t, tr, r];
				}else {
					c = [t, tr, r, br, b, bl, l, tl];
				}
				break;
			
		}
		return c;
	}
	
	function action(n) {
		if(win || lose) {
			return;
		}
		if($('#' + n).hasClass('flagged')) {
			return;
		}
		if($('#' + n).hasClass('question') && !$('#' + n).hasClass('mine')) {
			$('#' + n).removeClass('question');
		}
		if($('#' + n).hasClass('mine')) {
			firstClick = false;
			$('.mine')
				.removeClass('box')
				.removeClass('mine')
				.addClass('unMine');
			$('.unMine').css('border-width', borderSize + 'px');
			$('.flagged').each(function(i) {
				if(!$(this).hasClass('unMine')) {
					$(this)
						.removeClass('box')
						.addClass('wrong')
						.css('background-image', 'url(f/mine.gif)')
						.html('<img src="f/crossOut.png" />');
				}
			});
			$('#' + n).addClass('redMine');
			lose = true;
			$('.smile')
				.removeClass('smile')
				.addClass('dead');
			if(confirm("You LOSE, maybe next time! Would you like to play again?")) {
				$('#board').empty();
				mines = [];
				flagsLeft = numMines;
				time = 0;
				$('#timer').html('000');
				firstClick = false;
				win = false;
				lose = false;
				genned = false;
				$('.dead')
					.removeClass('dead')
					.addClass('smile');
				start();
			}
			return;
		}
		var number = 0;
		var decoded = decode(n);
		number = check(decoded, 'mine');
		
		if(number === 0 && !($('#' + n).hasClass('clicked'))) {
			$('#' + n).addClass('clicked');
			for(var y in decoded) {
				action(decoded[y]);
			}
		}
		switch(number) {
			
			case 0:
				number = 'blank';
				break;
			
			case 1:
				number = 'one';
				break;
			
			case 2:
				number = 'two';
				break;
			
			case 3:
				number = 'three';
				break;
			
			case 4:
				number = 'four';
				break;
				
			case 5:
				number = 'five';
				break;
			
			case 6:
				number = 'six';
				break;
				
			case 7:
				number = 'seven';
				break;
				
			case 8:
				number = 'eight';
				break;
				
		}
		
		$('#' + n)
			.removeClass('box')
			.addClass(number)
			.addClass('un')
			.css('border-width', borderSize + 'px');
		if($('.box').length === numMines && !lose) {
			win = true;
			score = getScore();
			firstClick = false;
			$('.smile')
				.removeClass('smile')
				.addClass('glasses');
			alert("You WIN, congratulation!  Your time was " + time + 
				".  Your score is " + score + "!");
		}
	}
	
	function getScore() {
		var size = width*height;
		var m = numMines / size;
		m *= 10;
		m *= (time < 1000000 ? Math.floor((1000000 - time)/1000) : 0);
		return Math.floor(m);
	}
	
	function game() {
		flagsLeft = numMines;
		
		$('#flagCount').html(con3(flagsLeft));
		
		for(i=0; i<width; i++) {
			for(j=0; j<height; j++) {
				var num = (i*height) + j
				if(num%width===0) {
					board.append('<div class="box" id="' + num + '" style="clear:both" />');
					continue;
				}
				board.append('<div class="box" id="' + num + '" />');
			}
		}
	
		$('.box').css('border-width', borderSize + 'px');
	
		//$('#board').css('margin', '0 ' + (screenWidth - (width*(25 + (borderSize * 2))))/2 + 'px');
		
		var length = ((32 + (borderSize * 2)) * width) - (borderSize * 2);
		
		$('#navBox')
			.css('width', length + 'px')
			.css('border-width', borderSize + 'px');
	}
	
	function genMines(clicked, others) {
		for(m=0; m<numMines; m++) {
			var numBoxes = height*width;
			var randNum = Math.floor(Math.random()*numBoxes);
			var exists = false;
			for(var mine in mines) {
				if(randNum===mines[mine] || randNum === clicked) {
					exists = true;
					break;
				}
			}
			for(var space in others) {
				if(randNum===others[space]) {
					exists = true;
					break;
				}
			}
			if(exists) {
				m--;
			} else {
				mines.push(randNum);
				$('#' + randNum).addClass('mine');
			}
		}
	}
	
	$('#face').click(function() {
		location.reload();
	});
	
	$('#game').hide();
	
	$('.gameType').mousedown(function() {
		gameType = $('.gameType:radio:checked').val();
		if(gameType === 'custom') {
			$('#height').focus();
		}
	});
	
	$('.customForm').mousedown(function() {
		$('.gameType:radio').filter('[value=custom]').attr('checked', 'checked');
	});
	
	$('#height').blur(function() {
		var val = $(this).val();
		val = +val;
		if(val > 20 || val < 9) {
			$(this).val('9');
			alert(val + ' is an invalid height.  The height must be between 9 and 20.');
			$('#height').focus();
		} else {
			$('#width').focus();
		}
	});
	
	$('#width').blur(function() {
		var val = $(this).val();
		val = +val;
		if(val > 30 || val < 9) {
			$(this).val('9');
			alert(val + ' is an invalid width.  The width must be between 9 and 30.');
			$('#width').focus();
		} else {
			$('#numMines').focus();
		}
	});
	
	$('#numMines').blur(function() {
		var val = $(this).val();
		val = +val;
		if(val > 590 || val < 9) {
			$(this).val('9');
			alert(val + ' is an invalid number of mines.  The number of mines must be between 9 and 590.');
			$('#numMines').focus();
		}else if(val > ($('#height').val() * $('#width').val()) - 10) {
		    $(this).val('9');
			alert(val + ' is an invalid number of mines.  The number of mines must be 9 less than the product of the height and width(' + ($('#height').val() * $('#width').val()) + ').');
			$('#numMines').focus();
		}else {
			$('#start').focus();
		}
	});
	
	function start() {
		if(genned) {
			return;
		}
		genned = true;
		gameType = $('.gameType:radio:checked').val();
		switch(gameType) {
			
			case 'beginner':
				height = 10;
				width = 10;
				numMines = 10;
				break;
			
			case 'intermediate':
				height = 16;
				width = 16;
				numMines = 40;
				break;
				
			case 'advanced':
				height = 16;
				width = 30;
				numMines = 99;
				break;
				
			case 'custom':
				height = $('#height').val();
				height = +height;
				width = $('#width').val();
				width = +width;
				numMines = $('#numMines').val();
				numMines = +numMines;
				break;
				
		}
		$('#popup').fadeOut(500);
		game();
		$('#game').delay(500).fadeIn(500);
		
		$('.box').hover(function() {
			if(win || lose) {
				return;
			}
			var $this = $(this);
			if($this.hasClass('un')) {
				return;
			}
			$this.addClass('boxHover');
		}, function() {
			$(this).removeClass('boxHover');
		});
		
		$('.box').mousedown(function() {
			
			$('.un').dblclick(function() {
				var num;
				var un = $(this);
				var id = un.attr('id');
				id = +id;
				if(un.hasClass('blank')) {
					return;
				}else if(un.hasClass('one')) {
					num = 1;
				}else if(un.hasClass('two')) {
					num = 2;
				}else if(un.hasClass('three')) {
					num = 3;
				}else if(un.hasClass('four')) {
					num = 4;
				}else if(un.hasClass('five')) {
					num = 5;
				}else if(un.hasClass('six')) {
					num = 6;
				}else if(un.hasClass('seven')) {
					num = 7;
				}else if(un.hasClass('eight')) {
					num = 8;
				}
				var around = decode(id);
				var amount = check(around, 'flagged');
				if(amount != num) {
					$(this).addClass('xFlash');
					return;
				}
				for(var boxes in around) {
					action(around[boxes]);
				}
			});
			
			$('.xFlash').mouseout(function() {
				$(this).removeClass('xFlash');
			});
			
			if($(this).hasClass('un')) {
				return;
			}
			if(lose || win) {
				return;
			}
			if(!firstClick && event.which != 3) {
				firstClick = true;
				var box = $(this).attr('id');
				box = +box;
				var surround = decode(box);
				genMines(box, surround);
			}
			if(event.which === 3) {
				if($(this).hasClass('flagged')) {
					$('#flagCount').html(con3(++flagsLeft));
					$(this)
						.removeClass('flagged')
						.empty()
						.addClass('question');
				} else if($(this).hasClass('question')) {
					$(this).removeClass('question');
				} else {
					$('#flagCount').html(con3(--flagsLeft));
					$(this)
						.addClass('flagged')
						.html('<img height="32px" width="32px" src="f/flag.png" />');
				}
				return;
			}
			var boxNum = $(this).attr('id');
			boxNum = +boxNum;
			action(boxNum);
		});
		
	}
	
	$('#start').click(function() {
		start();
	});
	
});