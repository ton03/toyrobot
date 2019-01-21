const Robot = require('./robot');

// Initialize robot instance to be used in test suites
let robot;
beforeEach(() => {
  robot = Object.create(Robot);
});

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

  test('set table bounds to 10x10', () => {
    robot.setTableBounds(10, 20);
    expect(robot.xBounds).toBe(10);
    expect(robot.yBounds).toBe(20);
  });

  test('undefined table bounds', () => {
    expect(robot.xBounds).toBeUndefined();
    expect(robot.yBounds).toBeUndefined();
  });
});

describe('Robot reporting', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');
  });

  test('report default robot position', () => {
    robot.report();
    expect(consoleSpy).toHaveBeenCalledWith('0,0,NORTH');
  });

  test('report a pre-set robot position', () => {
    robot.setPosition(6, 7, 'SOUTH');
    robot.report();
    expect(consoleSpy).toHaveBeenCalledWith('6,7,SOUTH');
  });
});
