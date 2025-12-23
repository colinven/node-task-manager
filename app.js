#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');

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

// GET NEXT AVAILABLE ID #, IF A TASK WAS PREVIOUSLY DELETED, IT'S ID # WILL BE REUSED
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

// CREATE NEW TASK OBJ, WRITE TO TASKS.JSON
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
        console.log(`** Task Added Successfully! (ID:${newTask.id}) **`);
    } catch(e) {
        console.log(`Failed to add task: ${e}`)
    }
};

// COMMAND LINE LOGIC
const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

switch (command) {
    case "add":
        if (!commandArgs || commandArgs.length === 0){
            console.log(`Could not add task: you must provide a description.`);
            break;
        }

        addTask(commandArgs.join(" "));
        break;
    
    default:
        console.log('Unknown command');
}
