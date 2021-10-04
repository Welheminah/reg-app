const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const pg = require('pg');
const Pool = pg.Pool;

const regPlate = require('./reg-factory');
// const routes = reqire('./routes');

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codexx:pg123@localhost:5432/my_reg';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const app = express();

const regInstance = regPlate(pool);

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));


const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts',

});

app.use(flash());
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

app.use(express.static('public'));


app.get("/", async function (req, res) {
    const regList = await regInstance.getReg()
    res.render("index",{
        regNumbers: regList
    });
});



app.post('/reg_numbers', async(req, res) => {
    
    const numPlate = req.body.regNo;
   await regInstance.addReg(numPlate)
    console.log(numPlate);
    res.redirect('/');
});



app.post('/reset', async(req, res) => {
    await regInstance.clear()

    res.redirect('/');
});

app.get('/error-msg', function (req, res) {
    req.flash('info', 'Flash Message Added');
    res.redirect('/');
});



// app.post('/reg_numbers', (req, res) => {
    
//     res.redirect('/');
// });



const PORT = process.env.PORT || 3017;

app.listen(PORT, function () {
    console.log("App started:", PORT)
})