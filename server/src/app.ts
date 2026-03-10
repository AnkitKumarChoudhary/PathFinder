import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Career Counselling Portal API is running',
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
