// Function to handle user signup
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
    username,
    email,
    password,
    role: "client", // Default role is 'client'
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("message").textContent =
    "Signup successful! You can now log in.";
  alert("Signup successful! You can now log in.");
  setTimeout(() => (window.location.href = "/login"), 2000);
}

// Function to handle login
function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === username);

  if (username === "hairdresser" && password === "hairdresser123") {
    setLoginState("hairdresser");
    window.location.href = "/hairdresser/dashboard";
    return;
  }

  if (user) {
    if (user.password === password) {
      setLoginState(user.role);
      window.location.href =
        user.role === "hairdresser"
          ? "/hairdresser/dashboard"
          : "/";
    } else {
      showMessage("Incorrect password!", "loginMessage", "red");
    }
  } else {
    showMessage("User not found!", "loginMessage", "red");
  }
}

// Set login state in localStorage
function setLoginState(role) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", role);
}

// Function to manage authentication-based UI and redirections
document.addEventListener("DOMContentLoaded", function () {
  const authLinks = document.getElementById("auth-links");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  const currentPage = window.location.pathname;

  if (currentPage.includes("hairdresser") && role !== "hairdresser") {
    window.location.href = "/";
  }

  if (isLoggedIn === "true") {
    authLinks.innerHTML = `<a href="#" id="logout">Logout</a>`;
    document.getElementById("logout").addEventListener("click", logout);
  } else {
    authLinks.innerHTML = "<a href='/login'>Login</a>";
  }
});

// Logout function
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  window.location.href = "/login";
}

// Show messages in the UI
function showMessage(message, elementId, color = "black") {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.color = color;
}
