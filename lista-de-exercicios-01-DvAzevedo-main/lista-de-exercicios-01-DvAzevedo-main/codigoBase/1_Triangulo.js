import * as THREE from 'three';


//const 	rendSize 	= new THREE.Vector2();
const minSize = 1/(2**6);

const defaultPoints = [];
defaultPoints.push( new THREE.Vector3( 0, 0, 0 ) );
defaultPoints.push( new THREE.Vector3( 1 / 2.0, (Math.sqrt(3.0) / 2.0) * 1, 0) );
defaultPoints.push( new THREE.Vector3( 1, 0, 0 ) );

const defaultGeometry = new THREE.BufferGeometry().setFromPoints( defaultPoints );

var 	scene,
		camera,
		renderer,
		shaderMat;

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
function getTransformTriangulo (coor1, coor2, coor3, transNum){
	const newCoor1 = getTransformCoor(coor1, trans[transNum]);
	const newCoor2 = getTransformCoor(coor2, trans[transNum]);
	const newCoor3 = getTransformCoor(coor3, trans[transNum]);

	return [newCoor1, newCoor2, newCoor3];
}
function getGeometry(coor1, coor2, coor3, transNum){
	const coordinates =  getTransformTriangulo(coor1, coor2, coor3, transNum);
	const geometry = new THREE.BufferGeometry().setFromPoints( coordinates );
	return {g: geometry, c: coordinates};
}
function isValid(points){
	const size = (points[2].x - points[0].x);
	if (size < minSize){
		return false;
	}else{
		return true;
	}
}
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	let minDim = Math.min(window.innerWidth, window.innerHeight);

	renderer.setSize(minDim*0.80, minDim*0.80); 

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( 0.0, 1.0, 1.0, -0.05, 0.0, 1.0 );

    geraImagem(defaultGeometry, defaultPoints);

	renderer.clear();
	renderer.render(scene, camera);    
}

/////
function geraImagem(geometry, currentPoints) {
	if(isValid(currentPoints)){
		renderer.clear();
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
		const tA = getGeometry(currentPoints[0], currentPoints[1], currentPoints[2], 0);
		geraImagem(tA.g, tA.c);

		const tB = getGeometry(currentPoints[0], currentPoints[1], currentPoints[2], 1);
		geraImagem(tB.g, tB.c);

		const tC = getGeometry(currentPoints[0], currentPoints[1], currentPoints[2], 2);
		geraImagem(tC.g, tC.c);

		const fractorial = new THREE.Mesh(geometry, shaderMat);
		scene.add(fractorial);
	}else{
		return 0;
	}
}
main();