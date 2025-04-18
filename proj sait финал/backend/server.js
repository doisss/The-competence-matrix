const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname,"static")))

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth-db');

// User model
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    dateOfBirth: { type: Date }, // Дата рождения
    direction: { 
        type: String, 
        enum: ['frontend', 'backend'] 
    },
    level: { 
        type: String, 
        enum: ['junior', 'middle', 'senior'] 
    }
}));

// Route to serve the auth.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/auth.html'));
});

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password, dateOfBirth, direction, level } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword,dateOfBirth, direction, level });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Email already exists' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'Пользователь не найден' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Неверный пароль' });
        }

        // Optionally generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
        res.send({ message: 'Авторизация успешна', token,user_data:user });
    } catch (error) {
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});
app.post('/users/:id', async (req, res) => {
    const { level, direction } = req.body;
    const userId = req.params.id;

    try {
        // Находим пользователя по ID и обновляем его уровень и направление
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { level, direction },
            { new: true, runValidators: true } // Возвращаем обновленный документ и проверяем валидность
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});