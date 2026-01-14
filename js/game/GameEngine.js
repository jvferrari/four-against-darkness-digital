// js/game/GameEngine.js
class GameEngine {
    constructor(seed = null) {
        this.seedManager = new SeedManager(seed);
        this.roomGenerator = new RoomGenerator();
        this.contentGenerator = new RoomContentGenerator();
        this.dungeonMap = new DungeonMap(
            this.seedManager,
            this.roomGenerator,
            this.contentGenerator
        );
        
        this.gameState = 'menu'; // menu, exploring, combat, inventory, etc.
        this.currentRoom = null;
    }
    
    startNewGame() {
        const entranceRoll = Math.floor(Math.random() * 6) + 1;
        this.currentRoom = this.dungeonMap.generateStartingRoom(entranceRoll);
        this.gameState = 'exploring';
        this.saveGame();
        
        return {
            room: this.currentRoom,
            exits: this.dungeonMap.getAvailableExits(this.currentRoom)
        };
    }
    
    exploreRoom() {
        if (!this.currentRoom.content.explored) {
            this.currentRoom.content.explored = true;
            this.saveGame();
            
            return {
                content: this.currentRoom.content,
                room: this.currentRoom
            };
        }
        
        return null; // Já explorada
    }
    
    moveThroughDoor(door) {
        const newRoom = this.dungeonMap.moveThroughDoor(door, this.currentRoom);
        this.currentRoom = newRoom;
        this.gameState = 'exploring';
        this.saveGame();
        
        return {
            room: newRoom,
            exits: this.dungeonMap.getAvailableExits(newRoom)
        };
    }
    
    goBack() {
        const previousRoom = this.dungeonMap.goBack();
        if (previousRoom) {
            this.currentRoom = previousRoom;
            this.saveGame();
            
            return {
                room: previousRoom,
                exits: this.dungeonMap.getAvailableExits(previousRoom)
            };
        }
        
        return null;
    }
    
    saveGame() {
        const saveData = {
            seed: this.seedManager.baseSeed,
            currentPosition: this.dungeonMap.currentPosition,
            rooms: Array.from(this.dungeonMap.rooms.entries()),
            gameState: this.gameState
        };
        
        localStorage.setItem('fad_save', JSON.stringify(saveData));
    }
    
    loadGame() {
        const saveData = JSON.parse(localStorage.getItem('fad_save'));
        if (!saveData) return false;
        
        // Recria o estado do jogo
        this.seedManager = new SeedManager(saveData.seed);
        this.dungeonMap = new DungeonMap(
            this.seedManager,
            this.roomGenerator,
            this.contentGenerator
        );
        
        // Restaura salas
        saveData.rooms.forEach(([key, room]) => {
            this.dungeonMap.rooms.set(key, room);
        });
        
        this.dungeonMap.currentPosition = saveData.currentPosition;
        this.gameState = saveData.gameState;
        this.currentRoom = this.dungeonMap.getCurrentRoom();
        
        return true;
    }
}