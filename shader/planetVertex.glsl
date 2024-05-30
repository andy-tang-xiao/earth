varying vec2 vUV;
varying vec3 vNormal;

uniform sampler2D heightMap;
uniform float displacementScale;

void main(){
    vUV = uv;
    vNormal = normalize(normalMatrix * normal);


    float displacement = texture2D(heightMap, uv).r;
    vec3 displacedPosition = position + normal * displacement * displacementScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition,1);
}