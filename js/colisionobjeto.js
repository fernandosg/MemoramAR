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