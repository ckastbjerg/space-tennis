const world = document.querySelector('.js-world');
let rotation = 0;

const players = [
    {
        element: document.querySelector('.js-player-1'),
        isDucking: false,
        keys: {
            duck: 49,
            head: 50,
        },
        rotation: 90,
    },
    {
        element: document.querySelector('.js-player-2'),
        isDucking: false,
        keys: {
            duck: 57,
            head: 48,
        },
        rotation: 270,
    },
];

players.forEach(player => {
    const element = player.element;
    element.addEventListener('transitionend', e => {
        if (player.isDucking) {
            element.classList.add('is-down');
            setTimeout(() => {
                if (element.classList.contains('is-down')) {
                    element.classList.remove('is-going-down', 'is-down');
                }
            }, 500);
        }
    });
});

let speed = 1;

function step() {
    let playerDied = false;
    players.forEach(player => {
        const element = player.element;
        if (rotation % 360 === player.rotation && !element.classList.contains('is-down')) {
            element.classList.add('is-dead');
            playerDied = true;
        }
    });

    if (!playerDied) {
        speed -= speed / 100;
        world.style.transition = `${speed}s linear`;
        rotation += 90;
        world.style.transform = `rotate(${rotation}deg)`;
    }
}

function start() {
    world.style.transition = `${speed}s linear`;
    world.addEventListener('transitionend', step);
    setTimeout(step, 1);
}

window.addEventListener('keydown', e => {
    players.forEach(player => {
        if (e.keyCode === player.keys.duck && !player.isDucking) {
            player.element.classList.add('is-going-down');
            player.isDucking = true;
        }
    });
});

window.addEventListener('keyup', e => {
    players.forEach(player => {
        if (e.keyCode === player.keys.duck) {
            player.element.classList.remove('is-going-down', 'is-down');
            player.isDucking = false;
        }
    });
});

start();
