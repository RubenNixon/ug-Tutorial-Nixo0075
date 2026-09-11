import express from 'express';

const app = express();

app.use(express.json());

const PORT = 5100;

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'API Online',
        timestamp: Date.now()
    });
});

app.post('/api/users', (req, res) => {
    const incomingData = req.body;

    res.status(201).json({
        message: "User successfully created",
        data: incomingData
    });
});

app.post('/api/search', (req, res) => {
    const queryParams = req.query;
    const bodyData = req.body;

    const combinedResult = {
        ...queryParams,
        ...bodyData
    };

    res.status(200).json(combinedResult);
});

app.listen(PORT, () => {
    console.log(`Server actively running on port ${PORT}`);
});