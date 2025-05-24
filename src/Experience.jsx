import { PivotControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
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

  const [zDragging, setZDragging] = useState(false);

  const setPipePosition = useObject((state) => state.setPipePosition);
  const setPipeRotation = useObject((state) => state.setPipeRotation);

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    target.current = {
      x: (x * viewport.width) / 2,
      y: (y * viewport.height) / 2,
    };
  };

  const { scene } = useThree();
  const checkbox = useObject((state) => state.checkbox);
  const pipePosition = useObject((state) => state.pipePosition);

  const handlePointerMissed = () => {
    if (objectName !== "pipe") return setIsDragging(false);

    const rotation = model.current.rotation;
    const relativePosition = new THREE.Vector3()
      .copy(model.current.position)
      .sub(new THREE.Vector3(-1, 0, 0)); // Compensate for house position
    setPipePosition(relativePosition);
    setPipeRotation(rotation);
    setIsDragging(false);
    if (checkbox) {
      scene.remove(model.current);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "z") return;

    setZDragging(true);
  }

  const handleKeyUp = (e) => {
    if (e.key !== "z") return;

    setZDragging(false);
  }

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (checkbox && pipePosition) {
      if (model.current) {
        scene.remove(model.current);
      }
    }
  }, [checkbox, pipePosition]);

  useFrame(() => {
    if (!model.current) return;

    model.current.position.x +=
      (target.current.x - model.current.position.x) * 0.2;
    model.current.position.y +=
      (target.current.y - model.current.position.y) * 0.2;
    
    if (zDragging) {
      model.current.position.z += ((target.current.x - model.current.position.x) - (target.current.y - model.current.position.y)) * 0.2;
    }
  });

  const scale = objectName === "window" ? 0.012 : 1.5;
  const rotation = objectName === "window" ? [0, 4.8, 0] : [0, 0, 0];

  const modelPipeGeometry = new THREE.CylinderGeometry(0.125, 0.125, 2.0);

  if (objectName === "pipe") {
    return (
      <mesh
        ref={model}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerMissed={handlePointerMissed}
        scale={scale}
        position={objectName === "Doorway" ? [2.2, 0, 1.35] : [2.2, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={modelPipeGeometry}
      >
        <meshStandardMaterial color={"red"} />
      </mesh>
    );
  }

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
  const pipeRotation = useObject((state) => state.pipeRotation);

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

  const refTemp = useRef();

  const handlePointerMissed = () => {
    console.log("cut", refTemp.current?.position);
    console.log("house", csg.current?.position);
    console.log("pipePosition", pipePosition);
  };

  return (
    <>
      <mesh position={[-1, 0, 0]} scale={1.6} rotation={[0, 3.14, 0]}>
        <meshNormalMaterial />
        <Geometry ref={csg}>
          <Base geometry={geometry} />
          {pipePosition && (
            <group
              position={[
                pipePosition.x * -0.64,
                pipePosition.y / 1.6,
                pipePosition.z,
              ]}
              rotation={pipeRotation}
              onPointerMissed={handlePointerMissed}
              ref={refTemp}
            >
              <Subtraction>
                <cylinderGeometry args={[0.125, 0.125, 2.0]} />
              </Subtraction>
            </group>
          )}
        </Geometry>
      </mesh>
      {object && <NewModel />}
    </>
  );
}

export default Experience;
