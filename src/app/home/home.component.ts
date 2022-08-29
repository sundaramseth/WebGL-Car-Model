import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

//connect with html
@ViewChild('canvas') private canvasRef!: ElementRef;  

private get canvas(): HTMLCanvasElement{
  return this.canvasRef.nativeElement;
}

// Some inputs value 
@Input() public rotationSpeedX: number = 0.01;
@Input() public rotationSpeedY: number = 0.005;
@Input() public rotationSpeedZ: number = 0.01;

@Input() public size: number = 200;
@Input() public texture: string = "/assets/texture.jpg";

//Stage Property
@Input() public cameraZ: number = 5;
@Input() public fieldOfView: number = 75;
@Input('nearClipping') public nearClippingPlane:number=0.1 ;
@Input('farClipping') public farClippingPlane:number=1000;

//To start thing off you need three things 
// 1. Scene
// 2. Camera
// 3. Renderer

private scene!: THREE.Scene;

private camera!: THREE.PerspectiveCamera;

private renderer!: THREE.WebGLRenderer;

// Load 3d model
private loaderspace = new GLTFLoader();

constructor () { 
  
}

ngAfterViewInit() {
  this.createScene();
  this.startRenderingLoop();
  //document.body.onscroll = this.moveCamera;
}
  ngOnInit(): void {

}


// Create Scene 

private createScene(){

this.scene = new THREE.Scene();

//load backgroud color
this.scene.background = new THREE.Color(0xdbdbdb);

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
this.scene.add( directionalLight );

const light = new THREE.HemisphereLight( 0x50bcfa, 0xc2c2c2, 1 );
light.position.set(-10,8,-10)
this.scene.add( light );

const width = 10;
const height = 10;
const intensity = 2;
const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
rectLight.position.set( 5, 7, -10 );
rectLight.lookAt( 0, 0, 0 );
this.scene.add( rectLight )

// white spotlight shining from the side, casting a shadow

const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 100, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

this.scene.add( spotLight );

const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
pointLight.position.set( -4, 3, 0 );
this.scene.add( light );




//Grid Helper
///const gridHelper = new THREE.GridHelper(10, 10);
//this.scene.add(gridHelper);

//Camera
let aceptRatio = this.getAceptratio();
this.camera = new THREE.PerspectiveCamera(this.fieldOfView,aceptRatio,this.nearClippingPlane,this.farClippingPlane);
this.camera.position.set(2, 1.5, 3);


//load 3d scene
this.loaderspace.load( 'assets/Car.glb',  ( gltf ) => {

this.scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

}


// Rendering
private startRenderingLoop(){
this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
this.renderer.setPixelRatio(devicePixelRatio);
this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  // turn on the physically correct lighting model

const controls = new OrbitControls(this.camera, this.renderer.domElement);
let component: HomeComponent = this;
(function render(){
  requestAnimationFrame(render);
  controls.update();
  component.renderer.render(component.scene, component.camera);
}());

}

private getAceptratio(){
  return this.canvas.clientWidth / this.canvas.clientHeight;
 }
 
}

