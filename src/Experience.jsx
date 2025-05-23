import { PivotControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useObject from "../store/object";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { Addition, Base, Geometry, Subtraction } from "@react-three/csg";

function NewModel() {
  const { viewport } = useThree();
  const model = useRef();
  const target = useRef({ x: 2.2, y: 0 });
  const isDragging = useObject((state) => state.isDragging);
  const object = useObject((state) => state.object);
  const objectName = useObject((state) => state.objectName);
  const setIsDragging = useObject((state) => state.setIsDragging);

  const setPipePosition = useObject((state) => state.setPipePosition);
  const setPipeRotation = useObject((state) => state.setPipeRotation);

  const { scene } = useThree();

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    target.current = {
      x: (x * viewport.width) / 2,
      y: (y * viewport.height) / 2,
    };
  };

  const handlePointerMissed = () => {
    if (objectName !== "pipe") return setIsDragging(false);

    const position = model.current.position;
    const rotation = model.current.rotation;
    setPipePosition(position);
    setPipeRotation(rotation);
    setIsDragging(false);
    scene.remove(model.current);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);

    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [isDragging]);

  useFrame(() => {
    if (!model.current) return;

    model.current.position.x +=
      (target.current.x - model.current.position.x) * 0.2;
    model.current.position.y +=
      (target.current.y - model.current.position.y) * 0.2;
  });

  const scale = objectName === "window" ? 0.012 : 1.5;
  const rotation = objectName === "window" ? [0, 4.8, 0] : [0, 0, 0];

  return (
    <primitive
      ref={model}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onPointerMissed={handlePointerMissed}
      scale={scale}
      object={objectName !== "window" ? object.scene : object}
      position={objectName === "Doorway" ? [2.2, 0, 1.35] : [2.2, 0, 0]}
      rotation={rotation}
    />
  );
}

function Experience() {
  const model = useGLTF("/models/house.glb");
  const object = useObject((state) => state.object);
  const isDragging = useObject((state) => state.isDragging);

  const pipePosition = useObject((state) => state.pipePosition);

  const csg = useRef();

  console.log(model);

  useFrame(() => {
    if (isDragging) {
      if (csg.current) {
        csg.current.update();
      }
    }
  });

  const geometry = model.nodes.mesh_0.geometry;

  const piperef = useRef();

  return (
    <>
      <mesh position={[-1, 0, 0]} scale={1.6} rotation={[0, 3.14, 0]}>
        <meshNormalMaterial />
        <Geometry ref={csg}>
          <Base geometry={geometry} />
          {pipePosition && (
              <Subtraction
                ref={piperef}
                position={[pipePosition.x, pipePosition.y + 0.25, pipePosition.z]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.2, 0.2, 10]} />
              </Subtraction>
          )}
        </Geometry>
      </mesh>
      {object && <NewModel />}
    </>
  );
}

export default Experience;
