"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import anime from "animejs";

export type StageController = { run: (code: string) => void };

export function SnapshotStage({ controllerRef }: { controllerRef: MutableRefObject<StageController | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const defaultCameraPosition = new THREE.Vector3(0, 1.7, 6.3);
    const defaultControlsTarget = new THREE.Vector3(0, 0.5, 0);
    camera.position.copy(defaultCameraPosition);
    camera.lookAt(defaultControlsTarget);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(defaultControlsTarget); controls.enableDamping = true; controls.dampingFactor = 0.06; controls.minDistance = 2.5; controls.maxDistance = 14; controls.update();
    const clock = new THREE.Clock();
    let sceneUpdate: ((seconds: number) => void) | null = null;
    let introEndTime = 0;

    const resetScene = () => {
      scene.clear();
      sceneUpdate = null;
      camera.position.copy(defaultCameraPosition);
      controls.target.copy(defaultControlsTarget);
      controls.enabled = true;
      controls.update();
      const ambient = new THREE.AmbientLight(0xffffff, 0.72);
      const key = new THREE.DirectionalLight(0xbcd6ff, 1.7);
      key.position.set(3, 5, 4);
      const fill = new THREE.DirectionalLight(0x67e8f9, 0.45);
      fill.position.set(-4, 1, 2);
      scene.add(ambient, key, fill);
    };
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = container;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    resetScene();
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (sceneUpdate) {
        try { sceneUpdate(clock.getElapsedTime()); } catch { /* preserve visible scene on animation error */ }
      }
      if (!controls.enabled && clock.getElapsedTime() >= introEndTime) {
        controls.enabled = true;
        controls.target.copy(defaultControlsTarget);
      }
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
    };
    loop();

    controllerRef.current = {
      run(code) {
        resetScene();
        window.__sceneUpdate = undefined;
        const fn = new Function("scene", "camera", "THREE", "anime", code);
        controls.enabled = false;
        introEndTime = clock.getElapsedTime() + 4;
        try {
          fn(scene, camera, THREE, anime);
          sceneUpdate = typeof window.__sceneUpdate === "function" ? window.__sceneUpdate : null;
        } catch (error) {
          controls.enabled = true;
          throw error;
        }
      },
    };
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controllerRef.current = null;
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [controllerRef]);

  return <div aria-label="Live generated retail scene" className="scene-canvas" ref={containerRef} />;
}

declare global { interface Window { __sceneUpdate?: (seconds: number) => void } }
