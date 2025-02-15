const express = require('express')
const mainRouter = require("./routes/index");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1',mainRouter);


const Ports = 3000;

app.listen(Ports,() => {
    console.log(`express is listening on ${Ports}`)
});