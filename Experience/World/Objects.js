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
        // console.log(this.actualbear);
        this.actualbear.children.forEach((child) => {
            if (child.name === "flowerBone") {
                // console.log(child);
                this.flower = child;
                child.castShadow = true;
                child.position.set(-2, 0, 3);
                child.scale.set(0, 0, 0);
            }
        });
        // console.log(this.flower);
        this.flower.children.forEach((child) => {
            if (child.name === "purple-flower") {
                // console.log(child.scale);
                this.purpleFlower = child;
                // child.castShadow = true;
                // child.position.set(0, 0, 0);
                // child.scale.set(0, 0, 0);

            }
        });

        this.flowermixer = new THREE.AnimationMixer(this.flower);
        this.swayingflower = this.flowermixer.clipAction(this.bear.animations[9]);
        this.swayingflower.play();
    }

    onScroll() {
        window.addEventListener("wheel", (e) => {
            // e.preventDefault();
            // this.playScrollAnimations();
            // console.log(this.scrollPercent);

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
            // if (this.scrollPercent > 50) {
            //     this.setTweenAnimation();
            // } 
        });
    }

    resize() { }

    update() {
        this.flowermixer.update(this.time.delta * 0.0009);

        // オブジェクトが下から上に移動してまた元の位置に戻る
        // if (this.actualbear.children[4].position.z < -10) {
        //     this.actualbear.children[4].position.z = 10;
        // }
        // if (this.actualbear.children[4].position.z > -10) {
        //     this.actualbear.children[4].position.z -= 0.01;
        // }
    }
}