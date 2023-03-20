import * as THREE from 'three';
import Experience from "../Experience.js";

export default class Objects {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.bear = this.resources.items.bear;
        this.actualbear = this.experience.world.bear.actualBear;
        this.mixer = this.experience.world.bear.mixer;
        this.animations = this.experience.world.bear.animations;
        this.particleTexture = this.resources.items.particleTexture;

        this.setStones();
        this.setFlower();
        this.onScroll();
    }

    setStones() {
        this.actualbear.children.forEach((child) => {
            if (child.name === "stones") {
                child.position.set(1, 0.8, 0);
                child.scale.set(0, 0, 0);
            }
        });
    }

    setFlower() {
        this.actualbear.children.forEach((child) => {
            if (child.name === "flowerBone") {
                this.flower = child;
                child.castShadow = true;
                child.position.set(-2, 0, 3);
                child.scale.set(0, 0, 0);
            }
        });
        this.flower.children.forEach((child) => {
            if (child.name === "purple-flower") {
                this.purpleFlower = child;
            }
        });

        this.flowermixer = new THREE.AnimationMixer(this.flower);
        this.swayingflower = this.flowermixer.clipAction(this.bear.animations[9]);
        this.swayingflower.play();
    }

    onScroll() {
        window.addEventListener("wheel", (e) => {

            if (e.deltaY > 1) {
                this.flower.position.z -= 0.1;
            }
            else if (this.flower.position.z < -10) {
                this.flower.position.z = 10;
            }
            else if (this.flower.position.z > 10) {
                this.flower.position.z = -10;
            }
            else {
                this.flower.position.z += 0.1;
            }
        });
    }

    resize() { }

    update() {
        this.flowermixer.update(this.time.delta * 0.0009);
    }
}