(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//DEBUG=true;
Memorama=require("../src/memorama.js");
memorama=new Memorama();
memorama.config({tipo_memorama:"cocina",cantidad_cartas:6,width:1000,height:800});
memorama.init();
},{"../src/memorama.js":6}],2:[function(require,module,exports){
module.exports=function(canvas_element){
        var JSARRaster,JSARParameters,detector,result;
        var threshold=139;
        function init(){
            JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
            JSARParameters = new FLARParam(canvas_element.width, canvas_element.height);
            detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
            result = new Float32Array(16);
            detector.setContinueMode(true);
            JSARParameters.copyCameraMatrix(result, .1, 2000);        
            THREE.Object3D.prototype.transformFromArray = function(m) {
                this.matrix.setFromArray(m);
                this.matrixWorldNeedsUpdate = true;
            }
        }

        var setCameraMatrix=function(realidadCamera){        
            realidadCamera.projectionMatrix.setFromArray(result);
        }
       
        function getMarkerNumber(idx) {
        	var data = detector.getIdMarkerData(idx);
        	if (data.packetLength > 4) {
            	return -1;
        	} 
                    
        	var result=0;
        	for (var i = 0; i < data.packetLength; i++ ) {
            	result = (result << 8) | data.getPacketData(i);
        	}

        	return result;
        }

        function getTransformMatrix(idx) {
            var mat = new NyARTransMatResult();
            detector.getTransformMatrix(idx, mat);

            var cm = new Float32Array(16);
            cm[0] = mat.m00*-1;
            cm[1] = -mat.m10;
            cm[2] = mat.m20;
            cm[3] = 0;
            cm[4] = mat.m01*-1;
            cm[5] = -mat.m11;
            cm[6] = mat.m21;
            cm[7] = 0;
            cm[8] = -mat.m02;
            cm[9] = mat.m12;
            cm[10] = -mat.m22;
            cm[11] = 0;
            cm[12] = mat.m03*-1;
            cm[13] = -mat.m13;
            cm[14] = mat.m23;
            cm[15] = 1;

            return cm;
        }

        function obtenerMarcador(markerCount){
            var matriz_encontrada
            for(var i=0;i<markerCount;i++){
                matriz_encontrada=getTransformMatrix(i);
            }   
            return matriz_encontrada;
        }    

        var markerToObject=function(objeto){
            var markerCount = detector.detectMarkerLite(JSARRaster, threshold); 
            if(markerCount>0){            
                objeto.transformFromArray(obtenerMarcador(markerCount));
                objeto.matrixWorldNeedsUpdate=true;
                return true;            
            }
            return false;
        }

        var cambiarThreshold=function (threshold_nuevo){
            threshold=threshold_nuevo;
        }
        return{
            init:init,
            setCameraMatrix,setCameraMatrix,
            markerToObject:markerToObject,
            cambiarThreshold:cambiarThreshold
        }
}
},{}],3:[function(require,module,exports){
var Animacion=require('../libs/animacion.js');
function Elemento(width_canvas,height_canvas,geometry){
    this.width=width_canvas;
    this.height=height_canvas;
    this.geometry=geometry,this.origen=new THREE.Vector2(),this.cont=0,this.estado=true,this.escalas=new THREE.Vector3(),this.posiciones=new THREE.Vector3();   
    this.animacion=new Animacion();
}


    
Elemento.prototype.cambiarUmbral=function(escala){     
    this.umbral_colision=this.width/4;
}            
Elemento.prototype.init=function(){
    this.elemento_raiz=new THREE.Object3D();
    this.geometria_atras=this.geometry.clone();
    this.textureLoader = new THREE.TextureLoader();
    this.cambiarUmbral(1);    
}


Elemento.prototype.etiqueta=function(etiqueta){
    this.nombre=etiqueta
}

Elemento.prototype.dimensiones=function(){
    return " "+width+" "+height;        
}

Elemento.prototype.calculoOrigen=function(){
    this.x=(this.posiciones.x+(this.width/2));
    this.y=(this.posiciones.y+(this.height/2));
    this.z=this.posiciones.z;
}



/*
        Elemento.prototype.calculoAncho=function(height_test){
            vFOV = Math.PI/4;
            height = 2 * Math.tan( Math.PI/8 ) * Math.abs(elemento_raiz.position.z-camera.position.z);
            fraction = height_test / height;
        }*/

        

Elemento.prototype.definirBackground=function(color){
    color_t=new THREE.Color(color);
    this.material_frente=new THREE.MeshBasicMaterial({color: color_t,side: THREE.DoubleSide}); 
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);  
}

Elemento.prototype.definir=function(ruta,objeto){
    parent=this;
    this.textureLoader.load( ruta, function(texture) {
            //texture = THREE.ImageUtils.loadTexture(ruta, undefined, function() {

                // the rest of your code here...
        objeto.actualizarMaterialFrente(texture);

    });
}


Elemento.prototype.actualizarMaterialAtras=function(texture2){
    this.textura_atras = texture2.clone();
    this.textura_atras.minFilter = THREE.LinearFilter;
    this.textura_atras.magFilter = THREE.LinearFilter;
    this.material_atras=new THREE.MeshBasicMaterial({map:this.textura_atras});  
    this.material_atras.transparent=true;

    this.geometria_atras.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    this.mesh2=new THREE.Mesh(this.geometria_atras,this.material_atras);
    this.elemento_raiz.add(this.mesh2);  
    this.textura_atras.needsUpdate = true;
}

Elemento.prototype.actualizarMaterialFrente=function(texture1){
    this.textura_frente = texture1.clone();
    this.textura_frente.minFilter = THREE.LinearFilter;
    this.textura_frente.magFilter = THREE.LinearFilter;
    this.material_frente=new THREE.MeshBasicMaterial({map:this.textura_frente,side: THREE.DoubleSide});  
    this.material_frente.transparent=true;
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);  
    this.textura_frente.needsUpdate = true;
}

Elemento.prototype.definirCaras=function(frontal,trasera,objeto){ 
    parent=this;
    console.dir(this.textureLoader); 
    this.textureLoader.load( frontal, function(texture1) {
        objeto.actualizarMaterialFrente(texture1);
        parent.textureLoader.load(trasera, function(texture2) {                    
            objeto.actualizarMaterialAtras(texture2);                                       
        });  
    });
            
}

Elemento.prototype.getTexturaAtras=function(){
    return this.textura_atras;
}

Elemento.prototype.getTexturaFrente=function(){
    return this.textura_frente;
}

Elemento.prototype.getMaterialAtras=function(){
    return this.material_atras;
}

Elemento.prototype.getMaterialFrente=function(){
    return material_frente;
}

Elemento.prototype.getDimensiones=function(){
    return {width:width,height:height,position:posiciones,geometry:elemento_raiz.geometry};
}

Elemento.prototype.get=function(){
    return this.elemento_raiz;
}

Elemento.prototype.actualizarMedidas=function(){
    this.width=this.width*this.elemento_raiz.scale.x;
    this.height=this.height*this.elemento_raiz.scale.y;
    this.cambiarUmbral(1);
}

Elemento.prototype.scale=function(x,y){
    this.elemento_raiz.scale.x=x;
    this.elemento_raiz.scale.y=y;        
    this.actualizarMedidas();
}

Elemento.prototype.position=function(pos){
    this.elemento_raiz.position.set(pos.x,pos.y,pos.z);
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=pos;
}


Elemento.prototype.actualizar=function(){
    for(var i=0;i<this.elemento_raiz.children.length;i++)
        this.elemento_raiz.children[i].material.map.needsUpdate=true;
    if(this.x!=this.elemento_raiz.position.x ||this.y!=this.elemento_raiz.position.y){           
        this.x=this.elemento_raiz.position.x;
        this.y=this.elemento_raiz.position.y;
        this.posiciones.x=this.elemento_raiz.position.x;
        this.posiciones.y=this.elemento_raiz.position.y;
        this.posiciones.z=this.elemento_raiz.position.z;
        this.calculoOrigen();
    }
}

       

Elemento.prototype.colisiona=function(mano){
    box_mano=new THREE.Box3().setFromObject(objeto);
    box_carta=new THREE.Box3().setFromObject(this.mesh);

    medidas1=box_mano.center().clone();
    medidas1.z=0;
    medidas2=box_carta.center().clone();
    medidas2.z=0;
    return medidas1.distanceTo(medidas2)<=63;
}

Elemento.prototype.getGradosActual=function(){
    return this.cont;
}

Elemento.prototype.rotarY=function(grados){
    this.elemento_raiz.rotation.y=grados;
}

Elemento.prototype.incrementGrados=function(){
    this.cont++;
}

Elemento.prototype.decrementGrados=function(){
    this.cont--;
}

Elemento.prototype.easein=function(){
    this.animacion.easein.mostrar(this.get(),-800,-2500,this.animacion);
}

Elemento.prototype.voltear=function(){
    this.estado=(this.estado) ? false : true;
    if(this.estado){
        this.animacion.ocultar(this,this.animacion);//this.ocultar(this);
    }else{
        this.animacion.mostrar(this,this.animacion,180);
    }
}


Elemento.prototype.getNombre=function(){
    return this.nombre;
}

Elemento.prototype.esParDe=function(objeto){      
    return this.getNombre()==objeto.getNombre() && this.elemento_raiz.id!=objeto.get().id;
}

Elemento.prototype.igualA=function(objeto){
    return this.elemento_raiz.id==objeto.get().id;
}

Elemento.prototype.getOrigen=function(){
    return "x = "+this.x+" y = "+this.y+" z = "+this.z;
}

Elemento.prototype.getUmbral=function(){
    return this.umbral_colision;
}



Elemento.prototype.actualizarPosicionesYescala=function(posicion,escala){
    this.posiciones.x=posicion.x;
    this.posiciones.y=posicion.y;
    this.posiciones.z=posicion.z;
    this.escalas.x=escala.x;
    this.escalas.y=escala.y;
    this.escalas.z=escala.z;
}
module.exports=Elemento;
},{"../libs/animacion.js":5}],4:[function(require,module,exports){
module.exports=function(width,height){
	//var Labels=function(){
		var canvas,context,material,textura,sprite,x_origen,y_origen;
		function init(){
			canvas=document.createElement("canvas");
			canvas.width=width;
			canvas.height=height;
			context=canvas.getContext("2d");
		}
		var definir=function(parametros){
			context.fillStyle=parametros.color;
			context.textAlign=parametros.alineacion;
			context.font=parametros.tipografia;	
			x_origen=parametros.x;
			y_origen=parametros.y;
		}

		var crear=function(texto){
			context.fillText(texto,x_origen,y_origen);
			textura = new THREE.Texture(canvas);
			textura.minFilter = THREE.LinearFilter;
			textura.magFilter = THREE.LinearFilter;
		    textura.needsUpdate = true;

		    var material = new THREE.SpriteMaterial({
		        map: textura,
		        transparent: false,
		        useScreenCoordinates: false,
		        color: 0xffffff // CHANGED
		    });

		    sprite = new THREE.Sprite(material);
		    sprite.scale.set(15,15, 1 ); // CHANGED
		    return sprite;
		}

		var actualizar=function(texto){		
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillText(texto,x_origen,y_origen);
			textura.needsUpdate=true;
		}
		return{
			init:init,
			definir:definir,
			crear:crear,
			actualizar:actualizar
		}

	//}
}
},{}],5:[function(require,module,exports){
function Animacion(){	
}

Animacion.prototype.easein={
	mostrado:false,
	mostrar:function(objeto,limit_z,limit_z_fuera,animation){		
		window.requestAnimationFrame(function(){
        	animation.easein.mostrar(objeto,limit_z,limit_z_fuera,animation);
        });
		if(objeto.position.z<=limit_z){
			objeto.position.z+=100
			animation.easein.mostrado=true; 		 
		}else if(animation.easein.mostrado){
			limit_z_ocultar=limit_z_fuera;
			setTimeout(function(){
				animation.easein.ocultar(objeto,limit_z,limit_z_ocultar,animation);				
				animation.easein.mostrado=false;
			},3000)
		}
	},
	ocultar:function(objeto,limit_z,limit_z_oculta,animation){
		if(objeto.position.z>limit_z_ocultar){
			objeto.position.z-=100;	
			window.requestAnimationFrame(function(){	        	
				animation.easein.ocultar(objeto,limit_z,limit_z_ocultar,animation);	
	        });
		}else
			animation.easein.mostrado=false;
	}
}

Animacion.prototype.mostrar=function(objeto,animation,grados){
	if(objeto.getGradosActual()<=grados){
        window.requestAnimationFrame(function(){
        	animation.mostrar(objeto,animation,grados);
        });    
        objeto.rotarY(THREE.Math.degToRad(objeto.getGradosActual()));
        objeto.incrementGrados();
    }
}

Animacion.prototype.ocultar=function(objeto,animation){
	 if(objeto.getGradosActual()>=0){
        window.requestAnimationFrame(function(){
            animation.ocultar(objeto,animation);
        }); 
        objeto.rotarY(THREE.Math.degToRad( objeto.getGradosActual()));
        objeto.decrementGrados();
    }
}
module.exports=Animacion;


},{}],6:[function(require,module,exports){
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
},{"./class/detector":2,"./class/elemento":3,"./class/labels":4}]},{},[1,3,2,4,6]);
