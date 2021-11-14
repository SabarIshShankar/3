var $container = $('container');
var renderer = new THREE.WebGLRenderer({ antialias: true });
var camera = new THREE.PerspectiveCamera(80, 1, 0.1, 10000);
var scene = new THREE.Scene();

scene.add(camera);
renderer.setSize(800, 800);
$container.append(renderer.domElement);

camera.postition.z = 200;

var pinkMat = new THREE.MeshPhongMaterial({
  color: new THREE.Color('rgb(226, 35, 213'),
  emissive: new THREE.Color('rgb(255, 128, 64'),
  specular: new THREE.Color('rgb(255, 155, 255'),
  shininess: 10,
  shading: THREE.FlatShading,
  transparent: 1,
  opacity: 1,
});

var L1 = new THREE.PointLight(0xffffff, 1);
L1.position.z = 100;
L1.position.y = 100;
L1.position.x = 100;
scene.add(L1);
