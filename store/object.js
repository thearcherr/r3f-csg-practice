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
  pipeGeometry: null,
  setPipeGeometry: (payload) => set({ pipeGeometry: payload }),
  holePosition: null,
  setHolePosition: (payload) => set({ holePosition: payload }),
  checkbox: false,
  setCheckbox: (payload) => set({checkbox: payload})
}));

export default useObject;
