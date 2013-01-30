if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// standard global variables
var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;

init();
animate();

var url = "ws://" + location.host + "/socket";
var ws = new WebSocket(url);
	ws.onmessage = function(event) {
		// socketColor = parseInt(event.data);
		// Create an obj that contains the data passed in the /add/ url
		var obj = JSON.parse(event.data); 
		// For exmaple, if the URL was localhost:8801/add/?id=12&firstName=Mike&lastName=Ditka,
		// you could access the values with mID=obj.id[0]; mFirstName=obj.firstName[0]; mLastName=obj.lastName[0];
		// You can then set these values to parameters in your THREE.JS render loop to dynamically change the scene

		console.log(obj);
	}
			
function init(){

	scene = new THREE.Scene();


	// CAMERA //
	// set the view size in pixels (custom or according to window size)
	var SCREEN_WIDTH = WIDTH, SCREEN_HEIGHT = HEIGHT;
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);
	camera.position.set(100,50,300);
	camera.lookAt(scene.position);	
	

	// RENDERER //
	// create and start the renderer; choose antialias setting.
	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );
	

	// CONTROLS //
	controls = new THREE.TrackballControls( camera );
	controls.zoomSpeed = .05;
	

	// STATS //
	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	

	// LIGHT //
	scene.add( new THREE.AmbientLight( 0x333333 ) );

	var light = new THREE.PointLight(0x555555);
	light.position.set(0,0,150);
	scene.add(light);
	
	addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
	addShadowedLight( 0.5, 1, -1, 0xbbbbbb, 1 );


	
	// GEOMETRY //
	// create a set of coordinate axes to help orient user
	// default size is 100 pixels in each direction; change size by setting scale
	var axes = new THREE.AxisHelper();
	axes.scale.set( 1, 1, 1 );
	axes.position.set(-50,-50,-50);
	scene.add( axes );

	var loader = new THREE.STLLoader();
	loader.addEventListener( 'load', function ( event ) {
		var geometry = event.content;
		var material = new THREE.MeshPhongMaterial( { ambient: 0x76766e, color: 0x76766e, specular: 0x111111, shininess: 200, perPixel: true } );
		var mesh = new THREE.Mesh( geometry, material );

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		mesh.position.set(0, 0,0);
		mesh.scale.x=50;
		mesh.scale.y=50;
		mesh.scale.z=50;
		scene.add( mesh );
	} );
	loader.load( '/static/files/head.stl' );
}


function addShadowedLight( x, y, z, color, intensity ) {

	var directionalLight = new THREE.DirectionalLight( color, intensity );
	directionalLight.position.set( x, y, z )
	scene.add( directionalLight );

	directionalLight.castShadow = true;
	//directionalLight.shadowCameraVisible = true;

	var d = 1;
	directionalLight.shadowCameraLeft = -d;
	directionalLight.shadowCameraRight = d;
	directionalLight.shadowCameraTop = d;
	directionalLight.shadowCameraBottom = -d;

	directionalLight.shadowCameraNear = 1;
	directionalLight.shadowCameraFar = 4;

	directionalLight.shadowMapWidth = 2048;
	directionalLight.shadowMapHeight = 2048;

	directionalLight.shadowBias = -0.005;
	directionalLight.shadowDarkness = 0.15;
}

$("#originButton").click(function() {
	//Bug in THREE doesn't let you directly maniupulate camera well. Have to remove and reset camera to re-origin
	scene.remove(camera);
    var SCREEN_WIDTH = 849, SCREEN_HEIGHT = 500;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(100,50,300);
	camera.lookAt(scene.position);	
	controls = new THREE.TrackballControls( camera );
	controls.zoomSpeed = .05;
});

function animate(){
    requestAnimationFrame( animate );

	render();		
	update();
}

function update(){
	// delta = change in time since last call (in seconds)
	var delta = clock.getDelta(); 
		
	controls.update();
	stats.update();
}

function render(){	
	renderer.render( scene, camera );
}