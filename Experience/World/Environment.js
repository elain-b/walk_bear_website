import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import GUI from 'lil-gui';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // this.gui = new GUI({ container: document.querySelector('.hero-main') });
        this.obj = {
            colorObj: { r: 0, g: 0, b: 0 },
            intensity: 3,
        };

        this.setParticle();
        this.setSunlight();
        // this.setGUI();
    }

    setGUI() {
        this.gui.addColor(this.obj, "colorObj").onChange(() => {
            this.sunLight.color.copy(this.obj.colorObj);
            this.ambientLight.color.copy(this.obj.colorObj);
            // console.log(this.obj.colorObj);
        });
        this.gui.add(this.obj, "intensity", 0, 10).onChange(() => {
            this.sunLight.intensity = this.obj.intensity;
            this.ambientLight.intensity = this.obj.intensity;
        });
    }

    setParticle() {
        this.firefliesGeometry = new THREE.BufferGeometry();
        this.firefliesCount = 30;
        this.positionArray = new Float32Array(this.firefliesCount * 3);

        for (let i = 0; i < this.firefliesCount; i++) {
            this.positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
            this.positionArray[i * 3 + 1] = Math.random() * 1.5;
            this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }

        this.firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3));
        // Material
        this.firefliesMaterial = new THREE.PointsMaterial({ size: 5, sizeAttenuation: true });
        // Points
        this.fireflies = new THREE.Points(this.firefliesGeometry, this.firefliesMaterial);
        this.scene.add(this.fireflies);
        this.fireflies.position.set(0, -2, 0);
    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.normalBias = 0.05;
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);
        this.sunLight.position.set(-1.5, 7, 3);
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight("#ffffff", 1);
        this.scene.add(this.ambientLight);
    }

    switchTheme(theme) {
        if (theme === "dark") {
            GSAP.to(this.sunLight.color, {
                b: 0.1411764705882353,
                g: 0.043137254901960784,
                r: 0.0392156862745098,
            });
            GSAP.to(this.ambientLight.color, {
                b: 0.1411764705882353,
                g: 0.043137254901960784,
                r: 0.0392156862745098,
            });
            GSAP.to(this.sunLight, {
                intensity: 0.78,
            });
            GSAP.to(this.ambientLight, {
                intensity: 0.78,
            });
            GSAP.to(this.fireflies.position, {
                x: 0,
                y: 0,
                z: 0,
            });
        } else {
            GSAP.to(this.sunLight.color, {
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255,
            });
            GSAP.to(this.ambientLight.color, {
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255,
            });
            GSAP.to(this.sunLight, {
                intensity: 3,
            });
            GSAP.to(this.ambientLight, {
                intensity: 3,
            });
            GSAP.to(this.fireflies.position, {
                x: 0,
                y: -2,
                z: 0,
            });
        }
    }

    resize() { }

    update() { }
}