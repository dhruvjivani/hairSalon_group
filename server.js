const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

// Initialize Express app and MongoDB configurations
const app = express();
const PORT = 3001;
const MONGO_URI = "mongodb+srv://admin:admin@cluster0.kclkr.mongodb.net/";
const DATABASE_NAME = "hairSalonDB";

// Middleware for parsing request bodies and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for relevant folders
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/javascript", express.static(path.join(__dirname, "javascript")));
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/pages", express.static(path.join(__dirname, "pages")));

// Function to establish MongoDB connection
async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client.db(DATABASE_NAME);
}

// ======== PAGE ROUTES ========
// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

// About Page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "about.html"));
});

// Contact Page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "contact.html"));
});

// Service Page
app.get("/service", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "service.html"));
});

// Location Page
app.get("/location", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "location.html"));
});

// services
app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "services.html"));
});

// registerClient
app.get("/registerClient", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "registerClient.html"));
});

// appointment
app.get("/appointment", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "appointment.html"));
});

// login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "login.html"));
});

// signin
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "signup.html"));
});

// Forgot password
app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "forgotPass.html"));
});

// ------------------------------------------------------------------------- //
// ------------------------------------------------------------------------- //
// Hairdresser Pages
app.get("/hairdresser/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "hairdresser", "dashboard.html"));
});

app.get("/hairdresser/clients", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Clients", "index.html")
  );
});

app.get("/hairdresser/clients/add", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Clients", "add.html")
  );
});

app.get("/hairdresser/edit/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Clients", "edit.html")
  );
});

// ======== API ROUTES (CRUD OPERATIONS) ========
// Get All Clients
app.get("/api/clients", async (req, res) => {
  const db = await connectDB();
  const clients = await db.collection("clients").find().toArray();
  res.json(clients);
});

// Get Client by ID
app.get("/api/clients/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const client = await db
    .collection("clients")
    .findOne({ _id: new ObjectId(id) });
  res.json(client);
});

// Add Client
app.post("/add", async (req, res) => {
  const db = await connectDB();
  const newData = req.body;
  console.log(newData);
  await db.collection("clients").insertOne(newData);
  res.redirect("/hairdresser/clients");
});

// Edit Client
app.post("/edit/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const updatedData = req.body;
  await db
    .collection("clients")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.redirect("/hairdresser/clients");
});

// Delete Client
app.delete("/delete/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  await db.collection("clients").deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Client deleted successfully!" });
});

// Services Routes
app.get("/hairdresser/services", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Services", "index.html")
  );
});

app.get("/hairdresser/services/add", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Services", "add.html")
  );
});

app.get("/hairdresser/services/edit/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Services", "edit.html")
  );
});

app.get("/api/services", async (req, res) => {
  const db = await connectDB();
  const services = await db.collection("services").find().toArray();
  console.log(services);
  res.json(services);
});

app.get('/api/stylists/:id/services', async (req, res) => {
  const db = await connectDB();
  const stylistId = req.params.id;

  try {
      // Log the request for debugging
      console.log(`Fetching services for stylist ID: ${stylistId}`);

      // Find the stylist by converting the string ID to ObjectId
      const stylist = await db.collection('stylists').findOne({ "_id": new ObjectId(stylistId) });
      console.log(stylist); 
      if (!stylist) {
          console.log(`Stylist with ID ${stylistId} not found`);
          return res.status(404).json({ message: 'Stylist not found' });
      }

      // Log the stylist data to verify services array
      console.log('Stylist found:', stylist);

      // Fetch services referenced in the stylist's services array
      const services = await db.collection('services').find({
          "_id": { "$in": stylist.services.map(id => new ObjectId(id.$oid)) }
      }).toArray();

      // Log the retrieved services
      console.log('Services retrieved:', services);

      res.json(services);
  } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post("/api/services/add", async (req, res) => {
  const db = await connectDB();
  const newData = req.body;
  await db.collection("services").insertOne(newData);
  res.redirect("/hairdresser/services");
});

app.post("/api/services/edit/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const updatedData = req.body;
  await db
    .collection("services")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.redirect("/hairdresser/services");
});

app.delete("/api/services/delete/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  await db.collection("services").deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Service deleted successfully!" });
});

// Appointments Routes
app.get("/hairdresser/schedule", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Schedule", "index.html")
  );
});

app.post("/api/schedule", async (req, res) => {
  const db = await connectDB();
  const scheduleData = req.body;
  try {
    await db.collection("appointments").insertOne(scheduleData);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving schedule:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/hairdresser/schedule/add", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Schedule", "add.html")
  );
});

app.get("/hairdresser/schedule/edit/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Schedule", "edit.html")
  );
});

app.get("/api/appointments", async (req, res) => {
  const db = await connectDB();
  const appointments = await db.collection("appointments").find().toArray();
  res.json(appointments);
});

app.get("/api/appointments/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const appointment = await db
    .collection("appointments")
    .findOne({ _id: new ObjectId(id) });
  res.json(appointment);
});

app.post("/api/appointments/add", async (req, res) => {
  const db = await connectDB();
  const newData = req.body;
  await db.collection("appointments").insertOne(newData);
  res.redirect("/hairdresser/schedule");
});

app.post("/api/appointments/edit/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const updatedData = req.body;
  await db
    .collection("appointments")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
  res.redirect("/hairdresser/schedule");
});

app.delete("/api/appointments/delete/:id", async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  await db.collection("appointments").deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Appointment deleted successfully!" });
});

// Add these to your Express app

// Stylist Routes
app.get("/stylists", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "customer", "stylists.html"));
});

app.get("/api/stylists", async (req, res) => {
  const db = await connectDB();
  console.log(db)
  const stylists = await db.collection("stylists").find().toArray();
  res.json(stylists);
});

// Route to get services of a specific stylist
app.get("/api/stylist/:id", async (req, res) => {
  const { id } = req.params;
  const db = await connectDB();
  const stylist = await db
    .collection("stylists")
    .findOne({ _id: new ObjectId(id) });
  if (!stylist) {
    return res.status(404).json({ message: "Stylist not found" });
  }
  res.json(stylist);
});

// Booking Routes
app.get("/booking", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "customer", "booking.html"));
});

app.post("/api/bookings", async (req, res) => {
  const db = await connectDB();
  const bookingData = req.body;
  await db.collection("bookings").insertOne(bookingData);
  res.status(201).json({ success: true });
});

// Confirmation Routes
app.get("/confirmation", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "customer", "confirmation.html"));
});

app.get("/api/bookings/last", async (req, res) => {
  const db = await connectDB();
  const lastBooking = await db
    .collection("bookings")
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
  res.json(lastBooking[0]);
});

// ======== STATIC FILE ROUTES ========
// CSS Files
app.get("/style/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "style.css"));
});

app.get("/style/signup.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "signup.css"));
});

app.get("/style/service.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "service.css"));
});

// JavaScript Files
app.get("/javascript/dashboard.js", (req, res) => {
  res.sendFile(
    path.join(__dirname, "javascript", "hairdresser", "dashboard.js")
  );
});

app.get("/javascript/login.js", (req, res) => {
  res.sendFile(path.join(__dirname, "javascript", "login.js"));
});

// ======== START SERVER ========
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
