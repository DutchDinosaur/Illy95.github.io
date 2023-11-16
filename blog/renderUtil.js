var loadTextResource = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function(){
        if (request.status < 200 || request.status > 299) 
            callback('http error:' + request.status + ' at ' + url);
        else callback(null,request.responseText);
    }
    request.send();
}

var loadImage = function (url, callback){
    var image = new Image();
	image.onload = function () {
		callback(null, image);
	}
	image.src = url;
}

var loadJSONResource = function (url, callback){ 
    loadTextResource(url, function(err,result) {
        if (err) callback(err);
        else {
            try { callback(null,JSON.parse(result)); } 
            catch (e) { callback(e); }
        }
    });
}

var compileShaderProgram = function (gl,shaderResources) {
    var compileShader = function (shaderSource,shaderType,gl) {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            console.error('shader comp error:', gl.getShaderInfoLog(shader));
        return shader;
    }

    var compiledShaders = new Array(shaderResources.length);
    for (let i = 0; i < shaderResources.length; i++) 
        compiledShaders[i] = compileShader(shaderResources[i], (shaderTypes[i] == "vertex") ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER ,gl);

    var program = gl.createProgram();
    compiledShaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error('shader program linking error:', gl.getProgramInfoLog(program));

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        console.error('shader program validating error:', gl.getProgramInfoLog(program));

    return program;
}

var initializeTexture = function(gl,tex) {
    var Texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, Texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		tex
	);
    return Texture;
}

class RenderObject {
    constructor(model,texture,program,name) {
        this.model = model;
        this.texture = texture;
        this.program = program;
        this.name = name;

        this.vertCount = 0;
        this.indexCount = 0;
    }
}

class GameObject {
    constructor(renderObject,position,update) {
        this.renderObject = renderObject
        this.transformMatrix = new Float32Array(16);
        glMatrix.mat4.identity(this.transformMatrix);
        glMatrix.mat4.translate(this.transformMatrix,this.transformMatrix,position);
        this.update = update;
        this.active = true;
    }

    translate(position) {
        glMatrix.mat4.translate(this.transformMatrix,this.transformMatrix,position);
    }

    scale(scale) {
        glMatrix.mat4.scale(this.transformMatrix,this.transformMatrix,scale);
    }

    rotate(angle,axis){
        glMatrix.mat4.rotate(this.transformMatrix,this.transformMatrix,angle,axis);
    }
}