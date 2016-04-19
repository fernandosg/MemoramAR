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
				renderer.setClearColor(0xffffff, 1);
				renderer.setSize(screen_width,screen_height);
				document.body.appendChild(renderer.domElement);
				definirCamara();
			}
			var definirCamara=function(){			
				var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
				camara = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
				camara.useTarget = false;
				//camara.lookAt(scene.position);
				camara.position.z=1;	
				scene.add(camara);
			}		

			var initWebcam=function(WIDTH_INIT,HEIGHT_INIT){
				video= new THREEx.WebcamTexture();
				videoTexture = video.texture;
				WIDTH_MOVIE=WIDTH_INIT;
				HEIGHT_MOVIE=HEIGHT_INIT;
				videoTexture.minFilter = THREE.LinearFilter;
				videoTexture.magFilter = THREE.LinearFilter;
				movieMaterial=new THREE.MeshBasicMaterial({map: videoTexture, depthTest: false, depthWrite: false});		
				var movieGeometry = new THREE.PlaneGeometry( 1, 1, 0.0);
				movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
				//movieScreen.position.set(0,50,0);//*/			
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
				scene.add(detector.get());
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
				detector.detectar(getEscenario(),video.video,objetos,objetos_en_escena,camara,scene);
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