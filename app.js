const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const tasks = [
    {
        text: 'practice with nodejs',
        done: true,
    },
];

app.get('/', (req, res) => {
    res.send(`
    Implemented APIs:
    POST    /todos/add              Create a new todo item if length is 20 symbols or less
    GET     /products               Get all products
    GET     /products/:productId    Get all products
    GET     /todos/switch/:id       Switch todo done - undone status
    GET     /todos/filterdone/:done   Get filtered todos (all, done, undone)
    GET     /todos/counter          Get done - undone counter
    PUT     /todos/:id              Update a todo item
    DELETE  /todos/:id              Delete a new todo item
    `);
});

app.post('/todos/add', (req, res) => {
    try {
        const newTask = req.body;
        if (newTask.text.length > 20) {
            res.status(400);
            res.send('Task text too long');
        }
        tasks.push(newTask);
        res.send('Task added');
    }
    catch (err) {
        res.statusCode = 500;
        res.json(JSON.stringify(err));
    }
});

// getProductsList
app.get('/products', (req, res) => {
    res.send(tasks);
});

// getProductsById
app.get('/products/:productId', (req, res) => {
    const id = req.params.id;
    res.send(tasks[id]);
});

app.get('/todos/switch/:id', (req, res) => {
    const id = req.params.id;
    tasks[id].done = !tasks[id].done;
    res.send(tasks[id]);
});

app.get('/todos/filterdone/:done', (req, res) => {
    const done = req.params.done;
    const filtered = tasks.filter(item => item.done.toString() === done);
    res.send(filtered);
});

app.get('/todos/counter', (req, res) => {
    const doneCount = tasks.reduce((prev, item, i) => {
        if (item.done) {
            prev++;
        }
        return prev;
    }, 0);
    res.send(`Tasks done: ${doneCount.toString()}, tasks undone: ${tasks.length - doneCount.toString()}`);
});

app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const newTask = req.body;
    tasks.splice(id, 1, newTask)
    res.send(`${id}`);
});

app.delete('/todos/:id', (req, res) => {
    try {
        const id = req.params.id;
        if (!tasks[id]) {
            res.status(400);
            res.send(`Task with id ${id} not found`)
        }
        tasks.splice(id, 1);
        res.send(tasks);
    }
    catch (err) {
        res.statusCode = 500;
        res.json(JSON.stringify(err));
    }
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});