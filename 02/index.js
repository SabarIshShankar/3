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
var exploreParticles;
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
  
}