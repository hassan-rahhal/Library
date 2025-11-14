function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
const registerForm = document.querySelector(".registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const users = getUsers();
        if (users.some(user => user.email === email)) {
            alert("Email already registered!");
            return;
        }
        users.push({ name, email, password, role: "customer" });
        saveUsers(users);
        alert("Registration successful! You can now log in.");
        registerForm.reset();
        window.location.href = "login.html";
    });
}
const loginForm = document.querySelector(".loginForm");
if (loginForm) {
    const emailInput = document.getElementById("email");
    const roleRadios = document.querySelector(".roleOptions");
    const roleLabel = document.querySelector('.roleGroup label');
    emailInput.addEventListener("input", () => {
        if (emailInput.value.trim().toLowerCase() === "superadmin@gmail.com") {
            roleRadios.style.display = "none";
            roleLabel.style.display = "none";
        } else {
            roleRadios.style.display = "block";
            roleLabel.style.display = "block";
        }
    });
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const users = getUsers();
        let user;
        if (email === "superadmin@gmail.com") {
            user = users.find(u => u.email === email && u.password === password && u.role === "superadmin");
        } else {
            const role = document.querySelector('input[name="role"]:checked').value;
            user = users.find(u => u.email === email && u.password === password && u.role === role);
        }
        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            if (user.role === "superadmin") {
                window.location.href = "superadmin.html";
            } else if (user.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert("Invalid credentials!");
        }
    });
}
let users = getUsers();
if (!users.some(u => u.email === "superadmin@gmail.com")) {
    users.push({
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "superadmin",
        role: "superadmin"
    });
    saveUsers(users);
}
const logoutBtn = document.querySelector(".logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.href = "index.html";
    });
}
if (document.getElementById("createAdminForm")) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (!loggedInUser || loggedInUser.role !== "superadmin") {
        alert("Access denied. Super Admin only.");
        window.location.href = "login.html";
    }
    function renderAdminTable() {
        const users = getUsers();
        const adminTableBody = document.querySelector("#adminTable tbody");
        adminTableBody.innerHTML = "";
        users.forEach((user, index) => {
            if (user.role === "admin") {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><button class="deleteBtn" data-index="${index}">Delete</button></td>
                `;
                adminTableBody.appendChild(tr);
            }
        });
        document.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                deleteAdmin(idx);
            });
        });
    }
    function deleteAdmin(index) {
        let users = getUsers();
        const userToDelete = users[index];
        if (!userToDelete || userToDelete.role !== "admin") return;
        if (confirm(`Are you sure you want to delete admin "${userToDelete.name}"?`)) {
            users.splice(index, 1);
            saveUsers(users);
            renderAdminTable();
        }
    }
    const createAdminForm = document.getElementById("createAdminForm");
    createAdminForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("adminName").value.trim();
        const email = document.getElementById("adminEmail").value.trim().toLowerCase();
        const password = document.getElementById("adminPassword").value;
        if (!name || !email || !password) {
            alert("Please fill all fields.");
            return;
        }
        let users = getUsers();
        if (users.some(u => u.email === email)) {
            alert("Admin with this email already exists!");
            return;
        }
        users.push({ name, email, password, role: "admin" });
        saveUsers(users);
        alert(`Admin "${name}" created successfully!`);
        createAdminForm.reset();
        renderAdminTable();
    });
    renderAdminTable();
}


// -------------------------------
// LOCAL STORAGE HANDLERS
// -------------------------------
function getBooks() {
    return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
}

// -------------------------------
// UI ELEMENTS
// -------------------------------
const bookForm = document.getElementById("adminBookForm");
const booksTableBody = document.querySelector("#booksTable tbody");
const coverInput = document.getElementById("bookCover");
const coverPreview = document.getElementById("adminCoverPreview");

// Image Preview
coverInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            coverPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// -------------------------------
// ADD OR UPDATE BOOK
// -------------------------------
let editIndex = null;

bookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const price = document.getElementById("bookPrice").value.trim();
    const desc = document.getElementById("bookDesc").value.trim();
    const cover = coverPreview.src || "";

    if (!title || !author || !price || !desc) {
        alert("Please fill all fields");
        return;
    }

    const books = getBooks();

    const newBook = {
        title,
        author,
        price,
        desc,
        cover
    };

    if (editIndex === null) {
        books.push(newBook);
    } else {
        books[editIndex] = newBook;
        editIndex = null;
    }

    saveBooks(books);
    renderBooks();

    bookForm.reset();
    coverPreview.src = "";
});

// -------------------------------
// RENDER BOOKS TABLE
// -------------------------------
function renderBooks() {
    const books = getBooks();
    booksTableBody.innerHTML = "";

    books.forEach((book, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price}$</td>
            <td>
                <button class="admin-edit-btn" onclick="editBook(${index})">Edit</button>
                <button class="admin-delete-btn" onclick="deleteBook(${index})">Delete</button>
            </td>
        `;

        booksTableBody.appendChild(row);
    });
}

// -------------------------------
// DELETE BOOK
// -------------------------------
function deleteBook(index) {
    const books = getBooks();
    books.splice(index, 1);
    saveBooks(books);
    renderBooks();
}

// -------------------------------
// EDIT BOOK
// -------------------------------
function editBook(index) {
    const books = getBooks();
    const book = books[index];

    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookPrice").value = book.price;
    document.getElementById("bookDesc").value = book.desc;

    coverPreview.src = book.cover;

    editIndex = index;
}

// -------------------------------
// LOAD BOOKS ON START
// -------------------------------
window.onload = renderBooks;
function getCustomers() {
    return JSON.parse(localStorage.getItem("customers")) || [];
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}
const customersTableBody = document.querySelector("#customersTable tbody");

function renderCustomers() {
    const customers = getCustomers();
    customersTableBody.innerHTML = "";

    customers.forEach((customer, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>
                <button class="admin-edit-btn" onclick="viewCustomerBookings(${index})">
                    View Bookings
                </button>
            </td>
        `;

        customersTableBody.appendChild(row);
    });
}
function viewCustomerBookings(index) {
    const customers = getCustomers();
    const bookings = getBookings();
    const books = getBooks();

    const customer = customers[index];

    const customerBookings = bookings.filter(b => b.customerEmail === customer.email);

    if (customerBookings.length === 0) {
        alert("This customer has no booked books.");
        return;
    }

    let msg = `Customer: ${customer.name}\nEmail: ${customer.email}\n\nBooked Books:\n`;

    customerBookings.forEach((booking, i) => {
        const book = books.find(b => b.title === booking.bookTitle);

        if (book) {
            msg += `
${i + 1}. ${book.title}
Author: ${book.author}
Price: ${book.price}$
Description: ${book.desc}

---------------------------
`;
        }
    });

    alert(msg);
}

function loginCustomer(customer) {
    localStorage.setItem("loggedCustomer", JSON.stringify(customer));
}
function showLoggedCustomer() {
    const customer = JSON.parse(localStorage.getItem("loggedCustomer"));
    const displaySpan = document.querySelector(".userDisplay");

    if (customer && displaySpan) {
        displaySpan.textContent = customer.name;
    }
}
window.onload = () => {
    showLoggedCustomer();

    if (typeof renderBooks === "function") renderBooks();
    if (typeof renderCustomers === "function") renderCustomers();
};
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".admin-logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Remove logged-in user
            localStorage.removeItem("loggedInUser");

            // Optional: remove admin flag
            localStorage.removeItem("isAdmin");

            // Show alert
            alert("Logout successfully!");

            // Redirect to login page
            window.location.href = "login.html";
        });
    }
});
function showFavoritesOnLogin(isLoggedIn) {
    const favoriteBtn = document.querySelector('.btnNav');
    if (isLoggedIn) {
        favoriteBtn.hidden = false; // Unhide the button
    }
}
