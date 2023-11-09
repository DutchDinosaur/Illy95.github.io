precision mediump float;
    
    attribute vec3 vertPosition;
    attribute vec2 vertTexCoord;

    varying vec2 fragTexCoord;

    uniform mat4 mObject;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main(){
        fragTexCoord = vertTexCoord;
        gl_Position = mProj * mView * mObject * vec4(vertPosition, 1.0);
    }