// js/utils/Random.js
class Random {
    constructor(seed = null) {
        if (typeof seed === 'string') {
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i);
                hash = hash & hash;
            }
            this.seed = Math.abs(hash);
        } else {
            this.seed = seed || Date.now();
        }
        this.current = this.seed;
    }
    
    next() {
        this.current = (this.current * 9301 + 49297) % 233280;
        return this.current / 233280;
    }
    
    int(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    
    rollDice(count, sides) {
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += this.int(1, sides);
        }
        return total;
    }
    
    rollD66() {
        const tens = this.int(1, 6);
        const units = this.int(1, 6);
        return parseInt(`${tens}${units}`);
    }
    
    choice(array) {
        return array[this.int(0, array.length - 1)];
    }
}