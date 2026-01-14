// js/game/GameEngine.js
class GameEngine {
    constructor() {
        this.seedManager = new SeedManager();
        this.roomGenerator = new RoomGenerator();
        this.contentGenerator = new RoomContentGenerator();
        this.dungeonMap = new DungeonMap(
            this.seedManager,
            this.roomGenerator,
            this.contentGenerator
        );
        
        this.party = null;
        this.currentRoom = null;
        this.messages = [];
        this.gameState = 'exploring';
    }
    
    initialize(party) {
        this.party = party;
        this.currentRoom = this.dungeonMap.generateStartingRoom();
        this.addMessage('Bem-vindo à masmorra!');
        return this;
    }
    
    exploreCurrentRoom() {
        if (!this.currentRoom.content.explored) {
            this.currentRoom.content.explored = true;
            this.addMessage('Você explora a sala...');
            return this.currentRoom.content;
        }
        return null;
    }
    
    searchRoom() {
        this.addMessage('Você procura por itens escondidos...');
        // Implementação futura
        return null;
    }
    
    rest() {
        this.addMessage('Você descansa um pouco...');
        // Implementação futura
        return null;
    }
    
    leaveDungeon() {
        this.addMessage('Você tenta sair da masmorra...');
        // Implementação futura
        return null;
    }
    
    moveThroughDoor(direction) {
        const door = this.currentRoom.doors.find(d => d.direction === direction);
        if (!door) {
            this.addMessage(`Não há porta na direção ${direction}!`);
            return null;
        }
        
        this.currentRoom = this.dungeonMap.moveThroughDoor(door, this.currentRoom);
        this.addMessage(`Você se move para ${direction}...`);
        
        return {
            room: this.currentRoom,
            exits: this.dungeonMap.getAvailableExits(this.currentRoom)
        };
    }
    
    goBack() {
        const previousRoom = this.dungeonMap.goBack();
        if (previousRoom) {
            this.currentRoom = previousRoom;
            this.addMessage('Você volta para a sala anterior...');
            return {
                room: this.currentRoom,
                exits: this.dungeonMap.getAvailableExits(this.currentRoom)
            };
        }
        return null;
    }
    
    getCurrentRoom() {
        return this.currentRoom;
    }
    
    getAvailableExits() {
        return this.dungeonMap.getAvailableExits(this.currentRoom);
    }
    
    getAllRooms() {
        return Array.from(this.dungeonMap.rooms.values());
    }
    
    getCurrentPosition() {
        return this.dungeonMap.currentPosition;
    }
    
    getRecentMessages() {
        return this.messages.slice(-10);
    }
    
    addMessage(msg) {
        const timestamp = new Date().toLocaleTimeString();
        this.messages.push(`[${timestamp}] ${msg}`);
    }
    
    saveGame() {
        const saveData = {
            seed: this.seedManager.baseSeed,
            currentPosition: this.dungeonMap.currentPosition,
            rooms: Array.from(this.dungeonMap.rooms.entries()),
            gameState: this.gameState,
            messages: this.messages,
            party: this.party
        };
        
        localStorage.setItem('fad_save', JSON.stringify(saveData));
    }
    
    loadGame() {
        const saveData = JSON.parse(localStorage.getItem('fad_save'));
        if (!saveData) return false;
        
        // Note: Esta implementação é básica
        this.seedManager = new SeedManager(saveData.seed);
        this.dungeonMap = new DungeonMap(
            this.seedManager,
            this.roomGenerator,
            this.contentGenerator
        );
        
        saveData.rooms.forEach(([key, room]) => {
            this.dungeonMap.rooms.set(key, room);
        });
        
        this.dungeonMap.currentPosition = saveData.currentPosition;
        this.gameState = saveData.gameState;
        this.messages = saveData.messages || [];
        this.party = saveData.party;
        this.currentRoom = this.dungeonMap.getCurrentRoom();
        
        return true;
    }
}