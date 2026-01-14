// js/game/DungeonMap.js
class DungeonMap {
    constructor(seedManager, roomGenerator, contentGenerator) {
        this.seedManager = seedManager;
        this.roomGenerator = roomGenerator;
        this.contentGenerator = contentGenerator;
        
        this.rooms = new Map();
        this.currentPosition = { x: 0, y: 0 };
        this.history = [];
    }
    
    generateStartingRoom() {
        const d66Code = 11; // Sala inicial fixa
        const seed = this.seedManager.getRoomSeed(d66Code);
        const room = this.roomGenerator.generateRoom(d66Code, seed);
        
        room.position = { x: 0, y: 0 };
        room.id = '0,0';
        room.isEntrance = true;
        room.explored = false;
        room.content = this.contentGenerator.generateContent(d66Code, true, seed);
        
        this.rooms.set('0,0', room);
        this.history.push({ x: 0, y: 0 });
        
        return room;
    }
    
    generateRoomAt(x, y, fromDirection = null) {
        const key = `${x},${y}`;
        
        if (this.rooms.has(key)) {
            return this.rooms.get(key);
        }
        
        // Gera código d66 baseado na posição
        const random = this.seedManager.getRandomForCode(`${x}${y}`);
        const d66Code = random.rollD66();
        const seed = this.seedManager.getRoomSeed(d66Code);
        
        const room = this.roomGenerator.generateRoom(d66Code, seed);
        
        room.position = { x: x, y: y };
        room.id = key;
        room.isEntrance = false;
        room.explored = false;
        room.content = this.contentGenerator.generateContent(d66Code, false, seed);
        
        this.rooms.set(key, room);
        return room;
    }
    
    moveThroughDoor(door, fromRoom) {
        let newX = fromRoom.position.x;
        let newY = fromRoom.position.y;
        
        switch(door.direction) {
            case 'north': newY--; break;
            case 'south': newY++; break;
            case 'east': newX++; break;
            case 'west': newX--; break;
        }
        
        this.currentPosition = { x: newX, y: newY };
        this.history.push({ x: newX, y: newY });
        
        return this.generateRoomAt(newX, newY, door.direction);
    }
    
    goBack() {
        if (this.history.length <= 1) return null;
        
        this.history.pop();
        const previousPos = this.history[this.history.length - 1];
        this.currentPosition = previousPos;
        
        return this.getRoomAt(previousPos.x, previousPos.y);
    }
    
    getRoomAt(x, y) {
        return this.rooms.get(`${x},${y}`);
    }
    
    getCurrentRoom() {
        return this.getRoomAt(this.currentPosition.x, this.currentPosition.y);
    }
    
    getAvailableExits(room) {
        if (!room) return [];
        
        const exits = [];
        room.doors.forEach(door => {
            let targetX = room.position.x;
            let targetY = room.position.y;
            
            switch(door.direction) {
                case 'north': targetY--; break;
                case 'south': targetY++; break;
                case 'east': targetX++; break;
                case 'west': targetX--; break;
            }
            
            const targetRoom = this.getRoomAt(targetX, targetY);
            
            exits.push({
                direction: door.direction,
                door: door,
                leadsTo: targetRoom ? 'existing' : 'new',
                targetPosition: { x: targetX, y: targetY }
            });
        });
        
        return exits;
    }
}