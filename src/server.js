import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];
const messages = [];

app.post("/participants", (req, res) => {
    if (typeof req.body == undefined){
        res.status(404).send("You can't send a empty body");
    }
    else if (typeof req.body.name == ''){
        res.status(404).send("You can't send a empty string as name");
    }
    else {
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
        const newMessage = req.body
        message.from = newMessage.name
        message.to = 'Todos'
        message.text = 'entra na sala...'
        message.type = 'status'
        message.time = (new Date()).toLocaleTimeString()
        participant.name = newMessage.name;
        participant.lastStatus = Date.now();
        participants.push(participant);
        messages.push(message)
        res.status(200).send('Usuário Cadastrado');
    }
})

app.get("/participants", (req, res) => {
    res.send(participants);
})

app.listen(process.env.PORT || 4000) 