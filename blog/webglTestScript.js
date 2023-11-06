
var InitTest = function () {

    loadTextResource('shaders/vertexShader.glsl', function (vsErr, vsText) {
    loadTextResource('shaders/fragmentShader.glsl', function (fsErr, fsText) {
    loadJSONResource( 'juce.json', function (modelerr, modelObject) {
    loadImage( 'spitsDrink.png', function (imgerr, img) {
        
    runTest(vsText,fsText,modelObject,img);
    }); }); }); });
};

var runTest = function (vertexShaderSource,fragmentShaderSource, juceModel,juceTecture) {
    var canvas = document.getElementById('webglCanvas');
    var gl = canvas.getContext('webgl');
    if (!gl) gl = canvas.getContext('experimental-webgl');

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

    //create shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
        console.error('vertex shader comp error:', gl.getShaderInfoLog(vertexShader));

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
        console.error('fragment shader comp error:', gl.getShaderInfoLog(fragmentShader));

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error('shader program linking error:', gl.getProgramInfoLog(program));

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        console.error('shader program validating error:', gl.getProgramInfoLog(program));

    //create buffer
    var Vertices = juceModel.meshes[0].vertices;
    var VertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);

    var Indices = [].concat.apply([], juceModel.meshes[0].faces);
    var IndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Indices), gl.STATIC_DRAW);

    var TexCoords = juceModel.meshes[0].texturecoords[0];
    var TexCoordBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TexCoordBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TexCoords), gl.STATIC_DRAW);

    //vertex attributes
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

    //create texture
    var Texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, Texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		juceTecture
	);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.useProgram(program);

    //set shader matrecies
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var viewMatrix = new Float32Array(16);
	glMatrix.mat4.lookAt(viewMatrix, [0, -.2, -1], [0, .2, 0], [0, 1, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	var projMatrix = new Float32Array(16);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(70), canvas.clientWidth / canvas.clientHeight, 0.01, 10000.0);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    // render loop! :)
    var identityMatrix = new  Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0,1,0]);
        //glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 9, [0.1,0,0]);
        //glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0, 0, 0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D,Texture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, Indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

//test with python3 -m http.server @ http://localhost:8000/webglTest.html
//generate json models .\\assimp2json.exe 'source.fbx' 'destination.json'