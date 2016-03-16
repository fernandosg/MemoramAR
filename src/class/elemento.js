module.exports=function(width_canvas,height_canvas,geometry){
    
        var width,height,nombre,canvas,context,mesh,image,geometria,origen=new THREE.Vector2(),x,y;
        var cont=0,elemento_raiz,material_frente,material_atras,textura_frente,textura_atras,imagen_carta,umbral_colision,box,imagen_principal,imagen1,imagen2,estado=true,escalas=new THREE.Vector3(),posiciones=new THREE.Vector3();
        var init=function(){
            canvas=document.createElement("canvas");
            canvas.width=width_canvas;
            canvas.height=height_canvas;
            elemento_raiz=new THREE.Object3D();
            context=canvas.getContext("2d");
            textura_frente=new THREE.Texture(canvas);
            textura_atras=new THREE.Texture();
            textura_frente.minFilter = THREE.LinearFilter;
            textura_frente.magFilter = THREE.LinearFilter;
            material_frente=new THREE.MeshBasicMaterial({map:textura_frente});  
            material_frente.transparent=true;
            geometria=geometry;
            geometria_atras=geometry.clone();
            mesh=new THREE.Mesh(geometria,material_frente);
            elemento_raiz.add(mesh);
            width=width_canvas;
            height=height_canvas;   
            imagen_carta=new Image();
            cambiarUmbral(1);   
        }

        function cambiarUmbral(escala){     
            umbral_colision=width/4;
        }

        var etiqueta=function(etiqueta){
            nombre=etiqueta
        }

        var dimensiones=function(){
            return " "+width+" "+height;        
        }

        function calculoOrigen(){
            origen.x=(posiciones.x+(width/2));
            origen.y=(posiciones.y+(height/2));
            origen.z=posiciones.z;
        }

        function interseccion(b) {
          return (Math.abs(this.getOrigen().x - b.getOrigen().x) * 2 < (width + b.getDimensiones().width)) &&
                 (Math.abs(this.getOrigen().y - b.getOrigen().y) * 2 < (height + b.getDimensiones().height));
        }


        var calculoAncho=function(height_test){
            vFOV = Math.PI/4;
            height = 2 * Math.tan( Math.PI/8 ) * Math.abs(elemento_raiz.position.z-camera.position.z);
            fraction = height_test / height;
            console.log("veamos si funciona "+fraction)
        }

        

        var definir=function(ruta){
            imagen_carta.src=ruta;
            imagen_carta.onload=function(){
                context.drawImage(imagen_carta,0,0);
                material_frente.map.needsUpdate=true;
            }
        }

        var definirCaras=function(frontal,trasera){        
            imagen_carta.src=frontal;
            imagen_carta.onload=function(){
                context.drawImage(imagen_carta,0,0);
                material_frente.map.needsUpdate=true;
            }
            var imagen_atras=new Image();
            var canvas2=document.createElement("canvas");
            canvas2.width=width;
            canvas2.height=height;
            var context_canvas=canvas2.getContext("2d");            
            var textura_atras = new THREE.Texture(canvas2);
            material_atras=new THREE.MeshBasicMaterial({map:textura_atras,color:0xcccccc});
            mesh2=new THREE.Mesh(geometria_atras,material_atras);            

            geometria_atras.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
            elemento_raiz.add(mesh2);
            imagen_atras.src=trasera;
            imagen_atras.onload=function(){
                context_canvas.drawImage(imagen_atras,0,0);
                material_atras.map.needsUpdate=true;
            }
            imagen_principal=frontal;    
        }

        var getDimensiones=function(){
            return {width:width,height:height,position:posiciones,geometry:elemento_raiz.geometry};
        }

        var get=function(){
            return elemento_raiz;
        }

        function actualizarMedidas(){
            width=width*elemento_raiz.scale.x;
            height=height*elemento_raiz.scale.y;
            cambiarUmbral(1);
            console.log("actualice medidas "+width+" "+height);
        }

        var scale=function(x,y){
            elemento_raiz.scale.x=x;
            elemento_raiz.scale.y=y;        
            actualizarMedidas();
        }

        var position=function(pos){
            elemento_raiz.position.set(pos.x,pos.y,pos.z);
            x=pos.x;
            y=pos.y;
            posiciones=pos;
        }


        var actualizar=function(){
            material_frente.map.needsUpdate=true;
            if(x!=elemento_raiz.position.x || y!=elemento_raiz.position.y){           
                x=elemento_raiz.position.x;
                y=elemento_raiz.position.y;
                posiciones.x=elemento_raiz.position.x;
                posiciones.y=elemento_raiz.position.y;
                posiciones.z=elemento_raiz.position.z;
                calculoOrigen();
            }
        }

        var getCanvas=function(){
            return canvas;
        }

        function distancia(v1,v2){
            dx = v1.x - v2.x;
            dy = v1.y - v2.y;

            return Math.sqrt(dx*dx+dy*dy);
        }

        function colisiona2(objeto){
            var mano=new THREE.Box3().setFromObject(mesh);
            var carta=new THREE.Box3().setFromObject(objeto);
            p1={x:mano.min.x,y:mano.max.y};
            p2={x:mano.max.x,y:mano.min.y};
            if(((carta.min.y>=mano.max.y && carta.max.y<=mano.max.x) || 
                    (carta.max.y<=mano.min.y && mano.min.x>=carta.min.x) ||
                    (p1.y>=carta.max.y && p1.x<=carta.min.x)||
                    (p2.y<=carta.min.y && p2.x<=carta.max.x)) && distancia(carta.center(),mano.center())<=(carta.size().x/2))
                return true;
            return false;       
         }  
        function colisiona(mano){
            box_mano=new THREE.Box3().setFromObject(mano);
            box_carta=new THREE.Box3().setFromObject(mesh);
            medidas=box_mano.max.clone();//box_mano.center().clone();
            medidas.z=(medidas.z*-1);
            medidas.x=medidas.x-box_mano.size().x*(3/4);
            medidas.y=medidas.y-box_mano.size().y*(3/4);
            return box_carta.center().distanceTo(medidas)<=63;
        }


/*
        function colisiona(carta){

            var mano=new THREE.Box3().setFromObject(mesh);
            carta=new THREE.Box3().setFromObject(carta);
            return distancia(carta.min,mano.min)<carta.size().x && distancia(carta.max,mano.max)<carta.size().x;  
         }
*/
        
        function mostrar(){
            if(cont<180){
                window.requestAnimFrame(mostrar);    
                elemento_raiz.rotation.y = THREE.Math.degToRad( cont );  
                cont++;
            }
        }

        function ocultar(){
            if(cont>0){
                window.requestAnimFrame(ocultar);    
                elemento_raiz.rotation.y = THREE.Math.degToRad( cont );  
                cont--;
            }
        }
        var voltear=function(){
            estado=(estado) ? false : true;
            if(estado)
                ocultar();
            else
                mostrar();
            /*
            imagen_principal=(estado) ? imagen2 : imagen1;
            imagen_carta.src=imagen_principal;
                imagen_carta.onload=function(){
                context.drawImage(imagen_carta,0,0);
                textura_frente.needsUpdate=true;
            }
            estado=(estado) ? false : true;
            textura_frente.needsUpdate=true;*/
        }

        var esParDe=function(objeto){       
            return nombre==objeto.getNombre() && elemento_raiz.id!=objeto.get().id;
        }

        var igualA=function(objeto){
            return elemento_raiz.id==objeto.get().id;
        }

        var getOrigen=function(){
            return origen;
        }
        var getNombre=function(){
            return nombre;
        }

        var getUmbral=function(){
            return umbral_colision;
        }

        var actualizarPosicionesYescala=function(posicion,escala){
            posiciones.x=posicion.x;
            posiciones.y=posicion.y;
            posiciones.z=posicion.z;
            escalas.x=escala.x;
            escalas.y=escala.y;
            escalas.z=escala.z;
            calculoOrigen();
        }

        return {
            get:get,
            init:init,
            getDimensiones:getDimensiones,
            nombre:nombre,
            definirCaras:definirCaras,
            voltear:voltear,
            getNombre:getNombre,
            igualA:igualA,
            esParDe:esParDe,
            distancia:distancia,
            calculoOrigen:calculoOrigen,
            actualizarPosicionesYescala:actualizarPosicionesYescala,
            calculoAncho:calculoAncho,
            etiqueta:etiqueta,
            scale:scale,
            dimensiones:dimensiones,
            getCanvas:getCanvas,
            getUmbral:getUmbral,
            getOrigen:getOrigen,
            actualizar:actualizar,
            position:position,
            definir:definir,
            colisiona:colisiona
        }
}