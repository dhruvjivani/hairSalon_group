// Import required Node.js modules
const express = require("express"); // Web framework for handling HTTP requests
const { MongoClient, ObjectId } = require("mongodb"); // MongoDB client and ObjectId for database operations
const path = require("path"); // Utility for handling file paths

// Initialize Express application and MongoDB configurations
const app = express(); // Create an Express app instance
const PORT = 3001; // Define the port number for the server to listen on
const MONGO_URI = "mongodb+srv://admin:admin@cluster0.kclkr.mongodb.net/"; // MongoDB connection string
const DATABASE_NAME = "hairSalonDB"; // Name of the MongoDB database to use

// Middleware setup for parsing request bodies and serving static files
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies (e.g., form submissions)

// Serve static files from specified directories
app.use("/images", express.static(path.join(__dirname, "images"))); // Serve static image files
app.use("/javascript", express.static(path.join(__dirname, "javascript"))); // Serve static JavaScript files
app.use("/style", express.static(path.join(__dirname, "style"))); // Serve static CSS files
app.use("/pages", express.static(path.join(__dirname, "pages"))); // Serve static HTML pages

// Function to establish a connection to the MongoDB database
async function connectDB() {
  const client = new MongoClient(MONGO_URI); // Create a new MongoDB client instance
  await client.connect(); // Connect to the MongoDB server
  return client.db(DATABASE_NAME); // Return the specified database instance
}

// ======== PAGE ROUTES ========
// Route to serve the Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html")); // Send the index.html file
});

// Route to serve the About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "about.html")); // Send the about.html file
});

// Route to serve the Contact page
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "contact.html")); // Send the contact.html file
});

// Route to serve the Service page
app.get("/service", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "service.html")); // Send the service.html file
});

// Route to serve the Location page
app.get("/location", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "location.html")); // Send the location.html file
});

// Route to serve the Services page (customer-facing)
app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "services.html")); // Send the services.html file
});

// Route to serve the Register Client page
app.get("/registerClient", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "registerClient.html")); // Send the registerClient.html file
});

// Route to serve the Appointment page
app.get("/appointment", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "appointment.html")); // Send the appointment.html file
});

// Route to serve the Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "login.html")); // Send the login.html file
});

// Route to serve the Signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "signup.html")); // Send the signup.html file
});

// Route to serve the Forgot Password page
app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "forgotPass.html")); // Send the forgotPass.html file
});

// ------------------------------------------------------------------------- //
// Hairdresser Pages
// Route to serve the Hairdresser Dashboard page
app.get("/hairdresser/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "hairdresser", "dashboard.html")); // Send the dashboard.html file
});

// Route to serve the Hairdresser Clients page
app.get("/hairdresser/clients", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Clients", "index.html")
  ); // Send the clients index.html file
});

// Route to serve the Add Client page
app.get("/hairdresser/clients/add", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Clients", "add.html")
  ); // Send the add.html file
});

// Route to serve the Edit Client page with dynamic ID
app.get("/hairdresser/edit/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Clients", "edit.html")
  ); // Send the edit.html file
});

// ======== API ROUTES (CRUD OPERATIONS) ========
// Route to get all clients from the database
app.get("/api/clients", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const clients = await db.collection("clients").find().toArray(); // Retrieve all clients as an array
  res.json(clients); // Send the clients as a JSON response
});

// Route to get a specific client by ID
app.get("/api/clients/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the client ID from the URL
  const client = await db
    .collection("clients")
    .findOne({ _id: new ObjectId(id) }); // Find client by ID
  res.json(client); // Send the client as a JSON response
});

// Route to add a new client
app.post("/add", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const newData = req.body; // Get the new client data from the request body
  console.log(newData); // Log the data for debugging
  await db.collection("clients").insertOne(newData); // Insert the new client into the database
  res.redirect("/hairdresser/clients"); // Redirect to the clients page
});

// Route to edit an existing client
app.post("/edit/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the client ID from the URL
  const updatedData = req.body; // Get the updated client data from the request body
  await db
    .collection("clients")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData }); // Update the client
  res.redirect("/hairdresser/clients"); // Redirect to the clients page
});

// Route to delete a client
app.delete("/delete/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the client ID from the URL
  await db.collection("clients").deleteOne({ _id: new ObjectId(id) }); // Delete the client
  res.json({ message: "Client deleted successfully!" }); // Send a success message as JSON
});

// Services Routes
// Route to serve the Hairdresser Services page
app.get("/hairdresser/services", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Services", "index.html")
  ); // Send the services index.html file
});

// Route to serve the Add Service page
app.get("/hairdresser/services/add", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Services", "add.html")
  ); // Send the add.html file
});

// Route to serve the Edit Service page with dynamic ID
app.get("/hairdresser/services/edit/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Services", "edit.html")
  ); // Send the edit.html file
});

// Route to get all services from the database
app.get("/api/services", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const services = await db.collection("services").find().toArray(); // Retrieve all services as an array
  console.log(services); // Log the services for debugging
  res.json(services); // Send the services as a JSON response
});

// Route to get services for a specific stylist by ID
app.get("/api/stylists/:id/services", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const stylistId = req.params.id; // Extract the stylist ID from the URL

  try {
    // Log the request for debugging purposes
    console.log(`Fetching services for stylist ID: ${stylistId}`);

    // Find the stylist by converting the string ID to an ObjectId
    const stylist = await db
      .collection("stylists")
      .findOne({ _id: new ObjectId(stylistId) });
    console.log(stylist); // Log the stylist data for debugging
    if (!stylist) {
      console.log(`Stylist with ID ${stylistId} not found`); // Log if stylist is not found
      return res.status(404).json({ message: "Stylist not found" }); // Send 404 response
    }

    // Log the stylist data to verify the services array
    console.log("Stylist found:", stylist);

    // Fetch services referenced in the stylist's services array
    const services = await db
      .collection("services")
      .find({
        _id: { $in: stylist.services.map((id) => new ObjectId(id.$oid)) }, // Map service IDs to ObjectIds
      })
      .toArray();

    // Log the retrieved services for debugging
    console.log("Services retrieved:", services);

    res.json(services); // Send the services as a JSON response
  } catch (error) {
    console.error("Error fetching services:", error); // Log any errors
    res.status(500).json({ message: "Server error", error: error.message }); // Send 500 response with error details
  }
});

// Route to add a new service
app.post("/api/services/add", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const newData = req.body; // Get the new service data from the request body
  await db.collection("services").insertOne(newData); // Insert the new service into the database
  res.redirect("/hairdresser/services"); // Redirect to the services page
});

// Route to edit an existing service
app.post("/api/services/edit/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the service ID from the URL
  const updatedData = req.body; // Get the updated service data from the request body
  await db
    .collection("services")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData }); // Update the service
  res.redirect("/hairdresser/services"); // Redirect to the services page
});

// Route to delete a service
app.delete("/api/services/delete/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the service ID from the URL
  await db.collection("services").deleteOne({ _id: new ObjectId(id) }); // Delete the service
  res.json({ message: "Service deleted successfully!" }); // Send a success message as JSON
});

// Appointments Routes
// Route to serve the Hairdresser Schedule page
app.get("/hairdresser/schedule", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Schedule", "index.html")
  ); // Send the schedule index.html file
});

// Route to save a new appointment (schedule)
app.post("/api/schedule", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const scheduleData = req.body; // Get the schedule data from the request body
  try {
    await db.collection("appointments").insertOne(scheduleData); // Insert the new appointment into the database
    res.status(201).json({ success: true }); // Send a 201 success response
  } catch (error) {
    console.error("Error saving schedule:", error); // Log any errors
    res.status(500).json({ message: "Server error" }); // Send a 500 error response
  }
});

// Route to serve the Add Appointment page
app.get("/hairdresser/schedule/add", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Schedule", "add.html")
  ); // Send the add.html file
});

// Route to serve the Edit Appointment page with dynamic ID
app.get("/hairdresser/schedule/edit/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "pages", "hairdresser", "Schedule", "edit.html")
  ); // Send the edit.html file
});

// Route to get all appointments from the database
app.get("/api/appointments", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const appointments = await db.collection("appointments").find().toArray(); // Retrieve all appointments as an array
  res.json(appointments); // Send the appointments as a JSON response
});

// Route to get a specific appointment by ID
app.get("/api/appointments/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the appointment ID from the URL
  const appointment = await db
    .collection("appointments")
    .findOne({ _id: new ObjectId(id) }); // Find appointment by ID
  res.json(appointment); // Send the appointment as a JSON response
});

// Route to add a new appointment
app.post("/api/appointments/add", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const newData = req.body; // Get the new appointment data from the request body
  await db.collection("appointments").insertOne(newData); // Insert the new appointment into the database
  res.redirect("/hairdresser/schedule"); // Redirect to the schedule page
});

// Route to edit an existing appointment
app.post("/api/appointments/edit/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the appointment ID from the URL
  const updatedData = req.body; // Get the updated appointment data from the request body
  await db
    .collection("appointments")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedData }); // Update the appointment
  res.redirect("/hairdresser/schedule"); // Redirect to the schedule page
});

// Route to delete an appointment
app.delete("/api/appointments/delete/:id", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const { id } = req.params; // Extract the appointment ID from the URL
  await db.collection("appointments").deleteOne({ _id: new ObjectId(id) }); // Delete the appointment
  res.json({ message: "Appointment deleted successfully!" }); // Send a success message as JSON
});

// Stylist Routes
// Route to serve the Stylists page (customer-facing)
app.get("/stylists", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "customer", "stylists.html")); // Send the stylists.html file
});

// Route to get all stylists from the database
app.get("/api/stylists", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  console.log(db); // Log the database instance for debugging
  const stylists = await db.collection("stylists").find().toArray(); // Retrieve all stylists as an array
  res.json(stylists); // Send the stylists as a JSON response
});

// Route to get a specific stylist by ID
app.get("/api/stylist/:id", async (req, res) => {
  const { id } = req.params; // Extract the stylist ID from the URL
  const db = await connectDB(); // Connect to the database
  const stylist = await db
    .collection("stylists")
    .findOne({ _id: new ObjectId(id) }); // Find stylist by ID
  if (!stylist) {
    return res.status(404).json({ message: "Stylist not found" }); // Send 404 if not found
  }
  res.json(stylist); // Send the stylist as a JSON response
});

// Booking Routes
// Route to serve the Booking page (customer-facing)
app.get("/booking", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "customer", "booking.html")); // Send the booking.html file
});

// Route to add a new booking
app.post("/api/bookings", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const bookingData = req.body; // Get the booking data from the request body
  await db.collection("bookings").insertOne(bookingData); // Insert the new booking into the database
  res.status(201).json({ success: true }); // Send a 201 success response
});

// Confirmation Routes
// Route to serve the Confirmation page (customer-facing)
app.get("/confirmation", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "customer", "confirmation.html")); // Send the confirmation.html file
});

// Route to get the last booking from the database
app.get("/api/bookings/last", async (req, res) => {
  const db = await connectDB(); // Connect to the database
  const lastBooking = await db
    .collection("bookings")
    .find() // Find all bookings
    .sort({ _id: -1 }) // Sort by ID in descending order (latest first)
    .limit(1) // Limit to the most recent one
    .toArray(); // Convert to an array
  res.json(lastBooking[0]); // Send the last booking as a JSON response
});

// ======== STATIC FILE ROUTES ========
// CSS File Routes
app.get("/style/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "style.css")); // Serve the main style.css file
});

app.get("/style/signup.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "signup.css")); // Serve the signup.css file
});

app.get("/style/service.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "service.css")); // Serve the service.css file
});

// JavaScript File Routes
app.get("/javascript/dashboard.js", (req, res) => {
  res.sendFile(
    path.join(__dirname, "javascript", "hairdresser", "dashboard.js")
  ); // Serve the dashboard.js file
});

app.get("/javascript/login.js", (req, res) => {
  res.sendFile(path.join(__dirname, "javascript", "login.js")); // Serve the login.js file
});

// ======== START SERVER ========
// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Log server start message
});
