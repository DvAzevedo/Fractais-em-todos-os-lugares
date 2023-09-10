import * as THREE from 'three';

const defaultPoints = [];
defaultPoints.push( new THREE.Vector3( 0, 0, 0 ) );
defaultPoints.push( new THREE.Vector3( 1 / 2.0, (Math.sqrt(3.0) / 2.0) * 1, 0) );
defaultPoints.push( new THREE.Vector3( 1, 0, 0 ) );

const defaultGeometry = new THREE.BufferGeometry().setFromPoints( defaultPoints );

var 	scene,
		camera,
        randomTrans,
        randomPoint,
		renderer;

var shaderMat;
let limiteDoCaos = 200000
const pointMat = new THREE.ShaderMaterial({ 	
    wireframe: true,
    vertexShader:`
    void main() {	
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    fragmentShader:`
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`
});

const transA = { a: 0.5, b: 0.0, c: 0.0, d: 0.5, e: 0.0, f: 0.0 };
const transB = { a: 0.5, b: 0.0, c: 0.0, d: 0.5, e: 0.5, f: 0.0 };
const transC = { a: 0.5, b: 0.0, c: 0.0, d: 0.5, e: 0.25, f: Math.sqrt(3) / 4 };
const trans = [transA, transB, transC];

function getTransformCoor(coor, t){
	//ax + by + e, cx + dy + f
	let x = t.a*coor.x + t.b*coor.y + t.e;
	let y = t.c*coor.x + t.d*coor.y + t.f;
	return new THREE.Vector3(x, y, 0);
}

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	let minDim = Math.min(window.innerWidth, window.innerHeight);

	renderer.setSize(minDim*0.80, minDim*0.80); 

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( 0.0, 1.0, 1.0, -0.05, 0.0, 1.0 );

    geraImagem(defaultGeometry);
    geraCaos(defaultPoints[0], 0);
  
}

/////

function geraImagem(geometry) {

    shaderMat = new THREE.ShaderMaterial({ 	
        wireframe: true,
        vertexShader:`
        void main() {	
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
        fragmentShader:`
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`

    });

    const fractorial = new THREE.Mesh(geometry, shaderMat);
    fractorial.name = "frac";
    scene.add(fractorial);

}

function drawPoint(randomPoint){
    
    const pointGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array( [ randomPoint.x, randomPoint.y, randomPoint.z ] );
    pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    const material = new THREE.PointsMaterial( { color: 0x888888 } );
    
    const point = new THREE.Points(pointGeometry, material);
    scene.add(point);
    renderer.render(scene, camera);
}



function geraCaos(currentPoint, i) {
    setTimeout(function() {
        randomTrans = trans[Math.floor(Math.random() * 3)];
        randomPoint = getTransformCoor(currentPoint, randomTrans);
        drawPoint(randomPoint);
        currentPoint = randomPoint;
        if (i < limiteDoCaos) {
            geraCaos(currentPoint, i + 1);
        }
    }, 0.05);
}




main();