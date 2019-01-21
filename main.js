#!/usr/bin/env node
const fs = require('fs');
const Robot = require('./robot');

// Table top dimensions
// Modify this to change the table dimensions
const X_DIM = 5;
const Y_DIM = 5;

// Run the robot based on the provided data
const run = (data) => {
  const commands = data
    .split('\n')
    .map(s => s.replace(/\r/, '').trim())
    .filter(s => s.trim());
  const toyRobot = Object.create(Robot);

  // Set table bounds
  toyRobot.setTableBounds(
    X_DIM,
    Y_DIM
  );

  // Read the commands that controls the robot
  commands.forEach(command => toyRobot.processCommand(command));
};

// Read the input file
const inputFilename = process.argv[2] || 'input.txt';
fs.readFile(inputFilename, 'utf-8', (error, data) => {
  if (error) throw error;
  run(data);
});
