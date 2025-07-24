// main.js

// ========== THEME =============
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');
  localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  document.body.classList.add(savedTheme === 'light' ? 'light-theme' : 'dark-theme');
  renderSavedBookings();
  renderAdminBookings();
  attachSlotListeners();
});

// ========== LOGIN / SIGNUP =============
window.handleSubmit = function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  if (window.isLogin) {
    const existing = users.find(u => u.username === username && u.password === password);
    if (!existing) return alert("Invalid credentials");
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("userRole", existing.role);
    window.location.href = existing.role === "admin" ? "admin.html" : "index.html";
  } else {
    if (users.find(u => u.username === username)) return alert("User exists");
    users.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created. You can now log in.");
    toggleForm();
  }
};

window.toggleForm = function () {
  window.isLogin = !window.isLogin;
  document.getElementById("form-title").innerText = window.isLogin ? "Login" : "Sign Up";
  document.getElementById("submit-btn").innerText = window.isLogin ? "Login" : "Sign Up";
  document.getElementById("toggle-msg").innerHTML =
    window.isLogin
      ? `Don't have an account? <a href="#" onclick="toggleForm()">Sign Up</a>`
      : `Already have an account? <a href="#" onclick="toggleForm()">Login</a>`;
};
window.isLogin = true;

// ========== BOOKING SLOTS =============
function attachSlotListeners() {
  const slotButtons = document.querySelectorAll(".slot");
  const resetBtn = document.getElementById("reset-date-btn");

  slotButtons.forEach(btn =>
    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.style.backgroundColor = "grey";
    })
  );

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      slotButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "#00bfa5";
      });
    });
  }

  const confirmBtn = document.getElementById("confirmBookingBtn");
  if (confirmBtn) confirmBtn.onclick = confirmBooking;
}

function confirmBooking() {
  const selectedName = document.getElementById("booking-name")?.value.trim();
  const date = document.getElementById("booking-date")?.value;
  const selectedBtn = document.querySelector(".slot.selected");

  if (!selectedName || !date) {
    alert("Please enter both your name and booking date.");
    return;
  }

  if (!selectedBtn) {
    alert("Please select a slot.");
    return;
  }

  selectedSlot = selectedBtn.dataset.time;
  bookingCost = Math.floor(Math.random() * 150) + 150;

  document.getElementById("summarySlot").innerText = `Slot: ${selectedSlot}`;
  document.getElementById("summaryCost").innerText = `Cost: ₹${bookingCost}`;
  document.getElementById("summaryPopup").style.display = "flex";
}

function renderUserBookings() {
  const section = document.getElementById("myBookingsSection");
  if (!section) return;

  const currentUser = localStorage.getItem("loggedInUser");
  const allBookings = JSON.parse(localStorage.getItem("userBookings")) || [];

  const userBookings = allBookings.filter(b => b.user === currentUser);

  if (userBookings.length === 0) {
    section.innerHTML = `<p>No bookings yet.</p>`;
    return;
  }

  userBookings.forEach(({ user, date, slots, status }) => {
    const card = document.createElement("div");
    card.className = "booking-card";
    card.innerHTML = `
      <h3>${user}</h3>
      <p>Date: ${date}</p>
      <p>Time: ${slots.join(", ")}</p>
      <p><strong>Status:</strong> ${status || "Confirmed"}</p>
    `;
    section.appendChild(card);
  });
}


function cancelBookingByAdmin(index) {
  const bookings = JSON.parse(localStorage.getItem("userBookings")) || [];

  if (confirm("Are you sure you want to cancel this booking?")) {
    bookings[index].status = "Cancelled";
    localStorage.setItem("userBookings", JSON.stringify(bookings));
    alert("Booking cancelled.");
    location.reload();
  }
}

// ========== ADMIN PANEL =============
function renderAdminBookings() {
  const section = document.getElementById("adminBookingsSection");
  if (!section) return;

  const all = JSON.parse(localStorage.getItem("userBookings")) || [];
  section.innerHTML = "";

  if (all.length === 0) {
    section.innerHTML = "<p>No bookings found.</p>";
    return;
  }

  all.forEach((b, i) => {
    const card = document.createElement("div");
    card.className = "booking-card";
    card.innerHTML = `
      <h3>${b.user}</h3>
      <p>Date: ${b.date}</p>
      <p>Time: ${b.slots.join(", ")}</p>
      <p>Status: ${b.status || "Confirmed"}</p>
      <button onclick="cancelBookingByAdmin(${i})">Cancel</button>
    `;
    section.appendChild(card);
  });
}

// ========== USER BOOKINGS PAGE =============
window.cancelBooking = function (button) {
  const card = button.closest(".booking-card");
  card.remove();
  alert("Booking cancelled.");
};

window.rescheduleBooking = function (button) {
  alert("Redirect to turf selection page for rescheduling.");
  window.location.href = "turf.html";
};

// ========== SOLO PLAYER FEATURE =============
window.joinAsSoloPlayer = function () {
  const vacantTurfs = [
    { name: "Turf A", time: "6:00 PM - 7:00 PM" },
    { name: "Turf B", time: "8:00 PM - 9:00 PM" },
    { name: "Turf C", time: "10:00 PM - 11:00 PM" },
  ];
  const listContainer = document.getElementById("vacantTurfList");
  const displayArea = document.getElementById("availableTurfs");

  listContainer.innerHTML = "";
  vacantTurfs.forEach(turf => {
    const item = document.createElement("li");
    item.style = "padding: 0.5rem; background: #2a2a3b; margin: 0.5rem auto; border-radius: 8px; max-width: 300px;";
    item.innerHTML = `<strong>${turf.name}</strong> — ${turf.time} <br><button onclick="joinTurf('${turf.name}', '${turf.time}')">Join</button>`;
    listContainer.appendChild(item);
  });
  displayArea.style.display = "block";
};

window.joinTurf = function (turfName, time) {
  const soloBookings = JSON.parse(localStorage.getItem("soloBookings")) || [];
  const exists = soloBookings.some(b => b.turfName === turfName && b.time === time);
  if (exists) return alert("Already joined this slot.");

  soloBookings.push({ turfName, time });
  localStorage.setItem("soloBookings", JSON.stringify(soloBookings));
  alert(`🎉 You've joined ${turfName} at ${time} as a solo player.`);
  renderSavedBookings();
};

function renderSavedBookings() {
  const listContainer = document.getElementById("vacantTurfList");
  const displayArea = document.getElementById("availableTurfs");
  if (!listContainer || !displayArea) return;

  const soloBookings = JSON.parse(localStorage.getItem("soloBookings")) || [];
  listContainer.innerHTML = "";

  soloBookings.forEach(({ turfName, time }) => {
    const item = document.createElement("li");
    item.style = "padding: 0.5rem; background: #2a2a3b; margin: 0.5rem auto; border-radius: 8px; max-width: 300px;";
    item.innerHTML = `<strong>${turfName}</strong> — ${time}`;
    listContainer.appendChild(item);
  });
  displayArea.style.display = soloBookings.length ? "block" : "none";
}

let selectedSlot = null;
let bookingCost = 0;

// Highlight selected slot
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slot").forEach(slot => {
    slot.addEventListener("click", () => {
      selectedSlot = slot.dataset.time;
      document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
    });
  });

  document.getElementById("confirmBookingBtn").addEventListener("click", () => {
    if (!selectedSlot) {
      alert("Please select a slot first.");
      return;
    }

    bookingCost = Math.floor(Math.random() * 150) + 150;

    document.getElementById("summarySlot").innerText = `Slot: ${selectedSlot}`;
    document.getElementById("summaryCost").innerText = `Cost: ₹${bookingCost}`;
    document.getElementById("summaryPopup").style.display = "flex";
  });
});

function closeSummary() {
  document.getElementById("summaryPopup").style.display = "none";
}

function proceedToPayment() {
  document.getElementById("summaryPopup").style.display = "none";

  setTimeout(() => {
    document.getElementById("paymentSuccessPopup").style.display = "flex";

    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById("orderDetails").innerText =
      `Order ID: ${orderId}\nSlot: ${selectedSlot}\nAmount Paid: ₹${bookingCost}`;
  }, 800);
}

function closePaymentPopup() {
  document.getElementById("paymentSuccessPopup").style.display = "none";

  const slotBtn = [...document.querySelectorAll(".slot")].find(btn => btn.dataset.time === selectedSlot);
  if (slotBtn) {
    slotBtn.disabled = true;
    slotBtn.style.backgroundColor = "red";
    slotBtn.innerText += " (Booked)";
  }

  selectedSlot = null;
}

function renderUserBookings() {
  const section = document.getElementById("myBookingsSection");
  const currentUser = localStorage.getItem("loggedInUser");

  const allBookings = JSON.parse(localStorage.getItem("userBookings")) || [];
  const userBookings = allBookings.filter(b => b.user === currentUser);

  section.innerHTML = "";

  if (userBookings.length === 0) {
    section.innerHTML = "<p>No bookings yet.</p>";
    return;
  }

  userBookings.forEach(({ turf, date, slots, status }) => {
    const card = document.createElement("div");
    card.className = "booking-card";
    card.innerHTML = `
      <h3>${turf || "Turf"}</h3>
      <p>Date: ${date}</p>
      <p>Time: ${slots.join(", ")}</p>
      <p><strong>Status:</strong> ${status || "Confirmed"}</p>
      <button onclick="cancelBooking(this)">Cancel</button>
      <button onclick="rescheduleBooking(this)">Reschedule</button>
    `;
    section.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderUserBookings();
});

const bookings = JSON.parse(localStorage.getItem("userBookings")) || [];
bookings.push({
  user: name,
  date,
  slots: [selectedSlot],
  turf: turfName,
  price: turfPrice
});
localStorage.setItem("userBookings", JSON.stringify(bookings));
