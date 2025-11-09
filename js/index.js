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
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const role = document.querySelector('input[name="role"]:checked').value;
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials or role!");
        }
    });
}
const userDisplay = document.querySelector(".userDisplay");
const logoutBtn = document.querySelector(".logoutBtn");
const loginBtn = document.querySelector(".loginBtn");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser && userDisplay) {
    userDisplay.textContent = `Hello, ${loggedInUser.name}!`;
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
}
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.reload();
    });
}
let users = JSON.parse(localStorage.getItem("users") || "[]");
if (!users.some(u => u.email === "superadmin@gmail.com")) {
    users.push({
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "superadmin",
        role: "superadmin"
    });
    localStorage.setItem("users", JSON.stringify(users));
}
const roleRadios = document.querySelector(".roleOptions");
const roleLabel = document.querySelector('.roleGroup label');
const emailInput = document.getElementById("email");
if (loginForm) {
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
        const users = JSON.parse(localStorage.getItem("users") || "[]");
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
            window.location.href = "superadmin.html";
        } else {
            alert("Invalid credentials!");
        }
    });
}
if (document.getElementById("createAdminForm")) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (!loggedInUser || loggedInUser.role !== "superadmin") {
        alert("Access denied. Super Admin only.");
        window.location.href = "login.html";
    }
    const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
    const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
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
    const logoutBtn = document.querySelector(".logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
    }
    renderAdminTable();
}
// ----------------------------------------
