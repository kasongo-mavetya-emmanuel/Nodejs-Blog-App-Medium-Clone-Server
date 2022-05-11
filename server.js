const dotenv = require('dotenv');
const mongoose= require('mongoose')

dotenv.config({path: './config.env'});
const app= require('./app');

mongoose.connect(process.env.DATABASE_LOCAL)
.then(() => console.log('DB connection successful!'));


const port = process.env.PORT ||3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))