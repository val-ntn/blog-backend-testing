//setup.js

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
      title: 'Chapter 1: Down the Rabbit-Hole',
      content: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it. 'And what is the use of a book,' thought Alice 'without pictures or conversation?' So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'rabbit-hole', 'fantasy'],
      deleted: false,
    },
    {
      title: 'Chapter 2: The Pool of Tears',
      content: `Curiouser and curiouser! cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English). Now I'm opening out like the largest telescope that ever was! Good-bye, feet! ... Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'tears', 'adventure'],
      deleted: false,
    },
    {
      title: 'Chapter 3: A Caucus-Race and a Long Tale',
      content: `They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them. The whole place was a perfect muddle. The birds all quarrelled at once over the order of the caucus race, and nobody could make out who was to begin. Alice thought this might be a good chance for her to get dry, so she walked a little way off, and sat down under a tree...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'caucus-race', 'animals'],
      deleted: false,
    },
    {
      title: 'Chapter 4: The Rabbit Sends in a Little Bill',
      content: `It was the White Rabbit, trotting slowly back again, and looking anxiously about as it went, as if it had lost something. Alice thought it would be quite as well to follow it, so she went a little way in the direction it was going. Suddenly the Rabbit jumped into a large rabbit-hole under the hedge, and Alice followed him down the hole, feeling very curious...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'rabbit', 'bill'],
      deleted: false,
    },
    // Soft deleted posts
    {
      title: 'Chapter 5: Advice from a Caterpillar',
      content: `The Caterpillar and Alice looked at each other for some time in silence: at last the Caterpillar took the hookah out of its mouth, and addressed her in a languid, sleepy voice. 'Who are you?' said the Caterpillar. This was not an encouraging opening for a conversation. Alice replied, rather shyly, 'I—I hardly know, sir, just at present—at least I know who I was when I got up this morning, but I think I must have been changed several times since then...'`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'caterpillar', 'advice'],
      deleted: true,
    },
    {
      title: 'Chapter 6: Pig and Pepper',
      content: `Alice went on again in a sorrowful tone, 'I wish you wouldn’t keep appearing and vanishing so suddenly: you make one quite giddy.' 'All right,' said the Duchess; 'and here’s a dish of tea, all ready for you—now, who’s to take it?' The baby was sneezing and howling and kicking about as if it couldn’t help it...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'pig', 'pepper'],
      deleted: true,
    },
    {
      title: 'Chapter 7: A Mad Tea-Party',
      content: `There was a table set out under a tree in front of the house, and the March Hare and the Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the other two were using it as a cushion. 'Have some wine,' the March Hare said in an encouraging tone. Alice looked all round the table, but there was nothing on it but tea. 'I don’t see any wine,' she remarked...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'tea-party', 'madness'],
      deleted: true,
    },
    {
      title: 'Chapter 8: The Queen’s Croquet-Ground',
      content: `The Queen had only one way of settling all difficulties, great or small. “Off with his head!” she said, without even looking round. Alice was rather puzzled by this, but she thought she had better not say anything. The soldiers were playing at croquet with flamingos for mallets and hedgehogs for balls, and the whole scene was quite absurd and chaotic...`,
      author: adminId,
      category: 'Literature',
      tags: ['alice', 'queen', 'croquet'],
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
    title: 'Mad Hatter’s Tea Party',
    startDate: new Date('2025-07-10T15:00:00Z'),
    endDate: new Date('2025-07-10T17:00:00Z'),
    location: 'Wonderland Garden',
    contact: 'mad.hatter@example.com',
    schedule: '15:00–17:00',
    costs: 'Free',
    source: 'https://example.com/wonderland/mad-hatter-tea-party',
    iconURL: 'https://example.com/wonderland/icons/tea-party.png',
    imageURL: 'https://example.com/wonderland/images/tea-party-banner.jpg',
    description: 'Join the whimsical Mad Hatter and friends for an unforgettable tea party in Wonderland.',
    deleted: false,
  },
  {
    title: 'Queen’s Croquet Game',
    startDate: new Date('2025-08-01T10:00:00Z'),
    endDate: new Date('2025-08-01T14:00:00Z'),
    location: 'Queen’s Palace Grounds',
    contact: 'queen.hearts@example.com',
    schedule: '10:00–14:00',
    costs: 'Entry ticket required',
    source: 'https://example.com/wonderland/queens-croquet',
    iconURL: 'https://example.com/wonderland/icons/croquet.png',
    imageURL: 'https://example.com/wonderland/images/croquet-banner.jpg',
    description: 'Watch the Queen of Hearts host a lively croquet match with flamingo mallets and hedgehog balls.',
    deleted: false,
  },
  {
    title: 'Cheshire Cat’s Hide and Seek',
    startDate: new Date('2025-09-05T09:00:00Z'),
    endDate: new Date('2025-09-05T12:00:00Z'),
    location: 'Wonderland Forest',
    contact: 'cheshire.cat@example.com',
    schedule: '09:00–12:00',
    costs: 'Free',
    source: 'https://example.com/wonderland/cheshire-hide-seek',
    iconURL: 'https://example.com/wonderland/icons/cheshire-cat.png',
    imageURL: 'https://example.com/wonderland/images/cheshire-cat-banner.jpg',
    description: 'A playful hide and seek game led by the mysterious Cheshire Cat in the heart of Wonderland’s forest.',
    deleted: false,
  },
  {
    title: 'The White Rabbit’s Race',
    startDate: new Date('2025-10-12T08:00:00Z'),
    endDate: new Date('2025-10-12T11:00:00Z'),
    location: 'Rabbit Hole Track',
    contact: 'white.rabbit@example.com',
    schedule: '08:00–11:00',
    costs: 'Free',
    source: 'https://example.com/wonderland/white-rabbit-race',
    iconURL: 'https://example.com/wonderland/icons/white-rabbit.png',
    imageURL: 'https://example.com/wonderland/images/white-rabbit-race.jpg',
    description: 'A fast-paced race event hosted by the White Rabbit; don’t be late!',
    deleted: false,
  },
  {
    title: 'Wonderland Chess Tournament',
    startDate: new Date('2025-11-20T13:00:00Z'),
    endDate: new Date('2025-11-20T18:00:00Z'),
    location: 'Chessboard Arena',
    contact: 'chesstourney@example.com',
    schedule: '13:00–18:00',
    costs: '€10',
    source: 'https://example.com/wonderland/chess-tournament',
    iconURL: 'https://example.com/wonderland/icons/chess.png',
    imageURL: 'https://example.com/wonderland/images/chess-banner.jpg',
    description: 'Compete in a strategic chess tournament inspired by the chess theme in Wonderland.',
    deleted: false,
  },
  // Soft deleted events
  {
    title: 'Deleted Tea Party Rehearsal',
    startDate: new Date('2024-07-01T14:00:00Z'),
    endDate: new Date('2024-07-01T15:00:00Z'),
    location: 'Secret Garden',
    contact: 'secret@example.com',
    schedule: '14:00–15:00',
    costs: 'Free',
    source: 'https://example.com/wonderland/deleted-tea-party',
    iconURL: '',
    imageURL: '',
    description: 'A soft deleted rehearsal for the tea party event.',
    deleted: true,
  },
  {
    title: 'Deleted Queen’s Banquet',
    startDate: new Date('2024-08-15T18:00:00Z'),
    endDate: new Date('2024-08-15T21:00:00Z'),
    location: 'Queen’s Castle',
    contact: 'banquet@example.com',
    schedule: '18:00–21:00',
    costs: 'Invitation only',
    source: 'https://example.com/wonderland/deleted-queens-banquet',
    iconURL: '',
    imageURL: '',
    description: 'A soft deleted exclusive banquet event hosted by the Queen of Hearts.',
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
