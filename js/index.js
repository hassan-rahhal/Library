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
if (document.getElementById("createBookForm") || document.getElementById("bookTable")) {
    function getBooks() {
        return JSON.parse(localStorage.getItem("books") || "[]");
    }
    function saveBooks(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }
    function renderBooks() {
        const books = getBooks();
        const tbody = document.querySelector("#bookTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        books.forEach((book, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>
                <button class="editBtn" data-index="${index}">Edit</button>
                <button class="deleteBtn" data-index="${index}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        document.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                if(confirm("Are you sure you want to delete this book?")) {
                    let books = getBooks();
                    books.splice(idx, 1);
                    saveBooks(books);
                    renderBooks();
                }
            });
        });
        document.querySelectorAll(".editBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                const books = getBooks();
                const book = books[idx];
                document.getElementById("bookTitle").value = book.title;
                document.getElementById("bookAuthor").value = book.author;
                document.getElementById("bookCover").value = book.cover || "";
                document.getElementById("bookDescription").value = book.description || "";
                document.getElementById("bookTag").value = book.tag || "";
                document.getElementById("createBookForm").onsubmit = (e) => {
                    e.preventDefault();
                    books[idx] = {
                        title: document.getElementById("bookTitle").value,
                        author: document.getElementById("bookAuthor").value,
                        cover: document.getElementById("bookCover").value,
                        description: document.getElementById("bookDescription").value,
                        tag: document.getElementById("bookTag").value
                    };
                    saveBooks(books);
                    renderBooks();
                    e.target.reset();
                    document.getElementById("createBookForm").onsubmit = addBookHandler;
                };
            });
        });
    }

    function addBookHandler(e) {
        e.preventDefault();
        const title = document.getElementById("bookTitle").value;
        const author = document.getElementById("bookAuthor").value;
        const cover = document.getElementById("bookCover").value;
        const description = document.getElementById("bookDescription").value;
        const tag = document.getElementById("bookTag").value;
        const books = getBooks();
        books.push({ title, author, cover, description, tag });
        saveBooks(books);
        renderBooks();
        e.target.reset();
    }
    document.getElementById("createBookForm").addEventListener("submit", addBookHandler);
    function renderCustomers() {
        const users = JSON.parse(localStorage.getItem("users") || "[]").filter(u => u.role === "customer");
        const tbody = document.querySelector("#customerTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        users.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                <button class="deleteUserBtn" data-index="${index}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll(".deleteUserBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
                const customers = allUsers.filter(u => u.role === "customer");
                if(confirm(`Delete customer "${customers[idx].name}"?`)) {
                    const updatedUsers = allUsers.filter(u => u.email !== customers[idx].email);
                    localStorage.setItem("users", JSON.stringify(updatedUsers));
                    renderCustomers();
                }
            });
        });
    }
    renderBooks();
    renderCustomers();
}
const adminLogoutBtn = document.querySelector(".admin-logout-btn");
if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.href = "index.html";
    });
}
const menuToggle = document.querySelector('.menuToggle');
const navBar = document.querySelector('.navBar');

menuToggle.addEventListener('click', () => {
  navBar.classList.toggle('active');
});

