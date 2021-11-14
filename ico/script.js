console.clear();
import * as THREE from "https://cdn.skypack.dev/three@0.132.2/build/three.module.js";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

THREE.BufferGeometry.prototype.tripleFace = tripleFace;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 0, 12);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

let g = new THREE.IcosahedronGeometry(5, 5).tripleFace();
console.log(g);
let m = new THREE.MeshLambertMaterial({color: "aqua", wireframe: false});
let o = new THREE.Mesh(g, m);
scene.add(o);

let l = new THREE.Mesh(g, new THREE.MeshBasicMaterial({wireframe: true}));
l.scale.setScalar(1.002);
scene.add(l);

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

renderer.setAnimationLoop(()=>{
  renderer.render(scene, camera);
});

function tripleFace(){
  let geometry = this;
  let pos = geometry.attributes.position;
  if (geometry.index != null) {
    console.log("Works for non-indexed geometries!");
    return;
  }
  
  let facesCount = pos.count / 3;
  
  let pts = [];
  let triangle = new THREE.Triangle();
  let a = new THREE.Vector3(), b = new THREE.Vector3, c = new THREE.Vector3();
  for(let i = 0; i < facesCount; i++){
    a.fromBufferAttribute(pos, i * 3 + 0);
    b.fromBufferAttribute(pos, i * 3 + 1);
    c.fromBufferAttribute(pos, i * 3 + 2);
    triangle.set(a, b, c);
    let o = new THREE.Vector3();
    triangle.getMidpoint(o);
    
    // make it tetrahedron-like
    let l = a.distanceTo(b);
    let h = Math.sqrt(3) / 2 * l * 0.125;// scale it at your will
                                        // remove 0.125 to get tetrahedrons
    let d = o.clone().normalize().setLength(h); 
    o.add(d);
    
    pts.push(
      o.clone(), a.clone(), b.clone(),
      o.clone(), b.clone(), c.clone(),
      o.clone(), c.clone(), a.clone()
    );
  }
  
  let g = new THREE.BufferGeometry().setFromPoints(pts);
  g.computeVertexNormals()
  return g;
}