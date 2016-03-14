function DetectorAR(canvas_element){
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
        cm[12] = mat.m03+30;
        cm[13] = -mat.m13-20;
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
        var markerCount = detector.detectMarkerLite(JSARRaster, 139); 
        if(markerCount>0){            
            objeto.transformFromArray(obtenerMarcador(markerCount));
            return true;            
        }
        return false;
    }
    init();
    return{
        setCameraMatrix,setCameraMatrix,
        markerToObject:markerToObject
    }
}