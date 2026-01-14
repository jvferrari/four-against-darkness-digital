// js/game/ui/ControlsRenderer.js
class ControlsRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    render(exits, room) {
        let html = '<div class="game-controls">';
        
        // Botões de ação básicos
        if (room && room.content && !room.content.explored) {
            html += '<button class="control-btn" data-action="explore">Explorar Sala</button>';
        }
        
        html += '<button class="control-btn" data-action="search">Procurar</button>';
        html += '<button class="control-btn" data-action="rest">Descansar</button>';
        html += '<button class="control-btn" data-action="leave">Sair</button>';
        
        // Portas disponíveis
        if (exits && exits.length > 0) {
            html += '<div class="exits-section">';
            html += '<h4>Portas Disponíveis:</h4>';
            exits.forEach(exit => {
                const status = exit.leadsTo === 'existing' ? ' (visitada)' : ' (nova)';
                html += `<button class="exit-btn control-btn" data-direction="${exit.direction}">
                    ${exit.direction.toUpperCase()}${status}
                </button>`;
            });
            html += '</div>';
        }
        
        // Botão para voltar
        html += '<button class="control-btn back-btn" data-action="back">⬅ Voltar</button>';
        
        html += '</div>';
        this.container.innerHTML = html;
    }
}