// Import các module cần thiết
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Khởi tạo ứng dụng Express
const app = express();

// Sử dụng bodyParser middleware
app.use(bodyParser.json());

// Kết nối tới MongoDB sử dụng Mongoose
mongoose.connect('mongodb://localhost:27017/your_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Định nghĩa schema và model cho kết quả của sinh viên
const studentResultSchema = new mongoose.Schema({
    studentId: String,
    examId: String,
    score: Number,
    answers: [String],
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const StudentResult = mongoose.model('StudentResult', studentResultSchema);

// API endpoint để lưu kết quả của sinh viên
app.post('/api/student-results', async (req, res) => {
    const { studentId, examId, score, answers } = req.body;

    try {
        const result = new StudentResult({
            studentId,
            examId,
            score,
            answers
        });

        await result.save();

        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// API endpoint để lấy kết quả của sinh viên theo studentId
app.get('/api/student-results/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const results = await StudentResult.find({ studentId });
        res.send(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Cổng lắng nghe cho server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
