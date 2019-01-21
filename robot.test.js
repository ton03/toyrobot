const Robot = require('./robot');

// Initialize robot instance to be used in test suites
let robot;
beforeEach(() => {
  robot = Object.create(Robot);
});

// Mock console.log to "disable" logging
jest.spyOn(console, 'log').mockImplementation(() => jest.fn());

describe('Set Robot position and table bounds', () => {
  test('default position at (0, 0)', () => {
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(0);
  });

  test('default direction facing NORTH', () => {
    expect(robot.dir).toBe('NORTH');
  });

  test('set position and direction at (2, 3, EAST)', () => {
    robot.setPosition(2, 3, 'EAST');
    expect(robot.xPos).toBe(2);
    expect(robot.yPos).toBe(3);
    expect(robot.dir).toBe('EAST');
  });

  test('default table bounds (5x5)', () => {
    expect(robot.xBounds).toBe(5);
    expect(robot.yBounds).toBe(5);
  });

  test('set table bounds to 10x20', () => {
    robot.setTableBounds(10, 20);
    expect(robot.xBounds).toBe(10);
    expect(robot.yBounds).toBe(20);
  });

  test('ignore when setting invalid bounds', () => {
    robot.setPosition(0, 0, 'NORTH');
    robot.setPosition(99, -99, 'KANYE');
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(0);
    expect(robot.dir).toBe('NORTH');
  });
});

describe('Robot reporting its position', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');
  });

  test('report default robot position', () => {
    robot.report();
    expect(consoleSpy).toHaveBeenCalledWith('0,0,NORTH');
  });

  test('report a pre-set robot position', () => {
    robot.setPosition(3, 3, 'SOUTH');
    robot.report();
    expect(consoleSpy).toHaveBeenCalledWith('3,3,SOUTH');
  });
});

describe('Simple robot movement and turning', () => {
  test('move north once', () => {
    robot.setPosition(0, 0, 'NORTH');
    robot.move();
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(1);
    expect(robot.dir).toBe('NORTH');
  });

  test('move south once', () => {
    robot.setPosition(0, 1, 'SOUTH');
    robot.move();
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(0);
    expect(robot.dir).toBe('SOUTH');
  });

  test('move west once', () => {
    robot.setPosition(1, 0, 'WEST');
    robot.move();
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(0);
    expect(robot.dir).toBe('WEST');
  });

  test('move east once', () => {
    robot.setPosition(0, 0, 'EAST');
    robot.move();
    expect(robot.xPos).toBe(1);
    expect(robot.yPos).toBe(0);
    expect(robot.dir).toBe('EAST');
  });

  test('facing north, turning right to face east', () => {
    robot.setPosition(0, 0, 'NORTH');
    robot.turn('RIGHT');
    expect(robot.dir).toBe('EAST');
  });

  test('facing east, turning right to face south', () => {
    robot.setPosition(0, 0, 'EAST');
    robot.turn('RIGHT');
    expect(robot.dir).toBe('SOUTH');
  });

  test('facing south, turning right to face west', () => {
    robot.setPosition(0, 0, 'SOUTH');
    robot.turn('RIGHT');
    expect(robot.dir).toBe('WEST');
  });

  test('facing west, turning right to face north', () => {
    robot.setPosition(0, 0, 'WEST');
    robot.turn('RIGHT');
    expect(robot.dir).toBe('NORTH');
  });

  test('facing north, turning left to face west', () => {
    robot.setPosition(0, 0, 'NORTH');
    robot.turn('LEFT');
    expect(robot.dir).toBe('WEST');
  });

  test('facing west, turning left to face south', () => {
    robot.setPosition(0, 0, 'WEST');
    robot.turn('LEFT');
    expect(robot.dir).toBe('SOUTH');
  });

  test('facing south, turning left to face east', () => {
    robot.setPosition(0, 0, 'SOUTH');
    robot.turn('LEFT');
    expect(robot.dir).toBe('EAST');
  });

  test('facing east, turning left to face north', () => {
    robot.setPosition(0, 0, 'EAST');
    robot.turn('LEFT');
    expect(robot.dir).toBe('NORTH');
  });

  test('error when moving from an invalid direction', () => {
    robot.dir = 'KANYE';
    expect(() => robot.move()).toThrow(/^Robot is facing an invalid direction: KANYE$/);
  });

  test('error when turning from an invalid direction', () => {
    robot.dir = 'KANYE';
    expect(() => robot.turn('LEFT')).toThrow(/^Robot is facing an invalid direction: KANYE$/);
  });

  test('error when turning to an invalid direction', () => {
    expect(() => robot.turn('KANYE')).toThrow(/^Invalid direction: KANYE$/);
  });

  test('ignore unknown commands; robot stays put', () => {
    robot.setPosition(2, 3, 'WEST');
    robot.processCommand('DAB');
    robot.processCommand('FORTNITE');
    expect(robot.xPos).toBe(2);
    expect(robot.yPos).toBe(3);
    expect(robot.dir).toBe('WEST');
  });
});

describe('Prevent robot from falling off', () => {
  test('do not fall off the west side', () => {
    robot.setPosition(0, 2, 'WEST');
    robot.move();
    robot.move();
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(2);
  });

  test('do not fall off the north side', () => {
    robot.setPosition(2, 4, 'NORTH');
    robot.move();
    robot.move();
    expect(robot.xPos).toBe(2);
    expect(robot.yPos).toBe(4);
  });

  test('do not fall off the east side', () => {
    robot.setPosition(4, 2, 'EAST');
    robot.move();
    robot.move();
    expect(robot.xPos).toBe(4);
    expect(robot.yPos).toBe(2);
  });

  test('do not fall off the south side', () => {
    robot.setPosition(2, 0, 'SOUTH');
    robot.move();
    robot.move();
    expect(robot.xPos).toBe(2);
    expect(robot.yPos).toBe(0);
  });
});

describe('Moving and turning combination', () => {
  test('move 1 cell north east', () => {
    robot.move();
    robot.turn('RIGHT');
    robot.move();
    expect(robot.xPos).toBe(1);
    expect(robot.yPos).toBe(1);
  });

  test('move a few times then teleport to a different location', () => {
    robot.move();
    robot.move();
    robot.move();
    robot.setPosition(3, 4, 'SOUTH');
    expect(robot.xPos).toBe(3);
    expect(robot.yPos).toBe(4);
    expect(robot.dir).toBe('SOUTH');
  });

  test('zigzag from north west corner to south east corner', () => {
    robot.setPosition(0, 4, 'EAST');
    robot.move();
    robot.turn('RIGHT');
    robot.move();
    robot.turn('LEFT');
    robot.move();
    robot.turn('RIGHT');
    robot.move();
    robot.turn('LEFT');
    robot.move();
    robot.turn('RIGHT');
    robot.move();
    robot.turn('LEFT');
    robot.move();
    robot.turn('RIGHT');
    robot.move();
    expect(robot.xPos).toBe(4);
    expect(robot.yPos).toBe(0);
    expect(robot.dir).toBe('SOUTH');
  });

  test('continue moving on all directions and hope not to fall off', () => {
    const charge = () => {
      for (let i = 0; i < 20; ++i) {
        robot.move();
      }
    };

    // Charge to north west corner
    charge();
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(4);

    // Charge to north east corner
    robot.turn('RIGHT');
    charge();
    expect(robot.xPos).toBe(4);
    expect(robot.yPos).toBe(4);

    // Charge to south east corner
    robot.turn('RIGHT');
    charge();
    expect(robot.xPos).toBe(4);
    expect(robot.yPos).toBe(0);

    // Charge to south west corner
    robot.turn('RIGHT');
    charge();
    expect(robot.xPos).toBe(0);
    expect(robot.yPos).toBe(0);
  });
});
