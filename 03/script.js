const canvas = document.getElementById("bjs");
const engine = new BABYLON.Engine(canvas, true);
window.addEventListener("keydown", move, false);

var createScene = function (canvas, engine){
	var scene = new BABYLON.Scene(engine);
	camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 1, -10), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 5;
	var building = BABLYLON.SceneLoader.Append("","yourMesh.glb", scene, function(meshes){
		scene.createDefaultCameraOrLight(true, true, true);
	}); return scene;
};
function move(event){
}
const scene = createScene();

 engine.runRenderLoop(function () {
	 scene.render();
 });

 window.addEventListener("resize", function(){
	 engine.resize();
 });