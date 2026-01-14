// js/game/RoomGenerator.js
class RoomGenerator {
    generateRoom(d66Code, seed) {
        const random = new Random(seed);
        const tens = Math.floor(d66Code / 10);
        const units = d66Code % 10;
        
        // Tipos de sala básicos
        const roomTypes = ['corridor', 'small', 'medium', 'large', 'L-shaped', 'circular'];
        const roomType = roomTypes[(tens + units) % roomTypes.length];
        
        // Dimensões baseadas no tipo
        let width, height;
        if (roomType === 'corridor') {
            width = 1;
            height = 3 + random.int(0, 3);
        } else if (roomType === 'small') {
            width = 2 + random.int(0, 1);
            height = 2 + random.int(0, 1);
        } else if (roomType === 'medium') {
            width = 3 + random.int(0, 2);
            height = 3 + random.int(0, 2);
        } else {
            width = 4 + random.int(0, 2);
            height = 4 + random.int(0, 2);
        }
        
        // Gera portas (1-3 portas)
        const numDoors = 1 + random.int(0, 2);
        const doors = [];
        const possibleDirections = ['north', 'south', 'east', 'west'];
        
        for (let i = 0; i < Math.min(numDoors, possibleDirections.length); i++) {
            const dir = possibleDirections[i];
            let x, y;
            
            if (dir === 'north' || dir === 'south') {
                x = random.int(1, width - 2);
                y = dir === 'north' ? 0 : height - 1;
            } else {
                x = dir === 'west' ? 0 : width - 1;
                y = random.int(1, height - 2);
            }
            
            doors.push({
                x: x,
                y: y,
                direction: dir
            });
        }
        
        // Cria grid
        const grid = [];
        for (let y = 0; y < height; y++) {
            grid[y] = [];
            for (let x = 0; x < width; x++) {
                const isBorder = x === 0 || x === width - 1 || y === 0 || y === height - 1;
                const isDoor = doors.some(d => d.x === x && d.y === y);
                
                if (isBorder && !isDoor) {
                    grid[y][x] = 'wall';
                } else {
                    grid[y][x] = 'floor';
                }
            }
        }
        
        return {
            d66Code: d66Code,
            type: roomType,
            width: width,
            height: height,
            doors: doors,
            grid: grid
        };
    }
}