import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from '@ashthornton/asscroll';

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.bear = this.experience.world.bear.actualBear;
        this.bearScene = this.experience.world.bear;
        this.mixer = this.experience.world.bear.mixer;
        this.activeAction = this.experience.world.bear.activeAction;
        this.animations = this.experience.world.bear.animations;
        this.objects = this.experience.world.objects;
        this.environment = this.experience.world.environment;

        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            this.setSmoothScroll();
        }
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.5,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            // Desktop
            "(min-width: 969px)": () => {
                this.bear.position.set(0, 0, 0);
                this.bear.scale.set(0.6, 0.6, 0.6);
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.environment.flowersbox.position.y = 0;

                this.items = GSAP.utils.toArray('.section');
                this.items.forEach((item) => {
                    GSAP.fromTo(
                        item,
                        {
                            duration: 1,
                            y: 10,
                            autoAlpha: 0,
                        },
                        {
                            y: 0,
                            autoAlpha: 1,
                            scrollTrigger: {
                                trigger: item,
                                toggleActions: "play none none reset",
                                start: "bottom bottom",
                                // markers: true,
                            },
                        }
                    );
                });

                // First Move section ----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                });

                // Second section ----------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                        onEnter: () => {
                            this.previousAction = this.activeAction;
                            this.activeAction = this.mixer.clipAction(this.animations[3]);

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
                        },
                        onLeaveBack: () => {
                            this.previousAction = this.activeAction;
                            this.activeAction = this.mixer.clipAction(this.animations[5]);

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
                    },
                });

                this.secondSectionTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top center",
                        // end: "bottom bottom",
                        scrub: 0.6,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                });

                // Third section -----------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });
            },

            // Mobile
            "(max-width: 968px)": () => {
                // Resets
                this.bear.scale.set(0.6, 0.6, 0.6);
                this.bear.position.set(0, 0, 0);
                this.camera.orthographicCamera.position.set(0, 6.5, 10);

                // First section ---------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                });

                // Second section --------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });

                // Third section --------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });

            },

            // all
            all: () => {
                this.objects.flower.scale.set(2, 2, 2);
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section) => {
                });
                // All animations
                // First section -----------------------------------------
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Second section -----------------------------------------
                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                })
                    .to(
                        this.circleSecond.scale,
                        {
                            x: 3,
                            y: 3,
                            z: 3,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Fadein Stone
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                    },
                });

                this.bear.children.forEach((child) => {
                    if (child.name === "stones") {
                        this.first = GSAP.to(child.scale, {
                            x: 0.4,
                            y: 0.4,
                            z: 0.4,
                        });
                    }
                });
                this.secondPartTimeline.add(this.first);

                // Second section ----------------------------
                this.second = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        // end: "center center",
                        scrub: 0.6,
                    },
                });
                this.thirdMoveTimeline.add(this.second);
            }
        });
    }

    resize() { }

    update() { }
}