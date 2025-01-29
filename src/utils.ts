import * as THREE from "three";

export const ensureArray = <T>(array: T[] | T): T[] => {
  return Array.isArray(array) ? array : [array];
};

export const lerpRotation = (source: THREE.Euler, target: THREE.Euler, alpha: number): THREE.Quaternion => {
  const sourceQuaternion = new THREE.Quaternion().setFromEuler(source);
  const targetQuaternion = new THREE.Quaternion().setFromEuler(target);
  return sourceQuaternion.slerp(targetQuaternion, alpha);
}

