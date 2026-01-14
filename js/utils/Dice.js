// js/utils/Dice.js
class Dice {
    static roll(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }
    
    static rollD66() {
        const tens = Math.floor(Math.random() * 6) + 1;
        const units = Math.floor(Math.random() * 6) + 1;
        return parseInt(`${tens}${units}`);
    }
    
    static rollMultiple(count, sides) {
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += this.roll(sides);
        }
        return total;
    }
}