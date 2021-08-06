var camera;
var scene;
var renderer;
var dom;
var sun;
var ground;
var rollingGroundSphere;
var ball;
var rollingSpeed = 0.004;
var ballRollingSpeed;
var worldRadius = 26;
var sceneWidth;
var sceneHeight;
var heroRadius = 0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY = 1.86;
var bounceValue= 0.1;
var gravity = 0.005;
var leftLane = -1;
var rightLane =1;
var middleLane=0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval=0.5;
var treesInPath;
var treesPool;
var explodeParticleGeometry;
var particleCount =20;
var explosionPower = 1.06;
var explodeParticles;
var titleText;
var scoreText;
var pausedText;
var highText;
var score;
var highScore;
var paused;

init();

function init(){
  createScene();
  update();
}

function createScene(){
  score = 0;
  highScore = localStorage.getItem("highScore") || 0;
  paused= false;
  treesInPath=[];
  treesPool= [];
  clock = new THREE.Clock();
  clock.start();
  ballRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
  sphericalHelper = new THREE.Spherical();
  pathAngleValues=[1.52, 1.57, 1.62];
  sceneWidth = window.innerWidth - 20;
  sceneHeight = windo.innerHeight - 20;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x8fd8ff, 0.09);

  camera = new THREE.PerspectiveCamera(60, sceneWidth/sceneHeight, 0.1, 1000);
  camera.position.z = 8.5;
  camera.position.y = 3.3;
  renderer = new THREE.WebGLRenderer({ alpha: true});
  renderer.setClearColor(0x8fd8ff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sceneWidth, sceneHeight);
  dom = document.getElementByID("game");
  dom.appendChild(renderer.domElement);

  createTressPool();
  addWorld();
  addBall();addLight();
  createExplosionParticles();
  
	window.addEventListener("resize", onWIndowResize, false);
	document.onkeydown = handleKeyDown;

	titleText = document.createElement("div");
	titleText.style.position = "absolute";
	titleText.style.textalign = "center";
	titleText.innerHTML = "ball";
	titleText,style.top = 10+"px";
	titleText.style.color = "#ffffff";
	if(window.innerWidth<600){
		titleText.style.fontSize = 24+ "px";
		titleText.style.left = window.innerWidth / 2 -142.5 +"px";
	}else{
		titleText.style.fontSize = 32 + "px";
	  titleText.style.left = window.innerWidth / 2 -190 + "px";
	}
	document.body.appendChild(titleText);

	pausedText = document.createElement("div");
	pausedText.style.position = "absolute";
	pausedText.style.fontWeight = "bold";
	pausedText.style.color = "#000";
	if(window.innerWidth < 600){
		pauseText.style.fontSize = 12+"px";
		pausedText.style.top = 45+"px";
		pausedText.style.left = 15+"px"
	} else {
		pausedText.style.fontSize = 24+ "px";
		pausedText.style.top = 50 + "px";
		pausedText.style.left = 30 + "px";

	}document.body.appendChild(pausedText);

	scoreText = document.createElement("div");
	scoreText.style.position = "absolute";
	scoreText.stye.fontWeight = "bold";
	scoreText.style.color = "#000";
	scoreText.innerHTML = "Score: 0";
	if(window.innerWidth < 600){
		scoreText.style.fontSize = 12 + "px";
		scoreText.style.top = 65 +"px";
		scoreText.style.left = 15 +"px";
	} else{
		scoreText.style.fontSize = 24 + "px";
		scoreText.style.top = 80 +"px";
		scoreText.style.left = 30 +"px";
	}
	document.body.appendChild(scoreText);

	highText = document.createElement("div");
	highText.style.position = "absolute";
	highText.style.fontWeight = "bold";
	highText.style.color = "#000";
	highText.innerHTML = `High score: ${highScore}`;
	if(window.innerWidth < 600){
		highText.style.fontSize = 12 + "px";
		highText.style.top = 85 + "px";
		highText.style.left = 15+"px";
	} else {
			highText.style.fontSize = 24 + "px";
		highText.style.top = 110 + "px";
		highText.style.left = 30+"px";
	}
	document.body.appendChild(hightText);

}


function createExplosionParticles(){
	explodeParticleGeometry = new THREE.Geometry();
	for (var i = 0; i< particleCOunt; i++){
		var vertex = new THREE.Vector3();
		explodeParticleGeomtry.vertices.push(vertex);
	} 
	var pMaterial = new THREE.PointsMaterial({
		color: 0x187018,
		transparent: true,
		opacity: 1,
		size: 0.2,
	});
	explodeParticles = new THREE.Points(explodeParticleGeometry, pMaterial);
	scene.add(explodeParticles);
	explodeParticles.visible = false;
}


function createTressPool(){
	var maxTreesInPool = 10;
	var newTree;
	for( var i = 0; i< maxTreesInPool; i++){
		newTree = createTree();
		treesPool.push(newTree);
	}
}

function handleKeyDown(keyEvent){
	var validMove = true;
	if ((keyEvent.keyCode === 37 || keyEvent.keyCode === 65) && !paused){
		if(currentLane == middleLane){
			currentLane = leftLane;
		} else if (currentLane == rightLane){
			currentLane = middleLane;

		} else {
			validMove = false;

		}
	} else if((keyEvent.keyCode === 39 || keyEvent.keyCode === 68) && !paused){
		if (currentLane == middleLane){
			currentLane = rightLane;
		} else if (currentLane == leftLane ){
			currentLane = middleLane;
		} else {
			validMove = false;
		}
	} else if (keyEvent.keyCode === 80 || keyEvent.keyCode === 81){
		if(pause){
			pausedText.innerHTML = "";
			paused = false;
		} else {
			pausedText.innerHTML = "Paused";
			paused = true;
		}
	} else {
		if((keyEvent.keyCode === 38 || keyEvent.keyCode === 87 || keyEvent.keyCode === 32) && !jumping && !paused){
			bounceValue = 0.11;
			jumping = true;
		}
		validMove = false;
	}
}
//handleSwipe