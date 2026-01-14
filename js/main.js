// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const gameEngine = new GameEngine();
    const roomRenderer = new RoomRenderer('room-container');
    const contentRenderer = new ContentRenderer('content-container');
    const controlsRenderer = new ControlsRenderer('controls-container');
    
    let currentRoom = null;
    let currentExits = [];
    
    // Inicia novo jogo
    document.getElementById('new-game-btn').addEventListener('click', () => {
        const result = gameEngine.startNewGame();
        currentRoom = result.room;
        currentExits = result.exits;
        
        updateDisplay();
    });
    
    // Carrega jogo salvo
    document.getElementById('load-game-btn').addEventListener('click', () => {
        if (gameEngine.loadGame()) {
            currentRoom = gameEngine.currentRoom;
            currentExits = gameEngine.dungeonMap.getAvailableExits(currentRoom);
            updateDisplay();
        }
    });
    
    // Explora sala atual
    document.getElementById('explore-btn').addEventListener('click', () => {
        const result = gameEngine.exploreRoom();
        if (result) {
            updateDisplay();
        }
    });
    
    // Navegação por portas (delegação de eventos)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('exit-btn')) {
            const direction = e.target.dataset.direction;
            const door = currentRoom.doors.find(d => d.direction === direction);
            
            if (door) {
                const result = gameEngine.moveThroughDoor(door);
                currentRoom = result.room;
                currentExits = result.exits;
                updateDisplay();
            }
        }
        
        if (e.target.classList.contains('back-btn')) {
            const result = gameEngine.goBack();
            if (result) {
                currentRoom = result.room;
                currentExits = result.exits;
                updateDisplay();
            }
        }
    });
    
    function updateDisplay() {
        // Renderiza sala
        roomRenderer.renderRoom(currentRoom);
        
        // Renderiza conteúdo
        if (currentRoom.content.explored) {
            contentRenderer.renderContent(currentRoom.content);
        } else {
            contentRenderer.renderHidden();
        }
        
        // Renderiza controles
        controlsRenderer.renderExits(currentExits);
        
        // Botão de exploração só se não explorada
        document.getElementById('explore-btn').style.display = 
            currentRoom.content.explored ? 'none' : 'block';
    }
    
    // Inicia com um jogo novo automaticamente (para teste)
    const result = gameEngine.startNewGame();
    currentRoom = result.room;
    currentExits = result.exits;
    updateDisplay();
});