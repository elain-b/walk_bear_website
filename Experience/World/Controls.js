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
                // this.rectLight.width = 0.5;
                // this.rectLight.height = 0.7;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                // console.log(this.bear);

                GSAP.fromTo(
                    ".first-section",
                    {
                        duration: 1,
                        y: 20,
                        autoAlpha: 0,
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        scrollTrigger: {
                            trigger: ".hero",
                            start: "center top",
                            // markers: true,
                        }
                    }
                )

                // First section ----------------------------------------
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
                this.firstMoveTimeline.fromTo(
                    this.bear.children[0].position,
                    { x: 0, y: 0, z: 0 },
                    {
                        x: () => {
                            return this.sizes.width * 0.0014;
                        }
                    }
                );

                // Second section ----------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.bear.children[0].position,
                        {
                            x: () => {
                                return -1.5;
                            },
                            // z: () => {
                            //     return 2;
                            // },
                        },
                        "same"
                    )
                    .to(
                        this.bear.children[0].scale,
                        {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        "same"
                    );
                // .to(this.camera.orthographicCamera.position, {
                //     y: 1.5,
                //     x: -4.1,
                // });
                // .to(
                //     this.rectLight,
                //     {
                //         width: 0.5 * 4,
                //         height: 0.7 * 4,
                //     },
                //     "same"
                // );

                // Third section -----------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.bear.children[0].position,
                        {
                            x: () => {
                                return 2.1;
                            },
                        },
                        "same"
                    );
                // .to(this.camera.orthographicCamera.position, {
                //     // z: 0.0001,
                //     x: -3.1,
                // });
            },

            // Mobile
            "(max-width: 968px)": () => {
                // Resets
                this.bear.scale.set(0.6, 0.6, 0.6);
                this.bear.position.set(0, 0, 0);
                // this.rectLight.width = 0.3;
                // this.rectLight.height = 0.4;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);

                // First section ---------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        // invalidateOnRefresh: true,
                    },
                });
                // .to(this.bear.scale, {
                //     x: 0.1,
                //     y: 0.1,
                //     z: 0.1,
                // });

                // Second section --------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    // .to(
                    //     this.bear.scale,
                    //     {
                    //         x: 0.25,
                    //         y: 0.25,
                    //         z: 0.25,
                    //     },
                    //     "same"
                    // )
                    // .to(
                    //     this.rectLight,
                    //     {
                    //         width: 0.3 * 3.4,
                    //         height: 0.4 * 3.4,
                    //     },
                    //     "same"
                    // )
                    .to(
                        this.bear.position,
                        {
                            x: 1.5,
                        },
                        "same"
                    );

                // Third section --------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(this.bear.position, {
                        x: -1.5,
                        // z: -4.5,
                    });

            },

            // all
            all: () => {
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
                // .to(
                //     this.bear.position,
                //     {
                //         y: 0.7,
                //     },
                //     "same"
                // );

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

                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                    },
                });

                this.bear.children.forEach((child) => {
                    if (child.name === "stones") {
                        this.first = GSAP.to(child.position, {
                            x: 3,
                            y: 0.5,
                            z: 0,
                            duration: 0.3,
                        });
                    }
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
                })
                    .to(
                        this.bear.children[1].position,
                        {
                            x: 3,
                            y: 0,
                            z: 0,
                            duration: 0.3,
                        },
                        "same"
                    )
                    // .to(
                    //     this.bear.children[1].scale,
                    //     {
                    //         x: 0,
                    //         y: 0,
                    //         z: 0,
                    //         duration: 0.3,
                    //     },
                    //     "same"
                    // );
                this.thirdMoveTimeline.add(this.second);
            }
        });
    }

    resize() { }

    update() { }
}