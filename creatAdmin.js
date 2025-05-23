// createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // adjust the path if needed
import readline from 'readline';

// Load environment variables from .env
dotenv.config();

// Get URI from .env
const MONGO_URI = process.env.MONGODB_URI; // or whatever your variable is named

if (!MONGO_URI) {
  console.error("MongoDB URI not found in .env file (check process.env.MONGO_URI)");
  process.exit(1);
}

// Create a readline interface for CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const name = await ask('Admin name: ');
    const email = await ask('Admin email: ');
    const password = await ask('Admin password: ');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('A user with that email already exists.');
      process.exit(0);
    }

    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    console.log('Admin user created successfully.');

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
