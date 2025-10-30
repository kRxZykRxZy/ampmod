import { useEffect, useState, useRef } from "react";
import styles from "../../design.css";
import myStyles from "./hero.css";
import strangeObject1 from "./apple-cat-in-space.svg";
import strangeObject2 from "./mm-controller.svg";
import strangeObject3 from "./blueblock3d.svg";
import * as Bowser from "bowser";
import Localise from "../localise/localise";

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default () => {
    const [isPhone, setIsPhone] = useState(false);
    const canvasRef = useRef(null);

    // Detect mobile platform
    useEffect(() => {
        const parsed = Bowser.parse(window.navigator.userAgent);
        const platformType = parsed.platform.type;
        setIsPhone(platformType === "mobile");
    }, []);

    // Starfield background
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const resizeCanvas = () => {
            const oldWidth = canvas.width;
            const oldHeight = canvas.height;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const widthRatio = canvas.width / oldWidth;
            const heightRatio = canvas.height / oldHeight;

            stars.forEach(star => {
                star.x *= widthRatio;
                star.y *= heightRatio;
            });

            strangeObjects.forEach(cat => {
                cat.x *= widthRatio;
                cat.y *= heightRatio;
            });
        };

        // Deterministic randomisation
        // This seed is actually the timestamp of AmpMod's first commit after forking
        // (https://codeberg.org/ampmod/ampmod/commit/7855f3310fe03dfe317c3e451847b1e6a8e98028)
        const seed = 1738606141000;
        const rand = mulberry32(seed);

        const stars = Array.from({ length: 200 }, () => ({
            x: rand() * canvas.width,
            y: rand() * canvas.height,
            radius: rand() * 1.5 + 0.5,
            speed: rand() * 0.5 + 0.2,
        }));

        const catImages = [strangeObject1, strangeObject2, strangeObject3];

        // Floating strangeObjects
        const strangeObjects = Array.from({ length: 12 }, () => {
            const img = catImages[Math.floor(rand() * catImages.length)];
            let width = 60 + rand() * 40;
            let height = 20 + rand() * 10;

            // Make the blue block smaller
            if (img === strangeObject3) {
                // blue block
                width *= 0.5; // half width
                height *= 0.5; // half height
            }

            return {
                x: rand() * canvas.width,
                y: rand() * canvas.height,
                speedX: rand() * 0.3 - 0.15,
                speedY: rand() * 0.3 - 0.15,
                rotation: rand() * Math.PI * 2,
                rotationSpeed: rand() * 0.01 - 0.005,
                width,
                height,
                img,
            };
        });

        // Preload images
        const loadedImages = {};
        catImages.forEach(src => {
            const img = new Image();
            img.src = src;
            loadedImages[src] = img;
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            ctx.fillStyle = "white";
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) star.y = canvas.height;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw strangeObjects
            strangeObjects.forEach(cat => {
                cat.x += cat.speedX;
                cat.y += cat.speedY;
                cat.rotation += cat.rotationSpeed;

                // Wrap around screen edges only when fully off-screen
                const margin = 5;
                if (cat.x + cat.width / 2 < -margin)
                    cat.x = canvas.width + cat.width / 2 + margin;
                if (cat.x - cat.width / 2 > canvas.width + margin)
                    cat.x = -cat.width / 2 - margin;
                if (cat.y + cat.height / 2 < -margin)
                    cat.y = canvas.height + cat.height / 2 + margin;
                if (cat.y - cat.height / 2 > canvas.height + margin)
                    cat.y = -cat.height / 2 - margin;
                ctx.save();
                ctx.translate(cat.x, cat.y);
                ctx.rotate(cat.rotation);
                ctx.drawImage(
                    loadedImages[cat.img],
                    -cat.width / 2,
                    -cat.height / 2,
                    cat.width,
                    cat.height
                );
                ctx.restore();
            });

            requestAnimationFrame(animate);
        };

        animate();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    return (
        <header
            className={styles.headerContainer}
            style={{
                position: "relative",
                overflow: "hidden",
                background: "black",
            }}
        >
            {/* Starfield canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    opacity: 0.7,
                    pointerEvents: "none",
                }}
            />

            <div
                className={myStyles.headerContainerContainer}
                style={{ position: "relative", zIndex: 1 }}
            >
                <div className={myStyles.headerContent}>
                    <h1 className={styles.headerText}>
                        <Localise id="appSlogan" />
                    </h1>

                    {process.env.ampmod_mode === "canary" && (
                        <strong>
                            <Localise id="hero.canaryWarning" />
                        </strong>
                    )}

                    <div className={styles.spacing}></div>
                    <div className={myStyles.buttonRow}>
                        {!isPhone && (
                            <a
                                href="editor.html"
                                className={myStyles.primaryButton}
                            >
                                <Localise id="hero.create" />
                            </a>
                        )}
                        <a
                            href="examples.html"
                            className={myStyles.primaryButton}
                        >
                            <Localise id="hero.examples" />
                        </a>
                    </div>
                    <div className={styles.spacing}></div>
                </div>
            </div>
        </header>
    );
};
