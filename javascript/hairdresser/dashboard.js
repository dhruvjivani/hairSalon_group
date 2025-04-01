// Sample appointments - added only if no data exists
const sampleAppointments = [
  {
    username: "john_doe",
    service: "Haircut",
    date: "2025-03-15",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    username: "jane_smith",
    service: "Hair Coloring",
    date: "2025-03-16",
    time: "2:00 PM",
    status: "Pending",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("appointments")) {
    localStorage.setItem("appointments", JSON.stringify(sampleAppointments));
  }

  const appointments = getService(); // Fetch data using getService()
  const tableBody = document.getElementById("appointmentBody");

  if (appointments.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No appointments scheduled yet.</td></tr>`;
    return;
  }

  // Populate the table with appointments
  appointments.forEach((appointment, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${appointment.username}</td>
        <td>${appointment.service}</td>
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
        <td id="status-${index}">${appointment.status}</td>
        <td>
          <button class="btn yes-btn" id="confirm-${index}">Yes</button>
          <button class="btn no-btn" id="reject-${index}">No</button>
        </td>
      `;

    tableBody.appendChild(row);

    // Attach event listeners to buttons
    document
      .getElementById(`confirm-${index}`)
      .addEventListener("click", () => updateStatus(index, "Confirmed"));
    document
      .getElementById(`reject-${index}`)
      .addEventListener("click", () => updateStatus(index, "Rejected"));
  });
});

// Function to simulate fetching data
function getService() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

// Function to update appointment status
function updateStatus(index, newStatus) {
  let appointments = getService();

  // Update the status in the array
  appointments[index].status = newStatus;

  // Save updated data to localStorage
  localStorage.setItem("appointments", JSON.stringify(appointments));

  // Update the status in the table dynamically
  const statusElement = document.getElementById(`status-${index}`);
  statusElement.textContent = newStatus;

  // Change text color based on status
  statusElement.style.color = newStatus === "Confirmed" ? "#28a745" : "#dc3545";

  alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
}
