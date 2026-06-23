# Self-Aware Snake Game

A web-based Snake game where the snake has **full awareness of itself** - it knows its body position, length, direction, and can detect potential collisions and optimal paths.

## Features

### Snake Self-Awareness
- **Body Awareness**: The snake knows the exact position of every segment in its body
- **Position Tracking**: Real-time tracking of head and tail positions
- **Length Awareness**: The snake is aware of its current length
- **Direction Knowledge**: Knows current and next movement direction
- **Collision Detection**: Can predict and avoid self-collisions
- **Trapped Detection**: Identifies when the snake is trapped with limited movement options
- **Food Awareness**: Knows the direction to the nearest food

### Visual Awareness Indicators
- Segment numbering on each body part
- Awareness rings around the snake's head showing its perception radius
- Directional eyes that indicate current movement direction
- Collision warnings when the snake is at risk
- Food direction indicators

### Game Features
- Classic Snake gameplay with arrow key controls
- Score system based on food consumed and snake length
- Pause/Resume functionality
- Toggle awareness visualization
- Real-time statistics display

## How to Play

1. **Start the Game**: Click "Start Game" button or press any arrow key
2. **Control the Snake**: Use arrow keys (↑, ↓, ←, →) to change direction
3. **Pause/Resume**: Press Space or click "Pause" button
4. **Toggle Awareness**: Click "Toggle Awareness Visualization" to show/hide awareness indicators

## Game Controls

- **Arrow Keys**: Change snake direction
- **Space**: Pause/Resume game
- **Start Game Button**: Begin new game
- **Pause Button**: Toggle pause state
- **Toggle Awareness Button**: Show/hide awareness visualization

## Technical Implementation

### Snake Awareness System

The `SelfAwareSnake` class maintains a comprehensive awareness object that tracks:

```javascript
{
    bodySegments: [{x, y}, ...],  // Array of all body segment positions
    headPosition: {x, y},         // Current head position
    tailPosition: {x, y},         // Current tail position
    length: number,               // Current snake length
    direction: string,            // Current movement direction
    nextDirection: string,        // Next planned direction
    isGrowing: boolean,           // Whether snake is growing (ate food)
    canTurn: boolean,             // Whether snake can change direction
    collisionRisk: boolean,       // Whether next move would cause collision
    selfCollisionRisk: boolean,   // Whether next move would cause self-collision
    isTrapped: boolean,           // Whether snake has limited movement options
    foodDirection: string         // Direction to nearest food
}
```

### Awareness Methods

- `updateSnakeAwareness()`: Updates all awareness properties
- `checkCollisionRisk()`: Predicts if next move would cause collision
- `checkSelfCollisionRisk()`: Checks for potential self-collision
- `checkIfTrapped()`: Determines if snake has limited safe moves
- `getFoodDirection()`: Calculates direction to nearest food

### Rendering

The game uses HTML5 Canvas for rendering with:
- Smooth animations
- Awareness visualization overlays
- Color-coded snake segments (head, body, tail)
- Glowing food with visual effects
- Grid background for better spatial awareness

## File Structure

```
self-aware-snake/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── game.js             # Main game logic and snake awareness
└── README.md           # This file
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (responsive design)
- Requires JavaScript and HTML5 Canvas support

## Development

To run locally:
1. Clone this repository
2. Open `index.html` in a web browser
3. Or use a local server: `python -m http.server 8000`

## Future Enhancements

- [ ] AI mode where snake navigates automatically using its awareness
- [ ] Multiplayer support
- [ ] Different difficulty levels
- [ ] Power-ups and special abilities
- [ ] High score system with local storage
- [ ] Mobile touch controls
- [ ] Sound effects and music
- [ ] Themes and customization options

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Created with ❤️ for demonstrating self-aware game entities.

---

**Enjoy the game and watch your snake become self-aware!** 🐍✨
