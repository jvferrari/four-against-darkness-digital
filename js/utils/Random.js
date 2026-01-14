// js/utils/Random.js
class Random {
    constructor(seed) {
        this.seed = this.hashCode(seed);
        this.current = this.seed;
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    
    next() {
        // Gerador LCG simples
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
    
    // Rola d66 (2 dados: um para dezenas, outro para unidades)
    rollD66() {
        const tens = this.int(1, 6);
        const units = this.int(1, 6);
        return parseInt(`${tens}${units}`);
    }
    
    choice(array) {
        return array[this.int(0, array.length - 1)];
    }
}