/**
 * Self-Aware Snake Game
 * The snake has full awareness of its own body, position, and state
 */

class SelfAwareSnake {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game configuration
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.tileHeight = this.canvas.height / this.gridSize;
        
        // Game state
        this.snake = [];
        this.food = null;
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.showAwareness = true;
        
        // Snake self-awareness properties
        this.snakeAwareness = {
            bodySegments: [],
            headPosition: { x: 0, y: 0 },
            tailPosition: { x: 0, y: 0 },
            length: 0,
            direction: 'right',
            nextDirection: 'right',
            isGrowing: false,
            canTurn: true,
            collisionRisk: false,
            foodDirection: null
        };
        
        // Initialize game
        this.init();
    }
    
    init() {
        // Set up event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.getElementById('startBtn').addEventListener('click', this.startGame.bind(this));
        document.getElementById('pauseBtn').addEventListener('click', this.togglePause.bind(this));
        document.getElementById('toggleAwareness').addEventListener('click', this.toggleAwareness.bind(this));
        
        // Initialize snake
        this.resetSnake();
        
        // Create first food
        this.createFood();
        
        // Update UI
        this.updateStats();
    }
    
    resetSnake() {
        const centerX = Math.floor(this.tileCount / 2);
        const centerY = Math.floor(this.tileHeight / 2);
        
        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];
        
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        
        // Update snake awareness
        this.updateSnakeAwareness();
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.resetSnake();
        this.createFood();
        
        document.getElementById('startBtn').textContent = 'Restart';
        
        // Start game loop
        this.gameLoop();
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
    }
    
    toggleAwareness() {
        this.showAwareness = !this.showAwareness;
        document.getElementById('toggleAwareness').textContent = 
            this.showAwareness ? 'Hide Awareness' : 'Show Awareness';
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) {
            setTimeout(() => this.gameLoop(), 100);
            return;
        }
        
        // Update snake awareness before movement
        this.updateSnakeAwareness();
        
        // Check for collisions
        if (this.checkCollisions()) {
            this.gameOver();
            return;
        }
        
        // Move snake
        this.moveSnake();
        
        // Check if snake ate food
        this.checkFoodCollision();
        
        // Render
        this.render();
        
        // Update stats display
        this.updateStats();
        
        // Continue loop
        setTimeout(() => this.gameLoop(), 100);
    }
    
    moveSnake() {
        // Apply next direction
        this.direction = { ...this.nextDirection };
        
        // Calculate new head position
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Add new head
        this.snake.unshift(head);
        
        // Check if snake is growing (ate food)
        if (!this.snakeAwareness.isGrowing) {
            // Remove tail if not growing
            this.snake.pop();
        } else {
            // Reset growing state
            this.snakeAwareness.isGrowing = false;
        }
        
        // Update awareness after movement
        this.updateSnakeAwareness();
    }
    
    checkCollisions() {
        const head = this.snake[0];
        
        // Check wall collisions
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileHeight) {
            return true;
        }
        
        // Check self collisions (skip head)
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    checkFoodCollision() {
        const head = this.snake[0];
        
        if (this.food && head.x === this.food.x && head.y === this.food.y) {
            // Snake ate food
            this.score += 10 * this.snake.length;
            this.snakeAwareness.isGrowing = true;
            this.createFood();
            
            // Update awareness
            this.updateSnakeAwareness();
        }
    }
    
    createFood() {
        let foodPosition;
        let isValid = false;
        
        // Generate food position that doesn't overlap with snake
        while (!isValid) {
            foodPosition = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileHeight)
            };
            
            // Check if food is on snake
            isValid = true;
            for (const segment of this.snake) {
                if (segment.x === foodPosition.x && segment.y === foodPosition.y) {
                    isValid = false;
                    break;
                }
            }
        }
        
        this.food = foodPosition;
        
        // Update food direction in awareness
        this.updateSnakeAwareness();
    }
    
    handleKeyDown(e) {
        // Prevent key repeats
        if (e.repeat) return;
        
        // Only allow direction changes if snake can turn
        if (!this.snakeAwareness.canTurn) return;
        
        switch (e.key) {
            case 'ArrowUp':
                if (this.direction.y === 0) { // Prevent 180-degree turn
                    this.nextDirection = { x: 0, y: -1 };
                    this.snakeAwareness.canTurn = false;
                }
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                    this.snakeAwareness.canTurn = false;
                }
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                    this.snakeAwareness.canTurn = false;
                }
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                    this.snakeAwareness.canTurn = false;
                }
                break;
            case ' ':
                this.togglePause();
                break;
        }
    }
    
    updateSnakeAwareness() {
        if (this.snake.length === 0) return;
        
        const head = this.snake[0];
        const tail = this.snake[this.snake.length - 1];
        
        // Update basic awareness
        this.snakeAwareness = {
            bodySegments: [...this.snake],
            headPosition: { ...head },
            tailPosition: { ...tail },
            length: this.snake.length,
            direction: this.getDirectionString(this.direction),
            nextDirection: this.getDirectionString(this.nextDirection),
            isGrowing: this.snakeAwareness.isGrowing || false,
            canTurn: true, // Reset turn ability after awareness update
            collisionRisk: this.checkCollisionRisk(),
            foodDirection: this.getFoodDirection()
        };
        
        // Check if snake is about to collide with itself
        this.snakeAwareness.selfCollisionRisk = this.checkSelfCollisionRisk();
        
        // Check if snake is trapped
        this.snakeAwareness.isTrapped = this.checkIfTrapped();
    }
    
    getDirectionString(dir) {
        if (dir.x === 1) return 'right';
        if (dir.x === -1) return 'left';
        if (dir.y === -1) return 'up';
        if (dir.y === 1) return 'down';
        return 'none';
    }
    
    checkCollisionRisk() {
        if (this.snake.length < 2) return false;
        
        const head = this.snake[0];
        const nextHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        // Check if next position is in snake body (excluding tail if growing)
        for (let i = this.snakeAwareness.isGrowing ? 1 : 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            if (nextHead.x === segment.x && nextHead.y === segment.y) {
                return true;
            }
        }
        
        // Check wall collision risk
        if (nextHead.x < 0 || nextHead.x >= this.tileCount ||
            nextHead.y < 0 || nextHead.y >= this.tileHeight) {
            return true;
        }
        
        return false;
    }
    
    checkSelfCollisionRisk() {
        if (this.snake.length < 3) return false;
        
        const head = this.snake[0];
        const nextHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        // Check if next position would cause self-collision
        for (let i = 1; i < this.snake.length; i++) {
            if (nextHead.x === this.snake[i].x && nextHead.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    checkIfTrapped() {
        if (this.snake.length < 3) return false;
        
        const head = this.snake[0];
        const possibleMoves = [
            { x: head.x + 1, y: head.y },
            { x: head.x - 1, y: head.y },
            { x: head.x, y: head.y + 1 },
            { x: head.x, y: head.y - 1 }
        ];
        
        let safeMoves = 0;
        
        for (const move of possibleMoves) {
            // Check if move is valid (not wall, not snake body)
            if (move.x >= 0 && move.x < this.tileCount &&
                move.y >= 0 && move.y < this.tileHeight) {
                
                let isSafe = true;
                for (let i = 1; i < this.snake.length; i++) {
                    if (move.x === this.snake[i].x && move.y === this.snake[i].y) {
                        isSafe = false;
                        break;
                    }
                }
                
                if (isSafe) safeMoves++;
            }
        }
        
        // If only one safe move (current direction), snake is potentially trapped
        return safeMoves <= 1;
    }
    
    getFoodDirection() {
        if (!this.food) return null;
        
        const head = this.snake[0];
        const dx = this.food.x - head.x;
        const dy = this.food.y - head.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'down' : 'up';
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (subtle)
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i < this.tileHeight; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw food
        if (this.food) {
            this.ctx.fillStyle = '#ff4444';
            this.ctx.beginPath();
            this.ctx.arc(
                this.food.x * this.gridSize + this.gridSize / 2,
                this.food.y * this.gridSize + this.gridSize / 2,
                this.gridSize / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Food glow effect
            this.ctx.shadowColor = '#ff4444';
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = 'rgba(255, 68, 68, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(
                this.food.x * this.gridSize + this.gridSize / 2,
                this.food.y * this.gridSize + this.gridSize / 2,
                this.gridSize / 2 + 4,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw snake
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            const isHead = i === 0;
            const isTail = i === this.snake.length - 1;
            
            // Draw segment
            this.ctx.fillStyle = isHead ? '#00ff88' : 
                               isTail ? '#008844' : '#00aa66';
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
            
            // Add segment number for awareness visualization
            if (this.showAwareness && this.snake.length > 1) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '8px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(
                    i.toString(),
                    segment.x * this.gridSize + this.gridSize / 2,
                    segment.y * this.gridSize + this.gridSize / 2
                );
            }
            
            // Draw awareness rings around head
            if (this.showAwareness && isHead) {
                this.drawAwarenessRings(segment);
            }
        }
        
        // Draw snake eyes (direction indicator)
        if (this.snake.length > 0) {
            this.drawSnakeEyes(this.snake[0]);
        }
        
        // Draw awareness information
        if (this.showAwareness && this.snake.length > 0) {
            this.drawAwarenessInfo();
        }
    }
    
    drawAwarenessRings(head) {
        const centerX = head.x * this.gridSize + this.gridSize / 2;
        const centerY = head.y * this.gridSize + this.gridSize / 2;
        
        // Draw awareness radius (snake length * grid size)
        const awarenessRadius = this.snake.length * this.gridSize * 0.8;
        
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, awarenessRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw pulse effect
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, awarenessRadius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawSnakeEyes(head) {
        const centerX = head.x * this.gridSize + this.gridSize / 2;
        const centerY = head.y * this.gridSize + this.gridSize / 2;
        const eyeSize = this.gridSize / 4;
        
        // Draw eyes based on direction
        if (this.direction.x === 1) { // Right
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX + this.gridSize / 4, centerY - this.gridSize / 6, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(centerX + this.gridSize / 4, centerY + this.gridSize / 6, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.direction.x === -1) { // Left
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX - this.gridSize / 4, centerY - this.gridSize / 6, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(centerX - this.gridSize / 4, centerY + this.gridSize / 6, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.direction.y === -1) { // Up
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX - this.gridSize / 6, centerY - this.gridSize / 4, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(centerX + this.gridSize / 6, centerY - this.gridSize / 4, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.direction.y === 1) { // Down
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX - this.gridSize / 6, centerY + this.gridSize / 4, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(centerX + this.gridSize / 6, centerY + this.gridSize / 4, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawAwarenessInfo() {
        const head = this.snake[0];
        const x = head.x * this.gridSize + this.gridSize / 2;
        const y = head.y * this.gridSize - 10;
        
        // Draw awareness text
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x - 50, y - 30, 100, 30);
        
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Length: ${this.snake.length}`, x, y - 15);
        this.ctx.fillText(`Dir: ${this.snakeAwareness.direction}`, x, y - 5);
        
        // Draw collision warning if at risk
        if (this.snakeAwareness.collisionRisk) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            this.ctx.fillRect(x - 30, y + 5, 60, 15);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('DANGER!', x, y + 15);
        }
        
        // Draw food direction indicator
        if (this.snakeAwareness.foodDirection) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            this.ctx.fillRect(x - 25, y + 25, 50, 15);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(`Food: ${this.snakeAwareness.foodDirection}`, x, y + 32);
        }
    }
    
    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('length').textContent = this.snake.length;
        
        // Update snake stats
        document.getElementById('bodySegments').innerHTML = 
            `<strong>Body Segments:</strong> ${this.snakeAwareness.bodySegments.length} <span style="color: #00ff88">[${this.snakeAwareness.bodySegments.map(s => `(${s.x},${s.y})`).join(', ')}]</span>`;
        
        document.getElementById('headPosition').innerHTML = 
            `<strong>Head Position:</strong> (${this.snakeAwareness.headPosition.x}, ${this.snakeAwareness.headPosition.y})`;
        
        document.getElementById('direction').innerHTML = 
            `<strong>Direction:</strong> ${this.snakeAwareness.direction} (Next: ${this.snakeAwareness.nextDirection})`;
        
        document.getElementById('nextMove').innerHTML = 
            `<strong>Status:</strong> ${this.snakeAwareness.collisionRisk ? '⚠️ Collision Risk!' : '✅ Safe'} | ${this.snakeAwareness.isTrapped ? '🚫 Trapped' : '🟢 Free'} | ${this.snakeAwareness.foodDirection ? `Food → ${this.snakeAwareness.foodDirection}` : 'No food'}`;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        // Show game over message
        alert(`Game Over! Score: ${this.score}, Length: ${this.snake.length}`);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SelfAwareSnake('gameCanvas');
    
    // Expose game to console for debugging
    window.snakeGame = game;
});
