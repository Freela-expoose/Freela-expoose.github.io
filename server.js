//Install express server
const compression = require('compression')
const express = require('express');
const path = require('path');

const port = process.env.PORT || 8080;
const app = express();

app.use(compression())

// Serve only the static files form the dist directory
// The __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('ping', (req, res) => {
    return res.send('pong');
});

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(port);