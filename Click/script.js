var num = 0;

window.onload = function (){
	var name = prompt("name");
	var space = document.getElementById("space");
	space.innerHTML = name;
}

var cookie = document.getElementById("cookie");

function cookieClick(){
	num += 1;
	var numbers = document.getElementById("numbers");
	var upgradeLevel =  document.getElementById("upgradeLevel");

	numbers.innerHTML = num;
	if(num >= 30){
		num += 2;
		upgradeLevel.innerHTML = "Level 1"
	}
	if (num >= 500){
		num += 100;
		upgradeLevel.innerHTML = "Level 2"
	}
	if(num >= 1000){
		num += 300;
		upgradeLevel.innerHTML = "Level 3";
	}

	if(num >= 100000){
		num += 1000;
		upgradeLevel.innerHTML = "Level 4";
	}
}