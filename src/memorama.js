function Memorama(){

}

Memorama.prototype.config=function(configuracion){
  this.tipo_memorama=configuracion["tipo_memorama"];  
  this.cantidad_cartas=configuracion["cantidad_cartas"];
  this.WIDTH=configuracion["width"];
  this.HEIGHT=configuracion["height"];
}


Memorama.prototype.init=function(){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento
  var Labels=require("./class/labels");
  var DetectorAR=require("./class/detector");
  var Elemento=require("./class/elemento");

  /*
    MODIFICO LA FUNCION setFromArray DE LA CLASE Matrix4
  */
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
  var videoCamera=new THREE.Camera();
  var realidadCamera=new THREE.Camera();  
  WIDTH_CANVAS=this.WIDTH;
  HEIGHT_CANVAS=this.HEIGHT;//configuracion["height"];
  var planoCamera=new THREE.PerspectiveCamera();//THREE.Camera();
  planoCamera.near=0.1;
  planoCamera.far=2000;
  var renderer = new THREE.WebGLRenderer();
  planoCamera.lookAt(planoScene.position);
  renderer.autoClear = false;
  renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
  document.getElementById("ra").appendChild(renderer.domElement);



  canvas=document.createElement("canvas");
  canvas.width=WIDTH_CANVAS;
  canvas.height=HEIGHT_CANVAS;
  var video=new THREEx.WebcamTexture(WIDTH_CANVAS,HEIGHT_CANVAS);
  videoTexture=new THREE.Texture(canvas);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );     
  var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
  movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.scale.x=-1;
  movieScreen.material.side = THREE.DoubleSide;
  videoScene.add(movieScreen);  
    // CREACION DEL CANVAS QUE PERMITE LEER LA INFORMACION DEL CANVAS PARA LA DETECCION DE DetectorAR 
  var canvas_context=canvas.getContext("2d");
  var detector_ar=DetectorAR(canvas);
  detector_ar.init();
  detector_ar.setCameraMatrix(realidadCamera);


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
  mano=new Elemento(60,60,new THREE.PlaneGeometry(60,60));
  mano.init();  
  mano.etiqueta("Detector");
  mano.definir("./assets/img/mano_escala.png",mano);
  mano.get().position.z=-1;
  objeto=mano.get();
  objeto.matrixAutoUpdate = false;
  realidadScene.add(objeto);

   // CREACION DEL ELEMENTO ACIERTO (LA IMAGEN DE LA ESTRELLA)
  indicador_acierto=new Elemento(500,500,new THREE.PlaneGeometry(500,500));
  indicador_acierto.init();
  indicador_acierto.definir("./assets/img/scale/star.png",indicador_acierto);
  indicador_acierto.position(new THREE.Vector3(0,0,-2500));
  planoScene.add(indicador_acierto.get());

  // CREACION DEL ELEMENTO ERROR (LA IMAGEN DE LA X)
  indicador_error=new Elemento(500,500,new THREE.PlaneGeometry(500,500));
  indicador_error.init();
  indicador_error.definir("./assets/img/scale/error.png",indicador_error);
  indicador_error.position(new THREE.Vector3(0,0,-2500));
  planoScene.add(indicador_error.get());

///*
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
    objetos_mesh.push(elemento);
    objetos.push(elemento);
    planoScene.add(elemento.get());
    objetos[objetos.length-1].definirCaras("./assets/img/memorama/sin_voltear.jpg","./assets/img/memorama/"+this.tipo_memorama+"/cart"+fila_pos+"_"+cartas[this.tipo_memorama][fila_pos-1]+".jpg",
      objetos[objetos.length-1]); 
    capa_elemento=document.createElement("div");
    capa_elemento.innerHTML+="Elemento "+i+" nombre carta "+cartas[this.tipo_memorama][fila_pos-1]+" pos= x:"+objetos[objetos.length-1].get().position.x+",y:"+objetos[objetos.length-1].get().position.y+",z:"+objetos[objetos.length-1].get().position.z+" <br>";
    document.getElementById("objetos").appendChild(capa_elemento);
    console.log("VEAMOS "+fila_pos+" "+limite_renglon);    
  }
//*/


  //CREACION DE KATHIA
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

  //CREACION DE LA ETIQUETA DONDE SE ESCRIBE LA RESPUESTA DE KATHIA
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
        error.play();
        detectados[0].voltear();
        detectados.pop();
    }
    //*/
}
  
  /*
    FUNCION PARA VERIFICAR LA COLISION.
      SE ACTUALIZA LA POSICION DE LA MANO CON EL OBJETO3D QUE ES ACTUALIZADO A RAIZ DE LA UBICACION DEL MARCADOR
      EN ESTA FUNCION SE ITERA SOBRE TODAS LAS CARTAS AGREGADAS A ESCENA
  */

  function verificarColision(){    
    mano.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale()); 
    for(var i=0;i<objetos_mesh.length;i++){
      if(objetos_mesh[i]==null)
        continue;
      if(objetos_mesh[i].colisiona(objeto)){//if(mano.colisiona(objetos[i].get())){
        console.log("Colisiona con "+objetos[i].getNombre()+" "+i); 
        logicaMemorama(i);
      } 
    }
  }

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
    renderer.clear();
    renderer.render( videoScene, videoCamera );
    renderer.clearDepth();
    renderer.render( planoScene, planoCamera );
    renderer.clearDepth();
    renderer.render( realidadScene, realidadCamera );
  }

  /*
    FUNCION DE ANIMACION

  */
  function loop(){  

    movieScreen.material.map.needsUpdate=true; 
    for(var i=0;i<objeto.children.length;i++)
      objeto.children[i].material.needsUpdate=true;          
    for(var i=0;i<objetos.length;i++)
        objetos[i].actualizar();          
    canvas_context.drawImage(video.video,0,0,WIDTH_CANVAS,HEIGHT_CANVAS);
    canvas.changed = true;
    label.material.map.needsUpdate=true;
    textura_kathia.needsUpdate=true;
    if(detector_ar.markerToObject(objeto)){
      actualizarDistancia(objeto.getWorldPosition().z);
      mostrarPosicionMano(objeto.getWorldPosition());
      if(objeto.getWorldPosition().z>300 && objeto.getWorldPosition().z<=500)
        verificarColision();    
    }
    if(!pausado_kathia)
      animate();  
    rendering();
    requestAnimationFrame(loop);    
  }

  document.getElementById("threshold").addEventListener("change",function(evt){
    detector_ar.cambiarThreshold(document.getElementById("threshold").value);
  })  
  initKathia(texto);
  loop();
}

module.exports=Memorama;