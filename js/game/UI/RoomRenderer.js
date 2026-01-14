// js/game/ui/RoomRenderer.js
class RoomRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    render(room) {
        if (!room) {
            this.container.innerHTML = '<div class="room-display"><p>Nenhuma sala carregada</p></div>';
            return;
        }
        
        let html = `
            <div class="room-display">
                <h3>Sala ${room.d66Code || 'Inicial'}</h3>
                <p>Tipo: ${room.type} (${room.width}x${room.height})</p>
        `;
        
        // Renderiza o grid da sala
        html += this.renderGrid(room);
        
        // Adiciona informações das portas
        html += `<p>Portas: ${room.doors.length}</p>`;
        
        html += `</div>`;
        this.container.innerHTML = html;
    }
    
    renderGrid(room) {
        let html = '<div class="room-grid">';
        const playerX = Math.floor(room.width / 2);
        const playerY = Math.floor(room.height / 2);
        
        for (let y = 0; y < room.height; y++) {
            html += '<div class="grid-row">';
            for (let x = 0; x < room.width; x++) {
                const cell = room.grid[y][x];
                const isDoor = room.doors.some(d => d.x === x && d.y === y);
                const isPlayer = (x === playerX && y === playerY);
                
                let cellClass = cell;
                let cellSymbol = '.';
                
                if (isPlayer) {
                    cellClass = 'player';
                    cellSymbol = 'P';
                } else if (isDoor) {
                    cellClass = 'door';
                    cellSymbol = 'D';
                } else if (cell === 'wall') {
                    cellSymbol = '#';
                } else if (cell === 'void') {
                    cellSymbol = ' ';
                    cellClass = 'void';
                }
                
                html += `<div class="cell ${cellClass}">${cellSymbol}</div>`;
            }
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
}