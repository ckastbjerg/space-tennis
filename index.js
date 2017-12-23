const world = document.querySelector('.js-world');
const game = document.querySelector('.js-game');
const ball = document.querySelector('.js-ball');
const startButton = document.querySelector('.js-start');
const placeholderBall = document.querySelector('.js-placeholder-ball');

const rotations = [90, 180, 270, 360];
function getRotation() {
    const index = Math.floor(Math.random() * rotations.length);
    const rotation = rotations[index];
    rotations.splice(index, 1);
    return rotation;
}

const players = [
    {
        element: document.querySelector('.js-player-1'),
        wrapper: document.querySelector('.js-player-wrapper-1'),
        isDucking: false,
        isPunching: false,
        keys: {
            duck: 49,
            punch: 50,
        },
        rotation: getRotation(),
    },
    {
        element: document.querySelector('.js-player-2'),
        wrapper: document.querySelector('.js-player-wrapper-2'),
        isDucking: false,
        isPunching: false,
        keys: {
            duck: 57,
            punch: 48,
        },
        rotation: getRotation(),
    },
    {
        element: document.querySelector('.js-player-3'),
        wrapper: document.querySelector('.js-player-wrapper-3'),
        isDucking: false,
        isPunching: false,
        keys: {
            duck: 86,
            punch: 66,
        },
        rotation: getRotation(),
    },
];

function getCircleProps(element) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top, radius: rect.width / 2 };
}

function isColliding(element, ballElement) {
    const circle1 = getCircleProps(element);
    const circle2 = getCircleProps(ballElement);
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

players.forEach(player => {
    const element = player.element;
    player.wrapper.style.transform = `rotate(${player.rotation}deg)`;
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
let playerDied = false;
let isGoingRight = true;

function rotate() {
    let rotation = parseInt(world.style.transform.match(/(-?[0-9\.]+)/g)[0]);
    rotation = isGoingRight ? rotation + 90 : rotation - 90;
    speed -= speed / 100;
    world.style.transition = `${speed}s linear`;
    world.style.transform = `rotate(${rotation}deg)`;
}

function step() {
    if (playerDied) { return };

    players.forEach(player => {
        if (isColliding(player.element.querySelector('.player__head'), ball)) {
            player.element.classList.add('is-dead');
            speed = 100000000000000;
            playerDied = true;
            rotate();
        } else if (isColliding(player.element.querySelector('.js-player-bat'), ball)) {
            isGoingRight = !isGoingRight;
            game.classList.toggle('is-going-left');
            rotate();
        }
    });

    window.requestAnimationFrame(step);
}

world.style.transform = `rotate(${getRotation()}deg)`;

function start() {
    world.style.transition = `${speed}s linear`;
    step();
    world.addEventListener('transitionend', rotate);
    setTimeout(rotate, 1);
}

window.addEventListener('keydown', e => {
    players.forEach(player => {
        if (e.keyCode === player.keys.duck && !player.isDucking) {
            player.element.classList.add('is-going-down');
            player.isDucking = true;
        } else if (e.keyCode === player.keys.punch && !player.isPunching) {
            player.element.classList.add('is-punching');
            setTimeout(() => {
                player.element.classList.remove('is-punching');
            }, 250);
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

startButton.addEventListener('click', start);
