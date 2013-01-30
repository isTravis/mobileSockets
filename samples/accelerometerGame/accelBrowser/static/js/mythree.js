// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// var renderer, scene, camera, stats;

// var sphere, uniforms, attributes;

// var vc1;
// var socketColor

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// var minVal = 99999999999;
// var maxVal = 0;

// init();
// animate();

// var url = "ws://" + location.host + "/socket";
// var ws = new WebSocket(url);
// 	ws.onmessage = function(event) {
// 		socketColor = parseInt(event.data);

// 		if(socketColor >maxVal){
// 			maxVal = socketColor;
// 			datapoints = document.getElementById( 'datapoints' );
// 		    newdata = document.createElement('p')
// 		    newText = document.createTextNode("New Max: ("+String(socketColor)+")");
// 			newdata.appendChild( newText );
// 			datapoints.appendChild(newdata);
// 		}
// 		if(socketColor<minVal){
// 			minVal = socketColor;
// 			datapoints = document.getElementById( 'datapoints' );
// 		    newdata = document.createElement('p')
// 		    newText = document.createTextNode("New Min: ("+String(socketColor)+")");
// 			newdata.appendChild( newText );
// 			datapoints.appendChild(newdata);
// 		}
// 	}



var container, stats;
var camera, scene, projector, renderer;
var mesh;
var floor;
var lip;

var socketColor;
var currentID;

var jumpTimes = [0];
var timeCounts = [0];

var direction = 1;

var numPlayers = 1;
var playerIDs = [];
var players = [];



init();
animate();

var url = "ws://" + location.host + "/socket";
var ws = new WebSocket(url);
	ws.onmessage = function(event) {
		// socketColor = parseInt(event.data);
		var obj = JSON.parse(event.data);
		currentID = obj.id[0];
		socketColor = obj.message[0];

		// console.log(obj.id[0]);
		// console.log(obj.message[0]);



		if(playerIDs.length == 0){
			playerIDs.push(currentID);
		}

		if(playerIDs.indexOf(currentID) < 0){
			console.log("new player")
			playerIDs.push(currentID);
			jumpTimes.push(0);
			timeCounts.push(0);
			console.log(jumpTimes);
			newPlayer();
			//create new player

			// console.log(playerIDs.indexOf(currentID))
		}

		var currentIndex = playerIDs.indexOf(currentID);


		if(socketColor == "jump"){
			jump = 1;
			console.log("jump");
			jumpTimes[currentIndex] = 20;
		}else if(socketColor == "left"){
			direction = -1;
		}else if(socketColor == "right"){
			direction = 1;
		}
	}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );


	//

	camera = new THREE.PerspectiveCamera( 50, WIDTH/HEIGHT, 1, 10000 );
	camera.position.x = 0;
	camera.position.z = 423;
	camera.position.y = 200;
	camera.target = new THREE.Vector3( 0, 200, 0 );

	scene = new THREE.Scene();

	//

	var light = new THREE.DirectionalLight( 0xefefff, 2 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffefef, 2 );
	light.position.set( -1, -1, -1 ).normalize();
	scene.add( light );

	var loader = new THREE.JSONLoader( true );
	loader.load( "static/js/horse.js", function( geometry ) {

		mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } ) );
		mesh.scale.set( 1.5, 1.5, 1.5 );
		// scene.add( mesh );

	} );

	//Floor//
	var floorTexture = new THREE.ImageUtils.loadTexture( 'static/wallpaper.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 1, 1 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
	var floorGeometry = new THREE.PlaneGeometry(3200, 500, 800, 250);
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = 200;
	floor.position.x=0;
	floor.position.z = 0;
	floor.doubleSided = false;
	scene.add(floor);

	//

	//

	var mapLip = THREE.ImageUtils.loadTexture( "/static/character1.png" );
	players[0] = new THREE.Sprite( { map: mapLip, useScreenCoordinates: false, affectedByDistance: true} );
	players[0].scale.x = 0.4;
	players[0].scale.y = 0.4;
	players[0].position.set( 0,95, 0 );
	// sprite.position.normalize();
	// sprite.position.multiplyScalar( radius );
	scene.add( players[0] );



	renderer = new THREE.WebGLRenderer();
	renderer.sortObjects = false;
	renderer.setSize( WIDTH, HEIGHT );

	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function newPlayer(){
	var mapLip = THREE.ImageUtils.loadTexture( "/static/character"+((players.length)%5+1)+".png" ); //character1.png ... character9.png !! Need to change for more than 9 players
	// console.log("before"+players.length);
	players.push( new THREE.Sprite( { map: mapLip, useScreenCoordinates: false, affectedByDistance: true} ));
	// console.log("after"+players.length);
	players[players.length-1].scale.x = 0.4;
	players[players.length-1].scale.y = 0.4;
	players[players.length-1].position.set( -300+Math.random()*600,95, 0 );
	// sprite.position.normalize();
	// sprite.position.multiplyScalar( radius );
	scene.add( players[players.length-1] );
}

function onWindowResize() {

	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize( WIDTH, HEIGHT );

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

var radius = 600;
var theta = 0;

var duration = 1000;
var keyframes = 15, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;

function render() {

	theta += .1;
	for(var ii = 0; ii<players.length; ii++){
		if(timeCounts[ii]<jumpTimes[ii]){
			players[ii].position.y = 95+50*Math.sin((Math.PI)*(timeCounts[ii]/jumpTimes[ii]));
			// camera.target.z = 0+00*Math.sin((Math.PI)*(timeCounter/jumptime));
			// console.log(camera.target.y);
			timeCounts[ii]++;
		}else{
			players[ii].position.y = 95;
			timeCounts[ii] = 0;
			jumpTimes[ii] = 0;
			//jumpTimes[ii]=20+Math.random()*10;
		}
		players[ii].scale.x = direction*0.4;

	}


	// lip.scale.x = direction*0.4;
	floor.position.x = (floor.position.x-(direction*2))%776;
	// camera.target.y = 150+100*Math.cos(theta);
	// camera.position.x = radius * Math.sin(( theta ) );
	// console.log("x"+camera.position.x);
	// camera.position.z = radius * Math.cos(( theta ) );
	// console.log("z"+camera.position.z);

	camera.lookAt( camera.target );

	if ( mesh ) {

		// Alternate morph targets

		var time = Date.now() % duration;

		var keyframe = Math.floor( time / interpolation );

		if ( keyframe != currentKeyframe ) {

			mesh.morphTargetInfluences[ lastKeyframe ] = 0;
			mesh.morphTargetInfluences[ currentKeyframe ] = 1;
			mesh.morphTargetInfluences[ keyframe ] = 0;

			lastKeyframe = currentKeyframe;
			currentKeyframe = keyframe;

			// console.log( mesh.morphTargetInfluences );

		}

		mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
		mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];

	}

	renderer.render( scene, camera );

}
