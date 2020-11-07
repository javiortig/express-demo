const Joi = require('joi');

const express = require('express');
const app = express();

app.use(express.json());

let port = process.env.PORT || 3000;

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});


app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) res.status(404).send('Couldn\'t find the course');
    else res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});


app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const c = {
        id: courses.length +1,
        name: req.body.name,
    };
    courses.push(c);
    res.send(c);
});
