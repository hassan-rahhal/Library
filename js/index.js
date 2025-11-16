// ===========================
// USER MANAGEMENT
// ===========================
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===========================
// BOOKS MANAGEMENT
// ===========================
function getBooks() {
    return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
}

// ===========================
// FAVORITES MANAGEMENT
// ===========================
function getFavorites() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return [];
    const favKey = `favorites_${user.email}`;
    return JSON.parse(localStorage.getItem(favKey)) || [];
}

function saveFavorites(favorites) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
    const favKey = `favorites_${user.email}`;
    localStorage.setItem(favKey, JSON.stringify(favorites));
}

function getFavoriteDetails(bookIndex) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return null;
    const favKey = `favorites_details_${user.email}`;
    const details = JSON.parse(localStorage.getItem(favKey)) || {};
    return details[bookIndex] || null;
}

function saveFavoriteDetails(bookIndex, timestamp) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
    const favKey = `favorites_details_${user.email}`;
    const details = JSON.parse(localStorage.getItem(favKey)) || {};
    details[bookIndex] = { addedAt: timestamp };
    localStorage.setItem(favKey, JSON.stringify(details));
}

function removeFavoriteDetails(bookIndex) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
    const favKey = `favorites_details_${user.email}`;
    const details = JSON.parse(localStorage.getItem(favKey)) || {};
    delete details[bookIndex];
    localStorage.setItem(favKey, JSON.stringify(details));
}

function toggleFavorite(bookIndex) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Please login to add favorites!");
        window.location.href = "login.html";
        return;
    }
    
    let favorites = getFavorites();
    const index = favorites.indexOf(bookIndex);
    
    if (index > -1) {
        favorites.splice(index, 1);
        removeFavoriteDetails(bookIndex);
        alert("Removed from favorites!");
    } else {
        favorites.push(bookIndex);
        saveFavoriteDetails(bookIndex, new Date().toISOString());
        alert("Added to favorites!");
    }
    
    saveFavorites(favorites);
    updateFavoriteButtons();
    
    // Refresh favorites page if we're on it
    if (window.location.pathname.includes('favorite.html')) {
        renderFavoritesPage();
    }
}

function toggleFavoriteFromDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));
    
    if (bookId === null || isNaN(bookId)) return;
    
    toggleFavorite(bookId);
    updateFavoriteButtonOnDetails(bookId);
}

function updateFavoriteButtonOnDetails(bookId) {
    const favorites = getFavorites();
    const isFavorited = favorites.includes(bookId);
    
    const btn = document.getElementById('favoriteToggleBtn');
    const icon = document.getElementById('favoriteIcon');
    const text = document.getElementById('favoriteText');
    
    if (!btn) return;
    
    if (isFavorited) {
        btn.classList.add('favorited');
        icon.textContent = '❤️';
        text.textContent = 'Remove from Favorites';
    } else {
        btn.classList.remove('favorited');
        icon.textContent = '🤍';
        text.textContent = 'Add to Favorites';
    }
}

function clearAllFavorites() {
    if (!confirm("Are you sure you want to remove all favorites? This cannot be undone!")) {
        return;
    }
    
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
    
    const favKey = `favorites_${user.email}`;
    const detailsKey = `favorites_details_${user.email}`;
    
    localStorage.removeItem(favKey);
    localStorage.removeItem(detailsKey);
    
    alert("All favorites cleared!");
    renderFavoritesPage();
}

function updateFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const bookIndex = parseInt(btn.getAttribute('data-index'));
        if (favorites.includes(bookIndex)) {
            btn.textContent = '❤️';
            btn.classList.add('favorited');
        } else {
            btn.textContent = '🤍';
            btn.classList.remove('favorited');
        }
    });
}

// ===========================
// CONTACT MESSAGES
// ===========================
function getMessages() {
    return JSON.parse(localStorage.getItem("messages")) || [];
}

function saveMessages(messages) {
    localStorage.setItem("messages", JSON.stringify(messages));
}

// ===========================
// REGISTER
// ===========================
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

// ===========================
// LOGIN
// ===========================
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

// Create superadmin if doesn't exist
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

// ===========================
// LOGOUT
// ===========================
const logoutBtns = document.querySelectorAll(".logoutBtn, .admin-logout-btn");
logoutBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.href = "index.html";
    });
});

// ===========================
// SUPERADMIN - CREATE ADMIN
// ===========================
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

// ===========================
// ADMIN - BOOK MANAGEMENT
// ===========================
const bookForm = document.getElementById("adminBookForm");
const booksTableBody = document.querySelector("#booksTable tbody");
const coverInput = document.getElementById("bookCover");
const coverPreview = document.getElementById("adminCoverPreview");

if (coverInput && coverPreview) {
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
}

let editIndex = null;

if (bookForm) {
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
        renderBooksTable();

        bookForm.reset();
        coverPreview.src = "";
    });
}

function renderBooksTable() {
    if (!booksTableBody) return;
    
    const books = getBooks();
    booksTableBody.innerHTML = "";

    books.forEach((book, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>$${book.price}</td>
            <td>
                <button class="admin-edit-btn" onclick="editBook(${index})">Edit</button>
                <button class="admin-delete-btn" onclick="deleteBook(${index})">Delete</button>
            </td>
        `;

        booksTableBody.appendChild(row);
    });
}

function deleteBook(index) {
    const books = getBooks();
    books.splice(index, 1);
    saveBooks(books);
    renderBooksTable();
}

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

// ===========================
// ADMIN - CUSTOMER MANAGEMENT
// ===========================
function getCustomers() {
    return getUsers().filter(u => u.role === "customer");
}

const customersTableBody = document.querySelector("#customersTable tbody");

function renderCustomers() {
    if (!customersTableBody) return;
    
    const customers = getCustomers();
    customersTableBody.innerHTML = "";

    customers.forEach((customer, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>
                <button class="admin-delete-btn" onclick="deleteCustomer('${customer.email}')">Delete</button>
            </td>
        `;

        customersTableBody.appendChild(row);
    });
}

function deleteCustomer(email) {
    if (confirm(`Are you sure you want to delete this customer?`)) {
        let users = getUsers();
        users = users.filter(u => u.email !== email);
        saveUsers(users);
        renderCustomers();
    }
}

// ===========================
// ADMIN - MESSAGES MANAGEMENT
// ===========================
const messagesTableBody = document.querySelector("#messagesTable tbody");

function renderMessages() {
    if (!messagesTableBody) return;
    
    const messages = getMessages();
    messagesTableBody.innerHTML = "";

    if (messages.length === 0) {
        messagesTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center">No messages yet</td></tr>';
        return;
    }

    messages.forEach((msg, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${msg.name}<br><small>${msg.email}</small></td>
            <td>${msg.message}<br><small>Phone: ${msg.phone}</small></td>
            <td>
                <button class="admin-delete-btn" onclick="deleteMessage(${index})">Delete</button>
            </td>
        `;

        messagesTableBody.appendChild(row);
    });
}

function deleteMessage(index) {
    if (confirm("Delete this message?")) {
        let messages = getMessages();
        messages.splice(index, 1);
        saveMessages(messages);
        renderMessages();
    }
}

// ===========================
// CONTACT FORM
// ===========================
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phonenumber").value.trim();
        const message = document.getElementById("message").value.trim();
        
        const messages = getMessages();
        messages.push({
            name,
            email,
            phone,
            message,
            date: new Date().toLocaleString()
        });
        
        saveMessages(messages);
        alert("Message sent successfully! We'll get back to you soon.");
        contactForm.reset();
    });
}

// ===========================
// RENDER PRODUCTS DYNAMICALLY
// ===========================
function renderProducts() {
    const bookList = document.querySelector(".bookList");
    if (!bookList) return;
    
    const books = getBooks();
    
    if (books.length === 0) {
        bookList.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No books available yet. Check back soon!</p>';
        return;
    }
    
    bookList.innerHTML = "";
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    books.forEach((book, index) => {
        const article = document.createElement("article");
        article.className = "bookCard";
        
        const avgRating = calculateAverageRating(index);
        const ratingsCount = getRatings(index).length;
        const ratingDisplay = ratingsCount > 0 ? `<div style="color: #ffa500; font-size: 14px; margin-top: 5px;">${displayStars(avgRating)} (${ratingsCount})</div>` : '';
        
        article.innerHTML = `
            <div class="bookTag">${book.price}</div>
            ${user && user.role === "customer" ? `<button class="favorite-btn" data-index="${index}" onclick="toggleFavorite(${index})">🤍</button>` : ''}
            <a href="productinfo.html?id=${index}"><img class="bookCover" src="${book.cover || 'images/book1.jpg'}" alt="${book.title}"></a>
            <div class="bookInfo">
                <h3 class="bookName">${book.title}</h3>
                <p class="bookAuthor">by ${book.author}</p>
                ${ratingDisplay}
            </div>
        `;
        
        bookList.appendChild(article);
    });
    
    if (user && user.role === "customer") {
        updateFavoriteButtons();
    }
}

// ===========================
// RATINGS & COMMENTS
// ===========================
function getRatings(bookId) {
    return JSON.parse(localStorage.getItem(`ratings_${bookId}`)) || [];
}

function saveRatings(bookId, ratings) {
    localStorage.setItem(`ratings_${bookId}`, JSON.stringify(ratings));
}

function calculateAverageRating(bookId) {
    const ratings = getRatings(bookId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
}

function displayStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (halfStar) stars += '★';
    for (let i = 0; i < emptyStars; i++) stars += '☆';
    
    return stars;
}

function submitRating(bookId, rating, comment) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || user.role !== "customer") {
        alert("Please login as a customer to rate this book!");
        return;
    }
    
    const ratings = getRatings(bookId);
    
    // Check if user already rated
    const existingIndex = ratings.findIndex(r => r.userEmail === user.email);
    
    const newRating = {
        userEmail: user.email,
        userName: user.name,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
    };
    
    if (existingIndex > -1) {
        ratings[existingIndex] = newRating;
        alert("Your rating has been updated!");
    } else {
        ratings.push(newRating);
        alert("Thank you for your rating!");
    }
    
    saveRatings(bookId, ratings);
    renderProductDetails(); // Refresh the page
}

function deleteRating(bookId, userEmail) {
    if (!confirm("Delete this review?")) return;
    
    let ratings = getRatings(bookId);
    ratings = ratings.filter(r => r.userEmail !== userEmail);
    saveRatings(bookId, ratings);
    renderProductDetails(); // Refresh
}

// ===========================
// PRODUCT DETAILS PAGE
// ===========================
function renderProductDetails() {
    // Check if we're on product details page
    if (!document.getElementById('productImage')) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (bookId === null) {
        document.body.innerHTML = '<h1 style="text-align:center; margin-top:100px;">Book not found</h1>';
        return;
    }
    
    const books = getBooks();
    const book = books[parseInt(bookId)];
    
    if (!book) {
        document.body.innerHTML = '<h1 style="text-align:center; margin-top:100px;">Book not found</h1>';
        return;
    }
    
    // Display book info
    document.getElementById('productImage').src = book.cover || 'images/book1.jpg';
    document.getElementById('productTitle').textContent = book.title;
    document.getElementById('productAuthor').textContent = `by ${book.author}`;
    document.getElementById('productPrice').textContent = `${book.price}`;
    document.getElementById('productDescription').textContent = book.desc;
    
    // Display average rating
    const avgRating = calculateAverageRating(bookId);
    const ratings = getRatings(bookId);
    document.getElementById('averageStars').textContent = displayStars(avgRating);
    document.getElementById('ratingText').textContent = `(${ratings.length} ${ratings.length === 1 ? 'rating' : 'ratings'})`;
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
const favoriteBtn = document.getElementById('favoriteToggleBtn');
if (user && user.role === "customer") {
    favoriteBtn.style.display = 'block';  // Show the button for logged-in customers
    updateFavoriteButtonOnDetails(bookId);  // Update icon/text based on favorite status
} else {
    favoriteBtn.style.display = 'none';  // Hide for non-customers or logged-out users
}

    // Render rating form
    renderRatingForm(bookId);
    
    // Render comments
    renderComments(bookId);
}

function renderRatingForm(bookId) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const container = document.getElementById('ratingFormContainer');
    
    if (!user || user.role !== "customer") {
        container.innerHTML = `
            <div class="login-prompt">
                <p>Please <a href="login.html">login</a> as a customer to rate this book.</p>
            </div>
        `;
        return;
    }
    
    // Check if user already rated
    const ratings = getRatings(bookId);
    const existingRating = ratings.find(r => r.userEmail === user.email);
    
    let selectedRating = existingRating ? existingRating.rating : 0;
    let existingComment = existingRating ? existingRating.comment : '';
    
    container.innerHTML = `
        <form class="rating-form" id="ratingForm">
            <div class="rating-input-group">
                <p style="margin-bottom: 10px; font-weight: 600;">Your Rating:</p>
                <div class="star-rating" id="starRating">
                    <span class="star" data-rating="1">★</span>
                    <span class="star" data-rating="2">★</span>
                    <span class="star" data-rating="3">★</span>
                    <span class="star" data-rating="4">★</span>
                    <span class="star" data-rating="5">★</span>
                </div>
            </div>
            <textarea id="commentText" placeholder="Write your review here..." required>${existingComment}</textarea>
            <button type="submit" class="submit-rating-btn">${existingRating ? 'Update Review' : 'Submit Review'}</button>
        </form>
    `;
    
    // Set up star rating
    const stars = container.querySelectorAll('.star');
    
    // Highlight existing rating
    if (selectedRating > 0) {
        stars.forEach((star, index) => {
            if (index < selectedRating) {
                star.classList.add('active');
            }
        });
    }
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < hoverRating) {
                    s.style.color = '#ffa500';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.style.color = '#ffa500';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    // Handle form submission
    document.getElementById('ratingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedRating === 0) {
            alert("Please select a rating!");
            return;
        }
        
        const comment = document.getElementById('commentText').value.trim();
        
        if (!comment) {
            alert("Please write a review!");
            return;
        }
        
        submitRating(bookId, selectedRating, comment);
    });
}

function renderComments(bookId) {
    const ratings = getRatings(bookId);
    const container = document.getElementById('commentsContainer');
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (ratings.length === 0) {
        container.innerHTML = '<p class="no-comments">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    // Sort by date (newest first)
    ratings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = ratings.map(rating => {
        const date = new Date(rating.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const canDelete = currentUser && (currentUser.email === rating.userEmail || currentUser.role === 'admin');
        
        return `
            <div class="comment-card">
                <div class="comment-header">
                    <div>
                        <span class="comment-user">${rating.userName}</span>
                        ${canDelete ? `<button class="delete-comment-btn" onclick="deleteRating('${bookId}', '${rating.userEmail}')">Delete</button>` : ''}
                    </div>
                    <span class="comment-rating">${displayStars(rating.rating)}</span>
                </div>
                <p class="comment-date">${formattedDate}</p>
                <p class="comment-text">${rating.comment}</p>
            </div>
        `;
    }).join('');
}

// ===========================
// RENDER FAVORITES PAGE
// ===========================
function renderFavorites() {
    const bookList = document.querySelector(".bookList");
    if (!bookList || !window.location.pathname.includes('favorite.html')) return;
    
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        bookList.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Please login to view favorites!</p>';
        return;
    }
    
    const favorites = getFavorites();
    const books = getBooks();
    
    if (favorites.length === 0) {
        bookList.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No favorites yet. Start adding books!</p>';
        return;
    }
    
    bookList.innerHTML = "";
    
    favorites.forEach(bookIndex => {
        const book = books[bookIndex];
        if (!book) return;
        
        const avgRating = calculateAverageRating(bookIndex);
        const ratingsCount = getRatings(bookIndex).length;
        const ratingDisplay = ratingsCount > 0 ? `<div style="color: #ffa500; font-size: 14px; margin-top: 5px;">${displayStars(avgRating)} (${ratingsCount})</div>` : '';
        
        const article = document.createElement("article");
        article.className = "bookCard";
        
        article.innerHTML = `
            <div class="bookTag">${book.price}</div>
            <button class="favorite-btn favorited" data-index="${bookIndex}" onclick="toggleFavorite(${bookIndex})">❤️</button>
            <a href="productinfo.html?id=${bookIndex}"><img class="bookCover" src="${book.cover || 'images/book1.jpg'}" alt="${book.title}"></a>
            <div class="bookInfo">
                <h3 class="bookName">${book.title}</h3>
                <p class="bookAuthor">by ${book.author}</p>
                ${ratingDisplay}
            </div>
        `;
        
        bookList.appendChild(article);
    });
}

// ===========================
// SEARCH & FILTER
// ===========================
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        filterBooks(query);
    });
}

function filterBooks(query) {
    const bookList = document.querySelector(".bookList");
    if (!bookList) return;
    
    const books = getBooks();
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    
    bookList.innerHTML = "";
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (filtered.length === 0) {
        bookList.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No books found matching your search.</p>';
        return;
    }
    
    filtered.forEach((book, index) => {
        const originalIndex = books.indexOf(book);
        const article = document.createElement("article");
        article.className = "bookCard";
        
        const avgRating = calculateAverageRating(originalIndex);
        const ratingsCount = getRatings(originalIndex).length;
        const ratingDisplay = ratingsCount > 0 ? `<div style="color: #ffa500; font-size: 14px; margin-top: 5px;">${displayStars(avgRating)} (${ratingsCount})</div>` : '';
        
        article.innerHTML = `
            <div class="bookTag">${book.price}</div>
            ${user && user.role === "customer" ? `<button class="favorite-btn" data-index="${originalIndex}" onclick="toggleFavorite(${originalIndex})">🤍</button>` : ''}
            <a href="productinfo.html?id=${originalIndex}"><img class="bookCover" src="${book.cover || 'images/book1.jpg'}" alt="${book.title}"></a>
            <div class="bookInfo">
                <h3 class="bookName">${book.title}</h3>
                <p class="bookAuthor">by ${book.author}</p>
                ${ratingDisplay}
            </div>
        `;
        
        bookList.appendChild(article);
    });
    
    if (user && user.role === "customer") {
        updateFavoriteButtons();
    }
}

// ===========================
// USER DISPLAY & UI
// ===========================
function showLoggedUser() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const displaySpan = document.querySelector(".userDisplay");
    const loginBtn = document.querySelector(".loginBtn");
    const logoutBtn = document.querySelector(".logoutBtn");
    const favoriteBtn = document.querySelector('.headerBtns a[href="favorite.html"] button');

    if (user) {
        if (displaySpan) displaySpan.textContent = `Hello, ${user.name}`;
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (favoriteBtn && user.role === "customer") favoriteBtn.hidden = false;
    } else {
        if (displaySpan) displaySpan.textContent = "";
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (favoriteBtn) favoriteBtn.hidden = true;
    }
}

// ===========================
// MOBILE MENU TOGGLE
// ===========================
const menuToggle = document.querySelector(".menuToggle");
const navBar = document.querySelector(".navBar");

if (menuToggle && navBar) {
    menuToggle.addEventListener("click", () => {
        navBar.classList.toggle("active");
    });
}

// ===========================
// PAGE LOAD
// ===========================
window.onload = () => {
    showLoggedUser();
    
    // Admin pages
    if (typeof renderBooksTable === "function") renderBooksTable();
    if (typeof renderCustomers === "function") renderCustomers();
    if (typeof renderMessages === "function") renderMessages();
    
    // Customer pages
    renderProducts();
    renderProductDetails();
    renderFavorites();
    setupSearch();
};