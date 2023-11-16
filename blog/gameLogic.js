var gameManager = function(){

}

var lastMouseValue;
var mouseStartPos;
var mouseLastPos;
var angles = glMatrix.vec2.create();
var flightCamMovement = function(gl){

    if(mouseDown) {
        if (mouseDown != lastMouseValue) {
            mouseStartPos = mousePosition;
        }

        var mouseDelta = [0,0];
        glMatrix.vec2.sub(mouseDelta,mousePosition, mouseLastPos);
        glMatrix.vec2.mul(mouseDelta,mouseDelta,[.01,.01]);
        
        glMatrix.vec2.add(angles,angles, mouseDelta);

        glMatrix.vec3.rotateY(cameraForward,cameraForward,[0,0,0],-mouseDelta[0])

    }
    lastMouseValue = mouseDown;
    mouseLastPos = mousePosition;

    if (!glMatrix.vec3.exactEquals(glMatrix.vec3.create(),movementVector) || mouseDown){
         
        console.log(glMatrix.vec3.angle([0,0,1],[cameraForward[0],0,cameraForward[2]]));

        glMatrix.vec3.rotateY(movementVector,movementVector,[0,0,0],-angles[0]);

        glMatrix.vec3.add(camPos,camPos,glMatrix.vec3.scale(movementVector,movementVector,.1));
        glMatrix.vec3.zero(movementVector);

        var lookat = glMatrix.vec3.create();
        glMatrix.vec3.add(lookat,camPos,cameraForward);

        glMatrix.mat4.lookAt(viewMatrix, camPos, lookat, [0,1,0]);
        
    }
    


    gl.uniformMatrix4fv(cameraUniformLocation, gl.FALSE, viewMatrix);
}

var camPos = glMatrix.vec3.create();
var cameraForward = glMatrix.vec3.fromValues(0,0,1);

var movementVector = glMatrix.vec3.create();
var mousePosition;
var mouseDown = 0;

const handleMovement = (e) => {
    switch (e.key) {
        case 'a':
            glMatrix.vec3.add(movementVector,movementVector,[1,0,0]);
            break;
        case 'd':
            glMatrix.vec3.add(movementVector,movementVector,[-1,0,0]);
            break;
        case 'w':
            glMatrix.vec3.add(movementVector,movementVector,[0,0,1]);
            break;
        case 's':
            glMatrix.vec3.add(movementVector,movementVector,[0,0,-1]);
            break;
        case ' ' :
            glMatrix.vec3.add(movementVector,movementVector,[0,1,0]);
            break;
        case 'Shift':
            glMatrix.vec3.add(movementVector,movementVector,[0,-1,0]);
            break;
        case 'e':
            glMatrix.vec3.add(movementVector,movementVector,[0,1,0]);
            break;
        case 'q':
            glMatrix.vec3.add(movementVector,movementVector,[0,-1,0]);
            break;
    }
}
window.addEventListener('keydown', handleMovement);

function handleMouseMove(e) {
    var eventDoc, doc, body;

    e = e || window.event;

    if (e.pageX == null && e.clientX != null) {
        eventDoc = (e.target && e.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        e.pageX = e.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        e.pageY = e.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mousePosition = glMatrix.vec2.fromValues(e.pageX, e.pageY);
}
document.onmousemove = handleMouseMove;

document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}