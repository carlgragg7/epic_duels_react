class Board {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.playerPosition = { x: 0, y: 0 }; // default position of the player
    }

    setPlayerPosition(x, y) {
      this.playerPosition.x = x;
      this.playerPosition.y = y;
    }
  }

  export default Board;
