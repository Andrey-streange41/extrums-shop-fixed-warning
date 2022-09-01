const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

//My files
const sequelize = require('./db/db');
const models = require('./models/models');
const router = require('./routes/index');
const errorHandlerMiddleware = require('./middlewares/errorsHandler.middleware');

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'..','static')));
app.use(fileUpload({}));

app.use(cors());

app.use('/api', router);//

//Error handling ...
app.use(errorHandlerMiddleware);

async function main(){
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT,()=>console.log(`Server started on port:${PORT}`));
    }
    catch (error) {
        console.log(error.message);
    }
}

main();
