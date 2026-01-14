// js/game/RoomContentGenerator.js
class RoomContentGenerator {
    constructor() {
        // Vazio por enquanto
    }
    
    generateContent(d66Code, isEntrance, seed) {
        const random = new Random(seed);
        
        if (isEntrance) {
            return {
                type: 'entrance',
                description: 'Entrada da Masmorra',
                explored: false,
                content: null
            };
        }
        
        const contentRoll = random.rollDice(1, 6);
        
        if (contentRoll <= 2) {
            return {
                type: 'empty',
                description: 'A sala está vazia e silenciosa.',
                explored: false,
                content: null
            };
        } else if (contentRoll <= 4) {
            return {
                type: 'treasure',
                description: 'Você encontra um tesouro!',
                explored: false,
                content: {
                    gold: random.rollDice(2, 6) * 10
                }
            };
        } else {
            return {
                type: 'monster',
                description: 'Monstros aparecem!',
                explored: false,
                content: {
                    type: 'goblin',
                    count: random.rollDice(1, 4) + 1,
                    level: 2
                }
            };
        }
    }
}