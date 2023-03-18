import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

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
        // this.setTweenAnimation();
        // this.setAnimationScripts();
        // this.playScrollAnimations();
        this.onMouseMove();
        this.onScroll();
        // this.onPercentScroll();
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

        // new THREE.PointLight(色, 光の強さ, 距離, 光の減衰率)
        const light = new THREE.PointLight(0xFFFFFF, 1, 10, 1.0);
        light.position.set(0, 1.5, 1.5);
        this.actualBear.add(light);

        // const lightHelper = new THREE.PointLightHelper(light);
        // light.add(lightHelper);

        this.scene.add(this.actualBear);
        // console.log(this.actualBear.children[0]);
        this.actualBear.children[0].children[1].scale.set(0.6, 0.6, 0.6);
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualBear);

        // this.element = document.getElementsByClassName('first-section');
        // console.log(this.element[0].classList.contains('first-section'));
        // if (this.element[0].classList.contains('first-section')) {
        //     console.log(this.element);
        // }

        // this.walk = this.bear.animations[2];
        // this.waitAnimation = this.bear.animations[0];
        // this.activeAction = this.mixer.clipAction(this.walkAnimation);
        // this.walk = this.mixer.clipAction(this.bear.animations[2]);
        this.activeAction = this.mixer.clipAction(this.bear.animations[5]);
        // this.wait = this.mixer.clipAction(this.bear.animations[0]);
        // console.log(this.mixer);
        // this.actionWalkWeight = 0;
        // this.actionWaitWeight = 1;
        // this.walk.play();
        this.activeAction.play();
        // console.log(this.activeAction);
        // this.setCreateAnimation(this.mixer, this.activeAction, this.bear.animations[2]);
        // console.log(this.walk)
        // this.activeAction.play();
        this.animations = this.bear.animations;
    }

    setCreateAnimation(mixer, action, clip) {
        this.proxy = {
            get time() {
                return mixer.time;
            },
            set time(value) {
                action.paused = false;
                mixer.setTime(value);
                action.paused = true;
            }
        };

        this.scrollingTL = GSAP.timeline({
            scrollTrigger: {
                trigger: ".page",
                start: "top top",
                end: "+=500%",
                pin: true,
                scrub: true,
                markers: true,
                onUpdate: function () {
                    this.camera.perspectiveCamera.updateProjectionMatrix();
                    // console.log(proxy.time);
                    // console.log(this.camera.perspectiveCamera);
                }
            }
        });

        this.scrollingTL.to(this.proxy, {
            time: clip.duration,
            repeat: 3,
        });
    };

    setTweenAnimation() {
        this.animations = this.bear.animations;
        new TWEEN.Tween(this.actualBear.position)
            .to({
                z: 2,
            }, (10000 / 1))
            .start()
            .onComplete(() => {
                // console.log("tween");
                this.previousAction = this.activeAction;
                this.activeAction = this.mixer.clipAction(this.bear.animations[2]);

                if (this.activeAction !== this.previousAction) {
                    this.previousAction.fadeOut(0.2);
                }

                this.activeAction.clampWhenFinished = true;
                this.activeAction.setLoop(THREE.LoopRepeat);

                this.activeAction
                    .reset()
                    .fadeIn(0.2)
                    .play();
            });
    }

    setAnimationScripts() {
        this.animationScripts = [];
        this.animations = this.bear.animations;

        this.animationScripts.push({
            start: 28,
            end: 30,
            func: () => {
                console.log("28~30");
                this.previousAction = this.activeAction;
                this.activeAction = this.mixer.clipAction(this.bear.animations[2]);

                if (this.activeAction !== this.previousAction) {
                    this.previousAction.fadeOut(0.2);
                }

                this.activeAction.clampWhenFinished = true;
                this.activeAction.setLoop(THREE.LoopRepeat);

                this.activeAction
                    .reset()
                    .setEffectiveTimeScale(1)
                    .setEffectiveWeight(1)
                    .fadeIn(0.2)
                    .play();
            }
        });

        this.animationScripts.push({
            start: 30,
            end: 50,
            func: () => {
                console.log("30~50");
                this.previousAction = this.activeAction;
                this.activeAction = this.mixer.clipAction(this.bear.animations[0]);

                if (this.activeAction !== this.previousAction) {
                    this.previousAction.fadeOut(0.5);
                }

                this.activeAction.clampWhenFinished = true;
                this.activeAction.setLoop(THREE.LoopRepeat);

                this.activeAction
                    .reset()
                    .setEffectiveTimeScale(1)
                    .setEffectiveWeight(1)
                    .fadeIn(0.5)
                    .play();
            }
        });

        // this.animationScripts.push({
        //     start: 50,
        //     end: 0,
        //     func: () => {
        //         console.log("wakl again animation");
        //         this.previousAction = this.activeAction;
        //         this.activeAction = this.mixer.clipAction(this.bear.animations[2]);

        //         if (this.activeAction !== this.previousAction) {
        //             this.previousAction.fadeOut(0.5);
        //         }

        //         this.activeAction.clampWhenFinished = true;
        //         this.activeAction.setLoop(THREE.LoopRepeat);

        //         this.activeAction
        //             .reset()
        //             .setEffectiveTimeScale(1)
        //             .setEffectiveWeight(1)
        //             .fadeIn(0.5)
        //             .play();
        //         // this.walk = this.mixer.clipAction(this.bear.animations[0]);
        //         // this.walk.play();
        //     }
        // });
    }

    playScrollAnimations() {
        this.animationScripts.forEach((a) => {
            if (this.scrollPercent >= a.start && this.scrollPercent < a.end) {
                a.func();
            }
            else if (this.scrollPercent >= a.start && this.scrollPercent > a.end) {
                a.func();
            }
        });
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
            // e.preventDefault();
            // this.playScrollAnimations();
            // console.log(this.scrollPercent);

            // if (e.deltaY > 1) {
            if (this.scrollPercent > 1) {
                this.mixer.update(this.time.delta * 0.01);
                // this.mixer.update(Math.sin(this.time.delta) * 0.05 + 0.5);
            } else {
                this.mixer.update(this.time.delta * -0.01);
                // this.mixer.update(Math.sin(this.time.delta) * -0.05 + -0.5);
            }
            // if (this.scrollPercent > 50) {
            //     this.setTweenAnimation();
            // } 
        });
    }

    onPercentScroll() {
        this.scrollPercent = 0;

        document.body.onscroll = () => {
            //calculate the current scroll progress as a percentage
            this.scrollPercent =
                ((document.documentElement.scrollTop || document.body.scrollTop) /
                    ((document.documentElement.scrollHeight ||
                        document.body.scrollHeight) -
                        document.documentElement.clientHeight)) *
                100
                ; (document.getElementById('scrollProgress')).innerText =
                    'Scroll Progress : ' + this.scrollPercent.toFixed(2);
        };
    }

    resize() { }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualBear.rotation.y = this.lerp.current;

        // console.log(event.deltaY);
        // this.mixer.update(this.time.delta * 0.0009);
        // this.mixer.update(this.time.delta * this.scrollPercent);
        // console.log(this.delta);
        // console.log(this.scrollPercent);
        // console.log(this.time.delta);

        // this.playScrollAnimations();

        // console.log(this.scrollPercent);

        // this.actionWalkWeight += 0.01;
        // this.actionWaitWeight -= 0.01;

        // this.walk.setEffectiveWeight(this.actionWalkWeight);
        // this.wait.setEffectiveWeight(this.actionWaitWeight);
        // console.log(this.actionWalkWeight);
    }
}