import EventEmitter from './EventEmitter.js';

export default class Time extends EventEmitter {
    constructor() {
        super();

        this.start = performance.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16; // Approx. 60 FPS
        this.playing = true;
        this.lastTimestamp = 0;

        this.tick = this.tick.bind(this);
        this.ticker = requestAnimationFrame(this.tick);
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    tick(timestamp) {
        // Limit frame rate to avoid lag spikes
        const frameInterval = 1000 / 60; // 60 FPS
        if (timestamp - this.lastTimestamp < frameInterval) {
            this.ticker = requestAnimationFrame(this.tick);
            return;
        }
        this.lastTimestamp = timestamp;

        const current = performance.now();
        this.delta = Math.min(current - this.current, 60); // Prevent large delta jumps
        this.elapsed += this.playing ? this.delta : 0;
        this.current = current;

        if (this.playing) {
            this.trigger('tick');
        }

        this.ticker = requestAnimationFrame(this.tick);
    }

    stop() {
        cancelAnimationFrame(this.ticker);
    }
}