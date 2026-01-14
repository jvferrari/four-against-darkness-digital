// js/game/PartyManager.js
class PartyManager {
    constructor() {
        this.characters = [];
        this.inventory = []; // Inventário compartilhado
        this.gold = 0;
        this.order = [0, 1, 2, 3]; // Ordem de marcha
    }
    
    addCharacter(character) {
        if (this.characters.length < 4) {
            this.characters.push(character);
            return true;
        }
        return false;
    }
    
    removeCharacter(characterId) {
        this.characters = this.characters.filter(char => char.id !== characterId);
    }
    
    getCharacter(index) {
        return this.characters[index];
    }
    
    getAllCharacters() {
        return this.characters;
    }
    
    getAliveCharacters() {
        return this.characters.filter(char => char.currentHp > 0);
    }
    
    getUnconsciousCharacters() {
        return this.characters.filter(char => char.currentHp === 0);
    }
    
    distributeGold(amount) {
        const perCharacter = Math.floor(amount / this.characters.length);
        const remainder = amount % this.characters.length;
        
        this.characters.forEach((char, index) => {
            char.addGold(perCharacter + (index < remainder ? 1 : 0));
        });
        
        this.gold += amount;
    }
    
    addToSharedInventory(item) {
        this.inventory.push(item);
    }
    
    getTotalGold() {
        return this.characters.reduce((total, char) => total + char.gold, 0) + this.gold;
    }
    
    // Reorganiza a ordem dos personagens
    setMarchingOrder(newOrder) {
        if (newOrder.length === 4 && new Set(newOrder).size === 4) {
            this.order = newOrder;
            return true;
        }
        return false;
    }
    
    // Retorna personagens na ordem de marcha
    getMarchingOrder() {
        return this.order.map(index => this.characters[index]);
    }
}