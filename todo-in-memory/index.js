const express = require('express');

const app = express();

app.use(express.json());

let todos = [];
let currentId = 1;

app.get('/', (req,res)=>{
    res.status(200).json({
        message: "Simple todo app with add,update,delete functionality"
    })
})

app.post('/addTodos', (req,res) => {
    const {title} = req.body;

    if(!title){
        res.status(400).json({error: "Title is required"});
    }

    const newTodo = {
        id: currentId++,
        title: title,
        completed: false
    }

    todos.push(newTodo);

    res.status(201).json({
        message: "Todo added successfully",
        todo: newTodo
    })
})

app.get('/todos', (req,res)=> {
    res.status(200).json({
        message: 'Todo retrieved successfully',
        todos: todos
    })
})

app.put('/todo/:id', (req,res)=> {
    const {id} = req.params;
    const {title, completed} = req.body;

    const todo = todos.find(todo => todo.id === parseInt(id));

    if(!todo){
        res.status(404).json({error: 'Todo is not found'})
    }

    if(title !== undefined){
        todo.title = title;
    }

    if(completed !== undefined){
        todo.completed = completed;
    }

    res.status(200).json({
        message: "Todo updated successfully",
        todo: todo
    })
})

app.delete('/deleteTodo/:id', (req,res)=> {
    const {id} = req.params;

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if(todoIndex === -1){
        res.status(404).json({error: 'Todo is not found'});
    }

    const deletedTodo = todos.splice(todoIndex,1)[0];

    res.status(200).json({
        message: "Todo is deleted successfully",
        todo: deletedTodo
    })
})

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`);
});