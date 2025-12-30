const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Analytics, User } = require('./models');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://admin:admin123@cluster0.6yptqxm.mongodb.net/dashboardDB?appName=Cluster0')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/seed', async (req, res) => {
    try {
        await Analytics.deleteMany({});
        await User.deleteMany({});
        
        const sampleData = [
            { month: 'January', sales: 1200, activeUsers: 50 },
            { month: 'February', sales: 1900, activeUsers: 75 },
            { month: 'March', sales: 300, activeUsers: 20 },
            { month: 'April', sales: 500, activeUsers: 40 },
            { month: 'May', sales: 2000, activeUsers: 100 }
        ];
        
        const adminUser = {
            username: "admin",
            password: "password123", 
            role: "admin"
        };

        await Analytics.insertMany(sampleData);
        await User.create(adminUser);
        
        res.send("Database Seeding Complete! User 'admin' created.");
    } catch (err) {
        res.status(500).send("Error seeding database: " + err.message);
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ 
                success: true, 
                role: user.role, 
                message: "Login successful!" 
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const newUser = new User({ 
            username, 
            password, 
            role: role || 'user'
        });

        await newUser.save();

        res.json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/analytics', async (req, res) => {
    try {
        const data = await Analytics.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/analytics', async (req, res) => {
    const { month, sales, activeUsers } = req.body;
    try {
        const newData = new Analytics({ month, sales, activeUsers });
        await newData.save();
        res.json({ success: true, data: newData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/analytics/:id', async (req, res) => {
    const { id } = req.params;
    const { month, sales, activeUsers } = req.body;
    try {
        const updatedData = await Analytics.findByIdAndUpdate(
            id,
            { month, sales, activeUsers },
            { new: true }
        );
        res.json({ success: true, data: updatedData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/analytics/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Analytics.findByIdAndDelete(id);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});