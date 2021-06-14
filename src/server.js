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
app.use(express.static("public"))

let participants = [];
let messages = [];
function removeParticipants(){
    for (let i = 0; i < participants.length; i++){ 
        if((Date.now() - participants[i].lastStatus) > 10000){
            let message = {
                from: '',
                to: '',
                text: '',
                type: '',
                time: ''
            }
            message.from = participants[i].name
            message.to = 'Todos'
            message.text = 'sai da sala...'
            message.type = 'status'
            message.time = (new Date()).toLocaleTimeString()
            messages = [...messages, message]
            participants = participants.filter(participant => participant.name !== participants[i].name);
        }
    }
}
setInterval(removeParticipants, 15000);

app.post("/participants", (req, res) => {
    try {
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
        participant.name = stripHtml(newMessage.name).result.trim();
        participant.lastStatus = Date.now();
        participantSchema.validate(participant)
        participants = [...participants, participant];
        messages = [...messages, message]
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
    if (!req.body.type === 'status' && !req.body.type === 'message' && !req.body.type === 'private_message'){
        res.status(404).send('Tipo de mensagem inválido')
    }
    else {
    try{
        let message = {
            from: '',
            to: '',
            text: '',
            type: '',
            time: ''
        }
        const newMessage = req.body
        message.from = stripHtml(req.headers.user).result.trim()
        message.to = stripHtml(newMessage.to).result.trim()
        message.text = stripHtml(newMessage.text).result.trim()
        message.type = stripHtml(newMessage.type).result.trim()
        message.time = (new Date()).toLocaleTimeString()
        messageSchema.validate(message);
        messages.push(message)
        res.status(200).send('Messagem enviada')
    }
    catch (error){
        res.status(404).send('Erro na validação dos dados')
    }}
})

app.get("/messages", (req, res) => {
    const filtered_messages = messages.filter(message => ((message.type === 'private_message' && message.to === req.headers.user) || message.to === 'Todos'))
    try {
        if (typeof req.query.limit != 'undefined'){
            let limit = parseInt(req.query.limit)
            res.status(200).send(filtered_messages.slice(-limit))
        }
        else {
            res.status(200).send(filtered_messages)
        }
    }
    catch {
        res.status(404).send('Erro na validação dos dados')
    }
})

app.post("/status", (req, res) => {
    if (participants.includes(req.headers.user)){
        participants.find(participant => participant.name = req.headers.name).lastStatus = Date.now();
        res.status(200).send('Status de Usuário Atualizado')
    }
    else {
        res.status(404).send("")
    }
})

app.listen(process.env.PORT || 4000) 