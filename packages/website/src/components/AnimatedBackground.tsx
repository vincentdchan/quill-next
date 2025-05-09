import { useMemo } from 'react';
import ShadertoyReact from './ShadertoyReact';

export interface AnimatedBackgroundProps {
  className?: string;
}

const fragmentShader = `
#define TAU 6.2831853071

precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
    
  float o = texture2D(iChannel1, uv * 0.25 + vec2(0.0, iTime * 0.025)).r;
  float d = (texture2D(iChannel0, uv * 0.25 - vec2(0.0, iTime * 0.02 + o * 0.02)).r * 2.0 - 1.0);
  
  float v = uv.y + d * 0.1;
  v = 1.0 - abs(v * 2.0 - 1.0);
  v = pow(v, 2.0 + sin((iTime * 0.2 + d * 0.25) * TAU) * 0.5);
  
  vec3 color = vec3(0.0);
  
  float x = (1.0 - uv.x * 0.75);
  float y = 1.0 - abs(uv.y * 2.0 - 1.0);
  color += vec3(x * 0.5, y, x) * v;
  
  vec2 seed = gl_FragCoord.xy;
  float rx = fract(sin((seed.x * 12.9898) + (seed.y * 78.2330)) * 43758.5453);
  float ry = fract(sin((seed.x * 53.7842) + (seed.y * 47.5134)) * 43758.5453);
  vec2 r = vec2(rx, ry);

  vec3 vg = vec3(17.0 / 256.0, 17.0 / 256.0, 16.0 / 256.0);

  float s = mix(r.x, (sin((iTime * 2.5 + 60.0) * r.y) * 0.5 + 0.5) * ((r.y * r.y) * (r.y * r.y)), 0.04); 
  color += pow(s, 70.0) * (1.0 - v);
  gl_FragColor = vec4(max(color * 0.45, vec3(0.0)), 1.0) + vec4(vg, 0.0);
}
`;

function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const channel0 = useMemo(() => {
    const img = new Image();
    img.src = '/assets/images/channels/channel0.png';
    return img;
  }, []);
  const channel1 = useMemo(() => {
    const img = new Image();
    img.src = '/assets/images/channels/channel1.png';
    return img;
  }, []);

  return (
    <div className={className}>
      <ShadertoyReact
        fragmentShader={fragmentShader}
        iChannel0={channel0}
        iChannel1={channel1}
      />
    </div>
  );
}

export default AnimatedBackground;
