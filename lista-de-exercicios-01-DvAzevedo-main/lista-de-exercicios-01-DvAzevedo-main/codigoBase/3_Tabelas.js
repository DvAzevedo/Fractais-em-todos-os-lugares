import * as THREE from 'three';

import { GUI } from 'gui';

const 	gui = new GUI();
const 	rendSize 	= new THREE.Vector2();



const defaultPoints = [];
defaultPoints.push( new THREE.Vector3( 0, 0, 0 ) );
defaultPoints.push( new THREE.Vector3( 1 / 2.0, (Math.sqrt(3.0) / 2.0) * 1, 0) );
defaultPoints.push( new THREE.Vector3( 1, 0, 0 ) );

const defaultGeometry = new THREE.BufferGeometry().setFromPoints( defaultPoints );
let boolT1 = false;
var 	controls,
        scene,
		camera,
		renderer;

var shaderMat
var defaultRecTime = 2;
// Tabelas
const t1_II = {a:0.00, b:0.00, c:0.00, d:0.16, e:0.00, f:0.00};
const t2_II = {a:0.58, b:0.04, c:-0.04, d:0.85, e:0.00, f:1.6};
const t3_II = {a:0.20, b:-0.26, c:0.23, d:0.22, e:0.00, f:1.6};
const t4_II = {a:-0.15, b:0.28, c:0.26, d:0.24, e:0.00, f:0.44};
const t_II = [t1_II, t2_II, t3_II, t4_II];

const t1_III = {a:0.00, b:0.00, c:0.00, d:0.16, e:0.00, f:0.00};
const t2_III = {a:0.75, b:0.04, c:-0.04, d:0.85, e:0.00, f:1.6};
const t3_III = {a:0.20, b:-0.26, c:0.23, d:0.22, e:0.00, f:1.6};
const t4_III = {a:-0.15, b:0.28, c:0.26, d:0.24, e:0.00, f:0.44};
const t_III = [t1_III, t2_III, t3_III, t4_III];

const t1_IV = {a:0.01, b:0.00, c:0.00, d:0.45, e:0.00, f:0.00};
const t2_IV = {a:-0.42, b:-0.42, c:-0.42, d:0.42, e:0.00, f:0.40};
const t3_IV = {a:0.42, b:-0.42, c:0.42, d:0.42, e:0.00, f:0.40};
const t4_IV = {a:0.42, b:0.42, c:-0.42, d:0.42, e:0.00, f:0.40};
const t_IV = [t1_IV, t2_IV, t3_IV, t4_IV];

const t1_V = {a:0.382, b:0.000, c:0.000, d:0.382, e:0.309, f:0.570};
const t2_V = {a:0.118, b:-0.363, c:0.363, d:0.118, e:0.363, f:0.330};
const t3_V = {a:0.118, b:0.363, c:-0.363, d:0.118, e:0.518, f:0.694};
const t4_V = {a:-0.309, b:-0.224, c:0.224, d:-0.309, e:0.607, f:0.309};
const t5_V = {a:-0.309, b:0.224, c:-0.224, d:-0.309, e:0.701, f:0.533};
const t6_V = {a:0.382, b:0.000, c:0.000, d:-0.382, e:0.309, f:0.677};
const t_V = [t1_V, t2_V, t3_V, t4_V, t5_V, t6_V];

const t1_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.00, f:0.00};
const t2_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.33, f:0.00};
const t3_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.66, f:0.00};
const t4_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.00, f:0.33};
const t5_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.00, f:0.66};
const t6_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.33, f:0.66};
const t7_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.66, f:0.33};
const t8_VI = {a:0.33, b:0.00, c:0.00, d:0.33, e:0.66, f:0.66};
const t_VI = [t1_VI, t2_VI, t3_VI, t4_VI, t5_VI, t6_VI, t7_VI, t8_VI];

const tabelas = [t_II, t_III, t_IV, t_V, t_VI];
// const transA = { a: 0.5, b: 0.0, c: 0.0, d: 0.5, e: 0.0, f: 0.0 };
// const transB = { a: 0.5, b: 0.0, c: 0.0, d: 0.5, e: 0.5, f: 0.0 };
// const transC = { a: 0.5, b: 0.0, c: 0.0, d: 0.5, e: 0.25, f: Math.sqrt(3) / 4 };
let trans = tabelas[0];

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

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	let minDim = Math.min(window.innerWidth, window.innerHeight);

	renderer.setSize(minDim*0.80, minDim*0.80); 

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -3.0, 3.0, 3.0, -3.0, 3.0, 0.0 );
    
    initGui();
    
    geraImagem(defaultGeometry, defaultPoints, defaultRecTime);

	renderer.clear();
	renderer.render(scene, camera);    
}

/////

function geraImagem(geometry, currentPoints, recTime) {
	if(recTime > 0){
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
        for(let i = 0; i < trans.length; i++) {
            const tA = getGeometry(currentPoints[0], currentPoints[1], currentPoints[2], i);
		    geraImagem(tA.g, tA.c, recTime-1);
        }

		const fractorial = new THREE.Mesh(geometry, shaderMat);
		fractorial.name = "frac";
        scene.add(fractorial);
	}else{
		return 0;
	}
}

function initGui() {
    controls = { Nivel : 2.0, Tabela : 2.0};
    gui.add(controls, 'Nivel', 0.0, 10.0).onChange(changeNivel);
	gui.add(controls, 'Tabela', 2.0, 6.0).onChange(changeTabela);
    gui.open();
}
function changeTabela() {
    scene = new THREE.Scene();
	trans = tabelas[Math.trunc(controls.Tabela)-2];
	console.log(trans.length);
    geraImagem(defaultGeometry, defaultPoints, controls.Nivel);
    renderer.render(scene, camera);    
}

function changeNivel() {
    scene = new THREE.Scene();
    geraImagem(defaultGeometry, defaultPoints, controls.Nivel);
    renderer.render(scene, camera);    
}

// function changeNivel() {
//     scene = new THREE.Scene();
//     geraImagem(defaultGeometry, defaultPoints);
//     renderer.render(scene, camera);    
// }

main();