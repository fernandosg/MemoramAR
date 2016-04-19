function Memorama(){

}

Memorama.prototype.config=function(configuracion){
  this.tipo_memorama=configuracion["tipo_memorama"];  
  this.cantidad_cartas=configuracion["cantidad_cartas"];
}


Memorama.prototype.init=function(){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento
  var Detector=require('./libs/detector.js');
  var Labels=require("./class/labels");
  var DetectorAR=require("./class/detector");
  var Elemento=require("./class/elemento");

  /*
    MODIFICO LA FUNCION setFromArray DE LA CLASE Matrix4
  */
  

  var error = new Audio("./assets/sounds/error.wav"); // buffers automatically when created
  var acierto = new Audio("./assets/sounds/acierto.wav"); 
  var videoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),planoScene=new THREE.Scene();
  var WIDTH_CANVAS=800,HEIGHT_CANVAS=600;
  var videoCamera=new THREE.Camera();
  var realidadCamera=new THREE.Camera();
  var planoCamera=new THREE.PerspectiveCamera(40,WIDTH_CANVAS/HEIGHT_CANVAS,0.1,2000);//THREE.Camera();
  var renderer = new THREE.WebGLRenderer();
  planoCamera.lookAt(planoScene.position);
  renderer.autoClear = false;
  renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
  document.getElementById("ra").appendChild(renderer.domElement);



  var video=new THREEx.WebcamTexture(WIDTH_CANVAS,HEIGHT_CANVAS);
  videoTexture=video.texture;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );           
  var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
  movieScreen = new THREE.Mesh( movieGeometry, movieMaterial ); 
  videoScene.add(movieScreen); 
  var markerRoot=new THREE.Object3D();
  markerRoot.matrixAutoUpdate = false;


  /* 
    SE CREA LA MANO, COMO OBJETO CANVAS DONDE SE DIBUJA LA IMAGEN DE mano_escala.
    LA POSICION DE ESTE OBJETO SE ACTUALIZARA
  */
 
  //objeto=mano.get();
  //realidadScene.add(objeto);

  var geometry = new THREE.PlaneGeometry( 30,30 );
  var material = new THREE.MeshBasicMaterial( {color:0xAA0000, side:THREE.DoubleSide } );

  var mesh = new THREE.Mesh( geometry, material );  
  THREE.Matrix4.prototype.setFromArray = function(m) {
      return this.set(
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
      );
  } 
  THREE.Object3D.prototype.transformFromArray = function(m) {
    this.matrix.setFromArray(m);
    this.matrixWorldNeedsUpdate = true;
  }
  objeto=new THREE.Object3D();
  objeto.matrixAutoUpdate = false;  
  objeto.add(mesh);
  realidadScene.add(objeto);

/*
  // CREACION DE LAS CARTAS COMO ELEMENTOS
  var cartas={animales:["medusa","ballena","cangrejo","pato"],cocina:["pinzas","refractorio","sarten","rallador"]};  
  objetos=[],objetos_mesh=[],objetos_3d=[];        
  limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
  for(var i=1,cont_fila=1,pos_y=-100,fila_pos=i,pos_x=-200;i<=this.cantidad_cartas;i++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+113))){         
    var elemento=new Elemento(120,120,new THREE.PlaneGeometry(120,120));
    elemento.init();
    elemento.etiqueta(cartas[this.tipo_memorama][fila_pos-1]);
    elemento.scale(.7,.7);  
    elemento.position(new THREE.Vector3(pos_x,pos_y,-600));  
    elemento.calculoOrigen();
    objetos_mesh.push(elemento);
    objetos.push(elemento);
    planoScene.add(elemento.get());
    objetos[objetos.length-1].definirCaras("./assets/img/memorama/sin_voltear.jpg","./assets/img/memorama/"+this.tipo_memorama+"/cart"+fila_pos+"_"+cartas[this.tipo_memorama][fila_pos-1]+".jpg",
      objetos[objetos.length-1]); 
    capa_elemento=document.createElement("div");
    capa_elemento.innerHTML+="Elemento "+i+" nombre carta "+cartas[this.tipo_memorama][fila_pos-1]+" pos= x:"+objetos[objetos.length-1].get().position.x+",y:"+objetos[objetos.length-1].get().position.y+",z:"+objetos[objetos.length-1].get().position.z+" <br>";
    document.getElementById("objetos").appendChild(capa_elemento);
    console.log("VEAMOS "+fila_pos+" "+limite_renglon);    
  }*/



  // CREACION DEL CANVAS QUE PERMITE LEER LA INFORMACION DEL CANVAS PARA LA DETECCION DE DetectorAR
  var canvas_element=document.createElement("canvas");
  canvas_element.width=WIDTH_CANVAS;
  canvas_element.height=HEIGHT_CANVAS;
  canvas_element.id="debugCanvas";
  var canvas_context=canvas_element.getContext("2d");
  var detector_ar=DetectorAR(canvas_element);
  detector_ar.setCameraMatrix(realidadCamera);
  var pares=0;
  detectados=[];

  /*
    FUNCION LOGICA MEMORAMA
    EN ESTA FUNCION ES DONDE SE DEFINE LAS ACCIONES CORRESPONDIENTES A LA LOGICA DE MEMORAMA:
      ES PAR{
        SI ES PAR, LOS ELEMENTOS SE ELIMINAN DE LA COLA DE ELEMENTOS DIBUJADOS.    
      }
      IMPAR{
        SI NO ES PAR, LOS ELEMENTOS SE ROTAN DE TAL MANERA DE QUE SE OCULTE Y SE DA UNA NOTIFICACION 
        DE MANERA GRAFICA 
      }


  */
  
  /*
    FUNCION PARA VERIFICAR LA COLISION.
      SE ACTUALIZA LA POSICION DE LA MANO CON EL OBJETO3D QUE ES ACTUALIZADO A RAIZ DE LA UBICACION DEL MARCADOR
      EN ESTA FUNCION SE ITERA SOBRE TODAS LAS CARTAS AGREGADAS A ESCENA
  */

  /*
    FUNCION PARA ACTUALIZAR EL ELEMENTO RANGE HTML.
      UNA PROPUESTA VISUAL DE LA PROFUNDIDAD ACTUAL  
  */
  function actualizarDistancia(z){
    document.getElementById("distancia").value=((100*z)/1246);  
  }

  /*
    FUNCION PARA MOSTRAR POSICION DE MANO
  */
  function mostrarPosicionMano(pos){
    document.getElementById("pos_x_mano").innerHTML=pos.x;
    document.getElementById("pos_y_mano").innerHTML=pos.y;
    document.getElementById("pos_z_mano").innerHTML=pos.z;
  }

  /*
    FUNCION PARA RENDERIZADO DE LAS ESCENAS.

  */
  function rendering(){ 
    //renderer.clear();
    renderer.render( videoScene, videoCamera );
    //renderer.clearDepth();
    //renderer.render( planoScene, planoCamera );
    //renderer.clearDepth();
    renderer.render( realidadScene, realidadCamera );
  }

  /*
    FUNCION DE ANIMACION

  */
  function loop(){
    movieMaterial.map.needsUpdate=true;/*
    for(var i=0;i<objeto.children.length;i++)
      objeto.children[i].material.needsUpdate=true;   
    */
    /*
    for(var i=0;i<objetos.length;i++)
        objetos[i].actualizar();    
      */
    canvas_context.drawImage(video.video,0,0);
    canvas_element.changed = true;
    if(detector_ar.detect(objeto)){
      actualizarDistancia(objeto.getWorldPosition().z);
      mostrarPosicionMano(objeto.getWorldPosition());
    }
    rendering();
    requestAnimationFrame(loop);    
  }

  document.getElementById("threshold").addEventListener("change",function(evt){
    detector_ar.cambiarThreshold(document.getElementById("threshold").value);
  })
  loop();
}

module.exports=Memorama;