uniform sampler2D planetTexure;
uniform sampler2D heightMap;

varying vec3 vNormal;
varying vec2 vUV;

void main(){
    vec3 lightDirection = normalize(vec3(1.0,0.0,1.0));

    vec3 bumpNormal = texture2D(heightMap, vUV).xyz *2.0 -1.0;
    bumpNormal = normalize(vNormal + bumpNormal);

    float lightIntensity = dot(bumpNormal, lightDirection);

    vec3 diffuseColor = texture2D(planetTexure,vUV).xyz;
    vec3 finalColor = diffuseColor* max(lightIntensity,0.0);


    float intensity = 1.05 - dot(vNormal, vec3(0.0,0.0,1.0));
    vec3 atmosphere = vec3(0.3,0.6,1.0) * pow(intensity,1.5);

    gl_FragColor = vec4(atmosphere +  finalColor, 1.0);
}