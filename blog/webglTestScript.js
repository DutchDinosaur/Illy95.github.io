var vertexShaderSource = `
    precision mediump float;
    
    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main(){
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }`;

var fragmentShaderSource = `
    precision mediump float;

    varying vec3 fragColor;

    void main(){
        gl_FragColor = vec4(fragColor,1.0);
    }`;

var initTest = function () {
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
    var boxVerties = [
        // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,
		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
    ];
    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVerties), gl.STATIC_DRAW);

    var boxIndices = [
		// Top
		0, 1, 2,
		0, 2, 3,
		// Left
		5, 4, 6,
		6, 4, 7,
		// Right
		8, 9, 10,
		8, 10, 11,
		// Front
		13, 12, 14,
		15, 14, 12,
		// Back
		16, 17, 18,
		16, 18, 19,
		// Bottom
		21, 20, 22,
		22, 20, 23
	];
    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, //location
        3, //number
        gl.FLOAT, // type
        gl.FALSE, //normalized
        6 * Float32Array.BYTES_PER_ELEMENT, //size
        0 //offset
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation, //location
        3, //number
        gl.FLOAT, //type
        gl.FALSE, //normalized
        6 * Float32Array.BYTES_PER_ELEMENT, //size
        3 * Float32Array.BYTES_PER_ELEMENT //offset
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    
    //set shader matrecies
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var viewMatrix = new Float32Array(16);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 1, 0], [0, 1, 0]);
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
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0,1,0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1,0,0]);
        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0, 0, 0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};