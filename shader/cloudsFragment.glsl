uniform sampler2D clouds;

varying vec2 vUV;
varying vec3 vNormal;

void main(){
    gl_FragColor = vec4(texture2D(clouds,vUV).xyz,0.5);
}