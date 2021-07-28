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
}