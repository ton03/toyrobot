/**
 * The toy robot
 */
const Robot = {
  xPos: 0,
  yPos: 0,
  dir: 'NORTH',
  xBounds: 5,
  yBounds: 5,
  hasBeenPlaced: false,

  /**
   * Sets the position of the robot and direction where it is facing
   * @param {number} xPos Default x position
   * @param {number} yPos Default y position
   * @param {string} dir Default direction
   */
  setPosition(xPos, yPos, dir) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.dir = dir;
    this.hasBeenPlaced = true;
  },

  /**
   * Lets the robot know how big the floor area is so it doesn't fall off it
   * @param {number} xBounds X bounds
   * @param {number} yBounds Y bounds
   */
  setTableBounds(xBounds, yBounds) {
    this.xBounds = xBounds;
    this.yBounds = yBounds;
  },

  /**
   * Prints position and direction data of the robot
   */
  report() {
    console.log(`${this.xPos},${this.yPos},${this.dir}`);
  },

  /**
   * Moves the robot depending on where it is facing
   * It is also smart enough to know when not to move when it's about to fall off
   */
  move() {
    switch(this.dir) {
      case 'NORTH':
        this.yPos += (this.yPos < this.yBounds - 1 ? 1 : 0);
        return;
      case 'SOUTH':
        this.yPos -= (this.yPos > 0 ? 1 : 0);
        return;
      case 'EAST':
        this.xPos += (this.xPos < this.xBounds - 1 ? 1 : 0);
        return;
      case 'WEST':
        this.xPos -= (this.xPos > 0 ? 1 : 0);
        return;
      default:
        throw Error(`Robot is facing an invalid direction: ${this.dir}`);
    }
  },

  /**
   * Turns the robot relative to where it is currently facing
   * @param {string} direction LEFT or RIGHT turn
   */
  turn(direction) {
    if (direction !== 'LEFT' && direction !== 'RIGHT') {
      throw Error(`Invalid direction: ${direction}`);
    }
    switch(this.dir) {
      case 'NORTH':
        this.dir = (direction === 'LEFT') ? 'WEST' : 'EAST';
        return;
      case 'SOUTH':
        this.dir = (direction === 'LEFT') ? 'EAST' : 'WEST';
        return;
      case 'EAST':
        this.dir = (direction === 'LEFT') ? 'NORTH' : 'SOUTH';
        return;
      case 'WEST':
        this.dir = (direction === 'LEFT') ? 'SOUTH' : 'NORTH';
        return;
      default:
        throw Error(`Robot is facing an invalid direction: ${this.dir}`);
    }
  },

  /**
   * Processes given command
   * @param {string} command The given command
   */
  processCommand(command) {
    if (command.startsWith('PLACE')) {
      const [ xOrigin, yOrigin, direction ] = command.split(' ')[1].split(',');
      this.setPosition(
        parseInt(xOrigin, 10), // starting X
        parseInt(yOrigin, 10), // staring Y
        direction // default direction
      );
    } else if (this.hasBeenPlaced) {
      if (command === 'MOVE') {
        this.move();
      } else if (command === 'LEFT' || command === 'RIGHT') {
        this.turn(command);
      } else if (command === 'REPORT') {
        this.report();
      }
    }
  }
};

module.exports = Robot;
