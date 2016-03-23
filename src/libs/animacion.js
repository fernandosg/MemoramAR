function Animacion(){	
}

Animacion.prototype.easein=function(objeto,limit_z,limit_z_fuera){
	var limit_z_ocultar,mostrado=false;
	var parent=this;
	this.mostrar=function(){
		if(objeto.position.z<=limit_z){
			objeto.position.z+=100
			window.requestAnimFrame(mostrar); 
			mostrado=true; 		 
		}else if(mostrado){
			limit_z_ocultar=limit_z_fuera;
			setTimeout(function(){
				parent.ocultar();
				mostrado=false;
			},3000)
		}
	}
	this.ocultar=function(){
		if(objeto.position.z>limit_z_ocultar){
			objeto.position.z-=100;
			window.requestAnimFrame(this.ocultar);		
		}else
			mostrado=false;
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

