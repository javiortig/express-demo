const debug = require('debug');
const startupDebugger = debug('app:startup');
const dbDebugger = debug('app:db');

const config = require('config');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

//Creating builtin middlewares:
app.use(express.json());
app.use(express.urlencoded( { extended: true}));
app.use(express.static('public'));
app.use(helmet());

//Creating custom Middlewares
app.use(logger.log);
app.use(logger.auth);

//Execute only if on development mode:
if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
}

// Configuration:
startupDebugger('Mail pass: ' + config.get('mail.password'));

dbDebugger('Starting db');

let port = process.env.PORT || 3000;

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.listen(port, () => {
    startupDebugger(`Listening on port ${port}...`)
});


app.get('/', (req, res) => {
    res.render('index', {title: 'My express app', message: 'Hello'});
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