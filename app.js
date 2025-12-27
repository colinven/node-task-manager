#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const dataDir = path.join(os.homedir(), ".task-manager");
const tasksFilePath = path.join(dataDir, 'tasks.json');

function ensureDataDirExists() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}
function readTasks() {
    ensureDataDirExists();
    
    if (!fs.existsSync(tasksFilePath)) {
        return [];
    }
    const fileContents = fs.readFileSync(tasksFilePath, 'utf8');

    try {
        const tasks = JSON.parse(fileContents);
        if (!Array.isArray(tasks)){
            return [];
        }
        return tasks;
    } catch (error){
        console.error("Warning: Could not parse tasks.json, starting with an empty task list.")
        return [];
    }
};

function writeTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

//need to fix this function, iterations start at lowest number, meaning smaller nums will not be reused
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
};

function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: getNextId(),
        description: description,
        status: 'todo',
        createdAt: new Date(),
        updatedAt: null
    }
    if (description === ''){
        console.log("Could not add task: you must provide a description.");
        return;
    }
    try {
        tasks.push(newTask);
        writeTasks(tasks);
        console.log(`** Task Added Successfully! (ID:${newTask.id}) **`);
    } catch(error) {
        console.error(`Failed to add task: ${error}`)
    }
};

function listTasks(taskStatus) {
    const tasks = readTasks();
    const validStatuses = ['todo', 'in-progress', 'done', ''];
    if (!validStatuses.includes(taskStatus)){
        console.log("Could not list tasks: you must provide a valid status.\nValid Statuses: (todo, in-progress, done)");
        return;
    }
    if (taskStatus === '') {
        tasks.forEach((task) => console.log(`------\nDescription: ${task.description}\nStatus: ${task.status}\nTask ID: ${task.id}\n`));
    } else {
        const selectedTasks = tasks.filter((task) => task.status === taskStatus);
        selectedTasks.forEach((task) => {
            console.log(`------\nDescription: ${task.description}\nStatus: ${task.status}\nTask ID: ${task.id}\n`);
        }) 
    }
};

function deleteTask(id){
    const tasks = readTasks();

    if (typeof id !== "number" || Number.isNaN(id)){
        console.log('Could not delete task: you must provide a valid task id number.');
        return;
    };

    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        console.log(`Could not delete task: task with id ${id} was not found.`);
        return;
    }
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    console.log(`** Task ${deletedTask.id} Successfully Deleted **`);
}

function updateTask(id, newDesc) {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
        console.log(`Could not update task: could not find task with id ${id}.`);
        return;
    } else if (newDesc === ''){
        console.log('Could not update task: please provide a valid description.');
        return;
    } else {
        const updatedTask = tasks[taskIndex]
        updatedTask.description = newDesc;
        updatedTask.updatedAt = new Date();
        writeTasks(tasks);
        console.log(`** Successfully Updated Task ID ${id}**`)
    }
};

function changeStatus(status, id) {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (id === '') {
        console.log('Could not update task: please provide a valid id.');
        return;
    };
    if (taskIndex === -1) {
        console.log(`Could not update task: could not find task with id ${id}.`);
        return;
    };
    const updatedTask = tasks[taskIndex];
    if (status === "mark-in-progress") {
        updatedTask.status = "in-progress";
    }
    if (status === "mark-done") {
        updatedTask.status = "done";
    }
    updatedTask.updatedAt = new Date();
    console.log(`** Successfully Updated Task ID ${id}**`);
    writeTasks(tasks);
}


// COMMAND LINE LOGIC
const args = process.argv.slice(2);
const command = args[0].toLowerCase();
const commandArgs = args.slice(1);
const argsFormatted = commandArgs.join(" ").trim();

switch (command) {
    case "add":
        addTask(argsFormatted);
        break;

    case "list":
        listTasks(argsFormatted);
        break;
        
    case "delete":
        deleteTask(+argsFormatted);
        break;

    case "update":
        updateTask(+commandArgs[0], commandArgs.slice(1).join(" "));
        break;

    case "mark-in-progress":
        changeStatus("mark-in-progress", +commandArgs[0]);
        break;

    case "mark-done":
        changeStatus("mark-done", +commandArgs[0]);
        break;

    default:
        console.log('Unknown command');
}
