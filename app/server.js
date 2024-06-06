const express = require('express');
const kafka = require('kafka-node');

const app = express();
const port = 3000;

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

app.get('/play/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const payloads = [{ topic: 'movie-requests', messages: JSON.stringify({ movie_id: movieId }) }];

    producer.send(payloads, (err, data) => {
        if (err) {
            return res.status(500).send('Error producing message');
        }
        // Replace the following URL with your actual HLS stream URL logic
        const streamUrl = `https://your-cloudfront-url/${movieId}.m3u8`;
        res.send(streamUrl);
    });
});

app.listen(port, () => {
    console.log(`MovieSync backend running at http://localhost:${port}`);
});
