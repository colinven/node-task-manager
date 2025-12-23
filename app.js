#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function readTasks() {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

function writeTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

function getNextId() {
    const tasks = readTasks();
    const allCurrentIds = tasks.map((task) => task.id);
    if (allCurrentIds) {
        for (const taskId of allCurrentIds) {
            if (!allCurrentIds.includes(taskId + 1)) {
            return taskId + 1;
            }
        }
    }
    return 1;
    
}
console.log(getNextId())

function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: getNextId(),
        description: description,
        status: 'todo',
        createdAt: new Date(),
        updatedAt: null
    }
    try {
        tasks.push(newTask);
        writeTasks(tasks);
        console.log(`${colors.green}** Task Added Successfully! (ID:${newTask.id}) **${colors.reset}`);
    } catch(e) {
        console.log(`${colors.red}Failed to add task: ${e}${colors.reset}`)
    }
};

