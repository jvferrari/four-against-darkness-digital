// js/game/SeedManager.js
class SeedManager {
    constructor(seed = null) {
        this.baseSeed = seed || this.generateSeed();
        this.seedMap = new Map();
        this.initSeedMap();
    }
    
    generateSeed() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    initSeedMap() {
        for (let tens = 1; tens <= 6; tens++) {
            for (let units = 1; units <= 6; units++) {
                const code = `${tens}${units}`;
                const seed = this.createDerivedSeed(code);
                this.seedMap.set(code, seed);
            }
        }
    }
    
    createDerivedSeed(code) {
        return this.hashCode(`${this.baseSeed}:${code}`).toString();
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
    
    getRoomSeed(d66Code) {
        return this.seedMap.get(d66Code.toString()) || this.baseSeed;
    }
    
    getRandomForCode(code) {
        const seed = this.getRoomSeed(code);
        return new Random(seed);
    }
}