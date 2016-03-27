window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){                
                window.setTimeout(callback(cont), 10 / 600);
              };
    })();
var Detector=require('../src/libs/detector.js');
var Labels=require("../src/class/labels");
var DetectorAR=require("../src/class/detector");
var Elemento=require("../src/class/elemento");
THREE.Matrix4.prototype.setFromArray = function(m) {
        return this.set(
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15]
        );
    }

var error = new Audio("./assets/sounds/error.wav"); // buffers automatically when created
var acierto = new Audio("./assets/sounds/acierto.wav"); 
var videoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),planoScene=new THREE.Scene();
var WIDTH_CANVAS=640,HEIGHT_CANVAS=480;
var videoCamera=new THREE.Camera();
var realidadCamera=new THREE.Camera();
var planoCamera=new THREE.PerspectiveCamera(40,WIDTH_CANVAS/HEIGHT_CANVAS,0.1,2000);//THREE.Camera();
//webglAvailable();
var renderer = new THREE.WebGLRenderer();
planoCamera.lookAt(planoScene.position);
renderer.autoClear = false;
renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
document.body.appendChild(renderer.domElement);



var video=new THREEx.WebcamTexture();
video.video.width=WIDTH_CANVAS;
video.video.height=HEIGHT_CANVAS;
videoTexture=video.texture;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
camara3d=new THREE.Object3D();
camara3d.position.z=-1;
camara3d.add(movieScreen);
camara3d.children[0].material.map.needsUpdate=true;
videoScene.add(camara3d);	
var markerRoot=new THREE.Object3D();
markerRoot.matrixAutoUpdate = false;
var geometry = new THREE.PlaneGeometry( 100, 100, 100 );
var material = new THREE.MeshBasicMaterial({color:0xcccccc
});
var cube = new THREE.Mesh(
  geometry,
  material
);
cube.position.z=-1;
markerRoot.add(cube);
realidadScene.add(markerRoot);



mano=new Elemento(60,60,new THREE.PlaneGeometry(60,60));
mano.init();
mano.definir("../assets/img/mano_escala.png",mano);
mano.get().position.z=-1;
objeto=mano.get();
objeto.matrixAutoUpdate = false;
realidadScene.add(objeto);
///*
indicador_acierto=new Elemento(500,500,new THREE.PlaneGeometry(500,500));
indicador_acierto.init();
indicador_acierto.definir("../assets/img/scale/star.png",indicador_acierto);
indicador_acierto.position(new THREE.Vector3(0,0,-2500));
planoScene.add(indicador_acierto.get());

indicador_error=new Elemento(500,500,new THREE.PlaneGeometry(500,500));
indicador_error.init();
indicador_error.definir("../assets/img/scale/error.png",indicador_error);
indicador_error.position(new THREE.Vector3(0,0,-2500));
planoScene.add(indicador_error.get());
//*/

var cartas={animales:["medusa","ballena","cangrejo","pato"],cocina:["pinzas","refractorio","sarten","rallador"]};
var tipo_memorama="cocina";
objetos=[],objetos_mesh=[],objetos_3d=[];        
for(var i=1,columna=-100,fila_pos=i,fila=-200;i<=8;i++,fila_pos=((i==5) ? 1 : fila_pos+1),fila=(fila_pos==1 ? -200 : (fila+80+33)),columna=((i>4) ? 120 : -100)){			
	var elemento=new Elemento(120,120,new THREE.PlaneGeometry(120,120));
  elemento.init();
	elemento.etiqueta(cartas[tipo_memorama][fila_pos-1]);
	elemento.scale(.7,.7);  
  elemento.position(new THREE.Vector3(fila,columna,-600));  
  elemento.calculoOrigen();
  objetos_mesh.push(elemento);
  objetos.push(elemento);
  planoScene.add(elemento.get());
	objetos[objetos.length-1].definirCaras("../assets/img/memorama/sin_voltear.jpg","../assets/img/memorama/"+tipo_memorama+"/cart"+i+"_"+cartas[tipo_memorama][fila_pos-1]+".jpg",
    objetos[objetos.length-1]);  
}
var material_kathia;
textura_kathia=new THREE.Texture(renderer_pixi.view);
textura_kathia.name="kathia";
textura_kathia.minFilter = THREE.LinearFilter;
textura_kathia.magFilter = THREE.LinearFilter;
geometria_kathia=new THREE.PlaneGeometry(kathia_ancho,kathia_alto);
material_kathia=new THREE.MeshBasicMaterial({map:textura_kathia});
mesh_kathia=new THREE.Mesh(geometria_kathia,material_kathia);	
mesh_kathia.position.set(530,300,-1100);
planoScene.add(mesh_kathia);

texto=Labels(250,250);
texto.init();
texto.definir({
	color:'#ff0000',
    alineacion:'center',
    tiporafia:'200px Arial',
    x:250/2,
    y:250/2
});
label=texto.crear("HELLO WORLD");
planoScene.add(label);

label.position.set(-1.5,-6.6,-20);

///*
var canvas_element=document.createElement("canvas");
canvas_element.width=WIDTH_CANVAS;
canvas_element.height=HEIGHT_CANVAS;
var canvas_context=canvas_element.getContext("2d");
var detector_ar=DetectorAR(canvas_element);
detector_ar.init();
detector_ar.setCameraMatrix(realidadCamera);
var pares=0;
detectados=[];
function logicaMemorama(pos_colision){  
    if(detectados.length==1 && detectados[0].igualA(objetos_mesh[pos_colision])){

    }else if(detectados.length==1 && detectados[0].esParDe(objetos_mesh[pos_colision])){        
        platicarModificada("acierto");
        indicador_acierto.easein();
        acierto.play();
        objetos_mesh[pos_colision].voltear();               
        objetos_mesh[pos_colision]=null;
        pares++;
        detectados=[];  
    }else if(detectados.length==0){     
        objetos_mesh[pos_colision].voltear();
        detectados.push(objetos_mesh[pos_colision]);
    }else if(detectados[0].get().id!=objetos_mesh[pos_colision].get().id){     
        platicarModificada("error_por_intento");
        indicador_error.easein();
        console.log(detectados[0].esParDe(objetos_mesh[pos_colision]));
        error.play();
        detectados[0].voltear();
        detectados.pop();
    }
    //*/
}

function verificarColision(){
	mano.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale());
	for(var i=0;i<objetos_mesh.length;i++){
        if(objetos_mesh[i]==null)
            continue;
		if(objetos[i].colisiona(objeto)){//if(mano.colisiona(objetos[i].get())){
			//console.log("Colisiona con "+objetos[i].getNombre()+" "+i);	
            logicaMemorama(i);
        }	
	}
}

function rendering(){	
	renderer.clear();
	renderer.render( videoScene, videoCamera );
	renderer.clearDepth();
  renderer.render( planoScene, planoCamera );
  renderer.clearDepth();
	renderer.render( realidadScene, realidadCamera );
}

function loop(){
	camara3d.children[0].material.map.needsUpdate=true;
  indicador_acierto.actualizar();
  indicador_error.actualizar();
  for(var i=0;i<objeto.children.length;i++)
    objeto.children[i].material.needsUpdate=true;    
    for(var i=0;i<objetos.length;i++){
    	objetos[i].actualizar();
    }
	canvas_context.drawImage(video.video,0,0);
	canvas_element.changed = true;
	label.material.map.needsUpdate=true;
	textura_kathia.needsUpdate=true;
    detectado=detector_ar.markerToObject(objeto);
    if(detectado){
        if(objeto.getWorldPosition().z<523){
        //console.log("FUE DETECTADO "+detectado+" pero estas muy lejos");
        }else if(objeto.getWorldPosition().z<=623){
            //console.log("FUE DETECTADO "+detectado+" y estas bien de lejano");
            verificarColision();
        }
    }
	rendering();
	requestAnimationFrame(loop);
	if(!pausado_kathia)
		animate();
}

initKathia(texto);
loop();