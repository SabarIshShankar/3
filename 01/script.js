let renderer = new THREE.WebGLRenderer();
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500);
let cameraRotation = 0;
let cameraRotationSpeed = 0.001;
let cameraAutoRotation = true;

let spotLight = new THREE.SpotLight(0xfffff, 1, 0, 10,2);
let textureLoader = new THREE.TextureLoader();

let planetProto = {
	sphere: function(size){
		let sphere = new THREE.SphereGeometry(size, 32, 32);

		return sphere;
	},
	material: function(options){
		let material = new THREE.MeshPhongMaterial();
		if (options){
			for(var property in options){
				material[property] = options[property];
			}
		}
		return material;
	},
	glowMaterial: function(intensity, fade, color){
		let glowMaterial = new THREE.ShaderMaterial({
			uniforms:{
				'c': {
					type: 'f',
					value: intensity
				},
				'p':{
					type:'f',
					value: fade
				},
				glowColor:{
					type:'c',
					value: new THREE.Color(color)
				},
				viewVector:{
					type:'v3',
					value: camera.position
				}
			},
			vertexShader:`
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
				,
				fragmentShader: `unifrom vec3 glowColor;
				varying float intensity;
				void main()
				{
					vec3 glow = glowColor*intensity;
					gl_FragColor = vect4(glow, 1.0);
					}`,
					side: THREE.BackSide,
					blending: THREE.AdditiveBlending,
					transparent: true
		});
		return glowMaterial;
	},
	texture: function(material, property, uri){
		let textureLoader = new THREE.TextureLoader();
		textureLoader.crossOrigin = true;
		textureLoader.load(
			uri, function(texture){
				material[property] = texture;
				material.needsUpdate = true;
			}
		);	}
};

let createPlanet = function(options){
	let surfaceGeometry = planetProto.sphere(options.surface.size);
	let surfaceMaterial = planetProto.material(options.surface.material);
	let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

	let atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);let atmosphereMaterialDefaults = {
		side: THREE.DoubleSide,
		transparent: true
	}	
	let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
	let atmosphereMaterial=planetProto.material(atmosphereMaterialOptions);
	let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

	let atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.glow.size);
	let atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
	let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

	let planet = new THREE.Object3D();
	surface.name = 'surface';
	atmosphere.name = 'atmosphere';
	atmosphericGlow.name = 'atmosphericGlow';

	planet.add(surface);
	planet.add(atmosphere);
	planet.add(atmosphericGlow);

	for (let textureProperty in options.surface.textures){
		planetProto.texture(
			surfaceMaterial,
			textureProperty,

			options.surface.textures[textureProperty]
		);
	}
	for (let textureProperty in options.atmosphere.textures){
		planetProto.texture(
			atmosphereMaterial,
			textureProperty,
	options.atmosphere.textures[textureProperty]
		);
	}
	return planet;
};

let earth = createPlanet({
	surface: {
		size: 0.5,
		material: {
			bumpScale: 0.05,
			specular: new THREE.Color('grey'),
			shininess: 10
		},
		textures: {
			map:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg',
			alphaMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmaptrans.jpg'
		},
		glow: {
			size: 0.02,
			intensity: 0.07,
			fade: 7,
			color: 0x93cfef
		}
	},
});

let markerProto = {
	latLongToVector3: function latLongToVector3(latitude, longitude, radius, height){
		var phi = (latitude)*Math.PI/180;
		var theta = (longitude-180)*Math.PI/180;
		var x = -(radius+height)*Math.cos(phi)*Math.cos(theta);
		var y = (radius+height) * Math.sin(phi);
		var z= (radius+height)*Math.sin(phi) * Math.sin(theta);
		return new THREE.Vector3(x, y, z);
	},
	marker: function marker(size, color, vector2Position){
		let markerGeometry = new THREE.SphereGeometry(size);
		let markerMaterial = new THREE.MeshLambertMaterial({
			color: color
		});
		let markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
		markerMesh.position.copy(vector3Position);
	return markerMesh;
	}
}

let placeMarker = function(object, options){
	let position = markerProto.latLongToVector3(options.latitude, options.longitude, options.radius, options.height);
	let marker = markerProto.marker(options.size, options.color, position);
	object.add(marker);
}

let placeMarkerAtAdress = function(address, color){
	let encodedLoation = address.replace(/\s/g, +);
	let http request = new XMLHHttpRequest();

	httpRequest.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address='+ encodedLocation);
	httpRequest.send(null);
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState == 4 && httpRequest.status ==200){
			let result = JSON.parse(httpRequest.responseText);
			if (result.results.length > 0){
				let latitude = result.results[0].geometry.location.lat;
				let longitude = result.results[0].geometry.location.lng;

				placeMarker (earth.getObjectByName('surface'), {
					latitude: latitude,
					longitude: longitude,
					radius: 0.5,
					height: 0,
					size = 0.01,
					color: color,

				});
			}
		}
	};
}

let galaxyGeometry = new THREE.SphereGeometry(100, 32, 32);
let galaxyMaterial = new THREE.MeshBasicMaterial({
	side: THREE>Backside
});
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

textureLoader.crossOrigin = true;
textureLoaded.load(('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png'),
function (texture){
	galaxyMaterial.map = texture;
	scene.add(galaxy);
}
);


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


camera.position.set(1,1,1);
orbitControls.enabled =!cameraAutoRotation;

scene.add(camera);
scene.add(spotLight);
scene.add(earth);

spotLight.position.set(2,0,1);
earth.receiveShadow = true;
earth.castShadow = true;
earth.getObjectByName('surface').geometry.center();

window.addEventListener('resize', function(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

let render = function(){
	earth.getObjectByName('surface').rotation.y += 1/32 * 0.01;

	earth.getObjectByName('atmosphere').rotation.y += 1/32 * 0.01;
	if (cameraAutoRotation){
		cameraAutoRotation += cameraRotationSpeed;
		camera.position.y = 0;
		camera.position.x = 2* Math.sin(cameraRotation);
		camera.position.z= 2 * math.cos(cameraRotation);
		camera.lootAt(earth.position);
	}
	requestAnimationFrame(render);
	renderer.render(scene, camera);

};
render();

var gui = new dat.GUI();
var guiCamera = gui.addFolder('Camera');
var guiSurface = gui.addFolfer('Surface');
var guiMarkers = guiSurface.addFolder('Markers');

var guiAtmosphere = gui.addFolder('Atmosphere');
var guiAtmosphericGlow = guiAtmosphere.addFolder('Glow');

var cameraControls = new function(){
	this.speed = cameraRotationSpeed;
	this.orbitControls =!cameraRotationSpeed;

}

var surfaceControls = new function(){
	this.rotation = 0;
	this.bumpscale = 0.05;
	this.shininess = 10;
}

var markersControls = new function(){
	this.address = '';
	this.colors: 0Xff0000;
	this.placeMarker = function(){
		placeMarkerAtAddress(this.address, this.color);

	}
}

var atmosphereControls = new function(){
	this.opacity = 0.8;
}

var atmosphericGlowControls = new function(){
	this.intensity = 0.7;
	this.fade = 7;
	this.color = 0x93cfef;
}

guiCamera.add(cameraControls, 'speed',0,0.1).step(0.001).onChange(function(value){
	cameraRotationSpeed = value;
});
guiCamera.add(cameraControls, 'orbitControls').onChange(function(value){
	cameraAutoRotation =!value;
	orbitControls.enabled = value;
});

guiSurface.add(surfaceControls. 'rotation', 0, 6).onChange(function(value){
	earth.getObjectByName('surface').rotation.y=value;
});
guiSurface.add(surfaceControls, 'bumpScale', 0, 1).step(0.01).onChange(function(value){
	earth.getObjectByName('surface').material.bumpscale = value;
});
guiSurface.add(surfaceControls,'shininess', 0, 30).onChange(function(value){
	earth.getObjectByName('surface').material.shininess = value;
});

guiMarkers.add(markersControls, 'address');
guiMarkers.addColor(markersControls, 'color');
guiMarkers.add(markersControls,'placemaker');
guiAtmosphere.add(atmosphereControls, 'opacity', 0, 1).onChange(function(value){
	earth.getObjectByName('atmosphere').material.opacity = value;
});

guiAtmosphericGlow.add(atmosphericGlowControls, 'intensity', 0, 1).onChange(function(value){
	earth.getObjectByName('atmosphericGlow').material.uniforms['c'].value = value;
});

guiAtmosphericGlow.add(atmosphericGlowControls, 'fade', 0, 50).onChange(function(value){
	earth.getObjectByName('atmosphericGlow').material.uniforms['p'].value = value;
});
guiAtmosphericGlow.addColor(atmosphericGlowControls, 'color').onChange(function(value){
	earth.getObjectByName('atmosphericGlow').material.uniforms.glowColor.value.setHex(value);
});

