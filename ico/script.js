THREE.BufferGeometry.prototype.tripleFace = tripleFace;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 1 , 1000);
camera.position.set(0, 0, 12);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
let controls = new OrbitControls(camera, renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));
let geo = new THREE.IcosahedronGeometry(5, 5).tripleFace();
let mesh = new THREE.MeshLambertMaterial({
	color: "aqua", 
	wireframe: false
});
let obj = new THREE.Mesh(geo, mesh);
scene.add(o);