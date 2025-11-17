// ======================= API ENDPOINTS =======================
const ROOM_API = "http://localhost:5000/api/rooms";
const SERVICE_API = "http://localhost:5000/api/services";
const MANAGER_API = "http://localhost:5000/api/manager/login";
const STAFF_API = "http://localhost:5000/api/staff";
const CUSTOMER_API = "http://localhost:5000/api/customers";
const RESERVATION_API = "http://localhost:5000/api/reservations";

// ======================= SOCKET.IO CONNECTION =======================
const socket = io("http://localhost:5000");
socket.on("serviceUpdated", getAllServices);
socket.on("roomUpdated", getAllRooms);

// ======================= BEAUTIFUL UI DISPLAY FUNCTIONS =======================

function createRoomCard(room) {
  // Check if room data is invalid or empty
  if (!room || !room.Room_Number) {
    return '<div class="message-box message-error">Invalid room number. Room numbers must be between 100 and 120.</div>';
  }
  
  // Safe handling of potentially undefined values
  const roomStatus = room.Status || 'Unknown';
  const roomType = room.Type || 'Standard';
  const roomPrice = room.Price ? parseFloat(room.Price).toLocaleString() : '0';
  
  return `
    <div class="data-card">
      <div class="data-card-title">Room ${room.Room_Number}</div>
      <div class="data-card-row">
        <span class="data-card-label">Type</span>
        <span class="type-badge">${roomType}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Status</span>
        <span class="status-badge status-${roomStatus.toLowerCase()}">${roomStatus}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Price</span>
        <span class="price-display">₹${roomPrice}</span>
      </div>
    </div>
  `;
}

function createServiceCard(service) {
  const isAvailable = service.Availability === 1;
  return `
    <div class="data-card">
      <div class="data-card-title service">${service.Service_Name}</div>
      <div class="data-card-row">
        <span class="data-card-label">Service ID</span>
        <span class="data-card-value">#${service.Service_ID}</span>
      </div>
      <div class="data-card-row" style="display: block; padding: 15px 0;">
        <div class="data-card-label" style="margin-bottom: 8px;">Description</div>
        <div style="color: #e6edf3; font-size: 0.9rem; line-height: 1.6; text-align: left; white-space: normal; word-wrap: break-word;">${service.Description}</div>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Price</span>
        <span class="price-display">₹${parseFloat(service.Price).toLocaleString()}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Availability</span>
        <span class="availability-badge availability-${isAvailable ? 'available' : 'unavailable'}">
          ${isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
  `;
}

function createStaffCard(staff) {
  return `
    <div class="data-card">
      <div class="data-card-title staff">${staff.Name}</div>
      <div class="data-card-row">
        <span class="data-card-label">Staff ID</span>
        <span class="data-card-value">#${staff.Staff_ID}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Email</span>
        <span class="data-card-value">${staff.Email}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Phone</span>
        <span class="data-card-value">${staff.Phone}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Address</span>
        <span class="data-card-value">${staff.Address}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Task</span>
        <span class="type-badge">${staff.Task}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Salary</span>
        <span class="price-display">₹${parseFloat(staff.Salary).toLocaleString()}</span>
      </div>
    </div>
  `;
}

function createCustomerCard(customer) {
  return `
    <div class="data-card">
      <div class="data-card-title customer">${customer.Name}</div>
      <div class="data-card-row">
        <span class="data-card-label">Customer ID</span>
        <span class="data-card-value">#${customer.Customer_ID}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Email</span>
        <span class="data-card-value">${customer.Email}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Phone</span>
        <span class="data-card-value">${customer.Phone}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Age</span>
        <span class="data-card-value">${customer.Age} years</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Address</span>
        <span class="data-card-value">${customer.Address}</span>
      </div>
    </div>
  `;
}

function createReservationCard(reservation) {
  return `
    <div class="data-card">
      <div class="data-card-title reservation">Reservation #${reservation.Reservation_ID}</div>
      <div class="data-card-row">
        <span class="data-card-label">Customer ID</span>
        <span class="data-card-value">#${reservation.Customer_ID}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Room Number</span>
        <span class="data-card-value">${reservation.Room_Number}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Check-in</span>
        <span class="data-card-value">${new Date(reservation.Check_in_date).toLocaleDateString()}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Check-out</span>
        <span class="data-card-value">${new Date(reservation.Check_out_date).toLocaleDateString()}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Duration</span>
        <span class="data-card-value">${reservation.Number_of_days} days</span>
      </div>
    </div>
  `;
}

function createPaymentCard(payment) {
  return `
    <div class="data-card">
      <div class="data-card-title payment">Payment #${payment.Payment_ID}</div>
      <div class="data-card-row">
        <span class="data-card-label">Reservation ID</span>
        <span class="data-card-value">#${payment.Reservation_ID}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Amount</span>
        <span class="price-display">₹${parseFloat(payment.Amount).toLocaleString()}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Payment Mode</span>
        <span class="type-badge">${payment.Payment_mode}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Date</span>
        <span class="data-card-value">${new Date(payment.Payment_date).toLocaleString()}</span>
      </div>
    </div>
  `;
}

function createAvailCard(avail) {
  return `
    <div class="data-card">
      <div class="data-card-title service">Service Booking</div>
      <div class="data-card-row">
        <span class="data-card-label">Customer ID</span>
        <span class="data-card-value">#${avail.Customer_ID}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Service ID</span>
        <span class="data-card-value">#${avail.Service_ID}</span>
      </div>
      <div class="data-card-row">
        <span class="data-card-label">Reservation ID</span>
        <span class="data-card-value">#${avail.Reservation_ID}</span>
      </div>
    </div>
  `;
}

function createAssignmentCard(assign) {
  return `
    <div class="data-card">
      <div class="data-card-title assignment">Assignment #${assign.Assignment_ID}</div>

      <div class="data-card-row">
        <span class="data-card-label">Room Number</span>
        <span class="data-card-value">${assign.Room_Number}</span>
      </div>

      <div class="data-card-row">
        <span class="data-card-label">Staff ID</span>
        <span class="data-card-value">#${assign.Staff_ID}</span>
      </div>

      <div class="data-card-row">
        <span class="data-card-label">Staff Name</span>
        <span class="data-card-value">${assign.Name}</span>
      </div>

      <div class="data-card-row">
        <span class="data-card-label">Task</span>
        <span class="type-badge">${assign.Task}</span>
      </div>
    </div>
  `;
}

function displayData(data, outputId, cardType) {
  const box = document.getElementById(outputId);
  
  // Handle different data structures
  let dataArray = [];
  
  if (Array.isArray(data)) {
    dataArray = data;
  } else if (data && data.data) {
    if (Array.isArray(data.data)) {
      dataArray = data.data;
    } else {
      dataArray = [data.data];
    }
  } else if (data) {
    dataArray = [data];
  }
  
  if (!dataArray || dataArray.length === 0) {
    box.innerHTML = '<div class="empty-state">No data found</div>';
    return;
  }

  let cardsHTML = '<div class="data-grid">';
  
  dataArray.forEach(item => {
    switch(cardType) {
      case 'room':
        cardsHTML += createRoomCard(item);
        break;
      case 'service':
        cardsHTML += createServiceCard(item);
        break;
      case 'staff':
        cardsHTML += createStaffCard(item);
        break;
      case 'customer':
        cardsHTML += createCustomerCard(item);
        break;
      case 'reservation':
        cardsHTML += createReservationCard(item);
        break;
      case 'payment':
        cardsHTML += createPaymentCard(item);
        break;
      case 'avail':
        cardsHTML += createAvailCard(item);
        break;
      case 'assignment':
        cardsHTML += createAssignmentCard(item);
        break;

    }
  });
  
  cardsHTML += '</div>';
  box.innerHTML = cardsHTML;
}

function displayMessage(message, outputId, isSuccess = true) {
  const box = document.getElementById(outputId);
  const messageClass = isSuccess ? 'message-success' : 'message-error';
  box.innerHTML = `<div class="message-box ${messageClass}">${message}</div>`;
}

// ======================= GENERIC DISPLAY FUNCTION =======================
async function showResult(promise, outputId, cardType = null) {
  const box = document.getElementById(outputId);
  box.innerHTML = '<div style="text-align: center; padding: 20px; color: #67e8f9;">Loading...</div>';
  
  try {
    const res = await promise;
    const data = await res.json();
    
    if (!res.ok) {
      if (data.error) {
        displayMessage(data.error, outputId, false);
        alert(data.error);
      } else {
        box.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
      return;
    }
    
    // If we have a card type, display as cards
    if (cardType && data.data) {
      displayData(data, outputId, cardType);
      return;
    }
    
    // If it's a single operation result (success message) WITHOUT data array
    if ((data.success || data.message) && !data.data) {
      displayMessage(data.message || 'Operation completed successfully!', outputId, true);
      return;
    }
    
    // Fallback to JSON display
    box.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) {
    displayMessage('Error: ' + err.message, outputId, false);
  }
}

// ======================= MANAGER LOGIN FUNCTIONS =======================
function showManagerSection() {
  document.getElementById("managerLoginSection").style.display = "block";
}

async function managerLogin() {
  const email = document.getElementById("managerEmail").value;
  const password = document.getElementById("managerPassword").value;
  const output = document.getElementById("managerOutput");

  try {
    const res = await fetch(MANAGER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

    if (data.success) {
      alert("Manager logged in successfully.");
      window.location.href = "manager.html";
    } else {
      alert("Invalid manager credentials.");
    }
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}

function logoutManager() {
  alert("Manager logged out.");
  window.location.href = "index.html";
}

// ======================= ROOM FUNCTIONS =======================
function getAllRooms() {
  showResult(fetch(`${ROOM_API}`), "roomOutput", "room");
}

function getAvailableRooms() {
  showResult(fetch(`${ROOM_API}/available`), "roomOutput", "room");
}

function getReservedRooms() {
  showResult(fetch(`${ROOM_API}/reserved`), "roomOutput", "room");
}

function getMaintenanceRooms() {
  showResult(fetch(`${ROOM_API}/maintenance`), "roomOutput", "room");
}

function getDeluxeRooms() {
  showResult(fetch(`${ROOM_API}/deluxe`), "roomOutput", "room");
}

function getStandardRooms() {
  showResult(fetch(`${ROOM_API}/standard`), "roomOutput", "room");
}

function getRoomByNumber() {
  const number = document.getElementById("roomNumber").value;
  showResult(fetch(`${ROOM_API}/${number}`), "roomOutput", "room");
}

function updateRoomPrice() {
  const number = document.getElementById("updatePriceRoomNumber").value;
  const price = parseFloat(document.getElementById("newRoomPrice").value);
  if (!price || price <= 0) return alert("Please enter a valid positive price.");
  showResult(
    fetch(`${ROOM_API}/${number}/price`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Price: price }),
    }),
    "roomOutput"
  );
}

function updateRoomStatus() {
  const number = document.getElementById("updateRoomNumber").value;
  const status = document.getElementById("newStatus").value;
  showResult(
    fetch(`${ROOM_API}/${number}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: status }),
    }),
    "roomOutput"
  );
}

// ======================= SERVICE FUNCTIONS =======================
function getAllServices() {
  showResult(fetch(`${SERVICE_API}`), "serviceOutput", "service");
}

function getAvailableServices() {
  showResult(fetch(`${SERVICE_API}/available`), "serviceOutput", "service");
}

function getUnavailableServices() {
  showResult(fetch(`${SERVICE_API}/unavailable`), "serviceOutput", "service");
}

function getServiceById() {
  showResult(fetch(`${SERVICE_API}/${serviceId.value}`), "serviceOutput", "service");
}

function addService() {
  const data = {
    Service_Name: serviceName.value,
    Description: serviceDesc.value,
    Price: parseFloat(servicePrice.value),
    Availability: parseInt(serviceAvail.value),
  };
  showResult(
    fetch(`${SERVICE_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    "serviceOutput"
  );
}

function updateServiceAvailability() {
  const data = { Availability: parseInt(newAvailability.value) };
  showResult(
    fetch(`${SERVICE_API}/${updateServiceId.value}/availability`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    "serviceOutput"
  );
}

function updateService() {
  const data = {
    Service_Name: updateServiceName.value.trim(),
    Description: updateServiceDesc.value.trim(),
    Price: parseFloat(updateServicePrice.value),
    Availability: parseInt(updateServiceAvailMain.value),
  };

  if (
    !data.Service_Name ||
    !data.Description ||
    !data.Price ||
    isNaN(data.Availability)
  ) {
    return alert("Please fill in all fields before updating the service.");
  }

  if (data.Price <= 0) {
    return alert("Price must be greater than 0.");
  }

  showResult(
    fetch(`${SERVICE_API}/${updateServiceIdMain.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    "serviceOutput"
  );
}

function deleteService() {
  showResult(
    fetch(`${SERVICE_API}/${deleteServiceId.value}`, {
      method: "DELETE",
    }),
    "serviceOutput"
  );
}

// ======================= STAFF FUNCTIONS =======================
function getAllStaff() {
  showResult(fetch(`${STAFF_API}`), "staffOutput", "staff");
}

function getStaffById() {
  const staffId = document.getElementById("staffId").value;
  showResult(fetch(`${STAFF_API}/${staffId}`), "staffOutput", "staff");
}

function getStaffByTask() {
  const task = staffTaskSelect.value;
  showResult(fetch(`${STAFF_API}/task/${task}`), "staffOutput", "staff");
}

function addStaff() {
  const data = {
    Name: staffName.value,
    Email: staffEmail.value,
    Phone: staffPhone.value,
    Address: staffAddress.value,
    Salary: staffSalary.value,
    Task: staffTask.value,
  };
  showResult(
    fetch(`${STAFF_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    "staffOutput"
  );
}

function updateStaff() {
  const data = {
    Name: updateStaffName.value,
    Email: updateStaffEmail.value,
    Phone: updateStaffPhone.value,
    Address: updateStaffAddress.value,
    Salary: parseInt(updateStaffSalary.value),
    Task: updateStaffTask.value,
  };
  showResult(
    fetch(`${STAFF_API}/${updateStaffId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    "staffOutput"
  );
}

function deleteStaff() {
  showResult(
    fetch(`${STAFF_API}/${deleteStaffId.value}`, { method: "DELETE" }),
    "staffOutput"
  );
}

// ======================= BOOKING FUNCTIONS =======================
let selectedRoomNumber = null;
let latestCustomerId = null;

// STEP 1: Check if room is vacant
async function checkAndShowBookingForm() {
  const roomNumber = document.getElementById("bookingRoomNumber").value;
  const output = document.getElementById("bookingOutput");

  if (!roomNumber) {
    return alert("Please enter a room number.");
  }

  try {
    const res = await fetch(`http://localhost:5000/api/rooms/check/${roomNumber}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      return alert(data.message);
    }

    selectedRoomNumber = roomNumber;
    document.getElementById("customerFormContainer").style.display = "block";
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}


// STEP 2: Save customer details and show payment form
async function submitBooking(event) {
  event.preventDefault();

  const output = document.getElementById("bookingOutput");
  const roomNumber = selectedRoomNumber;

  const data = {
    Name: custName.value.trim(),
    Email: custEmail.value.trim(),
    Phone: custPhone.value.trim(),
    Address: custAddress.value.trim(),
    Age: parseInt(custAge.value),
  };

  try {
    const res = await fetch(`${CUSTOMER_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      latestCustomerId =
        result.customer_id || result.Customer_ID || result.insertId;

      // Display beautiful success message
      output.innerHTML = `
        <div class="message-box message-success">
          <div>
            <strong>✓ Customer Details Saved!</strong><br>
            Your Customer ID is: <strong>#${latestCustomerId}</strong><br>
            Please note this ID for future service bookings.<br>
            Now proceeding to payment for Room ${roomNumber}...
          </div>
        </div>
      `;

      alert(`Customer details saved successfully for Room ${roomNumber}`);
      alert(`Your Customer ID is ${latestCustomerId}. Please note it for service bookings.`);

      document.getElementById("customerFormContainer").style.display = "none";
      document.getElementById("paymentFormContainer").style.display = "block";

      const today = new Date().toISOString().split("T")[0];
      document.getElementById("checkInDate").setAttribute("min", today);
      document.getElementById("checkOutDate").setAttribute("min", today);

      document.getElementById("checkInDate").addEventListener("change", () => {
        const checkIn = document.getElementById("checkInDate").value;
        document.getElementById("checkOutDate").setAttribute("min", checkIn);
      });
    } else {
      displayMessage("Failed to save customer details: " + (result.error || "Unknown error"), "bookingOutput", false);
      alert("Failed to save customer details");
    }
  } catch (err) {
    displayMessage("Error: " + err.message, "bookingOutput", false);
  }
}

// STEP 3: Auto-calculate total price
document.getElementById("checkOutDate").addEventListener("change", async () => {
  const checkIn = new Date(document.getElementById("checkInDate").value);
  const checkOut = new Date(document.getElementById("checkOutDate").value);

  if (checkOut <= checkIn) return alert("Check-out must be after check-in");

  const diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  document.getElementById("numDays").value = diffDays;

  const res = await fetch(`${ROOM_API}/${selectedRoomNumber}`);
  const data = await res.json();

  if (data && data.data && data.data[0]) {
    const price = parseFloat(data.data[0].Price);
    document.getElementById("amount").value = (price * diffDays).toFixed(2);
  }
});

// STEP 4: Dummy payment + reservation
async function submitPayment(event) {
  event.preventDefault();
  const output = document.getElementById("bookingOutput");

  const roomNumber = selectedRoomNumber;
  const checkIn = document.getElementById("checkInDate").value;
  const checkOut = document.getElementById("checkOutDate").value;
  const numDays = parseInt(document.getElementById("numDays").value);
  const amount = parseFloat(document.getElementById("amount").value);
  const paymentMode = document.getElementById("paymentMode").value;

  try {
    const reservationData = {
      Customer_ID: latestCustomerId,
      Room_Number: parseInt(roomNumber),
      Check_in_date: checkIn,
      Check_out_date: checkOut,
      Number_of_days: numDays,
    };

    const reservationRes = await fetch(`${RESERVATION_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData),
    });

    const reservationResult = await reservationRes.json();

    if (!reservationRes.ok) {
      displayMessage("Reservation creation failed. Try again.", "bookingOutput", false);
      return alert("Reservation creation failed. Try again.");
    }

    const reservationId =
      reservationResult.Reservation_ID || reservationResult.insertId;

    const paymentData = {
      Reservation_ID: reservationId,
      Amount: amount,
      Payment_mode: paymentMode,
    };

    await fetch(`http://localhost:5000/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    await fetch(`${ROOM_API}/${roomNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: "Reserved" }),
    });

    // Display beautiful success message
    output.innerHTML = `
      <div class="message-box message-success">
        <div>
          <strong>🎉 Payment Successful!</strong><br>
          Room ${roomNumber} has been booked successfully.<br>
          Reservation ID: #${reservationId}<br>
          Total Amount: ₹${amount.toLocaleString()}<br>
          Duration: ${numDays} days (${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()})
        </div>
      </div>
    `;
    
    alert("Payment successful. Room booked successfully.");
    document.getElementById("paymentFormContainer").style.display = "none";
  } catch (err) {
    displayMessage("Error: " + err.message, "bookingOutput", false);
  }
}

// ======================= SERVICE BOOKING (frontend) =======================

document.addEventListener("DOMContentLoaded", () => {
  // Bind listeners (avoid inline oninput problems)
  const serviceIdInput = document.getElementById("serviceIdInput");
  const customerIdInput = document.getElementById("serviceCustomerId");
  const payBtn = document.getElementById("payServiceBtn");

  if (serviceIdInput) serviceIdInput.addEventListener("input", () => fetchServicePrice());
  if (customerIdInput) customerIdInput.addEventListener("input", () => validateCustomerReservation());
  if (payBtn) payBtn.disabled = true; // start disabled
});

async function validateCustomerReservation() {
  const output = document.getElementById("serviceBookingOutput");
  const customerId = String(document.getElementById("serviceCustomerId").value || "").trim();

  // Clear messages and disable button until checks pass
  output.textContent = "";
  document.getElementById("serviceNameDisplay").value = "";
  document.getElementById("servicePriceDisplay").value = "";
  document.getElementById("payServiceBtn").disabled = true;

  if (!customerId) {
    return;
  }

  try {
    // Prefer dedicated endpoint: /api/reservations/customer/:id
    let res = await fetch(`${RESERVATION_API}/customer/${customerId}`);
    let data;

    if (res.ok) {
      data = await res.json();
    } else {
      // Fallback: fetch all reservations and filter (works if dedicated endpoint missing)
      res = await fetch(`${RESERVATION_API}`);
      data = await res.json();
      if (!res.ok) {
        output.textContent = "Unable to check reservations. Backend error.";
        return;
      }
      // normalize into { data: [...] } if needed
      if (!data.data) data = { data };
      data.data = data.data.filter(r => String(r.Customer_ID) === customerId);
    }

    if (!data || !data.data || data.data.length === 0) {
      output.textContent = "No reservation found for this Customer ID. Customer must book a room first.";
      return;
    }

    // Customer has at least one reservation (valid)
    output.textContent = `Valid customer. Found ${data.data.length} reservation(s).`;
    // If a service id already present, re-run service fetch so pay button can enable
    const serviceId = String(document.getElementById("serviceIdInput").value || "").trim();
    if (serviceId) await fetchServicePrice();
  } catch (err) {
    output.textContent = "Error checking customer reservations: " + err.message;
  }
}

async function fetchServicePrice() {
  const output = document.getElementById("serviceBookingOutput");
  const serviceId = String(document.getElementById("serviceIdInput").value || "").trim();
  const customerId = String(document.getElementById("serviceCustomerId").value || "").trim();

  // Clear old values
  document.getElementById("serviceNameDisplay").value = "";
  document.getElementById("servicePriceDisplay").value = "";
  document.getElementById("payServiceBtn").disabled = true;
  output.textContent = "";

  if (!serviceId) return;

  try {
    // First ensure customer is valid (they must have a reservation)
    if (!customerId) {
      output.textContent = "Enter Customer ID first (must have a reservation).";
      return;
    }
    // quick check for customer reservation
    const custRes = await fetch(`${RESERVATION_API}/customer/${customerId}`);
    if (!custRes.ok) {
      // fallback to global reservations check
      const allRes = await fetch(`${RESERVATION_API}`);
      const allData = await allRes.json();
      const found = (allData.data || allData).some(r => String(r.Customer_ID) === customerId);
      if (!found) {
        output.textContent = "Customer ID has no reservation. Cannot book service.";
        return;
      }
    } else {
      const custData = await custRes.json();
      if (!custData.data || custData.data.length === 0) {
        output.textContent = "Customer ID has no reservation. Cannot book service.";
        return;
      }
    }

    // Now fetch service details
    const res = await fetch(`${SERVICE_API}/${serviceId}`);
    const data = await res.json();

    if (!res.ok || !data.data || data.data.length === 0) {
      output.textContent = "Invalid Service ID. Please try another ID.";
      return;
    }

    const service = data.data[0];

    // Defensive checks
    if (!Object.prototype.hasOwnProperty.call(service, "Availability")) {
      output.textContent = "Service record missing Availability column (backend schema mismatch).";
      return;
    }

    if (service.Availability !== 1) {
      output.textContent = `Service '${service.Service_Name}' is currently unavailable.`;
      document.getElementById("serviceNameDisplay").value = service.Service_Name || "";
      document.getElementById("servicePriceDisplay").value = service.Price || "";
      return;
    }

    // Valid: display values and enable button
    document.getElementById("serviceNameDisplay").value = service.Service_Name;
    document.getElementById("servicePriceDisplay").value = service.Price;
    document.getElementById("payServiceBtn").disabled = false;
    output.textContent = `Service is available: ${service.Service_Name} — ₹${service.Price}`;
  } catch (err) {
    output.textContent = "Error fetching service: " + err.message;
  }
}

async function bookService() {
  const output = document.getElementById("serviceBookingOutput");
  output.textContent = "";

  const customerId = String(document.getElementById("serviceCustomerId").value || "").trim();
  const serviceId = String(document.getElementById("serviceIdInput").value || "").trim();
  const paymentMode = document.getElementById("servicePaymentMode").value;
  const serviceName = document.getElementById("serviceNameDisplay").value;
  const servicePrice = document.getElementById("servicePriceDisplay").value;

  if (!customerId || !serviceId || !paymentMode) {
    return alert("Please enter Customer ID, Service ID and choose a payment mode.");
  }

  try {
    // Call backend endpoint that handles avails + payment + reservation lookup
    const res = await fetch(`${RESERVATION_API}/service`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Customer_ID: Number(customerId),
        Service_ID: Number(serviceId),
        Payment_mode: paymentMode
      })
    });

    const result = await res.json();

    if (!res.ok) {
      // Show error message in beautiful format
      output.innerHTML = `<div class="message-box message-error">${result.error || 'Service booking failed. Please try again.'}</div>`;
      if (result && result.error) alert(result.error);
      else alert("Service booking failed. See console/output.");
      return;
    }

    // Show beautiful success message
    output.innerHTML = `
      <div class="message-box message-success">
        <div>
          <strong>🎉 Service Booked Successfully!</strong><br>
          Service: <strong>${serviceName}</strong><br>
          Amount Paid: <strong>₹${parseFloat(servicePrice).toLocaleString()}</strong><br>
          Payment Mode: <strong>${paymentMode}</strong><br>
          Reservation ID: <strong>#${result.Reservation_ID || 'N/A'}</strong><br>
          Avail ID: <strong>#${result.Avail_ID || 'N/A'}</strong>
        </div>
      </div>
    `;

    alert("Service booked and payment recorded successfully!");
    
    // Clean UI
    document.getElementById("serviceCustomerId").value = "";
    document.getElementById("serviceIdInput").value = "";
    document.getElementById("serviceNameDisplay").value = "";
    document.getElementById("servicePriceDisplay").value = "";
    document.getElementById("servicePaymentMode").value = "";
    document.getElementById("payServiceBtn").disabled = true;
  } catch (err) {
    output.innerHTML = `<div class="message-box message-error">Error booking service: ${err.message}</div>`;
  }
}

// ======================= MANAGER VIEW FUNCTIONS =======================

// Get all customers
function getAllCustomers() {
  showResult(fetch("http://localhost:5000/api/customers"), "customerOutput", "customer");
}

// Get all reservations
function getAllReservations() {
  showResult(fetch("http://localhost:5000/api/reservations"), "reservationOutput", "reservation");
}

// Get all avails
function getAllAvails() {
  showResult(fetch("http://localhost:5000/api/avails"), "availsOutput", "avail");
}

// Get all payments
function getAllPayments() {
  showResult(fetch("http://localhost:5000/api/payments"), "paymentOutput", "payment");
}

// Customers
async function getCustomerById() {
  const id = document.getElementById("customerId").value;
  showResult(fetch(`${CUSTOMER_API}/${id}`), "customerOutput", "customer");
}

// Reservations
async function getReservationsByCustomer() {
  const id = document.getElementById("reservationCustomerId").value;
  showResult(fetch(`${RESERVATION_API}/customer/${id}`), "reservationOutput", "reservation");
}

async function getReservationsByRoom() {
  const room = document.getElementById("reservationRoomNumber").value;
  showResult(fetch(`${RESERVATION_API}/room/${room}`), "reservationOutput", "reservation");
}

function getAllAssignments() {
  showResult(
    fetch("http://localhost:5000/api/assignments"),
    "assignmentOutput",
    "assignment"
  );
}

function getAssignmentByRoom() {
  const room = document.getElementById("assignRoomInput").value;
  showResult(
    fetch(`http://localhost:5000/api/assignments/room/${room}`),
    "assignmentOutput",
    "assignment"
  );
}

function getAssignmentByStaff() {
  const staff = document.getElementById("assignStaffInput").value;
  showResult(
    fetch(`http://localhost:5000/api/assignments/staff/${staff}`),
    "assignmentOutput",
    "assignment"
  );
}