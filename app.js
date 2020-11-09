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
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    //not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Couldn\'t find the course');
    
    else res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});


app.post('/api/courses', (req, res) => {
    //invalid
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const c = {
        id: courses.length +1,
        name: req.body.name,
    };
    courses.push(c);
    res.send(c);
});

app.put('/api/courses/:id', (req,res) =>{
    //not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Couldn\'t find the course');

    //invalid
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) =>{
    //not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Couldn\'t find the course');

    //invalid
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course); 
})



function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}