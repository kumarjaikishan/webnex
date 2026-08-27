import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RefreshCw } from "lucide-react";

export default function CyberFox3D({ className = "" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentAction, setCurrentAction] = useState("Survey");
  const [isGrabbing, setIsGrabbing] = useState(false);
  const actionsRef = useRef({});
  const mixerRef = useRef(null);
  const currentActionRef = useRef("Survey");

  useEffect(() => {
    currentActionRef.current = currentAction;
  }, [currentAction]);

  // Auto-randomize animation every 14 seconds
  useEffect(() => {
    const animationPool = ["Survey", "Walk", "Run"];
    
    const timer = setInterval(() => {
      const actions = actionsRef.current;
      if (!actions || Object.keys(actions).length === 0) return;

      const candidates = animationPool.filter((name) => name !== currentActionRef.current && actions[name]);
      if (candidates.length === 0) return;

      const randomNext = candidates[Math.floor(Math.random() * candidates.length)];
      
      const prevName = currentActionRef.current;
      if (actions[prevName]) actions[prevName].fadeOut(0.4);
      if (actions[randomNext]) actions[randomNext].reset().fadeIn(0.4).play();
      
      setCurrentAction(randomNext);
    }, 14000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 420;

    // --- 1. Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 2. Lighting System ---
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 1.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight.position.set(4, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x3fd6e0, 4.5, 10);
    cyanPoint.position.set(-3, 2, 2);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0x7c6cfb, 4.5, 10);
    violetPoint.position.set(3, 1, -2);
    scene.add(violetPoint);

    // --- 3. Dynamic Ground Shadow Disk ---
    const floorGeo = new THREE.CircleGeometry(1.6, 32);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x060914,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    // Orbiting 3D Cyber Particle Ring
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.8;
      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = 0.2 + (Math.random() - 0.5) * 2.0;
      pPos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x3fd6e0,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- 4. Physics & Throw Kinematics State ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    let posX = 0;
    let posY = 0;
    let posZ = 0;
    let velX = 0;
    let velY = 0;

    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetRotZ = 0;

    let prevMouseX = 0;
    let prevMouseY = 0;
    let lastTime = performance.now();

    const loader = new GLTFLoader();
    loader.load(
      "/fox.glb",
      (gltf) => {
        const model = gltf.scene;
        // Scale and center the Fox model
        model.scale.set(0.018, 0.018, 0.018);
        model.position.set(0, 0, 0);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        modelGroup.add(model);

        // Animation Mixer
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        const availableActions = {};
        gltf.animations.forEach((clip) => {
          availableActions[clip.name] = mixer.clipAction(clip);
        });
        actionsRef.current = availableActions;

        if (availableActions["Survey"]) {
          availableActions["Survey"].play();
          setCurrentAction("Survey");
        } else if (availableActions["Walk"]) {
          availableActions["Walk"].play();
          setCurrentAction("Walk");
        }

        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading Fox 3D GLTF model:", error);
        setLoading(false);
      }
    );

    // --- Interactive Drag & Throw Event Handlers ---
    const getNormalizedCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      return { normX, normY, clientX, clientY };
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsGrabbing(true);
      velX = 0;
      velY = 0;

      const { normX, normY } = getNormalizedCoords(e);
      const worldX = normX * 2.2;
      const worldY = (normY + 0.35) * 1.8;

      dragOffsetX = posX - worldX;
      dragOffsetY = posY - worldY;

      prevMouseX = worldX;
      prevMouseY = worldY;
      lastTime = performance.now();
    };

    const handlePointerMove = (e) => {
      const { normX, normY } = getNormalizedCoords(e);
      mouseX = normX;
      mouseY = -normY;

      if (!isDragging) {
        targetRotY = mouseX * 0.55;
        targetRotX = mouseY * 0.18;
        return;
      }

      const worldX = normX * 2.2;
      const worldY = (normY + 0.35) * 1.8;

      posX = worldX + dragOffsetX;
      posY = Math.max(0, worldY + dragOffsetY);

      targetRotZ = -velX * 0.35;
      targetRotX = velY * 0.25;

      const now = performance.now();
      const dt = Math.max(0.001, (now - lastTime) / 1000);
      velX = (worldX - prevMouseX) / dt;
      velY = (worldY - prevMouseY) / dt;

      velX = Math.max(-12, Math.min(12, velX));
      velY = Math.max(-12, Math.min(12, velY));

      prevMouseX = worldX;
      prevMouseY = worldY;
      lastTime = now;
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      setIsGrabbing(false);

      velX *= 0.6;
      velY *= 0.6;
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Physics Render Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(0.1, clock.getDelta());
      if (mixerRef.current) mixerRef.current.update(delta);

      if (!isDragging) {
        // Gravity
        const gravity = 12.0;
        velY -= gravity * delta;

        // Elastic Spring to Origin
        const springK = 8.5;
        const damping = 0.88;

        const springForceX = -springK * posX;
        velX += springForceX * delta;
        velX *= Math.pow(damping, delta * 60);

        posX += velX * delta;
        posY += velY * delta;

        // Floor Collision & Bounce
        if (posY <= 0) {
          posY = 0;
          if (Math.abs(velY) > 1.2) {
            velY = -velY * 0.42;
            velX *= 0.7;
          } else {
            velY = 0;
            velX *= 0.85;
          }
        }

        targetRotZ *= 0.92;
      }

      modelGroup.position.x = posX;
      modelGroup.position.y = posY;
      modelGroup.position.z = posZ;

      modelGroup.rotation.y += (targetRotY - modelGroup.rotation.y) * 0.08;
      modelGroup.rotation.x += (targetRotX - modelGroup.rotation.x) * 0.08;
      modelGroup.rotation.z += (targetRotZ - modelGroup.rotation.z) * 0.1;

      floor.position.x = posX;
      const heightFactor = Math.max(0.2, 1 / (1 + posY * 1.2));
      floor.scale.set(heightFactor, heightFactor, heightFactor);
      floorMat.opacity = 0.65 * heightFactor;

      particles.rotation.y += 0.003;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, []);

  const playAnimation = (actionName) => {
    const actions = actionsRef.current;
    if (!actions || !actions[actionName]) return;

    Object.keys(actions).forEach((key) => {
      if (key !== actionName) {
        actions[key].fadeOut(0.35);
      }
    });

    const nextAction = actions[actionName];
    nextAction.reset().fadeIn(0.35).play();
    setCurrentAction(actionName);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none group ${className}`}
    >
      {/* 1. Volumetric Cyber Halo Backlight */}
      <div className="absolute w-72 sm:w-88 h-72 sm:h-88 bg-gradient-to-tr from-amber-500/20 via-cyan/20 to-violet/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 bg-cyan/15 rounded-full blur-[65px] pointer-events-none" />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-panel/60 backdrop-blur-sm rounded-2xl">
          <RefreshCw className="w-8 h-8 text-cyan animate-spin" />
          <span className="font-mono text-xs text-cyan tracking-wider">LOADING 3D FOX...</span>
        </div>
      )}

      {/* 2. Main Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className={`relative z-20 w-full h-[360px] sm:h-[420px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] transition-cursor duration-75 ${
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
        title="Interactive 3D Fox Mascot - Click & Drag to throw!"
      />

      {/* 3. Interactive 3D Action Controller Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-center gap-1.5 -mt-4 bg-panel/90 backdrop-blur-md border border-edge/80 px-3 py-1.5 rounded-full shadow-lg">
        {[
          { name: "Survey", label: "Survey 🦊" },
          { name: "Walk", label: "Walk 🐾" },
          { name: "Run", label: "Run ⚡" },
        ].map((act) => (
          <button
            key={act.name}
            type="button"
            onClick={() => playAnimation(act.name)}
            className={`px-3 py-0.5 rounded-full text-[10px] font-mono transition-all ${
              currentAction === act.name
                ? "bg-gradient-to-r from-amber-400 to-cyan text-void font-bold shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-105"
                : "bg-void/60 text-mist hover:text-paper hover:bg-panel2 border border-edge/60"
            }`}
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}
