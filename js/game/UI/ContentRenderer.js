// js/game/ui/ContentRenderer.js
class ContentRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    render(content) {
        if (!content) {
            this.container.innerHTML = '<div class="content-display"><p>Nenhum conteúdo ainda.</p></div>';
            return;
        }
        
        let html = `<div class="content-display">
            <h4>${content.description}</h4>
            <p>${content.explored ? '✓ Explorada' : 'Não explorada'}</p>`;
        
        if (content.content) {
            if (content.type === 'treasure' && content.content.gold) {
                html += `<p>Ouro encontrado: ${content.content.gold} PO</p>`;
            } else if (content.type === 'monster') {
                html += `<p>${content.content.count} ${content.content.type}(s) nível ${content.content.level}</p>`;
            }
        }
        
        html += '</div>';
        this.container.innerHTML = html;
    }
}