var matWorldUniformLocation;
var worldMatrix;
var viewMatrix;

var cameraPosition = [0,1,0];
var cameraLookat = [0,1,0];
var cameraUp = [0,1,0];

var Initialize = function () {
    loadTextResource( 'shaders/vertexShader.glsl', function (vsErr, vsText) {
    loadTextResource( 'shaders/fragmentShader.glsl', function (fsErr, fsText) {
    loadJSONResource( 'juce.json', function (modelerr, modelObject) {
    loadImage( 'spitsDrink.png', function (imgerr, img) {

    runRenderer(vsText,fsText,modelObject,img);
    }); }); }); });
}

var compileShader = function (shaderSource,shaderType,gl) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error('shader comp error:', gl.getShaderInfoLog(shader));
    return shader;
}

var compileShaderProgram = function (gl,shaders) {
    var program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error('shader program linking error:', gl.getProgramInfoLog(program));

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        console.error('shader program validating error:', gl.getProgramInfoLog(program));

    return program;
}

var gpuBuffer = function (gl,program,Vertices,Indices,TexCoords) {
    var VertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);

    var IndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Indices), gl.STATIC_DRAW);

    var TexCoordBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TexCoordBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TexCoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, //location
        3, //number
        gl.FLOAT, // type
        gl.FALSE, //normalized
        3 * Float32Array.BYTES_PER_ELEMENT, //size
        0 //offset
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, TexCoordBufferObject);
    var texCoordsAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        texCoordsAttribLocation, //location
        2, //number
        gl.FLOAT, //type
        gl.FALSE, //normalized
        2 * Float32Array.BYTES_PER_ELEMENT, //size
        0 //offset
    );
    gl.enableVertexAttribArray(texCoordsAttribLocation);
}

var bindTexture = function(gl,tex) {
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
    gl.bindTexture(gl.TEXTURE_2D, null);
    return Texture;
}

var setTransformationMatrecies = function(gl,program, fov, aspect, clipNear, clipFar) {
    worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mWorld'), gl.FALSE, worldMatrix);

	viewMatrix = new Float32Array(16);
	glMatrix.mat4.lookAt(viewMatrix, cameraPosition, cameraLookat, cameraUp);
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mView'), gl.FALSE, viewMatrix);

	var projMatrix = new Float32Array(16);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(fov), aspect, clipNear, clipFar);
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mProj'), gl.FALSE, projMatrix);
}

var mooveCamera = function (gl, program, position, lookat, up) {
	glMatrix.mat4.lookAt(viewMatrix, position, lookat, up);
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mView'), gl.FALSE, viewMatrix);
}

var runRenderer = function (vertexShaderSource,fragmentShaderSource, juceModel,juceTecture) {
    var canvas = document.getElementById('webglCanvas');
    var gl = canvas.getContext('webgl');
    if (!gl) gl = canvas.getContext('experimental-webgl');

    gl.enable(gl.DEPTH_TEST);
    //backface culling
    // gl.enable(gl.CULL_FACE);
    // gl.frontFace(gl.CCW);
	// gl.cullFace(gl.BACK);

    var program = compileShaderProgram(gl, [
        compileShader(vertexShaderSource, gl.VERTEX_SHADER,gl),
        compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER,gl)
    ]);

    var Vertices = juceModel.meshes[0].vertices;
    var Indices = [].concat.apply([], juceModel.meshes[0].faces);
    var TexCoords = juceModel.meshes[0].texturecoords[0];
    gpuBuffer(gl,program,Vertices,Indices,TexCoords);

    var Texture = bindTexture(gl,juceTecture);

    gl.useProgram(program);

    setTransformationMatrecies(gl,program, 70, canvas.clientWidth / canvas.clientHeight, 0.01, 10000.0, [0, -.2, -1], [0, .2, 0], [0, 1, 0]);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    // render loop! :)
    var identityMatrix = new  Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var height = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0,1,0]);
        //glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 9, [0.1,0,0]);
        //glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mWorld'), gl.FALSE, worldMatrix);
        mooveCamera(gl, program, [0, -.2 + height, -1], [0, .2, 0], [0, 1, 0]);
        height += .001; 
        //clear screen
        gl.clearColor(0, 0, 0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //bind textures
        gl.bindTexture(gl.TEXTURE_2D,Texture);
        gl.activeTexture(gl.TEXTURE0);

        //draw
        gl.drawElements(gl.TRIANGLES, Indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

class RenderObject {
    constructor(model,position) {
        this.model = model
        this.transformMatrix = new Float32Array(16);
        glMatrix.mat4.translate(this.transformMatrix,position);
    }
}

//test with: python3 -m http.server @ http://localhost:8000/blog/webglTest.html
//generate json models .\\assimp2json.exe 'source.fbx' 'destination.json'