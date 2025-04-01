function signUp() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    document.getElementById("message").textContent = "Passwords do not match!";
    return;
  }

  const user = {
    username: username,
    email: email,
    password: password,
    role: "user", // Default role as 'user'
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("message").textContent =
    "Signup successful! You can now log in.";

  alert("Signup successful! You can now log in.");
  setTimeout(() => {
    window.location.href = "/login";
  }, 2000);
}
function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  // Static hairdresser credentials
  if (username === "hairdresser" && password === "hairdresser123") {
    document.getElementById("loginMessage").textContent = "Login successful!";
    setTimeout(() => {
      window.location.href = "/pages/hairdresser/dashboard";
    }, 2000);
    return;
  }

  // Regular user authentication
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === username);

  if (user) {
    if (user.password === password) {
      document.getElementById("loginMessage").textContent = "Login successful!";
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      document.getElementById("loginMessage").textContent =
        "Incorrect password!";
      document.getElementById("loginMessage").style.color = "red";
    }
  } else {
    document.getElementById("loginMessage").textContent = "User not found!";
    document.getElementById("loginMessage").style.color = "red";
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   const authLinks = document.getElementById("auth-links");

//   const isLoggedIn = localStorage.getItem("isLoggedIn");
//   const role = localStorage.getItem("role");

//   if (isLoggedIn === "true") {
//     authLinks.innerHTML = `<a href="#" id="logout">Logout</a>`;

//     document.getElementById("logout").addEventListener("click", function () {
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("role"); // Clear role data on logout
//       window.location.href = "/";
//     });

//     // Role-based dashboard redirection (optional)
//     if (role === "hairdresser") {
//       document.getElementById("auth-links").innerHTML += `<a href="/hairdresser/dashboard">Dashboard</a>`;
//     }
//   } else {
//     authLinks.innerHTML = `<a href="/signup">Login</a>`;
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const authLinks = document.getElementById("auth-links");

  // Check login status using localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  // Redirect logic (only for pages requiring hairdresser access)
  const currentPage = window.location.pathname;

  // Redirect hairdresser-only pages if the role isn't 'hairdresser'
  if (currentPage.includes("hairdresser") && role !== "hairdresser") {
    window.location.href = "/login";
    return; // Prevent further code execution
  }

  // Display relevant links based on login status
  if (isLoggedIn === "true") {
    authLinks.innerHTML = `<a href="#" id="logout">Logout</a>`;

    // Logout functionality
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role"); // Clear role on logout
      window.location.href = "/login";
    });
  } else {
    authLinks.innerHTML = "<a href='/login'>Login</a>" || null;
  }
});


// Function to format phone number
function formatPhoneNumber(phone) {
  // Remove non-numeric characters from the input
  const phoneDigits = phone.replace(/\D/g, "");

  // Format it into (123) 456-7890
  if (phoneDigits.length === 10) {
    return `(${phoneDigits.substring(0, 3)}) ${phoneDigits.substring(
      3,
      6
    )}-${phoneDigits.substring(6)}`;
  }

  return phone; // Return unformatted if not valid (or you can choose to return an error message)
}

// Check if client is already registered based on email
function isClientRegistered(email) {
  const registeredClients = JSON.parse(localStorage.getItem("users")) || [];
  const isRegistered = registeredClients.some(
    (client) => client.email === email
  );

  console.log("Registered Clients:", registeredClients);
  console.log("Is Registered:", isRegistered);

  return isRegistered;
}

// Register a new client (called when the registration form is submitted)
function registerNewClient() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  let phone = document.getElementById("phone").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const email = document.getElementById("email").value.trim();

  // Validate that all required fields are filled in
  if (!firstName || !lastName || !phone || !postalCode || !email) {
    alert("Please fill in all required fields.");
    return false;
  }

  // Format the phone number before validating
  phone = formatPhoneNumber(phone);

  // Validate phone number format (expected format: (123) 456-7890)
  const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
  if (!phone.match(phonePattern)) {
    alert("Invalid phone format. Use 1234567890.");
    return false;
  }

  // Validate postal code format (expected format: A1A 1A1)
  const postalCodePattern = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;
  if (!postalCode.match(postalCodePattern)) {
    alert("Invalid postal code format. Use A1A 1A1.");
    return false;
  }

  // Validate email format using a regular expression
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.match(emailPattern)) {
    alert("Invalid email format.");
    return false;
  }

  // Check if the client is already registered
  if (isClientRegistered(email)) {
    alert("Yes, you are ready for your appointment!");
    setTimeout(function () {
      window.location.href = "/appointment";
    }, 1000);
  } else {
    // Save new client details in localStorage
    const newClient = {
      username: firstName + "_" + lastName,
      phone,
      postalCode,
      email,
      password: "Abc@1234",
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newClient);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "hairdresser");

    alert(
      "Registration successful! You may now proceed to book an appointment."
    );
    setTimeout(function () {
      window.location.href = "/appointment";
    }, 2000);
  }
}
