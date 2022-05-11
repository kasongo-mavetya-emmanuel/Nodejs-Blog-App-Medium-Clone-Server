const path = require('path');
const userRouter= require('./routes/userRoutes');
const blogRouter= require('./routes/blogRoutes');
const bookMarkRouter= require('./routes/bookMarkRoutes');


const express = require('express')
const app = express();


// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


//Route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/bookMarks', bookMarkRouter);

module.exports=app
