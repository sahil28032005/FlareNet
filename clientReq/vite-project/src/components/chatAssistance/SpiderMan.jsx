import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from 'three'; // Add this import

export function SpiderMan({ animationTrigger }) {
  const { scene, animations } = useGLTF("/final.glb");
  const spidermanRef = useRef();
  const { actions } = useAnimations(animations, spidermanRef);
  const [currentAnimation, setCurrentAnimation] = useState("action6");

  // Map animation triggers to actual animation names
  const animationMap = {
    idle: "Armature|mixamo.com|Layer0",       // Index 8
    jump: "Armature.001|mixamo.com|Layer0",   // Index 0
    wave: "Armature.002|mixamo.com|Layer0",   // Index 1
    talk: "Armature.003|mixamo.com|Layer0",   // Index 2
    action4: "Armature.004|mixamo.com|Layer0", // Index 3
    action5: "Armature.005|mixamo.com|Layer0", // Index 4
    action6: "Armature.006|mixamo.com|Layer0", // Index 5
    action7: "Armature.007|mixamo.com|Layer0", // Index 6
    action8: "Armature.008|mixamo.com|Layer0", // Index 7
  };

  // Handle animation state changes
  useEffect(() => {
    const animationName = animationMap[currentAnimation];
    
    if (actions[animationName]) {
      // Stop all current animations
      Object.values(actions).forEach(action => action.stop());
      
      // Play the requested animation
      actions[animationName]
        .reset()
        .setLoop(currentAnimation === 'wave' ? THREE.LoopRepeat : THREE.LoopOnce)
        .fadeIn(0.5)
        .play();

      console.log(`🕷️ Playing animation: ${animationName}`);
    }
  }, [currentAnimation, actions]);

  // Handle external triggers
  useEffect(() => {
    const trigger = (animationTrigger || 'wave').toLowerCase();
    setCurrentAnimation(trigger in animationMap ? trigger : 'wave');
  }, [animationTrigger]);

  // Optional: Remove rotation if it conflicts with animations
  useFrame(() => {
    // Keep this empty if you want pure animations without rotation
    // Or add controlled rotation here if needed
  });

  return (
    <primitive
      ref={spidermanRef}
      object={scene}
      scale={[150, 150, 150]}
      position={[0, -1.5, 0]}
    />
  );
}

SpiderMan.defaultProps = {
  animationTrigger: "wave"
};