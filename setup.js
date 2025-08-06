//setup.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";

import User from "./models/User.js";
import Post from "./models/Post.js";
import Event from "./models/Event.js";
import EventReport from "./models/EventReport.js";
import Carousel from "./models/Carousel.js";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

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
    {
      title: "Chapter 1: Down the Rabbit-Hole",
      content: `<p><img style="float:left;margin-right:1em;margin-bottom:1em" src="http://localhost:5000/api/uploads/1754445520473-img14.jpg" alt="Image" width="200" />Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it. 'And what is the use of a book,' thought Alice 'without pictures or conversation?' So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies...</p>`,
      excerpt: `<p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it. 'And what is the use of a book,' thought Alice 'without pictures or conversation?...</p>`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "rabbit-hole", "fantasy"],
      views: 0,
      deleted: false,
      externalLinks: [],
    },
    {
      title: "Chapter 2: The Pool of Tears",
      content: `<p><img style="float:right;margin-right:1em;margin-bottom:1em;margin-left:1em" src="http://localhost:5000/api/uploads/1754445525488-img15.jpg" alt="Image" width="200" />Curiouser and curiouser! cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English). Now I'm opening out like the largest telescope that ever was! Good-bye, feet! ... Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can...</p>`,
      excerpt: `<p>Curiouser and curiouser! cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English). Now I'm opening out like the largest telescope that ever was! Good-bye, feet! ... Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, ...</p>`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "tears", "adventure"],
      views: 0,
      deleted: false,
      externalLinks: [],
    },
    {
      title: "Chapter 3: A Caucus-Race and a Long Tale",
      content: `<p><img style="float:left;margin-right:1em;margin-bottom:1em" src="http://localhost:5000/api/uploads/1754445487280-img9.jpg" alt="Image" width="120" />They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them. The whole place was a perfect muddle. The birds all quarrelled at once over the order of the caucus race, and nobody could make out who was to begin. Alice thought this might be a good chance for her to get dry, so she walked a little way off, and sat down under a tree...</p>`,
      excerpt: `They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them. The whole place was a perfect muddle. The birds all quarrelled at once over the order of the caucus race, and nobody could make out who was to begin....`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "caucus-race", "animals"],
      views: 0,
      deleted: false,
      externalLinks: [],
    },
    {
      title: "Chapter 4: The Rabbit Sends in a Little Bill",
      content: `<p><img style="float:right;margin-right:1em;margin-bottom:1em;margin-left:1em" src="http://localhost:5000/api/uploads/1754445551019-img20.jpg" alt="Image" width="150" />It was the White Rabbit, trotting slowly back again, and looking anxiously about as it went, as if it had lost something. Alice thought it would be quite as well to follow it, so she went a little way in the direction it was going. Suddenly the Rabbit jumped into a large rabbit-hole under the hedge, and Alice followed him down the hole, feeling very curious...</p>`,
      excerpt: `<p>It was the White Rabbit, trotting slowly back again, and looking anxiously about as it went, as if it had lost something. Alice thought it would be quite as well to follow it, so she went a little way in the direction it was going. Suddenly the Rabbit jumped into a large rabbit-hole under the hedge,...</p>`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "rabbit", "bill"],
      views: 0,
      deleted: false,
      externalLinks: [],
    },
    {
      title: "Chapter 5: Advice from a Caterpillar",
      content: `The Caterpillar and Alice looked at each other for some time...`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "caterpillar", "advice"],
      deleted: true,
    },
    {
      title: "Chapter 6: Pig and Pepper",
      content: `Alice went on again in a sorrowful tone...`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "pig", "pepper"],
      deleted: true,
    },
    {
      title: "Chapter 7: A Mad Tea-Party",
      content: `There was a table set out under a tree in front of the house...`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "tea-party", "madness"],
      deleted: true,
    },
    {
      title: "Chapter 8: The Queen’s Croquet-Ground",
      content: `The Queen had only one way of settling all difficulties...`,
      author: adminId,
      category: "Literature",
      tags: ["alice", "queen", "croquet"],
      deleted: true,
    },
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
    {
      title: "Queen’s Croquet Game",
      startDate: new Date("2025-08-01T10:00:00Z"),
      endDate: new Date("2025-08-01T14:00:00Z"),
      location: "Queen’s Palace Grounds",
      contact: "queen.hearts@example.com",
      schedule: "10:00–14:00",
      costs: "Entry ticket required",
      source: "https://example.com/wonderland/queens-croquet",
      iconURL: "https://example.com/wonderland/icons/croquet.png",
      imageURL: "https://example.com/wonderland/images/croquet-banner.jpg",
      description:
        "Watch the Queen of Hearts host a lively croquet match with flamingo mallets and hedgehog balls.",
      deleted: false,
    },
    {
      title: "Cheshire Cat’s Hide and Seek",
      startDate: new Date("2025-09-05T09:00:00Z"),
      endDate: new Date("2025-09-05T12:00:00Z"),
      location: "Wonderland Forest",
      contact: "cheshire.cat@example.com",
      schedule: "09:00–12:00",
      costs: "Free",
      source: "https://example.com/wonderland/cheshire-hide-seek",
      iconURL: "https://example.com/wonderland/icons/cheshire-cat.png",
      imageURL: "https://example.com/wonderland/images/cheshire-cat-banner.jpg",
      description:
        "A playful hide and seek game led by the mysterious Cheshire Cat.",
      deleted: false,
    },
    {
      title: "The White Rabbit’s Race",
      startDate: new Date("2025-10-12T08:00:00Z"),
      endDate: new Date("2025-10-12T11:00:00Z"),
      location: "Rabbit Hole Track",
      contact: "white.rabbit@example.com",
      schedule: "08:00–11:00",
      costs: "Free",
      source: "https://example.com/wonderland/white-rabbit-race",
      iconURL: "https://example.com/wonderland/icons/white-rabbit.png",
      imageURL: "https://example.com/wonderland/images/white-rabbit-race.jpg",
      description:
        "A fast-paced race event hosted by the White Rabbit; don’t be late!",
      deleted: false,
    },
    {
      title: "Wonderland Chess Tournament",
      startDate: new Date("2025-11-20T13:00:00Z"),
      endDate: new Date("2025-11-20T18:00:00Z"),
      location: "Chessboard Arena",
      contact: "chesstourney@example.com",
      schedule: "13:00–18:00",
      costs: "€10",
      source: "https://example.com/wonderland/chess-tournament",
      iconURL: "https://example.com/wonderland/icons/chess.png",
      imageURL: "https://example.com/wonderland/images/chess-banner.jpg",
      description:
        "Compete in a strategic chess tournament inspired by Wonderland.",
      deleted: false,
    },
    {
      title: "Deleted Tea Party Rehearsal",
      startDate: new Date("2024-07-01T14:00:00Z"),
      endDate: new Date("2024-07-01T15:00:00Z"),
      location: "Secret Garden",
      contact: "secret@example.com",
      schedule: "14:00–15:00",
      costs: "Free",
      source: "https://example.com/wonderland/deleted-tea-party",
      iconURL: "",
      imageURL: "",
      description: "A soft deleted rehearsal for the tea party event.",
      deleted: true,
    },
    {
      title: "Deleted Queen’s Banquet",
      startDate: new Date("2024-08-15T18:00:00Z"),
      endDate: new Date("2024-08-15T21:00:00Z"),
      location: "Queen’s Castle",
      contact: "banquet@example.com",
      schedule: "18:00–21:00",
      costs: "Invitation only",
      source: "https://example.com/wonderland/deleted-queens-banquet",
      iconURL: "",
      imageURL: "",
      description:
        "A soft deleted exclusive banquet hosted by the Queen of Hearts.",
      deleted: true,
    },
  ];

  await Event.insertMany(sampleEvents);
  console.log("Sample events inserted.");
}

async function seedCarousel() {
  await Carousel.deleteMany({});

  // Read filenames from the uploads directory
  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((file) => file.match(/\.jpg$/)) // only jpg images
    .slice(0, 20); // limit to 20 images

  const images = files.map(
    (file) => `http://localhost:5000/api/uploads/${file}`
  );

  const carousel = new Carousel({
    title: "Carousel",
    images,
    type: "multi-row",
    deleted: false,
  });

  await carousel.save();
  console.log("✅ Carousel inserted with real image files.");
}

async function seedEventReports(adminId) {
  console.log("== Seeding event reports ==");

  await EventReport.deleteMany({});

  // Find the corresponding event by title
  const event = await Event.findOne({ title: "Mad Hatter’s Tea Party" });
  if (!event) {
    console.error("Event not found for event report seeding.");
    return;
  }

  const report = new EventReport({
    event: event._id,
    title: "Mad Hatter’s Tea Party Recap",
    content: `<p><img class="_imageHighlighted_ji277_49" style="float: right; margin-left: 1em; margin-bottom: 1em; margin-right: 1em;" src="http://localhost:5000/api/uploads/1754445433628-img2.jpg" width="150"></p>
<p>The Mad Hatter’s tea party was a wild and whimsical event, full of laughter and unusual conversations.</p>
<p>There was a table set out under a tree in front of the house, and the March Hare and the Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the other two were using it as a cushion, resting their elbows on it, and talking over its head. “Very uncomfortable for the Dormouse,” thought Alice; “only, as it’s asleep, I suppose it doesn’t mind.”</p>
<p>The table was a large one, but the three were all crowded together at one corner of it: “No room! No room!” they cried out when they saw Alice coming. “There’s <em>plenty</em> of room!” said Alice indignantly, and she sat down in a large arm-chair at one end of the table.</p>
<p>“Have some wine,” the March Hare said in an encouraging tone.</p>`,
    excerpt: "A fun and whimsical tea party hosted by the Mad Hatter.",
    author: adminId,
    tags: [],
    externalLinks: [],
    deleted: false,
    deletedByEvent: false,
  });

  await report.save();
  console.log("Event report inserted.");
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const adminId = await createAdmin();

    await seedPosts(adminId);
    await seedEvents();
    await seedCarousel();
    await seedEventReports(adminId); // 👈 add this line

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
