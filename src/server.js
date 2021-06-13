import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors())

const participants = [];
const messages = [];

let participant = {
    name: '',
    lastStatus: '',
}
let message = {
    from: '',
    to: '',
    text: '',
    type: '',
    time: ''
}
app.post("/participants", (req, res) => {
    if (req.body.name = ''){
        res.status(404).send("You can't send a empty string as name");
    }
    else {
        participant.name = req.body;
        participant.lastStatus = Date.now();
        participants.push(participant);
        res.send(participant);
    }
})

app.get("/participants", (req, res) => {
    res.send(participants);
})

app.listen(process.env.PORT || 4000)