import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Bear {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.bear = this.resources.items.bear;
        this.actualBear = this.bear.scene;
        this.bearChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
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
                // child.rotation.y = Math.PI / 4;
                child.castShadow = false;
                child.receiveShadow = false;
            }

            this.bearChildren[child.name.toLowerCase()] = child;
        });

        // const width = 1;
        // const height = 1;
        // const intensity = 1;
        // const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        // rectLight.position.set(0, 0, 0);
        // this.actualBear.add(rectLight);

        // this.roomChildren["rectLight"] = rectLight;

        // const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);

        this.scene.add(this.actualBear);
        this.actualBear.children[0].children[1].scale.set(0.6, 0.6, 0.6);
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualBear);
        this.walk = this.mixer.clipAction(this.bear.animations[2]);
        this.walk.play();
        // console.log(this.walk);
        this.actionWalkWeight = 0;
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.001;
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

        this.mixer.update(this.time.delta * 0.0009);

        this.actionWalkWeight += 0.01;
        // console.log(this.actionWalkWeight);
    }
}