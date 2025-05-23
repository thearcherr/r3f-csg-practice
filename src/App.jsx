import { Canvas, useLoader } from "@react-three/fiber";
import "./App.css";
import Experience from "./Experience";
import { OrbitControls, useGLTF } from "@react-three/drei";
import useObject from "../store/object";
import { OBJLoader } from "three/examples/jsm/Addons.js";

function App() {
  const setObjectName = useObject((state) => state.setObjectName);
  const setObject = useObject((state) => state.setObject);
  const isDragging = useObject((state) => state.isDragging);

  const window = useLoader(OBJLoader, "/models/window.obj", (loader) => {
    loader.load("/models/window.obj", (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(0x808080);
        }
      });
    });
  });

  const door = useGLTF("/models/Doorway.glb");
  const pipe = useGLTF("/models/pipe.glb");

  const handleClick = (object) => {
    switch (object) {
      case "Doorway":
        setObjectName("Doorway");
        setObject(door);
        break;

      case "pipe":
        setObjectName("pipe");
        setObject(pipe);
        break;

      case "window":
        setObjectName("window");
        setObject(window);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Canvas fov={25}>
        <color args={["skyblue"]} attach="background" />
        <ambientLight intensity={1.5} />
        <OrbitControls enableZoom={false} enabled={!isDragging} />
        <Experience />
      </Canvas>
      <div className="bg-white absolute top-0 right-0 p-4 w-1/4 h-full rounded">
        <h1 className="text-2xl font-bold mb-10">Control Panel</h1>
        <div className="grid grid-cols-2 gap-y-4">
          <div
            className="w-24 h-24 cursor-pointer"
            onClick={() => handleClick("Doorway")}
          >
            <img
              src="/images/door.png"
              alt="Door"
              className="w-full h-full rounded-lg"
            />
          </div>
          <div
            className="w-24 h-24 cursor-pointer"
            onClick={() => handleClick("pipe")}
          >
            <img
              src="/images/pipe.png"
              alt="pipe"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
