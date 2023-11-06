precision mediump float;

    varying vec2 fragTexCoord;
    uniform sampler2D sampler;

    void main(){
        gl_FragColor = texture2D(sampler,fragTexCoord);
        if (gl_FragColor.a < .5) {
            discard;
        }
    }