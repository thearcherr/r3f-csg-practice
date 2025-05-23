import { create } from "zustand";

const useObject = create((set) => ({
  isDragging: false,
  setIsDragging: (payload) => set({ isDragging: payload }),
  objectName: "",
  setObjectName: (payload) => set({ objectName: payload }),
  object: null,
  setObject: (payload) => set({ object: payload }),
  value: {x: 0, y: 0},
  setValue: (payload) => set({ value: payload }),
  pipePosition: null,
  setPipePosition: (payload) => set({ pipePosition: payload }),
  pipeRotation: null,
  setPipeRotation: (payload) => set({ pipeRotation: payload }),
}));

export default useObject;
