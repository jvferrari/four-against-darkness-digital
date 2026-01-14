// js/game/RoomGenerator.js
class RoomGenerator {
    generateRoom(d66Code, seed) {
        const random = new Random(seed);
        const tens = Math.floor(d66Code / 10);
        const units = d66Code % 10;
        
        // Determina tipo baseado no código
        const roomType = this.determineRoomType(tens, units, random);
        
        // Gera dimensões baseadas no tipo
        const dimensions = this.generateDimensions(roomType, tens, units, random);
        
        // Gera portas
        const doors = this.generateDoors(roomType, dimensions, tens, units, random);
        
        // Cria grid
        const grid = this.createGrid(dimensions, doors, roomType);
        
        return {
            d66Code,
            type: roomType,
            width: dimensions.width,
            height: dimensions.height,
            doors,
            grid,
            seed: seed // Guarda a seed para consistência
        };
    }
    
    determineRoomType(tens, units, random) {
        // Baseado no livro Four Against Darkness:
        // - Códigos específicos geram tipos específicos
        // - Vamos criar uma lógica baseada no padrão d66
        
        const patterns = [
            'corridor', 'small', 'medium', 'large', 'L-shaped', 'T-shaped',
            'circular', 'octogonal', 'irregular', 'crossroads', 'chamber'
        ];
        
        // Usa código para selecionar padrão consistentemente
        const patternIndex = ((tens * 7 + units * 11) % patterns.length);
        return patterns[patternIndex];
    }
    
    generateDimensions(roomType, tens, units, random) {
        const baseSizes = {
            'corridor': { minW: 1, maxW: 1, minH: 3, maxH: 8 },
            'small': { minW: 2, maxW: 3, minH: 2, maxH: 3 },
            'medium': { minW: 3, maxW: 5, minH: 3, maxH: 5 },
            'large': { minW: 5, maxW: 8, minH: 5, maxH: 8 },
            'L-shaped': { minW: 4, maxW: 6, minH: 4, maxH: 6 },
            'T-shaped': { minW: 5, maxW: 7, minH: 4, maxH: 5 },
            'circular': { minW: 4, maxW: 6, minH: 4, maxH: 6 },
            'octogonal': { minW: 5, maxW: 7, minH: 5, maxH: 7 },
            'irregular': { minW: 4, maxW: 7, minH: 4, maxH: 7 },
            'crossroads': { minW: 3, maxW: 3, minH: 3, maxH: 3 },
            'chamber': { minW: 4, maxW: 6, minH: 4, maxH: 6 }
        };
        
        const size = baseSizes[roomType] || baseSizes.medium;
        
        // Usa tens/units para variação consistente
        const width = size.minW + ((tens + units) % (size.maxW - size.minW + 1));
        const height = size.minH + ((tens * units) % (size.maxH - size.minH + 1));
        
        return { width, height };
    }
    
    generateDoors(roomType, dimensions, tens, units, random) {
        const doors = [];
        const { width, height } = dimensions;
        
        // Número de portas baseado no tipo e código
        let numDoors = 1 + ((tens + units) % 4); // 1-4 portas
        
        // Tipos especiais têm mais portas
        if (roomType === 'crossroads') numDoors = 4;
        if (roomType === 'corridor') numDoors = 2; // Uma em cada extremidade
        
        // Posições possíveis para portas
        const possibleDoors = [];
        
        // Norte e Sul
        for (let x = 1; x < width - 1; x++) {
            possibleDoors.push({ x, y: 0, direction: 'north' });
            possibleDoors.push({ x, y: height - 1, direction: 'south' });
        }
        
        // Leste e Oeste
        for (let y = 1; y < height - 1; y++) {
            possibleDoors.push({ x: 0, y, direction: 'west' });
            possibleDoors.push({ x: width - 1, y, direction: 'east' });
        }
        
        // Embaralha consistentemente
        for (let i = possibleDoors.length - 1; i > 0; i--) {
            const j = random.int(0, i);
            [possibleDoors[i], possibleDoors[j]] = [possibleDoors[j], possibleDoors[i]];
        }
        
        // Seleciona as primeiras numDoors portas
        for (let i = 0; i < Math.min(numDoors, possibleDoors.length); i++) {
            doors.push(possibleDoors[i]);
        }
        
        return doors;
    }
    
    createGrid(dimensions, doors, roomType) {
        const { width, height } = dimensions;
        const grid = [];
        
        for (let y = 0; y < height; y++) {
            grid[y] = [];
            for (let x = 0; x < width; x++) {
                let cellType = 'void';
                
                // Determina se é parede ou chão baseado no tipo da sala
                if (roomType === 'corridor') {
                    cellType = 'floor';
                } else if (this.isInRoomShape(x, y, width, height, roomType)) {
                    // Verifica se está na borda (parede)
                    const isBorder = x === 0 || x === width - 1 || y === 0 || y === height - 1;
                    const isDoor = doors.some(d => d.x === x && d.y === y);
                    
                    if (isBorder && !isDoor) {
                        cellType = 'wall';
                    } else {
                        cellType = 'floor';
                    }
                }
                
                grid[y][x] = cellType;
            }
        }
        
        return grid;
    }
    
    isInRoomShape(x, y, width, height, roomType) {
        switch(roomType) {
            case 'circular':
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.min(width, height) / 2;
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                return distance <= radius;
                
            case 'L-shaped':
                return (x < width - 1 && y < 2) || (y < height - 1 && x < 2);
                
            case 'T-shaped':
                const stemWidth = Math.floor(width / 3);
                return (y < 2) || (x >= stemWidth && x < width - stemWidth);
                
            case 'octogonal':
                // Simplificação: retângulo com cantos arredondados
                const margin = 1;
                return x >= margin && x < width - margin && y >= margin && y < height - margin;
                
            default: // retangular
                return true;
        }
    }
}