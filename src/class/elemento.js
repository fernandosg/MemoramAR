function Elemento(width_canvas,height_canvas,geometry){
    this.width=width_canvas;
    this.height=height_canvas;
    this.geometry=geometry,this.origen=new THREE.Vector2(),this.cont=0,this.estado=true,this.escalas=new THREE.Vector3(),this.posiciones=new THREE.Vector3();   
}


    
Elemento.prototype.cambiarUmbral=function(escala){     
    this.umbral_colision=this.width/4;
}            
Elemento.prototype.init=function(){
    this.canvas=document.createElement("canvas");
    this.canvas.width=this.width;
    this.canvas.height=this.height;
    this.elemento_raiz=new THREE.Object3D();
    this.context=this.canvas.getContext("2d");
    this.textura_frente=new THREE.Texture(this.canvas);
    this.textura_atras=new THREE.Texture();
    this.textura_frente.minFilter = THREE.LinearFilter;
    this.textura_frente.magFilter = THREE.LinearFilter;
    this.material_frente=new THREE.MeshBasicMaterial({map:this.textura_frente});  
    this.material_frente.transparent=true;
    this.geometria_atras=this.geometry.clone();
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);  
    this.imagen_carta=new Image();
    this.cambiarUmbral(1);    
}


        Elemento.prototype.etiqueta=function(etiqueta){
            nombre=etiqueta
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

        

        Elemento.prototype.definir=function(ruta){
            this.imagen_carta.src=ruta;
            parent=this;
            this.imagen_carta.onload=function(){
                parent.context.drawImage(parent.imagen_carta,0,0);
                parent.material_frente.map.needsUpdate=true;
            }
        }

        Elemento.prototype.definirCaras=function(frontal,trasera){        
            this.imagen_carta.src=frontal;
            var parent=this;
            this.imagen_carta.onload=function(){
                parent.context.drawImage(parent.imagen_carta,0,0);
                parent.material_frente.map.needsUpdate=true;
            }
            var imagen_atras=new Image();
            var canvas2=document.createElement("canvas");
            canvas2.width=this.width;
            canvas2.height=this.height;
            var context_canvas=canvas2.getContext("2d");               
            this.textura_atras.minFilter = THREE.LinearFilter;
            this.textura_atras.magFilter = THREE.LinearFilter;
            this.material_atras=new THREE.MeshBasicMaterial({map:this.textura_atras,color:0xcccccc});
            mesh2=new THREE.Mesh(this.geometria_atras,this.material_atras);                        
            this.geometria_atras.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
            this.elemento_raiz.add(mesh2);
            imagen_atras.src=trasera;
            imagen_atras.onload=function(){
                context_canvas.drawImage(imagen_atras,0,0);
                parent.material_atras.map.needsUpdate=true;
            }  
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
            this.material_frente.map.needsUpdate=true;
            if(this.x!=this.elemento_raiz.position.x ||this.y!=this.elemento_raiz.position.y){           
               this.x=this.elemento_raiz.position.x;
               this.y=this.elemento_raiz.position.y;
                this.posiciones.x=this.elemento_raiz.position.x;
                this.posiciones.y=this.elemento_raiz.position.y;
                this.posiciones.z=this.elemento_raiz.position.z;
                this.calculoOrigen();
            }
        }

        Elemento.prototype.getCanvas=function(){
            return this.canvas;
        }

        Elemento.prototype.colisiona=function(mano){
            box_mano=new THREE.Box3().setFromObject(mano);
            box_carta=new THREE.Box3().setFromObject(this.mesh);
            medidas=box_mano.max.clone();//box_mano.center().clone();
            medidas.z=(medidas.z*-1);
            medidas.x=medidas.x-box_mano.size().x*(3/4);
            medidas.y=medidas.y-box_mano.size().y*(3/4);
            return box_carta.center().distanceTo(medidas)<=63;
        }

        
        Elemento.prototype.mostrar=function(){
            if(this.cont<=180){
                window.requestAnimFrame(this.mostrar);    
                this.elemento_raiz.rotation.y = THREE.Math.degToRad( this.cont );  
                this.cont++;
            }
        }

        Elemento.prototype.ocultar=function(){
            if(this.cont>=0){
                window.requestAnimFrame(this.ocultar);    
                this.elemento_raiz.rotation.y = THREE.Math.degToRad( this.cont );  
                this.cont--;
            }
        }
        Elemento.prototype.voltear=function(){
            this.estado=(this.estado) ? false : true;
            if(this.estado)
                this.ocultar();
            else
                this.mostrar();
        }

        Elemento.prototype.esParDe=function(objeto){       
            return this.nombre==objeto.getNombre() && this.elemento_raiz.id!=objeto.get().id;
        }

        Elemento.prototype.igualA=function(objeto){
            return this.elemento_raiz.id==objeto.get().id;
        }

        Elemento.prototype.getOrigen=function(){
            return origen;
        }
        Elemento.prototype.getNombre=function(){
            return nombre;
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
            this.calculoOrigen();
        }
module.exports=Elemento;