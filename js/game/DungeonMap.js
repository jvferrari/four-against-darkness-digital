// js/game/DungeonMap.js
class DungeonMap {
    constructor(seedManager, roomGenerator, contentGenerator) {
        this.seedManager = seedManager;
        this.roomGenerator = roomGenerator;
        this.contentGenerator = contentGenerator;
        
        // Mapa de salas: chave = "x,y", valor = objeto da sala
        this.rooms = new Map();
        this.connections = new Map(); // Conecta salas através de portas
        
        // Posição atual
        this.currentPosition = { x: 0, y: 0 };
        this.history = []; // Histórico de navegação para voltar
    }
    
    // Gera sala inicial
    generateStartingRoom(entranceRoll) {
        const room = this.generateRoomAt(0, 0, entranceRoll, true);
        this.history.push({ x: 0, y: 0 });
        return room;
    }
    
    // Gera sala em uma posição específica
    generateRoomAt(x, y, d66Code = null, isEntrance = false) {
        const key = `${x},${y}`;
        
        // Se já existe, retorna
        if (this.rooms.has(key)) {
            return this.rooms.get(key);
        }
        
        // Se não fornecer código, rola d66
        if (!d66Code) {
            const random = this.seedManager.getRandomForRoom(`${x}${y}`);
            d66Code = random.rollD66();
        }
        
        // Gera a sala
        const room = this.roomGenerator.generateRoom(d66Code, this.seedManager.getRoomSeed(d66Code));
        
        // Gera conteúdo
        room.content = this.contentGenerator.generateContent(
            d66Code, 
            isEntrance, 
            this.seedManager.getRoomSeed(`content:${d66Code}:${x}:${y}`)
        );
        
        // Posição e estado
        room.position = { x, y };
        room.isEntrance = isEntrance;
        room.explored = false;
        room.cleared = false;
        room.id = key;
        
        // Salva no mapa
        this.rooms.set(key, room);
        
        return room;
    }
    
    // Navega para uma nova sala através de uma porta
    moveThroughDoor(door, fromRoom) {
        // Determina nova posição baseada na direção da porta
        let newX = fromRoom.position.x;
        let newY = fromRoom.position.y;
        
        switch(door.direction) {
            case 'north': newY--; break;
            case 'south': newY++; break;
            case 'east': newX++; break;
            case 'west': newX--; break;
        }
        
        // Atualiza posição atual
        this.currentPosition = { x: newX, y: newY };
        
        // Adiciona ao histórico
        this.history.push({ x: newX, y: newY });
        
        // Gera ou obtém a sala
        const newRoom = this.generateRoomAt(newX, newY);
        
        // Registra conexão
        this.addConnection(fromRoom.id, newRoom.id, door);
        
        return newRoom;
    }
    
    // Volta para a sala anterior
    goBack() {
        if (this.history.length <= 1) return null;
        
        // Remove posição atual do histórico
        this.history.pop();
        
        // Pega sala anterior
        const previousPos = this.history[this.history.length - 1];
        this.currentPosition = previousPos;
        
        return this.getRoomAt(previousPos.x, previousPos.y);
    }
    
    // Adiciona conexão entre salas
    addConnection(fromRoomId, toRoomId, door) {
        const key = `${fromRoomId}:${door.direction}`;
        this.connections.set(key, toRoomId);
        
        // Também registra conexão inversa
        const reverseDir = this.getOppositeDirection(door.direction);
        const reverseKey = `${toRoomId}:${reverseDir}`;
        this.connections.set(reverseKey, fromRoomId);
    }
    
    getOppositeDirection(dir) {
        const opposites = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        return opposites[dir] || dir;
    }
    
    getRoomAt(x, y) {
        return this.rooms.get(`${x},${y}`);
    }
    
    getCurrentRoom() {
        return this.getRoomAt(this.currentPosition.x, this.currentPosition.y);
    }
    
    // Retorna portas disponíveis para navegação
    getAvailableExits(room) {
        const exits = [];
        
        // Verifica cada porta da sala
        room.doors.forEach(door => {
            // Calcula posição da porta conectada
            let targetX = room.position.x;
            let targetY = room.position.y;
            
            switch(door.direction) {
                case 'north': targetY--; break;
                case 'south': targetY++; break;
                case 'east': targetX++; break;
                case 'west': targetX--; break;
            }
            
            // Verifica se já existe uma sala lá
            const targetRoom = this.getRoomAt(targetX, targetY);
            
            exits.push({
                direction: door.direction,
                door: door,
                leadsTo: targetRoom ? 'existing' : 'new',
                targetPosition: { x: targetX, y: targetY },
                targetRoom: targetRoom
            });
        });
        
        return exits;
    }
}