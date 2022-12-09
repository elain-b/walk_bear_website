import * as THREE from "three";
import { Camera } from "three";

import Experience from "../Experience.js";

export default class Room {
    constructor() {
        this.experience = new Experience();

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    }

    resize() {
    }

    update() {
    }
}