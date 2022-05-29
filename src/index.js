/*
* Dumpy's API
* https://dumpy.gq
* lol
*/



import 'dotenv/config';
import AsciiTable from 'ascii-table';
import express from 'express';
import colors from 'colors';
import db from 'quick.db';
import fs from 'node:fs';
import path, { dirname } from 'node:path';

const app = express();
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
})
app.get('/html', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(path.join('/home/ubuntu/expressapi', '/html/index.html'));
})
app.post('/', (req, res) => {
    var host = req.get('host');
    var userAgent = req.get('user-agent');
    var accept = req.get('accept');
    var acceptEncoding = req.get('accept-encoding');
    var connection = req.get('connection');
    var message = req.get('message') || req.query.message;

    console.log(('Request incoming! host: ' + host + ' useragent: ' + userAgent + ' accept: ' + accept + ' acceptEncoding: ' + acceptEncoding + ' connection: ' + connection + ' message: ' + message).rainbow);
    if (!message || message == '' || message == null) {
        console.log('No message, no save!'.red);
    } else {
        const random = Math.floor(Math.random() * 1000000) + 1;
        if (db.has(`${random}`)) {
            random = Math.floor(Math.random() * 1000000) + 1;
            db.set(random.toString(), message.replace('"', ''));
        } else {
            db.set(random.toString(), message.replace('"', ''));
        }

        console.log('Message saved!'.green);
    }
    return res.send(JSON.stringify({
        "status": message ? "Message Saved!" : "To send a message, add message:*your message* to the headers or params"
    }));
});
app.get('/', (req, res) => {
    return res.send(JSON.stringify({
        "message": "This is a simple message server. It saves messages to a database and returns them when requested. To send a message change the request to POST, and add message:*your message* to the headers",

    }))
})
app.get('/send', (req, res) => {
    var host = req.get('host');
    var userAgent = req.get('user-agent');
    var accept = req.get('accept');
    var acceptEncoding = req.get('accept-encoding');
    var connection = req.get('connection');
    var message = req.get('message') || req.query.message;

    console.log(('Request incoming! host: ' + host + ' useragent: ' + userAgent + ' accept: ' + accept + ' acceptEncoding: ' + acceptEncoding + ' connection: ' + connection + ' message: ' + message).rainbow);
    if (!message || message == '' || message == null) {
        console.log('No message, no save!'.red);
    } else {
        const random = Math.floor(Math.random() * 1000000) + 1;
        if (db.has(`${random}`)) {
            random = Math.floor(Math.random() * 1000000) + 1;
            db.set(random.toString(), message.replace('"', ''));
        } else {
            db.set(random.toString(), message.replace('"', ''));
        }

        console.log('Message saved!'.green);
    }
    return res.send(JSON.stringify({
        "status": message ? "Message Saved!" : "To send a message, add message:*your message* to the headers or params",
        "success": message ? true : false
    }));
});
app.get('/messages', (req, res) => {
    var list = [];
    var table = new AsciiTable();

    db.all().forEach(element => {
        list.push(element.data);
        table.setHeading('ID', 'Message');
        table
            .addRow(element.ID, element.data)
    });
    if (req.get('auth') === process.env.DELETE_AUTH || req.query.auth === process.env.DELETE_AUTH) {
        console.log(table.toString().green)
        return res.send(`{"messages": [${list}]}`);
    } else {

        return res.status(401).send(JSON.stringify({
            "error": "You are not authorized to see messages"
        }));
    }

})
app.post('/messages', (req, res) => {
    if (req.get('auth') === process.env.DELETE_AUTH || req.query.auth === process.env.DELETE_AUTH) {
        try {
            var values = db.all();
            console.log(values)
            values.forEach(element => {
                db.delete(element.ID)
            })
            console.log('Message deleted!'.green);

        } catch (err) {
            console.log('No message to delete'.red);
            console.log(err)
        }
        return res.send(JSON.stringify({
            "status": "Messages deleted!"
        }));
    } else {

        return res.status(401).send(JSON.stringify({
            "status": "You are not authorized to delete messages."
        }));
    }
})

app.use(function (req, res, next) {
    res.status(404);
    res.send(JSON.stringify({
        "error": "404 Not Found"
    }))
});
app.listen(process.env.PORT, () =>
    console.log(`EXPRESS app listening on port ${process.env.PORT}!`.rainbow),
);