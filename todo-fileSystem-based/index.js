const { error } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const todoPath =  path.join(__dirname, 'todos.json');

const readTodos = () => {
    try {
        if(!fs.existsSync(todoPath)){
            return [];
        }
        const data = fs.readFileSync(todoPath, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error("Error reading or parsing the file:", error);
        return [];
    }
}

const writeTodos = (todos) =>{
    if (!Array.isArray(todos)) {
        console.error('Attempted to write invalid todos format. Resetting to an empty array.');
        todos = [];
    }
    fs.writeFileSync(todoPath, JSON.stringify(todos, null, 2));
};

app.get('/todos', (req,res)=> {
    const todos = readTodos();
    console.log('Todos read from file', todos);
    res.status(200).json(todos);
})

app.post('/addTodos', (req,res)=> {
    const {title} = req.body;
    if(!title){
        return res.status(400).json({error: 'Title is required'});
    }
    let todos =[];
    todos = readTodos();
    const newTodo = {id: Date.now(), title, completed: false};
    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
})

app.put('/todos/:id', (req,res)=>{
    const {id} = req.params;
    const {title,completed} = req.body;

    const todos = readTodos();
    if (!Array.isArray(todos)) {
        console.error('Invalid todos format, resetting to an empty array');
        todos = [];
      }
    const todo = todos.find(todo => todo.id === parseInt(id));

    if(!todo){
        return res.status(400).json({error: 'Todo is not found'});
    }

    if(title !== undefined) todo.title = title;
    if(completed !== undefined) todo.completed = completed;

    writeTodos(todo);

    res.status(200).json({
        message: "Todo updated successfully",
        todo: todo
    });
})

app.delete('/deleteTodo/:id', (req,res) =>{
    const {id} = req.params;

    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if(todoIndex === -1){
        return res.status(400).json({error: "Todo not found"});
    }

    const deletedTodo = todos.splice(todoIndex,1)[0];
    writeTodos(todos);

    res.status(200).json({message: "Todo is deleted successfully", todo: deletedTodo})
})

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
})

