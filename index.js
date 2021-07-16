const express = require('express');

const app = express();

app.use(() => {
    console.log('Hai')
})

app.listen(9000);