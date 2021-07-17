// mengimpor express agar file bisa dijalankan
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// mengatur port
const PORT = process.env.PORT || 9000

// menjalankan route
const authRoutes = require('./src/routes/auth.routes');
const blogRoutes = require('./src/routes/blog.routes');

app.use(express.json()) // type JSON

// listen port
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

/* ## Ketika koneksi ke mongo atlas 
mongoose.connect('mongodb+srv://')
 .then(() => {
     app.listen(9000, () => console.log('Connection Success'));
 })
 .catch(err => console.log(err))
*/

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) =>{
    cb(null, new Date().getTime() + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true)
    } else{
        cb(null, false)
    }
}

const db = require('./src/models/index.db')
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log("Cannot connect to the database!", err)
        process.exit()
    })
    
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use(multer({storage: fileStorage,fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/v1/auth', authRoutes); 
app.use('/v1/blog', blogRoutes);

app.use((error, req, res, next) =>{
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});