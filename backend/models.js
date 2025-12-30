const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    month: String,
    sales: Number,
    activeUsers: Number
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Analytics, User };