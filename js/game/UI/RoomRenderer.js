// js/game/UI/RoomRenderer.js
class RoomRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    renderRoom(room, showGrid = true) {
        let html = `
            <div class="room-display">
                <h3>Sala ${room.d66Code}</h3>
                <p>Tipo: ${room.type} (${room.width}x${room.height})</p>
        `;
        
        if (showGrid) {
            html += this.renderGrid(room);
        }
        
        html += `</div>`;
        this.container.innerHTML = html;
    }
    
    renderGrid(room) {
        let html = '<div class="room-grid">';
        
        for (let y = 0; y < room.height; y++) {
            html += '<div class="grid-row">';
            for (let x = 0; x < room.width; x++) {
                const cell = room.grid[y][x];
                const isDoor = room.doors.some(d => d.x === x && d.y === y);
                
                let cellClass = cell;
                let cellSymbol = '.';
                
                if (isDoor) {
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
    
    renderContent(content) {
        return `
            <div class="room-content">
                <h4>${content.description}</h4>
                ${content.explored ? '<p class="explored">✓ Explorada</p>' : ''}
                ${content.content ? `<pre>${JSON.stringify(content.content, null, 2)}</pre>` : ''}
            </div>
        `;
    }
    
    renderExits(exits) {
        let html = '<div class="room-exits"><h4>Saídas:</h4>';
        
        exits.forEach(exit => {
            const status = exit.leadsTo === 'existing' ? '(explorada)' : '(nova)';
            html += `
                <button class="exit-btn" data-direction="${exit.direction}">
                    ${exit.direction.toUpperCase()} ${status}
                </button>
            `;
        });
        
        // Botão para voltar
        html += `<button class="back-btn">⬅ Voltar</button>`;
        
        html += '</div>';
        return html;
    }
}