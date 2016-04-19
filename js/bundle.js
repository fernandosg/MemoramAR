(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Escenario=require("./escenario");
var ColisionObjeto=require("./colisionobjeto");
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var escenario=Escenario();
escenario.init(SCREEN_WIDTH,SCREEN_HEIGHT);
escenario.initWebcam(1000,700);
objeto_detector=ColisionObjeto();
objeto_detector.init(document.createElement("canvas"),132,150,"detector");
objeto_detector.definir(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(10,10,0));
objeto_detector.setBackground('./assets/img/mano_escala.png');
objeto_detector.ocultar();
escenario.initMarcador(objeto_detector);
var animales=["medusa","ballena","cangrejo","pato"];
for(var i=1,columna=30,fila_pos=i,fila=20;i<=8;i++,fila_pos=((i==5) ? 1 : fila_pos+1),fila=(fila_pos==1 ? 20 : (fila+120+20)),columna=((i>4) ? 30+120+30 : 30)){		
	carta=ColisionObjeto();
	carta.init(document.createElement("canvas"),120,120,animales[fila_pos-1]);
	carta.definir(escenario.getEscenario(),"TRANSPARENT",new THREE.Vector3(fila,columna,0));
	carta.setBackground("./assets/img/memorama/sin_voltear.jpg");
	carta.setBackgroundCarta("./assets/img/memorama/escala/cart"+i+"_"+animales[fila_pos-1]+".jpg");
	escenario.anadir(carta);
}
escenario.verObjetos();
escenario.render();
},{"./colisionobjeto":2,"./escenario":4}],2:[function(require,module,exports){
module.exports=function(){
	var objeto,WIDTH,HEIGHT,context,material,geometria,screen_objeto,textura,tipo_fondo,base_image;
	var ruta_carta,ruta_carta_sin_voltear,estado=false;
	var nombre;
	var init=function(tipo_elemento,width,height,nom){
		objeto=tipo_elemento;
		WIDTH=width;
		HEIGHT=height;
		objeto.width=width;
		objeto.height=height;
		context=objeto.getContext("2d");
		nombre=nom;
	}

	var getPosicionReal=function(escenario,posicion){
			return new THREE.Vector3(posicion.x-(escenario.width/2),
				((-1*posicion.y)+(escenario.height/2)),posicion.z)
	}

	var voltear=function(){
		base_image.src=((!estado) ? ruta_carta : ruta_carta_sin_voltear);
			base_image.onload=function(){
			context.drawImage(base_image,0,0);
			textura.needsUpdate=true;
		}
		estado=((estado==true) ? false : true);
	}	

	var esIgualA=function(objeto){
		return (getNombre()==objeto.getNombre() && obtenerScreen().id==objeto.obtenerScreen().id);
	}

	var esParDe=function(objeto){
		return (getNombre()==objeto.getNombre() && obtenerScreen().id!=objeto.obtenerScreen().id);
	}

	var definir=function(escenario,color,posicion){
		tipo_fondo=color;
		if(color!="TRANSPARENT"){
			context.fillStyle=color;
			context.fillRect(0,0,WIDTH,HEIGHT);
		}
		textura=new THREE.Texture(objeto);
		material=new THREE.MeshBasicMaterial({map:textura,side:THREE.DoubleSide});
		material.transparent=true;
		geometria=new THREE.PlaneGeometry(WIDTH,HEIGHT);
		screen_objeto=new THREE.Mesh(geometria,material);
		screen_objeto.position=getPosicionReal(escenario,posicion);
		textura.needsUpdate=true;
	}

	var obtenerTextura=function(){
		return textura;
	}

	var obtenerScreen=function(){
		return screen_objeto;
	}

	var setBackground=function(ruta){
		base_image=new Image();
		base_image.src=ruta;	
		base_image.onload=function(){
			context.drawImage(base_image,0,0);
			textura.needsUpdate=true;
		}
		ruta_carta_sin_voltear=ruta;
	}

	var setBackgroundCarta=function(ruta){
		ruta_carta=ruta;
	}

	var getTipoBackground=function(){
		return tipo_fondo;
	}

	var getNombre=function(){
		return nombre;
	}

	var verRutaBackground=function(){
		console.log(base_image.src);
	}

	var actualizar=function(){
		textura.needsUpdate=true;
	}

	var ocultar=function(){
		screen_objeto.visible=false;
	}
	return{
		init:init,
		definir:definir,
		obtenerScreen:obtenerScreen,
		obtenerTextura:obtenerTextura,
		getPosicionReal:getPosicionReal,
		getNombre:getNombre,
		setBackground:setBackground,
		setBackgroundCarta:setBackgroundCarta,
		actualizar:actualizar,
		ocultar:ocultar,
		voltear:voltear,
		esIgualA:esIgualA,
		esParDe:esParDe
	};
}
},{}],3:[function(require,module,exports){
module.exports=function(){
		var detector,posicion,objeto,vector_posicion;	
		var detectados=[];
		var init=function(obj){
			detector=new AR.Detector();
			objeto=obj;
			posicion=objeto.obtenerScreen().position;
			vector_posicion=new THREE.Vector3();
		}

		var getPosicionReal=function(escenario,posicion){
			return new THREE.Vector3(posicion.x-(escenario.width/2),
				((-1*posicion.y)+(escenario.height/2)),posicion.z)
		}

		var detectar=function(escenario,bytes,objetos,objetos_en_escena,camara){
			var markers = detector.detect(bytes);   	
		   	if(markers.length>0){   	
		   		objeto.obtenerScreen().position=objeto.getPosicionReal(escenario,new THREE.Vector3(markers[0].corners[0].x,markers[0].corners[0].y,15));
		   		objeto.obtenerScreen().visible=true;
		   		objeto.actualizar();	   		
				vector_posicion.x=objeto.obtenerScreen().position.x;
				vector_posicion.y=objeto.obtenerScreen().position.y;			
				var raycaster = new THREE.Raycaster( camara.position, vector_posicion.sub( camara.position ).normalize() );
				intersects=raycaster.intersectObjects(objetos);
				if(intersects.length>0){			
					if(detectados.length==1 && detectados[0].esParDe(objetos_en_escena[intersects[0].object.id])){
						objetos_en_escena[intersects[0].object.id].voltear();
						pos_elemento=objetos.indexOf(intersects[0].object);					
						delete objetos_en_escena[intersects[0].object.id];
						if (pos_elemento > -1) {
						    objetos.splice(pos_elemento, 1);
						}
						detectados.pop();	
					}else if(detectados.length==0){					
						objetos_en_escena[intersects[0].object.id].voltear();
						detectados.push(objetos_en_escena[intersects[0].object.id]);
					}else if(detectados[0].obtenerScreen().id!=intersects[0].object.id){
						detectados[0].voltear();
						detectados.pop();
					}
								
				}
						 
		   	}
		}

		var obtenerObjeto=function(){
			return objeto;
		}

		return {
			init:init,
			detectar:detectar,
			obtenerObjeto:obtenerObjeto
		}
}
},{}],4:[function(require,module,exports){
var Detector=require("./detector");
module.exports=function(){
			var camara,scene,renderer,VIEW_ANGLE,ASPECT,SCREEN_WIDTH,SCREEN_HEIGHT,movieScreen,videoTexture,detector;
			var canvas_recipe,canvas_recipe_context,projector,WIDTH_MOVIE,HEIGHT_MOVIE;
			var objetos=[],objetos_en_escena={};			
			var init=function(screen_width,screen_height){
				SCREEN_WIDTH=screen_width;
				SCREEN_HEIGHT=screen_height;
				scene=new THREE.Scene();
				renderer=new THREE.WebGLRenderer();
				renderer.setSize(screen_width,screen_height);
				document.body.appendChild(renderer.domElement);
				definirCamara();
			}
			var definirCamara=function(){			
				var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
				camara = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
				camara.useTarget = false
				camara.position.z=1000;	
				scene.add(camara);
			}		

			var initWebcam=function(WIDTH_INIT,HEIGHT_INIT){
				video= new THREEx.WebcamTexture();
				videoTexture = video.texture;
				WIDTH_MOVIE=WIDTH_INIT;
				HEIGHT_MOVIE=HEIGHT_INIT;
				videoTexture.minFilter = THREE.LinearFilter;
				videoTexture.magFilter = THREE.LinearFilter;
					
				movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
				var movieGeometry = new THREE.PlaneGeometry( WIDTH_MOVIE, HEIGHT_MOVIE, 100, 1 );
				movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
				movieScreen.position.set(0,50,0);//*/			
				scene.add(movieScreen);	
				initVideo();
			}

			var getEscenario=function(){
				return {width:video.video.width,height:video.video.height};//{width:WIDTH_MOVIE,height:HEIGHT_MOVIE};
			}

			var initVideo=function(){			
				canvas_recipe=document.createElement("canvas");
				canvas_recipe.width=video.video.width;
				canvas_recipe.height=video.video.height;
				canvas_recipe_context=canvas_recipe.getContext("2d");
			}

			var initMarcador=function(objeto){
				detector=Detector();
				detector.init(objeto);
				scene.add(objeto.obtenerScreen());
			}

			var anadir=function(objeto){
				objetos.push(objeto.obtenerScreen());
				objetos_en_escena[objeto.obtenerScreen().id]=objeto;
				scene.add(objeto.obtenerScreen());
			}

			var obtenerBytesVideo=function(){
				return canvas_recipe_context.getImageData(0, 0, video.video.width, video.video.height);
			}

			var render=function(){
				rendering();
				dibujarVideo();
				detector.detectar(getEscenario(),obtenerBytesVideo(),objetos,objetos_en_escena,camara);
				requestAnimationFrame(render);
			}

			var dibujarVideo=function(){
				canvas_recipe_context.drawImage(video.video,0,0,video.video.width,video.video.height)
			}

			var verObjetos=function(){
				for(var i=0;i<objetos.length;i++){
					console.log("los objetos son "+objetos[i].id+" "+objetos[i].position.x+" "+objetos[i].position.y);
				}
			}

			var rendering=function(){
				videoTexture.needsUpdate=true;
				for(var i=0;i<objetos.length;i++)
					objetos[i].needsUpdate=true;			
				detector.obtenerObjeto().actualizar();
				renderer.render( scene, camara );
			}

			return{
				init:init,
				anadir:anadir,
				render:render,
				definirCamara:definirCamara,
				initWebcam:initWebcam,
				initMarcador:initMarcador,
				getEscenario:getEscenario,
				verObjetos:verObjetos
			}
}
},{"./detector":3}]},{},[1]);
