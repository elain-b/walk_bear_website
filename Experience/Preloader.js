import { EventEmitter } from "events";
import Experience from "./Experience.js";
import GSAP from "gsap";
import convert from "./Utils/covertDivsToSpans.js";

export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.device = this.sizes.device;

        this.sizes.on("switchdevice", (device) => {
            this.device = device;
        });
        
        this.world.on("worldready", () => {
            this.setAssets();
            this.playIntro();
        });
    }

    setAssets() {
        // convert(document.querySelector(".intro-text"));
        // convert(document.querySelector(".hero-main-title"));
        // const heromaintitle = document.querySelector('.hero-main-title');
        // heromaintitle.classList.add('fadeIn');
        // convert(document.querySelector(".hero-main-description"));
        // convert(document.querySelector(".hero-second-subheading"));
        // convert(document.querySelector(".second-sub"));

        this.bear = this.experience.world.bear.actualBear;
        this.bearChildren = this.experience.world.bear.bearChildren;
    }

    firstIntro() {
        return new Promise((resolve) => {
            this.timeline = new GSAP.timeline();
            this.timeline.set(".hero-main-title", { y: 0, yPercent: 100 });
            this.timeline.to(".preloader", {
                opacity: 0,
                delay: 1,
                onComplete: () => {
                    document
                        .querySelector(".preloader")
                        .classList.add("hidden");
                },
            });
            if (this.device === "desktop") {
                this.timeline
                    .to(this.bearChildren.footprint.scale, {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                        ease: "back.out(2.5)",
                        duration: 0.7,
                    })
                    // .to(this.bear.position, {
                    //     x: -1,
                    //     ease: "power1.out",
                    //     duration: 0.7,
                    // });
            } else {
                this.timeline
                    .to(this.bearChildren.footprint.scale, {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                        ease: "back.out(2.5)",
                        duration: 0.7,
                    })
                    // .to(this.bear.position, {
                    //     z: -1,
                    //     ease: "power1.out",
                    //     duration: 0.7,
                    // });
            }
            this.timeline
                // .to(".intro-text .animatedis", {
                //     yPercent: 0,
                //     stagger: 0.05,
                //     ease: "back.out(1.7)",
                // })
                .to(
                    ".arrow-svg-wrapper",
                    {
                        opacity: 1,
                    },
                    "same"
                )
                .to(
                    ".title-bar",
                    {
                        opacity: 1,
                        onComplete: resolve,
                    },
                    "same"
                )
                .to(
                    ".toggle-bar",
                    {
                        opacity: 1,
                        onComplete: resolve,
                    },
                    "same"
                )
                // .to(
                //     ".hero-main-title",
                //     {
                //         autoAlpha: 0,
                //         onComplete: resolve,
                //     },
                //     "same"
                // );
        });
    }

    secondIntro() {
        return new Promise((resolve) => {
            this.secondTimeline = new GSAP.timeline();

            this.secondTimeline
                // .to(
                //     ".intro-text .animatedis",
                //     {
                //         yPercent: 100,
                //         stagger: 0.05,
                //         ease: "back.in(1.7)",
                //     },
                //     "fadeout"
                // )
                .to(
                    ".arrow-svg-wrapper",
                    {
                        opacity: 0,
                    },
                    "fadeout"
                )
                .to(
                    this.bear.position,
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                        ease: "power1.out",
                    },
                    "same"
                )
                // .to(
                //     this.bearChildren.footprint.rotation,
                //     {
                //         y: 2 * Math.PI + Math.PI / 4,
                //     },
                //     "same"
                // )
                // .to(
                //     this.bearChildren.footprint.scale,
                //     {
                //         x: 10,
                //         y: 10,
                //         z: 10,
                //     },
                //     "same"
                // )
                .to(
                    this.camera.orthographicCamera.position,
                    {
                        y: 6.5,
                    },
                    "same"
                )
                // .to(
                //     this.bearChildren.footprint.position,
                //     {
                //         x: 0,
                //         y: 0,
                //         z: 0,
                //     },
                //     "same"
                // )
                .set(this.bearChildren.metarig.scale, {
                    x: 0.6,
                    y: 0.6,
                    z: 0.6,
                })
                .to(
                    this.bearChildren.footprint.scale,
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                        // duration: 1,
                    },
                    "fadeout"
                )
                .to(
                    ".hero-main-title",
                    {
                        yPercent: 0,
                        stagger: 0.07,
                        ease: "back.out(1.7)",
                        autoAlpha: 1
                    },
                    "introtext"
                )
                // .to(
                //     ".hero-main-description .animatedis",
                //     {
                //         yPercent: 0,
                //         stagger: 0.07,
                //         ease: "back.out(1.7)",
                //     },
                //     "introtext"
                // )
                // .to(
                //     ".first-sub .animatedis",
                //     {
                //         yPercent: 0,
                //         stagger: 0.07,
                //         ease: "back.out(1.7)",
                //     },
                //     "introtext"
                // )
                // .to(
                //     ".second-sub .animatedis",
                //     {
                //         yPercent: 0,
                //         stagger: 0.07,
                //         ease: "back.out(1.7)",
                //     },
                //     "introtext"
                // )
                .to(".arrow-svg-wrapper", {
                    opacity: 1,
                    onComplete: resolve,
                });
        });
    }

    onScroll(e) {
        if (e.deltaY > 0) {
            this.removeEventListeners();
            this.playSecondIntro();
        }
    }

    onTouch(e) {
        this.initalY = e.touches[0].clientY;
    }

    onTouchMove(e) {
        let currentY = e.touches[0].clientY;
        let difference = this.initalY - currentY;
        if (difference > 0) {
            console.log("swipped up");
            this.removeEventListeners();
            this.playSecondIntro();
        }
        this.intialY = null;
    }

    removeEventListeners() {
        window.removeEventListener("wheel", this.scrollOnceEvent);
        window.removeEventListener("touchstart", this.touchStart);
        window.removeEventListener("touchmove", this.touchMove);
    }

    async playIntro() {
        this.scaleFlag = true;
        await this.firstIntro();
        this.moveFlag = true;
        this.scrollOnceEvent = this.onScroll.bind(this);
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);
        window.addEventListener("wheel", this.scrollOnceEvent);
        window.addEventListener("touchstart", this.touchStart);
        window.addEventListener("touchmove", this.touchMove);
    }
    async playSecondIntro() {
        this.moveFlag = false;
        await this.secondIntro();
        this.scaleFlag = false;
        this.emit("enablecontrols");
    }

    move() {
        if (this.device === "desktop") {
            this.bear.position.set(0, 0, 0);
        } else {
            this.bear.position.set(0, 0, 0);
        }
    }

    scale() {
        // this.bearChildren.rectLight.width = 0;
        // this.bearChildren.rectLight.height = 0;

        if (this.device === "desktop") {
            this.bear.scale.set(1, 1, 1);
        } else {
            this.bear.scale.set(1, 1, 1);
        }
    }

    update() {
        if (this.moveFlag) {
            this.move();
        }

        if (this.scaleFlag) {
            this.scale();
        }
    }
}
