module.exports=function(canvas_element){
<<<<<<< HEAD
     //var create = function(sourceCanvas) {
        var JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
    console.log("veamos el canvas "+canvas_element.width+" "+canvas_element.height);
        var JSARParameters = new FLARParam(canvas_element.width, canvas_element.height);
        var JSARDetector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
        JSARDetector.setContinueMode(true);

        var getMarkerNumber = function(idx) {
            var data = JSARDetector.getIdMarkerData(idx);
            if (data.packetLength > 4) {
                return -1;
            } 
            
            var result=0;
            for (var i = 0; i < data.packetLength; i++ ) {
                result = (result << 8) | data.getPacketData(i);
            }

            return result;
        }

        var getTransformMatrix = function(idx) {
            var mat = new NyARTransMatResult();
            JSARDetector.getTransformMatrix(idx, mat);
=======
        var JSARRaster,JSARParameters,detector,result;
        function init(){
            JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
            JSARParameters = new FLARParam(canvas_element.width, canvas_element.height);
            detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
            result = new Float32Array(16);
            detector.setContinueMode(true);
            JSARParameters.copyCameraMatrix(result, 10, 1000);        
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
>>>>>>> 62826756d397e97035323cc9b1707eec56209178

            var cm = new Float32Array(16);
            cm[0] = mat.m00;
            cm[1] = -mat.m10;
            cm[2] = mat.m20;
            cm[3] = 0;
            cm[4] = mat.m01;
            cm[5] = -mat.m11;
            cm[6] = mat.m21;
            cm[7] = 0;
            cm[8] = -mat.m02;
            cm[9] = mat.m12;
            cm[10] = -mat.m22;
            cm[11] = 0;
            cm[12] = mat.m03;
            cm[13] = -mat.m13;
            cm[14] = mat.m23;
            cm[15] = 1;

            return cm;
        }

<<<<<<< HEAD
        var setCameraMatrix = function(camara) {
            var result = new Float32Array(16);
            JSARParameters.copyCameraMatrix(result, 10, 1000);            
            camara.projectionMatrix.setFromArray(result);
        }

        var persistTime = 1;
        var newMarker = function(id, matrix) {
            return {
                id: id,
                matrix: matrix,
                age: persistTime,
            }
        }

        var markers = {};
        var detect = function(objeto ) {
            var markerCount = JSARDetector.detectMarkerLite(JSARRaster, 139); 
            if(markerCount>0){
                for( var index = 0; index < markerCount; index++ ) {                                    
                    objeto.transformFromArray(getTransformMatrix(index));
                }     
                return true;
            }else
                return false;
        }

        return {
            detect: detect,
            setCameraMatrix: setCameraMatrix,
        }
    //}
    
=======
        function obtenerMarcador(markerCount){
            var matriz_encontrada
            for(var i=0;i<markerCount;i++){
                matriz_encontrada=getTransformMatrix(i);
            }   
            return matriz_encontrada;
        }    

        var markerToObject=function(objeto){
            var markerCount = detector.detectMarkerLite(JSARRaster, 139); 
            if(markerCount>0){            
                objeto.transformFromArray(obtenerMarcador(markerCount));
                objeto.scale.x=.5;
                objeto.scale.y=.5;
                objeto.matrixWorldNeedsUpdate=true;
                return true;            
            }
            return false;
        }
        return{
            init:init,
            setCameraMatrix,setCameraMatrix,
            markerToObject:markerToObject
        }
>>>>>>> 62826756d397e97035323cc9b1707eec56209178
}