// ===== Helper Functions =====
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===== Registration Handling =====
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

// ===== Login Handling =====
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

// ===== Display Logged-in User & Logout =====
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
