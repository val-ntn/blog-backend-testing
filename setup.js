//setup.jsrm cr 

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

import User from './models/User.js';
import Post from './models/Post.js';
import Event from './models/Event.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MongoDB URI not found in .env file (check process.env.MONGODB_URI)");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function createAdmin() {
  console.log('== Admin creation ==');
  const name = await ask('Admin name: ');
  const email = await ask('Admin email: ');
  const password = await ask('Admin password: ');

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('A user with that email already exists. Skipping admin creation.');
    return existing._id;
  }

  const admin = new User({ name, email, password, role: 'admin' });
  await admin.save();
  console.log('Admin user created successfully.');
  return admin._id;
}

async function seedPosts(adminId) {
  console.log('== Seeding posts ==');

  // Clear existing posts (optional)
  await Post.deleteMany({});

  const samplePosts = [
    {
      title: 'Welcome to Our Blog',
      content: 'This is the first post on our new blog platform.',
      author: adminId,
      category: 'General',
      tags: ['intro', 'welcome'],
      deleted: false,
    },
    {
      title: 'Deleted Post Example',
      content: 'This post is soft deleted and should appear in the recycle bin.',
      author: adminId,
      category: 'Demo',
      tags: ['deleted', 'test'],
      deleted: true,
    }
  ];

  await Post.insertMany(samplePosts);
  console.log('Sample posts inserted.');
}

async function seedEvents() {
  console.log('== Seeding events ==');

  // Clear existing events (optional)
  await Event.deleteMany({});

  const sampleEvents = [
    {
      title: 'Art Fair 2025',
      startDate: new Date('2025-05-01T10:00:00Z'),
      endDate: new Date('2025-05-05T18:00:00Z'),
      location: 'Downtown Gallery',
      contact: 'info@artfair.com',
      schedule: '10:00–18:00 daily',
      costs: 'Free',
      source: 'https://artfair.com',
      iconURL: 'https://artfair.com/icon.png',
      imageURL: 'https://artfair.com/banner.jpg',
      description: 'Annual art fair showcasing local and international artists.',
      deleted: false,
    },
    {
      title: 'Deleted Music Festival',
      startDate: new Date('2025-06-10T12:00:00Z'),
      endDate: new Date('2025-06-12T22:00:00Z'),
      location: 'City Park',
      contact: 'contact@musicfest.com',
      schedule: '12:00–22:00 daily',
      costs: '€20',
      source: 'https://musicfest.com',
      iconURL: '',
      imageURL: '',
      description: 'This event is soft deleted for recycle bin testing.',
      deleted: true,
    }
  ];

  await Event.insertMany(sampleEvents);
  console.log('Sample events inserted.');
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const adminId = await createAdmin();

    await seedPosts(adminId);
    await seedEvents();

    console.log('Setup completed.');
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during setup:', err);
    rl.close();
    process.exit(1);
  }
}

main();
