require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Driver = require("./src/models/Driver");
const Delivery = require("./src/models/Delivery");

// Function to generate a random float between min and max with specified decimal places
// function getRandomFloat(min, max, decimalPlaces = 6) {
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.floor(Math.random() * (max - min + 1) + min) / factor;
// }
function getRandomFloat(min, max, precision = 6) {
  const random = Math.random() * (max - min) + min;
  return parseFloat(random.toFixed(precision));
}

async function seed() {
  // Connect to MongoDB
  const mongoUri = process.env.MONGO_URI; // Access the MONGO_URI

  if (!mongoUri) {
    console.error(
      "MONGO_URI environment variable not found. Please check your .env file."
    );
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  // Clear existing data
  await Driver.deleteMany({});
  await Delivery.deleteMany({});
  //   await mongoose.connection.db.dropDatabase();    // empty the database

  // Create fake (Seed) drivers
  const drivers = Array.from({ length: 5 }).map(() => ({
    // name: faker.name.findName(),
    name: faker.person.fullName(),
    available: true,
    // email: faker.internet.email(),
    // phone: faker.phone.phoneNumber(),
    location: {
      type: "Point",
      //   coordinates: [
      //     faker.location.longitude(79.88, 80.85, 6),
      //     faker.location.latitude(6.6, 8.0, 6),
      //   ],
      coordinates: [getRandomFloat(79.8, 81.9), getRandomFloat(6.6, 9.8)],
      //   coordinates: [faker.location.longitude(), faker.location.latitude()],
      //   coordinates: [faker.address.longitude(), faker.address.latitude()],
      //   coordinates: [
      //     faker.address.longitude( -122.6, -122.3, 6 ), // SF-ish
      //     faker.address.latitude( 37.6, 37.9, 6 )
      //   ]
    },

    available: true,
  }));

  // Insert drivers into the database
  const createdDrivers = await Driver.insertMany(drivers);
  console.log(`${createdDrivers.length} drivers seeded.`);

  // Create fake deliveries
  //   const deliveries = Array.from({ length: 20 }).map(() => ({
  const deliveries = createdDrivers.slice(0, 3).map((d) => ({
    orderId: faker.string.uuid(),
    // driverId: faker.random.arrayElement(drivers)._id,
    driver: d._id,
    status: "assigned",
    deliveryLocation: {
      type: "Point",
      coordinates: [getRandomFloat(79.8, 81.9), getRandomFloat(6.6, 9.8)], // Random restaurant location
    },
    pickupLocation: {
      type: "Point",
      coordinates: [getRandomFloat(79.8, 81.9), getRandomFloat(6.6, 9.8)], // Random customer location
    },
    createdAt: faker.date.past(),
  }));

  // Insert deliveries into the database
  await Delivery.insertMany(deliveries);

  console.log(`${deliveries.length} deliveries seeded.`);
  console.log("Database seeded successfully!");

  // Close the connection
  //   await mongoose.connection.close();

  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database: ", err);
  process.exit(1);
});
