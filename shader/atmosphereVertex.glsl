varying vec3 vNormal;
varying vec2 vUV;

void main(){
    vNormal =  normal;
    vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1);
}