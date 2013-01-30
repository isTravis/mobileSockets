

// var WIDTH = window.innerWidth;
// var HEIGHT = window.innerHeight;


// var container, stats;
// var camera, scene, projector, renderer;
// var mesh;
// var floor;
// var lip;

// var socketColor;
// var currentID;

// var jumpTimes = [0];
// var timeCounts = [0];

// var direction = 1;

// var numPlayers = 1;
// var playerIDs = [];
// var players = [];



// init();
// animate();

// var url = "ws://" + location.host + "/socket";
// var ws = new WebSocket(url);
// 	ws.onmessage = function(event) {
// 		// socketColor = parseInt(event.data);
// 		var obj = JSON.parse(event.data);
// 		currentID = obj.id[0];
// 		socketColor = obj.message[0];

// 		if(playerIDs.length == 0){
// 			playerIDs.push(currentID);
// 		}

// 		if(playerIDs.indexOf(currentID) < 0){
// 			console.log("new player")
// 			playerIDs.push(currentID);
// 			jumpTimes.push(0);
// 			timeCounts.push(0);
// 			console.log(jumpTimes);
// 			newPlayer();
// 		}

// 		var currentIndex = playerIDs.indexOf(currentID);


// 		if(socketColor == "jump"){
// 			jump = 1;
// 			console.log("jump");
// 			jumpTimes[currentIndex] = 20;
// 		}else if(socketColor == "left"){
// 			direction = -1;
// 		}else if(socketColor == "right"){
// 			direction = 1;
// 		}
// 	}

/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: June 2012 (three.js v49)
 */
	
//////////	
// MAIN //
//////////

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// standard global variables
var container, scene, camera, renderer, controls, stats;

// custom global variables
var sphere;

// initialization
init();

// animation loop / game loop
animate();

///////////////
// FUNCTIONS //
///////////////
			
function init() 
{
	///////////
	// SCENE //
	///////////
	scene = new THREE.Scene();

	////////////
	// CAMERA //
	////////////
	
	// set the view size in pixels (custom or according to window size)
	// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);
	// the camera defaults to position (0,0,0)
	// 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
	camera.position.set(0,0,1000);
	camera.lookAt(0,0,0);	
	
	//////////////
	// RENDERER //
	//////////////
	
	// create and start the renderer; choose antialias setting.
	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	// create a div element to contain the renderer
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	// alternatively: if you insert the div via HTML, access it using
	//   container = document.getElementById( 'container' );

	// attach renderer to the container div
	container.appendChild( renderer.domElement );
	
	////////////
	// EVENTS //
	////////////

	// automatically resize renderer

	
	
	///////////
	// STATS //
	///////////
	
	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	
	///////////
	// LIGHT //
	///////////
	
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	var ambientLight = new THREE.AmbientLight(0x444);
	scene.add(ambientLight);
	// scene.add(ambientLight);
	
	//////////////
	// GEOMETRY //
	//////////////
		
	// most objects displayed are a "mesh":
	//  a collection of points ("geometry") and
	//  a set of surface parameters ("material")	

	// Sphere parameters: radius, segments along width, segments along height
	var sphereGeometry = new THREE.SphereGeometry( 50, 32, 16 ); 
	// use a "lambert" material rather than "basic" for realistic lighting.
	//   (don't forget to add (at least one) light!)
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x8888ff} ); 
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(0, 0, 0);
	scene.add(sphere);

	var sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere1.position.set(window.innerWidth/2, window.innerHeight/2, 0);
	scene.add(sphere1);
	
	var sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere2.position.set(-window.innerWidth/2, window.innerHeight/2, 0);
	scene.add(sphere2);

	var sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere3.position.set(-window.innerWidth/2, -window.innerHeight/2, 0);
	scene.add(sphere3);

	var sphere4 = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere4.position.set(window.innerWidth/2, -window.innerHeight/2, 0);
	scene.add(sphere4);

	

	// fog must be added to scene before first render
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
}

function animate() 
{

	sphere.position.x = (sphere.position.x+1)%(window.innerWidth/2);
	sphere.position.y = (sphere.position.y+1)%(window.innerHeight/2);
	// console.log(window.innerWidth);
	// console.log(window.innerHeight);

    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	// delta = change in time since last call (in seconds)
		console.log(SCREEN_HEIGHT);
	stats.update();
}

function render() 
{	
	renderer.render( scene, camera );
}
