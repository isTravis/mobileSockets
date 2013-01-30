// /*
// 	Three.js "tutorials by example"
// 	Author: Lee Stemkoski
// 	Date: June 2012 (three.js v49)
//  */
	
// //////////	
// // MAIN //
// //////////




// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// // standard global variables
// var container, scene, camera, renderer, controls, stats;
// // var keyboard = new THREEx.KeyboardState();
// var clock = new THREE.Clock();

// var light3;

// var socketColor = 150;
// var numPoints = 0;
// var pointsx = [];
// var pointsy = [];
// var pointsz = [];
// // custom global variables
// var cube;
// var sphereIndex = 1;

// // initialization
// init();

// // animation loop / game loop
// animate();




// 		<script>

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();






var renderer, scene, camera, stats;

var sphere, uniforms, attributes;

var vc1;
var socketColor

var WIDTH = 849;
var HEIGHT = 500;

var minVal = 99999999999;
var maxVal = 0;

init();
animate();

var url = "ws://" + location.host + "/socket";
var ws = new WebSocket(url);
	ws.onmessage = function(event) {
		socketColor = parseInt(event.data);

		if(socketColor >maxVal){
			maxVal = socketColor;
			datapoints = document.getElementById( 'datapoints' );
		    newdata = document.createElement('p')
		    newText = document.createTextNode("New Max: ("+String(socketColor)+")");
			newdata.appendChild( newText );
			datapoints.appendChild(newdata);
		}
		if(socketColor<minVal){
			minVal = socketColor;
			datapoints = document.getElementById( 'datapoints' );
		    newdata = document.createElement('p')
		    newText = document.createTextNode("New Min: ("+String(socketColor)+")");
			newdata.appendChild( newText );
			datapoints.appendChild(newdata);
		}

	 //    datapoints = document.getElementById( 'datapoints' );
	 //    newdata = document.createElement('p')
	 //    newText = document.createTextNode("Point received: ("+String(socketColor)+")");
		// newdata.appendChild( newText );
		// datapoints.appendChild(newdata);
	}

function init() {

	camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 10000 );
	camera.position.z = 300;

	scene = new THREE.Scene();

	attributes = {

		size: {	type: 'f', value: [] },
		ca:   {	type: 'c', value: [] }

	};

	uniforms = {

		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "static/disc.png" ) },

	};

	uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;

	var shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: 		uniforms,
		attributes:     attributes,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		transparent:	true

	});


	var radius = 100, segments = 68, rings = 38;
	var geometry = new THREE.SphereGeometry( radius, segments, rings );

	vc1 = geometry.vertices.length;

	var geometry2 = new THREE.CubeGeometry( 0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10 );

	THREE.GeometryUtils.merge( geometry, geometry2 );

	sphere = new THREE.ParticleSystem( geometry, shaderMaterial );

	sphere.dynamic = true;
	sphere.sortParticles = true;

	var vertices = sphere.geometry.vertices;
	var values_size = attributes.size.value;
	var values_color = attributes.ca.value;

	for( var v = 0; v < vertices.length; v++ ) {

		values_size[ v ] = 10;
		values_color[ v ] = new THREE.Color( 0xffffff );

		if ( v < vc1 ) {

			values_color[ v ].setHSV( 0.01 + 0.1 * ( v / vc1 ), 0.99, ( vertices[ v ].y + radius ) / ( 2 *radius ) );

		} else {

			values_size[ v ] = 40;
			values_color[ v ].setHSV( 0.6, 0.75, 0.5 + vertices[ v ].y / ( 0.8 * radius ) );

		}

	}

	scene.add( sphere );

	renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1 } );
	renderer.setSize( WIDTH, HEIGHT );

	var container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	var time = Date.now() * 0.005;

	sphere.rotation.y = 0.2 * time;
	sphere.rotation.z = 0.2 * time;

	for( var i = 0; i < attributes.size.value.length; i ++ ) {

		if ( i < vc1 )
			attributes.size.value[ i ] = 24*(socketColor/4291518);


	}

	attributes.size.needsUpdate = true;

	renderer.render( scene, camera );

}


