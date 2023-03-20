import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

export default class Bear {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.bear = this.resources.items.bear;
        this.actualBear = this.bear.scene;
        this.bearChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        GSAP.registerPlugin(ScrollTrigger);
        this.activeAction = "";

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
        this.onScroll();
    }

    setModel() {
        this.actualBear.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });

        this.actualBear.children.forEach((child) => {
            child.scale.set(0, 0, 0);
            if (child.name === "footprint") {
                child.scale.set(0.1, 0.1, 0.1);
                child.position.set(0, 0.3, 0);
                child.castShadow = false;
                child.receiveShadow = false;
            }

            this.bearChildren[child.name.toLowerCase()] = child;
        });

        // new THREE.PointLight(色, 光の強さ, 距離, 光の減衰率)
        const light = new THREE.PointLight(0xFFFFFF, 1, 10, 1.0);
        light.position.set(0, 1.5, 1.5);
        this.actualBear.add(light);

        // const lightHelper = new THREE.PointLightHelper(light);
        // light.add(lightHelper);

        this.scene.add(this.actualBear);
        this.actualBear.children[0].children[1].scale.set(0.6, 0.6, 0.6);
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualBear);
        this.activeAction = this.mixer.clipAction(this.bear.animations[5]);
        this.activeAction.play();
        this.animations = this.bear.animations;
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.001;
        });
    }

    onScroll() {
        window.addEventListener("wheel", (e) => {

            if (this.scrollPercent > 1) {
                this.mixer.update(this.time.delta * 0.01);
            } else {
                this.mixer.update(this.time.delta * -0.01);
            }
        });
    }

    resize() { }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualBear.rotation.y = this.lerp.current;
    }
}