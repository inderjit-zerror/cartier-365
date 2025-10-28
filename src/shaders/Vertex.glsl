varying vec2 vUv;
uniform float uScrollSpeed;
uniform float uIntroCurve;

void main() {
  vUv = uv; 

  vec3 newPosition = position;
  // --------------------------------------------------------
  float speed = (uScrollSpeed + uIntroCurve) * 70.0;
  // --------------------------------------------------------
  newPosition.z -= sin(uv.x * 3.141) * speed;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
