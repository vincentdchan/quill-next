import React, { useRef, useEffect, useState, useCallback } from 'react';

const defaultVertexShader = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export interface ShadertoyReactProps {
  fragmentShader: string;
  style?: React.CSSProperties;
  className?: string;
  iChannel0?: TextureType;
  iChannel1?: TextureType;
  iChannel2?: TextureType;
  iChannel3?: TextureType;
  onShaderError?: (error: string, type: number | string) => void;
}

type GLRenderingContext = WebGL2RenderingContext | WebGLRenderingContext | null;
type TextureType = HTMLImageElement | HTMLVideoElement | WebGLTexture | null | undefined;
type ChannelTextures = [TextureType, TextureType, TextureType, TextureType];

const ShadertoyReact = ({
  fragmentShader,
  style,
  className,
  iChannel0, // URL string, HTMLImageElement, HTMLVideoElement
  iChannel1, // URL string, HTMLImageElement, HTMLVideoElement
  iChannel2, // URL string, HTMLImageElement, HTMLVideoElement
  iChannel3, // URL string, HTMLImageElement, HTMLVideoElement
  onShaderError, // Callback for shader compilation errors
}: ShadertoyReactProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<GLRenderingContext>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const lastTimeRef = useRef(0);
  const frameRef = useRef(0);

  const [mouse, setMouse] = useState({ x: 0, y: 0, clickX: 0, clickY: 0, isMouseDown: false });
  const iChannelTexturesRef = useRef<ChannelTextures>([null, null, null, null]);
  const iChannelResolutionsRef = useRef([
    { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }
  ]);
  const iChannelSourcesRef = useRef<ChannelTextures>([null, null, null, null]);

  const uniformLocationsRef = useRef({});

  const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const errorInfo = gl.getShaderInfoLog(shader)!;
      console.error(`Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`, errorInfo);
      if (onShaderError) {
        onShaderError(errorInfo, type);
      }
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const errorInfo = gl.getProgramInfoLog(program)!;
      console.error('Error linking program:', errorInfo);
      if (onShaderError) {
        onShaderError(errorInfo, 'program');
      }
      gl.deleteProgram(program);
      return null;
    }
    return program;
  };

  const loadTexture = useCallback((gl: GLRenderingContext, source: TextureType, textureUnit: number) => {
    if (!gl) {
      return;
    }
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Default texture (1x1 blue pixel)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    const setTextureParams = () => {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    if (typeof source === 'string') {
      const image = new Image();
      image.crossOrigin = "anonymous"; // Attempt to load cross-origin images if server allows
      image.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        setTextureParams();
        iChannelResolutionsRef.current[textureUnit] = { x: image.width, y: image.height, z: 1 };
        iChannelTexturesRef.current[textureUnit] = texture;
      };
      image.onerror = () => {
        console.error(`Failed to load texture from URL: ${source}`);
        setTextureParams(); // Still set params for the default texture
        iChannelResolutionsRef.current[textureUnit] = { x: 0, y: 0, z: 0 };
        iChannelTexturesRef.current[textureUnit] = texture; // Keep default
      };
      image.src = source;
    } else if (source instanceof HTMLImageElement || source instanceof HTMLVideoElement) {
        const mediaElement = source;
        try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mediaElement);
            setTextureParams();
            iChannelResolutionsRef.current[textureUnit] = {
                x: (mediaElement as HTMLVideoElement).videoWidth || (mediaElement as HTMLImageElement).naturalWidth || (mediaElement as HTMLImageElement).width,
                y: (mediaElement as HTMLVideoElement).videoHeight || (mediaElement as HTMLImageElement).naturalHeight || (mediaElement as HTMLImageElement).height,
                z: 1
            };
            iChannelTexturesRef.current[textureUnit] = texture;
            if (mediaElement instanceof HTMLVideoElement) {
                // For videos, we might want to update them continuously
                // This basic example only loads the current frame
                // For continuous update, this texture needs to be updated in the render loop
            }
        } catch (e) {
            console.error("Error loading texture from HTML element:", e);
            setTextureParams();
             iChannelResolutionsRef.current[textureUnit] = { x: 0, y: 0, z: 0 };
            iChannelTexturesRef.current[textureUnit] = texture;
        }
    } else if (source === null || source === undefined) {
        setTextureParams(); // Use default texture if no source
        iChannelResolutionsRef.current[textureUnit] = { x: 0, y: 0, z: 0 };
        iChannelTexturesRef.current[textureUnit] = texture;
    } else {
        console.warn(`Unsupported texture source type for iChannel${textureUnit}`);
        setTextureParams();
        iChannelResolutionsRef.current[textureUnit] = { x: 0, y: 0, z: 0 };
        iChannelTexturesRef.current[textureUnit] = texture;
    }
    return texture; // Return the texture object, though it might still be loading
  }, [onShaderError]);


  // Initialize WebGL and Shaders
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      if (onShaderError) onShaderError('WebGL not supported', 'context');
      return;
    }
    glRef.current = gl as WebGL2RenderingContext;

    const vertShader = createShader(gl as WebGL2RenderingContext, gl.VERTEX_SHADER, defaultVertexShader);
    const fragShader = createShader(gl as WebGL2RenderingContext, gl.FRAGMENT_SHADER, fragmentShader);

    if (!vertShader || !fragShader) return;

    const program = createProgram(gl as WebGL2RenderingContext, vertShader, fragShader);
    if (!program) return;
    programRef.current = program;

    // Store uniform locations
    const locations = {
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iTime: gl.getUniformLocation(program, 'iTime'),
      iTimeDelta: gl.getUniformLocation(program, 'iTimeDelta'),
      iFrame: gl.getUniformLocation(program, 'iFrame'),
      iMouse: gl.getUniformLocation(program, 'iMouse'),
      iDate: gl.getUniformLocation(program, 'iDate'),
      iSampleRate: gl.getUniformLocation(program, 'iSampleRate'),
      iFrameRate: gl.getUniformLocation(program, 'iFrameRate'),
      iChannel0: gl.getUniformLocation(program, 'iChannel0'),
      iChannel1: gl.getUniformLocation(program, 'iChannel1'),
      iChannel2: gl.getUniformLocation(program, 'iChannel2'),
      iChannel3: gl.getUniformLocation(program, 'iChannel3'),
      iChannelTime: gl.getUniformLocation(program, 'iChannelTime'),
      iChannelResolution: gl.getUniformLocation(program, 'iChannelResolution'),
    };
    uniformLocationsRef.current = locations;

    // Vertex data for a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Load initial textures
    iChannelSourcesRef.current = [iChannel0, iChannel1, iChannel2, iChannel3];
    iChannelSourcesRef.current.forEach((src, i) => {
      if (src) {
        iChannelTexturesRef.current[i] = loadTexture(gl, src, i);
      } else {
        // Ensure default texture is bound if no source
        iChannelTexturesRef.current[i] = loadTexture(gl, null, i);
      }
    });

    startTimeRef.current = Date.now();
    lastTimeRef.current = performance.now();
    frameRef.current = 0;

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (gl) {
        iChannelTexturesRef.current.forEach(tex => tex && gl.deleteTexture(tex));
        if (program) gl.deleteProgram(program);
        if (vertShader) gl.deleteShader(vertShader);
        if (fragShader) gl.deleteShader(fragShader);
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        // Attempt to lose context if possible, for cleanup
        const loseContextExt = gl.getExtension('WEBGL_lose_context');
        if (loseContextExt) loseContextExt.loseContext();
      }
      glRef.current = null;
      programRef.current = null;
    };
  }, [fragmentShader, onShaderError, loadTexture, iChannel0, iChannel1, iChannel2, iChannel3]);


  // Update textures if sources change
  useEffect(() => {
    const gl = glRef.current;
    if (!gl || !programRef.current) return;

    const newSources = [iChannel0, iChannel1, iChannel2, iChannel3];
    let sourcesChanged = false;
    for (let i = 0; i < 4; i++) {
      if (newSources[i] !== iChannelSourcesRef.current[i]) {
        sourcesChanged = true;
        break;
      }
    }

    if (sourcesChanged) {
      iChannelSourcesRef.current = newSources as ChannelTextures;
      newSources.forEach((src, i) => {
        if (iChannelTexturesRef.current[i]) {
          gl.deleteTexture(iChannelTexturesRef.current[i]); // Delete old texture
        }
        iChannelTexturesRef.current[i] = loadTexture(gl, src, i);
      });
    }
  }, [iChannel0, iChannel1, iChannel2, iChannel3, loadTexture]);


  // Render loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const locations = uniformLocationsRef.current as any;

    if (!gl || !program) return;

    const render = (now: number) => {
      animationFrameIdRef.current = requestAnimationFrame(render);

      const currentTime = (Date.now() - startTimeRef.current) / 1000.0; // in seconds
      const timeDelta = (now - lastTimeRef.current) / 1000.0;
      lastTimeRef.current = now;
      const frameRate = timeDelta > 0 ? 1.0 / timeDelta : 0;

      // Resize canvas to display size
      const canvas = canvasRef.current;
      if (canvas && (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }

      gl.useProgram(program);

      // Update uniforms
      if (locations.iResolution) {
        gl.uniform2f(locations.iResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
      if (locations.iTime) {
        gl.uniform1f(locations.iTime, currentTime);
      }
      if (locations.iTimeDelta) {
        gl.uniform1f(locations.iTimeDelta, timeDelta);
      }
      if (locations.iFrame) {
        gl.uniform1i(locations.iFrame, frameRef.current);
      }
      if (locations.iFrameRate) {
        gl.uniform1f(locations.iFrameRate, frameRate);
      }

      // iMouse
      if (locations.iMouse) {
        const canvasRect = canvas?.getBoundingClientRect();
        if (!canvasRect) {
          return;
        }
        // Shadertoy's iMouse.y is from bottom, WebGL texture coords are also often from bottom.
        // Mouse events give y from top of viewport.
        const mouseYForShader = canvasRect.height - (mouse.y - canvasRect.top);
        const clickMouseYForShader = canvasRect.height - (mouse.clickY - canvasRect.top);

        const currentMouseX = mouse.isMouseDown ? (mouse.x - canvasRect.left) : (mouse.clickX - canvasRect.left);
        const currentMouseY = mouse.isMouseDown ? mouseYForShader : clickMouseYForShader;

        gl.uniform4f(locations.iMouse,
          currentMouseX,
          currentMouseY,
          mouse.clickX - canvasRect.left, // z: click x
          clickMouseYForShader           // w: click y
        );
      }

      // iDate
      if (locations.iDate) {
        const d = new Date();
        const secondsInDay = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000;
        gl.uniform4f(locations.iDate, d.getFullYear(), d.getMonth() + 1, d.getDate(), secondsInDay);
      }

      // iSampleRate
      if (locations.iSampleRate) {
        gl.uniform1f(locations.iSampleRate, 44100.0); // Common audio sample rate
      }

      // iChannels
      const channelTimes = new Float32Array(4);
      const channelRes = new Float32Array(4 * 3);

      for (let i = 0; i < 4; i++) {
        if (locations[`iChannel${i}`]) {
          gl.uniform1i(locations[`iChannel${i}`], i); // Tell shader to use texture unit i
          gl.activeTexture(gl.TEXTURE0 + i);
          const tex = iChannelTexturesRef.current[i];
          gl.bindTexture(gl.TEXTURE_2D, tex!);

          // If it's a video texture, update it
          const sourceElement = iChannelSourcesRef.current[i];
          if (sourceElement instanceof HTMLVideoElement && sourceElement.readyState >= sourceElement.HAVE_CURRENT_DATA && !sourceElement.paused) {
             try {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
             } catch (e) {
                console.warn("Error updating video texture:", e);
             }
          }
        }
        // For simplicity, iChannelTime is set to iTime. For videos, it could be video.currentTime.
        channelTimes[i] = currentTime;
        channelRes[i * 3 + 0] = iChannelResolutionsRef.current[i].x;
        channelRes[i * 3 + 1] = iChannelResolutionsRef.current[i].y;
        channelRes[i * 3 + 2] = iChannelResolutionsRef.current[i].z;
      }

      if (locations.iChannelTime) {
        gl.uniform1fv(locations.iChannelTime, channelTimes);
      }
      if (locations.iChannelResolution) {
        gl.uniform3fv(locations.iChannelResolution, channelRes);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameRef.current++;
    };

    animationFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [fragmentShader, mouse]); // Re-trigger render loop setup if fragmentShader changes (though full re-init handles it)

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    // const rect = canvasRef.current?.getBoundingClientRect();
    const x = event.clientX; //  - rect.left; // Use clientX for broader consistency
    const y = event.clientY; //  - rect.top;
    setMouse(prev => ({ ...prev, x: x, y: y, clickX: x, clickY: y, isMouseDown: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setMouse(prev => ({ ...prev, isMouseDown: false }));
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouse.isMouseDown) {
      // const rect = canvasRef.current?.getBoundingClientRect();
      const x = event.clientX; // - rect.left;
      const y = event.clientY; // - rect.top;
      setMouse(prev => ({ ...prev, x: x, y: y }));
    }
  }, [mouse.isMouseDown]);


  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp} // Treat leaving canvas as mouse up
    />
  );
};

export default ShadertoyReact;
