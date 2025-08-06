//backend/setup.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";

import User from "./models/User.js";
import Post from "./models/Post.js";
import Event from "./models/Event.js";
import EventReport from "./models/EventReport.js";
import Carousel from "./models/Carousel.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error(
    "MongoDB URI not found in .env file (check process.env.MONGODB_URI)"
  );
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function createAdmin() {
  console.log("== Admin creation ==");
  const name = await ask("Admin name: ");
  const email = await ask("Admin email: ");
  const password = await ask("Admin password: ");

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(
      "A user with that email already exists. Skipping admin creation."
    );
    return existing._id;
  }

  const admin = new User({ name, email, password, role: "admin" });
  await admin.save();
  console.log("Admin user created successfully.");
  return admin._id;
}

async function seedPosts(adminId) {
  console.log("== Seeding posts ==");

  await Post.deleteMany({});

  const samplePosts = [
    // ... (same posts as before)
  ];

  await Post.insertMany(samplePosts);
  console.log("Sample posts inserted.");
}

async function seedEvents() {
  console.log("== Seeding events ==");

  await Event.deleteMany({});

  const sampleEvents = [
    {
      title: "Mad Hatter’s Tea Party",
      startDate: new Date("2025-07-10T15:00:00Z"),
      endDate: new Date("2025-07-10T17:00:00Z"),
      location: "Wonderland Garden",
      contact: "mad.hatter@example.com",
      schedule: "15:00–17:00",
      costs: "Free",
      source: "https://example.com/wonderland/mad-hatter-tea-party",
      iconURL: "https://example.com/wonderland/icons/tea-party.png",
      imageURL: "https://example.com/wonderland/images/tea-party-banner.jpg",
      description:
        "Join the whimsical Mad Hatter and friends for an unforgettable tea party in Wonderland.",
      deleted: false,
    },
    // ... (other events as before)
  ];

  const insertedEvents = await Event.insertMany(sampleEvents);
  console.log("Sample events inserted.");

  return insertedEvents;
}

async function seedEventReports(insertedEvents, adminId) {
  console.log("== Seeding event reports ==");

  await EventReport.deleteMany({});

  // Find the Mad Hatter's Tea Party event ID
  const madHatterEvent = insertedEvents.find(
    (e) => e.title === "Mad Hatter’s Tea Party"
  );
  if (!madHatterEvent) {
    console.error("Mad Hatter’s Tea Party event not found!");
    return;
  }

  const madHatterEventId = madHatterEvent._id;

  await EventReport.create({
    event: madHatterEventId,
    title: "Mad Hatter’s Tea Party Recap",
    content: `<p><img class="_imageHighlighted_ji277_49" style="float: right; margin-left: 1em; margin-bottom: 1em; margin-right: 1em;" src="http://localhost:5000/api/uploads/1754445433628-img2.jpg" width="150"></p>
<p>The Mad Hatter’s tea party was a wild and whimsical event, full of laughter and unusual conversations.</p>
<p>There was a table set out under a tree in front of the house, and the March Hare and the Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the other two were using it as a cushion, resting their elbows on it, and talking over its head. “Very uncomfortable for the Dormouse,” thought Alice; “only, as it’s asleep, I suppose it doesn’t mind.”</p>
<p>The table was a large one, but the three were all crowded together at one corner of it: “No room! No room!” they cried out when they saw Alice coming. “There’s <em>plenty</em> of room!” said Alice indignantly, and she sat down in a large arm-chair at one end of the table.</p>
<p>“Have some wine,” the March Hare said in an encouraging tone.</p>`,
    author: adminId,
    excerpt: "A fun and whimsical tea party hosted by the Mad Hatter.",
    tags: [],
    externalLinks: [],
    deleted: false,
    deletedByEvent: false,
  });

  console.log("Sample event report inserted.");
}

async function seedCarousel() {
  await Carousel.deleteMany({});
  const carousel = new Carousel({
    title: "Carousel",
    images: Array.from(
      { length: 20 },
      (_, i) =>
        `http://localhost:5000/api/uploads/17544455${(1000 + i * 500)
          .toString()
          .padStart(4, "0")}-img${i + 1}.jpg`
    ),
    type: "multi-row",
    deleted: false,
  });
  await carousel.save();
  console.log("Carousel inserted.");
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const adminId = await createAdmin();

    await seedPosts(adminId);
    const insertedEvents = await seedEvents();
    await seedEventReports(insertedEvents, adminId);
    await seedCarousel();

    console.log("Setup completed.");
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error during setup:", err);
    rl.close();
    process.exit(1);
  }
}

main();
