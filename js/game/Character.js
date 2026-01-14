// js/game/Character.js
class Character {
    constructor(classData) {
        this.id = this.generateId();
        this.name = this.generateName();
        this.class = classData.id;
        this.level = 1;
        this.maxHp = classData.hp;
        this.currentHp = classData.hp;
        this.attackBonus = classData.attack;
        this.defenseBonus = 0;
        this.gold = 0;
        this.inventory = [];
        this.equipped = {
            weapon: null,
            armor: null,
            shield: null,
            accessory: null
        };
        this.status = 'healthy';
    }
    
    generateId() {
        return 'char_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateName() {
        const names = ['Aragorn', 'Legolas', 'Gimli', 'Gandalf', 'Frodo', 'Boromir', 'Samwise', 'Merry', 'Pippin'];
        return names[Math.floor(Math.random() * names.length)];
    }
    
    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
        if (this.currentHp === 0) {
            this.status = 'unconscious';
        }
        return this.currentHp;
    }
    
    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
        if (this.currentHp > 0 && this.status === 'unconscious') {
            this.status = 'healthy';
        }
        return this.currentHp;
    }
    
    addGold(amount) {
        this.gold += amount;
        return this.gold;
    }
    
    addItem(item) {
        this.inventory.push(item);
    }
    
    removeItem(itemId) {
        this.inventory = this.inventory.filter(item => item.id !== itemId);
    }
    
    equip(item) {
        if (item.type === 'weapon') {
            this.equipped.weapon = item;
        } else if (item.type === 'armor') {
            this.equipped.armor = item;
        } else if (item.type === 'shield') {
            this.equipped.shield = item;
        }
    }
    
    getAttackBonus() {
        let bonus = this.attackBonus;
        if (this.equipped.weapon) {
            bonus += this.equipped.weapon.attackBonus || 0;
        }
        return bonus;
    }
    
    getDefenseBonus() {
        let bonus = this.defenseBonus;
        if (this.equipped.armor) {
            bonus += this.equipped.armor.defenseBonus || 0;
        }
        if (this.equipped.shield) {
            bonus += this.equipped.shield.defenseBonus || 0;
        }
        return bonus;
    }
}