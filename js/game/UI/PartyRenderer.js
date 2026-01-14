// js/game/ui/PartyRenderer.js
class PartyRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    render(party) {
        if (!party || !party.getAllCharacters) {
            this.container.innerHTML = '<div class="party-status"><p>Nenhum personagem</p></div>';
            return;
        }
        
        const characters = party.getAllCharacters();
        let html = '<div class="party-status">';
        
        characters.forEach((char, index) => {
            const healthPercent = (char.currentHp / char.maxHp) * 100;
            html += `
                <div class="character-card">
                    <h5>${char.name} (${char.class})</h5>
                    <p>Nível: ${char.level}</p>
                    <p>HP: ${char.currentHp}/${char.maxHp}</p>
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${healthPercent}%"></div>
                    </div>
                    <p>Ouro: ${char.gold} PO</p>
                    <p>Status: ${char.status}</p>
                </div>
            `;
        });
        
        html += '</div>';
        this.container.innerHTML = html;
    }
}