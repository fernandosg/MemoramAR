module.exports=function(width_canvas,height_canvas,geometry){
        var width,height,nombre,canvas,context,mesh,material,image,geometria,origen=new THREE.Vector2(),x,y;
        var imagen_carta,umbral_colision,box,imagen_principal,imagen1,imagen2,estado=true,escalas=new THREE.Vector3(),posiciones=new THREE.Vector3();
        var init=function(){
            canvas=document.createElement("canvas");
            canvas.width=width_canvas;
            canvas.height=height_canvas;
            context=canvas.getContext("2d");
            textura_principal=new THREE.Texture(canvas);
            textura_principal.minFilter = THREE.LinearFilter;
            textura_principal.magFilter = THREE.LinearFilter;
            material=new THREE.MeshBasicMaterial({map:textura_principal});  
            material.transparent=true;
            geometria=geometry;
            mesh=new THREE.Mesh(geometria,material);
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
            height = 2 * Math.tan( Math.PI/8 ) * Math.abs(mesh.position.z-camera.position.z);
            fraction = height_test / height;
            console.log("veamos si funciona "+fraction)
        }

        

        var definir=function(ruta){
            imagen_carta.src=ruta;
            imagen_carta.onload=function(){
                context.drawImage(imagen_carta,0,0);
                material.map.needsUpdate=true;
            }
        }

        var definirCaras=function(frontal,trasera){        
            imagen_carta.src=frontal;
            imagen_carta.onload=function(){
                context.drawImage(imagen_carta,0,0);
                material.map.needsUpdate=true;
            }
            imagen1=frontal;
            imagen2=trasera;
            imagen_principal=frontal;    
        }

        var getDimensiones=function(){
            return {width:width,height:height,position:posiciones,geometry:mesh.geometry};
        }

        var get=function(){
            return mesh;
        }

        function actualizarMedidas(){
            width=width*mesh.scale.x;
            height=height*mesh.scale.y;
            cambiarUmbral(1);
            console.log("actualice medidas "+width+" "+height);
        }

        var scale=function(x,y){
            mesh.scale.x=x;
            mesh.scale.y=y;        
            actualizarMedidas();
        }

        var position=function(pos){
            mesh.position.set(pos.x,pos.y,pos.z);
            x=pos.x;
            y=pos.y;
            posiciones=pos;
        }


        var actualizar=function(){
            material.map.needsUpdate=true;
            if(x!=mesh.position.x || y!=mesh.position.y){           
                x=mesh.position.x;
                y=mesh.position.y;
                posiciones.x=mesh.position.x;
                posiciones.y=mesh.position.y;
                posiciones.z=mesh.position.z;
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
        

        var voltear=function(){
            imagen_principal=(estado) ? imagen2 : imagen1;
            imagen_carta.src=imagen_principal;
                imagen_carta.onload=function(){
                context.drawImage(imagen_carta,0,0);
                textura_principal.needsUpdate=true;
            }
            estado=(estado) ? false : true;
            textura_principal.needsUpdate=true;
        }

        var esParDe=function(objeto){       
            return nombre==objeto.getNombre() && mesh.id!=objeto.get().id;
        }

        var igualA=function(objeto){
            return mesh.id==objeto.get().id;
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