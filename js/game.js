var canvas;
var ctx;

var sound = new Audio();
var end = new Audio();
var audioFile = new Audio();

audioFile.src = "Grieg - In the Hall of the Mountain King.mp3";
sound.src = "audio/start.mp3";
end.src = "audio/end.mp3";

canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");

canvas.style.backgroundColor = "#3A3A3A";

//array of words
var words = ["abandon", "balance", "calculation", "zero", "sadness", "umbrella", "identification", "lake",
			 "geography", "fancy", "acknowledgement", "eliminate", "hardware", "journey", "kitchen", "zoo",
			 "version", "talent", "wage", "young", "ability", "beautiful", "dangerous", "handsome", "early",
			 "bankruptcy", "candidate", "family", "immediate", "zone", "yard", "radio", "question", "unfortunately",
			 "damage", "generation", "freedom", "kingdom", "nation", "language", "mail", "paragraph", "quiz",
			 "vehicle", "safety", "range", "water", "captain", "economics", "knife", "observation", "pain",
			 "dance", "jewelry", "labor", "yesterday", "technical", "queen", "offense", "judge", "illegal",
			 "garbage", "panel", "handwriting", "machine", "ocean", "rain", "narrow", "salary", "major",
			 "violence", "union", "neighbor", "waitress", "tank"];

//we randomly take a word from the array and add it to temp[]
var temp = [];
//then, we take temp[] elements and append as a text node element to para[]
var para = [];
			 
var word, sc, initialCoordinate, dirX = 0; counter = 0, scoreX = 180, scoreY = 433;

var content = document.getElementById("content");

var rand_length, isEmptyStrings = false;

function start(){
	
	var btnLabel = document.getElementById("start");
	var btn = document.getElementById("bt");
	
	btn.style.display = "none";
	btnLabel.style.display = "none";
	
	sound.play();

	word = document.getElementById("word");
	sc = document.getElementById("score");
	
	word.style.display = "inline";
	sc.style.display = "inline-block";
	
	ctx.font = "50px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(counter, scoreX, scoreY);

	word.value = "";

	check();	
	play();
	soundtrack();
}

function createWord(){
	
	rand_length = Math.floor(Math.random()*4) + 4; //returns a random number between 4 and 7 (included)
	
	for(i = 0; i < rand_length; i++){
		
		var rand_index = Math.floor(Math.random() * words.length); //each time, returns a random index between 0 and the length of the words array
		
		if(temp.indexOf(words[rand_index]) != -1)
			rand_index = Math.floor(Math.random() * words.length); //if the random word already exists in temp[], then return a new random word
		
		temp.push(words[rand_index]); //here, we add that random word to temp[]
	}

	for(i = 0; i < temp.length; i++){
		
		if(temp[i] != ""){
			
			para[i] = document.createElement("p"); 
			var span = document.createElement("span");
			
			var node = document.createTextNode(temp[i]);
			
			span.appendChild(node);
			para[i].appendChild(span);
			
			para[i].style.left = initialCoordinate + "px";
			para[i].style.margin = "0 0 20px 0";
			
			content.appendChild(para[i]);
		}
		initialCoordinate = Math.floor(Math.random() * 100);
	}
	
	dirX = 0; //every time we set the beginning coordinate to 0
}


function check(){
	
	word.addEventListener("keyup", function(event){
		//when user presses 'enter'
		if(event.keyCode === 13) {
						
			for(j = 0; j < temp.length; j++){
				
				if(word.value != ""){
					
					//if there is a match
					if(word.value == temp[j]){

						var child = para[j];
						content.removeChild(child); //we remove the match from the content
						
						ctx.clearRect(0, 0, canvas.width, canvas.height);						
						counter++; //increase the score
						
						ctx.font = "50px Arial";
						ctx.fillStyle = "white";
						ctx.fillText(counter, scoreX, scoreY);
						
						//you have to clear para[] and temp[]
						temp[j] = "";
						word.value = "";
						para[j] = "";
						
						break;
						
					} else {
						//when there is no match
					}
				  }
			}
		}
	});
}

function move(){
	//if temp is empty or all strings are "" -> createWord()
	if(temp.length == 0){
		createWord();
	}
	
	for(i = 0; i < temp.length; i++){
		if(temp[i] != ""){
			isEmptyStrings = false;
			break;
		}
		isEmptyStrings = true;
	}
	
	if(isEmptyStrings){
		isEmptyStrings = false;
		createWord();
	}

	for(i = 0; i < temp.length; i++){
		if(para[i] != ""){
			
			var spanElement = para[i].getElementsByTagName('span')[0];
			var rect = spanElement.getBoundingClientRect();
			
			if(rect.right < canvas.width){
				
				if(rect.right < 350){
					para[i].style.color = "#11FF00";
				
				} else if(rect.right >= 350 && rect.right < 650){
					para[i].style.color = "yellow";
			
				} else if(rect.right >= 650 && rect.right < canvas.width) {
					para[i].style.color = "red";
			
				}
				
				para[i].style.margin = "0 0 20px " + dirX + "px";
			
			} else {
				content.style.display = "none";
				end.play();
				gameOver();
				break;
			}
		}
	}
	
	if(audioFile.currentTime <= 40){
		dirX += 3.5;
	
	} else if(audioFile.currentTime > 40 && audioFile.currentTime <= 58){
		dirX += 4.5;
	
	} else if(audioFile.currentTime > 58 && audioFile.currentTime <= 91){
		dirX += 5.5;
		
	} else if(audioFile.currentTime > 91 && audioFile.currentTime <= 104){
		dirX += 6.5;
		
	} else {
		dirX += 7;
	}
	
}

function play(){
	handle = setInterval(move, 100);
}

function gameOver(){
	clearInterval(handle);
	handle = 0;
	sound = null;
	end = null;
	audioFile.pause();
}

//Soundtrack of the game
function soundtrack(){
	audioFile.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
	}, false);

	audioFile.play();
	audioFile.volume = 1;
}