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

// ======================= GENERIC DISPLAY FUNCTION =======================
async function showResult(promise, outputId) {
  const box = document.getElementById(outputId);
  try {
    const res = await promise;
    const data = await res.json();
    box.textContent = JSON.stringify(data, null, 2);
    if (!res.ok && data.error) alert(data.error);
  } catch (err) {
    box.textContent = "Error: " + err.message;
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
    output.textContent = JSON.stringify(data, null, 2);

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
  showResult(fetch(`${ROOM_API}`), "roomOutput");
}

function getAvailableRooms() {
  showResult(fetch(`${ROOM_API}/available`), "roomOutput");
}

function getReservedRooms() {
  showResult(fetch(`${ROOM_API}/reserved`), "roomOutput");
}

function getMaintenanceRooms() {
  showResult(fetch(`${ROOM_API}/maintenance`), "roomOutput");
}

function getDeluxeRooms() {
  showResult(fetch(`${ROOM_API}/deluxe`), "roomOutput");
}

function getStandardRooms() {
  showResult(fetch(`${ROOM_API}/standard`), "roomOutput");
}

function getRoomByNumber() {
  const number = document.getElementById("roomNumber").value;
  showResult(fetch(`${ROOM_API}/${number}`), "roomOutput");
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
  showResult(fetch(`${SERVICE_API}`), "serviceOutput");
}

function getAvailableServices() {
  showResult(fetch(`${SERVICE_API}/available`), "serviceOutput");
}

function getUnavailableServices() {
  showResult(fetch(`${SERVICE_API}/unavailable`), "serviceOutput");
}

function getServiceById() {
  showResult(fetch(`${SERVICE_API}/${serviceId.value}`), "serviceOutput");
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
  showResult(fetch(`${STAFF_API}`), "staffOutput");
}

function getStaffById() {
  const staffId = document.getElementById("staffId").value;
  showResult(fetch(`${STAFF_API}/${staffId}`), "staffOutput");
}

function getStaffByTask() {
  const task = staffTaskSelect.value;
  showResult(fetch(`${STAFF_API}/task/${task}`), "staffOutput");
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
    const res = await fetch(`${ROOM_API}/${roomNumber}`);
    const room = await res.json();

    if (
      !res.ok ||
      !room ||
      !room.data ||
      room.data.length === 0 ||
      room.data[0].Status !== "Vacant"
    ) {
      return alert("This room is not available for booking.");
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
    output.textContent = JSON.stringify(result, null, 2);

    if (res.ok) {
      alert(`Customer details saved successfully for Room ${roomNumber}`);

      latestCustomerId =
        result.customer_id || result.Customer_ID || result.insertId;

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
      alert("Failed to save customer details");
    }
  } catch (err) {
    output.textContent = "Error: " + err.message;
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
    output.textContent = JSON.stringify(reservationResult, null, 2);

    if (!reservationRes.ok)
      return alert("Reservation creation failed. Try again.");

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

    alert("Payment successful. Room booked successfully.");
    document.getElementById("paymentFormContainer").style.display = "none";
  } catch (err) {
    output.textContent = "Error: " + err.message;
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
    output.textContent = JSON.stringify(result, null, 2);

    if (!res.ok) {
      if (result && result.error) alert(result.error);
      else alert("Service booking failed. See console/output.");
      return;
    }

    alert("Service booked and payment recorded.");
    // clean UI
    document.getElementById("serviceCustomerId").value = "";
    document.getElementById("serviceIdInput").value = "";
    document.getElementById("serviceNameDisplay").value = "";
    document.getElementById("servicePriceDisplay").value = "";
    document.getElementById("servicePaymentMode").value = "";
    document.getElementById("payServiceBtn").disabled = true;
  } catch (err) {
    output.textContent = "Error booking service: " + err.message;
  }
}

// ======================= MANAGER VIEW FUNCTIONS =======================

// Get all customers
function getAllCustomers() {
  showResult(fetch("http://localhost:5000/api/customers"), "customerOutput");
}

// Get all reservations
function getAllReservations() {
  showResult(fetch("http://localhost:5000/api/reservations"), "reservationOutput");
}

// Get all avails
function getAllAvails() {
  showResult(fetch("http://localhost:5000/api/avails"), "availsOutput");
}

// Get all payments
function getAllPayments() {
  showResult(fetch("http://localhost:5000/api/payments"), "paymentOutput");
}

// Customers
async function getCustomerById() {
  const id = document.getElementById("customerId").value;
  showResult(fetch(`${CUSTOMER_API}/${id}`), "customerOutput");
}

// Reservations
async function getReservationsByCustomer() {
  const id = document.getElementById("reservationCustomerId").value;
  showResult(fetch(`${RESERVATION_API}/customer/${id}`), "reservationOutput");
}

async function getReservationsByRoom() {
  const room = document.getElementById("reservationRoomNumber").value;
  showResult(fetch(`${RESERVATION_API}/room/${room}`), "reservationOutput");
}
