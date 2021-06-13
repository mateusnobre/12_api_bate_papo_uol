import express from 'express';
import cors from 'cors';
import { stripHtml } from "string-strip-html";
import Joi from 'joi';
const messageSchema = Joi.object({
    from: Joi.string().min(1),
    to: Joi.string().min(1),
    text: Joi.string().min(1),
    type: Joi.string().min(1),
    time: Joi.string().min(1)
})

const participantSchema = Joi.object({
    name: Joi.string().min(1),
    lastStatus: Joi.number().integer()
})

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];
const messages = [];

app.post("/participants", (req, res) => {
    try {
        participantSchema.validate(req.body)
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
        participant.name = trim(stripHtml(newMessage.name));
        participant.lastStatus = Date.now();
        participants.push(participant);
        messages.push(message)
        res.status(200).send('Usuário Cadastrado');
    }
    catch (error){
        res.status(404).send("You can't send a empty string as name");
    }
})

app.get("/participants", (req, res) => {
    res.send(participants);
})

app.post("/messages", (req, res) => {
    try{
    let message = {
        from: '',
        to: '',
        text: '',
        type: '',
        time: ''
    }
    const newMessage = req.body
    message.from = trim(stripHtml(req.headers.User))
    message.to = trim(stripHtml(newMessage.to))
    message.text = trim(stripHtml(newMessage.text))
    message.type = trim(stripHtml(newMessage.type))
    message.time = (new Date()).toLocaleTimeString()
    res.status(200).send('Messagem enviada')}
    catch (error){
        res.status(404).send('Erro na validação dos dados')
    }
})

app.listen(process.env.PORT || 4000) 