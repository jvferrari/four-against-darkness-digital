// js/game/SeedManager.js
class SeedManager {
    constructor(seed = null) {
        this.baseSeed = seed || this.generateSeed();
        this.seedMap = new Map(); // Mapeia códigos d66 para seeds específicas
        this.initSeedMap();
    }
    
    generateSeed() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    initSeedMap() {
        // Para cada possível código d66 (11-66), cria uma seed derivada
        for (let tens = 1; tens <= 6; tens++) {
            for (let units = 1; units <= 6; units++) {
                const code = `${tens}${units}`;
                const seed = this.createDerivedSeed(code);
                this.seedMap.set(code, seed);
            }
        }
    }
    
    createDerivedSeed(code) {
        // Combina a seed base com o código para criar uma seed única
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
    
    getRandomForRoom(d66Code) {
        const seed = this.getRoomSeed(d66Code);
        return new Random(seed);
    }
}