// js/game/RoomContentGenerator.js
class RoomContentGenerator {
    constructor(tables) {
        this.tables = tables;
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
        
        // Rola na tabela de conteúdo baseado no código d66
        const contentRoll = random.rollDice(1, 6);
        let contentType, contentData;
        
        switch(contentRoll) {
            case 1: // Vazio
                contentType = 'empty';
                contentData = { description: 'A sala está vazia.' };
                break;
                
            case 2: // Tesouro
                contentType = 'treasure';
                contentData = this.generateTreasure(random);
                break;
                
            case 3: // Monstros
                contentType = 'monsters';
                contentData = this.generateMonsters(random);
                break;
                
            case 4: // Armadilha
                contentType = 'trap';
                contentData = this.generateTrap(random);
                break;
                
            case 5: // Evento Especial
                contentType = 'special';
                contentData = this.generateSpecialEvent(random);
                break;
                
            case 6: // Chefe
                contentType = 'boss';
                contentData = this.generateBoss(random);
                break;
        }
        
        return {
            type: contentType,
            description: this.getDescription(contentType, contentData),
            explored: false,
            cleared: false,
            content: contentData,
            seed: seed
        };
    }
    
    generateTreasure(random) {
        const treasureTypes = ['gold', 'gem', 'magic_item', 'scroll', 'potion'];
        const type = random.choice(treasureTypes);
        
        switch(type) {
            case 'gold':
                return {
                    type: 'gold',
                    amount: random.rollDice(2, 6) * 10,
                    description: 'Um baú cheio de moedas de ouro!'
                };
            case 'gem':
                return {
                    type: 'gem',
                    value: random.rollDice(3, 6) * 25,
                    description: 'Uma gema brilhante!'
                };
            case 'magic_item':
                return {
                    type: 'magic_item',
                    item: random.choice(['sword', 'shield', 'wand', 'ring', 'amulet']),
                    description: 'Um item mágico reluzente!'
                };
            default:
                return {
                    type: 'treasure',
                    description: 'Tesouro variado!'
                };
        }
    }
    
    generateMonsters(random) {
        const monsterTypes = [
            { type: 'goblin', level: 2, count: random.rollDice(2, 6) },
            { type: 'skeleton', level: 3, count: random.rollDice(1, 6) + 2 },
            { type: 'orc', level: 4, count: random.rollDice(1, 6) + 1 },
            { type: 'spider', level: 3, count: random.rollDice(1, 6) },
            { type: 'rat_swarm', level: 1, count: random.rollDice(3, 6) }
        ];
        
        const monsters = random.choice(monsterTypes);
        return {
            ...monsters,
            description: `${monsters.count} ${monsters.type}(s) aparecem!`
        };
    }
    
    getDescription(contentType, contentData) {
        switch(contentType) {
            case 'empty': return 'A sala está vazia e silenciosa.';
            case 'treasure': return contentData.description;
            case 'monsters': return contentData.description;
            case 'trap': return 'Você percebe uma armadilha no chão!';
            case 'special': return 'Algo especial acontece...';
            case 'boss': return 'Um poderoso chefe bloqueia seu caminho!';
            default: return 'A sala aguarda exploração.';
        }
    }
    
    // ... métodos para gerar armadilhas, eventos, chefes
}