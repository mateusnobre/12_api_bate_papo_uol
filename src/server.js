import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors())
app.get('/posts', request)

app.listen(process.env.PORT || 4c000)