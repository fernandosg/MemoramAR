module.exports=function(canvas_element){
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
    
}