// js/main.js
class GameApp {
    constructor() {
        this.currentScreen = 'start';
        this.gameEngine = null;
        this.party = null;
        
        this.initializeEventListeners();
        this.showScreen('start');
        
        // Verifica se há jogo salvo
        if (localStorage.getItem('fad_save')) {
            document.getElementById('load-game-btn').style.display = 'block';
        }
    }
    
    initializeEventListeners() {
        // Botões da tela inicial
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.showScreen('class-select');
            this.loadClassSelection();
        });
        
        document.getElementById('load-game-btn').addEventListener('click', () => {
            this.loadGame();
        });
        
        // Botão voltar na seleção de classes
        document.getElementById('back-to-start-btn').addEventListener('click', () => {
            this.showScreen('start');
        });
        
        // Botão confirmar party
        document.getElementById('confirm-party-btn').addEventListener('click', () => {
            this.startGameWithSelectedParty();
        });
        
        // Botão gerenciar party (na tela do jogo)
        document.getElementById('manage-party-btn').addEventListener('click', () => {
            this.showScreen('party-management');
        });
        
        // Botão fechar gerenciamento
        document.getElementById('close-party-management').addEventListener('click', () => {
            this.showScreen('game');
        });
    }
    
    showScreen(screenName) {
        // Esconde todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostra a tela solicitada
        const screenElement = document.getElementById(`${screenName}-screen`);
        if (screenElement) {
            screenElement.classList.add('active');
            this.currentScreen = screenName;
        }
    }
    
    loadClassSelection() {
        const classGrid = document.getElementById('class-grid');
        if (!classGrid) return;
        
        classGrid.innerHTML = '';
        
        // Carrega classes do arquivo JSON
        const classes = this.loadClasses();
        
        classes.forEach(cls => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.dataset.class = cls.id;
            classCard.innerHTML = `
                <span class="class-icon">${cls.icon}</span>
                <h4>${cls.name}</h4>
                <p>${cls.description}</p>
                <div class="class-stats">
                    <span>HP: ${cls.hp}</span>
                    <span>ATK: ${cls.attack}</span>
                </div>
            `;
            
            classCard.addEventListener('click', () => {
                this.selectClass(cls.id, classCard);
            });
            
            classGrid.appendChild(classCard);
        });
        
        // Limpa lista de selecionados
        const selectedList = document.getElementById('selected-classes-list');
        if (selectedList) {
            selectedList.innerHTML = '';
        }
        
        const confirmBtn = document.getElementById('confirm-party-btn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
        }
    }
    
    loadClasses() {
        // Classes básicas - em produção, carregar do JSON
        return [
            { id: 'warrior', name: 'Guerreiro', icon: '⚔️', description: 'Especialista em combate', hp: 7, attack: 1 },
            { id: 'cleric', name: 'Clérigo', icon: '🙏', description: 'Cura e combate contra mortos-vivos', hp: 5, attack: 0.5 },
            { id: 'rogue', name: 'Ladino', icon: '🗡️', description: 'Especialista em armadilhas', hp: 4, attack: 0 },
            { id: 'wizard', name: 'Bruxo', icon: '🔮', description: 'Lançador de feitiços', hp: 3, attack: 0 },
            { id: 'barbarian', name: 'Bárbaro', icon: '🪓', description: 'Fúria e força bruta', hp: 8, attack: 1 },
            { id: 'dwarf', name: 'Anão', icon: '⛏️', description: 'Resistente e ligado ao ouro', hp: 6, attack: 1 },
            { id: 'elf', name: 'Elfo', icon: '🏹', description: 'Arqueiro e mago', hp: 5, attack: 1 },
            { id: 'halfling', name: 'Halfling', icon: '🍃', description: 'Sortudo e ágil', hp: 4, attack: 0 }
        ];
    }
    
    selectClass(classId, element) {
        const selectedList = document.getElementById('selected-classes-list');
        if (!selectedList) return;
        
        const selectedClasses = selectedList.querySelectorAll('.selected-class');
        
        // Verifica se já está selecionado
        if (Array.from(selectedClasses).some(card => card.dataset.class === classId)) {
            return;
        }
        
        // Limita a 4 classes
        if (selectedClasses.length >= 4) {
            alert('Você só pode selecionar 4 classes!');
            return;
        }
        
        // Adiciona à lista de selecionados
        const selectedDiv = document.createElement('div');
        selectedDiv.className = 'selected-class';
        selectedDiv.dataset.class = classId;
        
        const classData = this.loadClasses().find(c => c.id === classId);
        selectedDiv.innerHTML = `
            <span>${classData.icon}</span>
            <span>${classData.name}</span>
            <button class="remove-class" data-class="${classId}">×</button>
        `;
        
        selectedList.appendChild(selectedDiv);
        
        // Destacar card
        element.classList.add('selected');
        
        // Atualiza contador
        const title = document.querySelector('#class-select-screen h3');
        if (title) {
            title.textContent = `Equipe Selecionada (${selectedClasses.length + 1}/4)`;
        }
        
        // Ativa botão se tiver 4 classes
        const confirmBtn = document.getElementById('confirm-party-btn');
        if (confirmBtn && selectedClasses.length + 1 === 4) {
            confirmBtn.disabled = false;
        }
        
        // Adiciona evento para remover
        selectedDiv.querySelector('.remove-class').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeSelectedClass(classId);
        });
    }
    
    removeSelectedClass(classId) {
        // Remove da lista
        const selectedElement = document.querySelector(`.selected-class[data-class="${classId}"]`);
        if (selectedElement) {
            selectedElement.remove();
        }
        
        // Remove destaque do card
        const classCard = document.querySelector(`.class-card[data-class="${classId}"]`);
        if (classCard) {
            classCard.classList.remove('selected');
        }
        
        // Atualiza contador
        const selectedCount = document.querySelectorAll('.selected-class').length;
        const title = document.querySelector('#class-select-screen h3');
        if (title) {
            title.textContent = `Equipe Selecionada (${selectedCount}/4)`;
        }
        
        // Desativa botão se não tiver 4 classes
        const confirmBtn = document.getElementById('confirm-party-btn');
        if (confirmBtn) {
            confirmBtn.disabled = selectedCount !== 4;
        }
    }
    
    startGameWithSelectedParty() {
        const selectedClasses = Array.from(
            document.querySelectorAll('.selected-class')
        ).map(div => div.dataset.class);
        
        if (selectedClasses.length !== 4) {
            alert('Selecione exatamente 4 classes!');
            return;
        }
        
        // Cria a party
        this.party = new PartyManager();
        selectedClasses.forEach(classId => {
            const classData = this.loadClasses().find(c => c.id === classId);
            this.party.addCharacter(new Character(classData));
        });
        
        // Inicia o motor do jogo
        this.gameEngine = new GameEngine();
        this.gameEngine.initialize(this.party);
        
        // Mostra tela do jogo
        this.showScreen('game');
        
        // Inicializa renderizadores
        this.initializeGameUI();
        
        // Atualiza a tela
        this.updateGameDisplay();
    }
    
    loadGame() {
        this.gameEngine = new GameEngine();
        if (this.gameEngine.loadGame()) {
            this.party = this.gameEngine.party;
            this.showScreen('game');
            this.initializeGameUI();
            this.updateGameDisplay();
            alert('Jogo carregado com sucesso!');
        } else {
            alert('Nenhum jogo salvo encontrado.');
        }
    }
    
    initializeGameUI() {
        // Inicializa renderizadores de UI
        this.roomRenderer = new RoomRenderer('current-room-container');
        this.contentRenderer = new ContentRenderer('content-container');
        this.controlsRenderer = new ControlsRenderer('controls-container');
        this.partyRenderer = new PartyRenderer('party-status');
        
        // Adiciona eventos aos controles
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('control-btn')) {
                const action = e.target.dataset.action || e.target.dataset.direction;
                this.handleControlClick(action);
            }
        });
    }
    
    handleControlClick(action) {
        if (!this.gameEngine) return;
        
        let result = null;
        
        switch(action) {
            case 'explore':
                result = this.gameEngine.exploreCurrentRoom();
                break;
            case 'search':
                this.gameEngine.searchRoom();
                break;
            case 'rest':
                this.gameEngine.rest();
                break;
            case 'leave':
                this.gameEngine.leaveDungeon();
                break;
            case 'back':
                result = this.gameEngine.goBack();
                break;
            case 'north':
            case 'south':
            case 'east':
            case 'west':
                result = this.gameEngine.moveThroughDoor(action);
                break;
        }
        
        if (result || action === 'search' || action === 'rest' || action === 'leave') {
            this.updateGameDisplay();
        }
    }
    
    updateGameDisplay() {
        if (!this.gameEngine) return;
        
        const currentRoom = this.gameEngine.getCurrentRoom();
        const exits = this.gameEngine.getAvailableExits();
        
        // Atualiza renderizações
        if (this.roomRenderer) {
            this.roomRenderer.render(currentRoom);
        }
        
        if (this.contentRenderer && currentRoom) {
            this.contentRenderer.render(currentRoom.content);
        }
        
        if (this.controlsRenderer) {
            this.controlsRenderer.render(exits, currentRoom);
        }
        
        if (this.partyRenderer) {
            this.partyRenderer.render(this.party);
        }
        
        // Atualiza mapa
        this.updateDungeonMap();
        
        // Atualiza log
        this.updateGameLog();
    }
    
    updateDungeonMap() {
        const mapContainer = document.getElementById('dungeon-map');
        if (!mapContainer || !this.gameEngine) return;
        
        const rooms = this.gameEngine.getAllRooms();
        const currentPos = this.gameEngine.getCurrentPosition();
        
        // Limpa mapa
        mapContainer.innerHTML = '';
        
        // Encontra limites do mapa
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        rooms.forEach(room => {
            minX = Math.min(minX, room.position.x);
            maxX = Math.max(maxX, room.position.x);
            minY = Math.min(minY, room.position.y);
            maxY = Math.max(maxY, room.position.y);
        });
        
        const gridSize = 20;
        const offsetX = Math.abs(minX);
        const offsetY = Math.abs(minY);
        const gridWidth = maxX - minX + 1;
        const gridHeight = maxY - minY + 1;
        
        // Configura grid CSS
        mapContainer.style.gridTemplateColumns = `repeat(${gridWidth}, ${gridSize}px)`;
        mapContainer.style.gridTemplateRows = `repeat(${gridHeight}, ${gridSize}px)`;
        
        // Preenche com células
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const cell = document.createElement('div');
                cell.className = 'map-cell';
                
                const room = this.gameEngine.dungeonMap.getRoomAt(x, y);
                if (room) {
                    if (room.isEntrance) {
                        cell.classList.add('entrance');
                        cell.title = 'Entrada';
                    } else if (room.explored) {
                        cell.classList.add('explored');
                    }
                    
                    if (x === currentPos.x && y === currentPos.y) {
                        cell.classList.add('current');
                        cell.title = `Você está aqui (${room.type})`;
                    }
                } else {
                    cell.classList.add('unexplored');
                }
                
                cell.style.gridColumn = x + offsetX + 1;
                cell.style.gridRow = y + offsetY + 1;
                mapContainer.appendChild(cell);
            }
        }
    }
    
    updateGameLog() {
        const logContainer = document.getElementById('game-log');
        if (!logContainer || !this.gameEngine) return;
        
        const messages = this.gameEngine.getRecentMessages();
        
        logContainer.innerHTML = messages.map(msg => 
            `<div class="log-message">${msg}</div>`
        ).join('');
        
        // Rola para baixo
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// Inicia a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});