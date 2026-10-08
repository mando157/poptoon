(async () => {
    await loadSlim(tsParticles);

    await tsParticles.load({
        id: "tsparticles",
        options: {
            fpsLimit: 60,
            particles: {
                number: { value: 80, density: { enable: true } },
                paint: {
                    color: "#E5C06B",
                },
                shape: { type: "circle" },
                opacity: { value: 0.6 },
                size: { value: { min: 1, max: 4 } },
                links: {
                    enable: true,
                    distance: 150,
                    color: "#E5C06B",
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    outModes: { default: "bounce" },
                },
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                    onClick: { enable: true, mode: "push" },
                },
                modes: {
                    grab: { distance: 180, links: { opacity: 0.8 } },
                    push: { quantity: 4 },
                },
            },
            background: { color: "#000" },
        },
    });
})();