precision mediump float;

    varying vec2 fragTexCoord;
    uniform vec4 texTransform;
    uniform sampler2D sampler;

    void main(){
        //vec2 uv = (fragTexCoord * vec2(texTransform.z,texTransform.a)) + vec2(texTransform.x,texTransform.y);
        gl_FragColor = texture2D(sampler,fragTexCoord);
        if (gl_FragColor.a < .8) {
            discard;
        }
    }