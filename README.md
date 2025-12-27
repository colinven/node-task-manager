# A lightweight, file-based CLI Task Manager built with Node.js

#### This is a simple task manager application which allows you to:
-Add tasks to your to-do list.
-Update Task descriptions.
-Change task statuses from "todo", to "in-progress", or "done".
-List all tasks, or filter tasks by status.
-Delete tasks.

#### Tasks are stored locally in a user-specific directory `~/.task-manager/tasks.json` so the tool works cleanly across macOS, Linux, and Windows.

## Installation:

1. Clone or download this repository.

2. Install globally: 
```bash
npm install -g .
```

3. After installation, the command `task-manager` becomes available system-wide.

## Usage

The general format is:
```bash
task-manager <command> [arguments]
```

### Commands

#### 1. Add a Task

```bash
task-manager add "Get coffee"
```

Creates a new task with:
-A unique ID
-A description
-Status `todo`
-Timestamps

#### 2. List Tasks

List all tasks:
```bash
task-manager list
```

List tasks by status:
```bash
task-manager list todo
task-manager list in-progress
task-manager list done
```

#### 3. Delete a Task

```bash
task-manager delete <id>
```

Example:
```bash
task-manager delete 4
```

#### 4. Update a Task Description

```bash
task-manager update <id> "New description here"
```

Example:
```bash
task-manager update 2 "Finish writing documentation"
```

#### 5. Change Task Status

__Mark as in-progress:__
```bash
task-manager mark-in-progress <id>
```

__Mark as done:__
```bash
task-manager mark-done <id>
```

Example:
```bash
task-manager mark-done 4
```

## Task Structure

Each task in `tasks.json` looks like:
```json
{
    "id": 3,
    "description": "Buy groceries",
    "status": "todo",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": null
}
```