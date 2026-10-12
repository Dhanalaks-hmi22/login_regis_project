// =====================================
// 1. Reusable Functions
// =====================================

// Get an HTML element by ID
const getElement = (id) => document.getElementById(id);

// Show a message with a style
const showMessage = (element, text, type) => {
    if (!element) return;

    element.innerText = text;
    element.className = "message " + type;
};

// Validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Get registered user from browser storage
const getRegisteredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("registeredUser")) || null;
    } catch (error) {
        return null;
    }
};


// =====================================
// 2. Registration Form
// =====================================

const registerForm = getElement("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const name = getElement("name").value.trim();
        const email = getElement("register-email").value.trim().toLowerCase();
        const password = getElement("register-password").value;
        const confirmPassword = getElement("confirm-password").value;

        const registerMessage = getElement("register-message");

        // Validate empty fields
        if (!name || !email || !password || !confirmPassword) {

            showMessage(
                registerMessage,
                "Please fill in all fields.",
                "error"
            );

            return;
        }

        // Validate name
        if (name.length < 2) {

            showMessage(
                registerMessage,
                "Name must contain at least 2 characters.",
                "error"
            );

            return;
        }

        // Validate email
        if (!isValidEmail(email)) {

            showMessage(
                registerMessage,
                "Please enter a valid email address.",
                "error"
            );

            return;
        }

        // Validate password length
        if (password.length < 6) {

            showMessage(
                registerMessage,
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }

        // Check password confirmation
        if (password !== confirmPassword) {

            showMessage(
                registerMessage,
                "Passwords do not match.",
                "error"
            );

            return;
        }

        // Check if this email is already registered
        const existingUser = getRegisteredUser();

        if (existingUser && existingUser.email === email) {

            showMessage(
                registerMessage,
                "This email is already registered. Please login.",
                "error"
            );

            return;
        }

        // Store user information in browser storage.
        // DEMO ONLY: Never store plain-text passwords in a real application.
        const user = {
            name: name,
            email: email,
            password: password
        };

        try {

            localStorage.setItem("registeredUser", JSON.stringify(user));

            showMessage(
                registerMessage,
                "Account created successfully! Redirecting to login...",
                "success"
            );

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);

        } catch (error) {

            showMessage(
                registerMessage,
                "Unable to save account in this browser.",
                "error"
            );

        }

    });

}


// =====================================
// 3. Login Form
// =====================================

const loginForm = getElement("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = getElement("login-email").value.trim().toLowerCase();
        const password = getElement("login-password").value;

        const loginMessage = getElement("login-message");

        // Validate empty fields
        if (!email || !password) {

            showMessage(
                loginMessage,
                "Please enter your email and password.",
                "error"
            );

            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {

            showMessage(
                loginMessage,
                "Please enter a valid email address.",
                "error"
            );

            return;
        }

        // Get registered user
        const user = getRegisteredUser();

        // Check login details
        if (
            user &&
            user.email === email &&
            user.password === password
        ) {

            try {

                // Store logged-in session information
                sessionStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({
                        name: user.name,
                        email: user.email
                    })
                );

                showMessage(
                    loginMessage,
                    "Login successful! Opening dashboard...",
                    "success"
                );

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 800);

            } catch (error) {

                showMessage(
                    loginMessage,
                    "Unable to start the login session.",
                    "error"
                );

            }

        } else {

            showMessage(
                loginMessage,
                "Invalid email or password. Please register first if you are new.",
                "error"
            );

        }

    });

}


// =====================================
// 4. Dashboard Access and User Details
// =====================================

const userName = getElement("user-name");

if (userName) {

    let loggedInUser = null;

    try {
        loggedInUser = JSON.parse(
            sessionStorage.getItem("loggedInUser")
        );
    } catch (error) {
        loggedInUser = null;
    }

    if (!loggedInUser) {

        window.location.replace("index.html");

    } else {

        userName.innerText = loggedInUser.name;

        getElement("user-email").innerText = loggedInUser.email;

    }

}


// =====================================
// 5. Logout
// =====================================

const logoutButton = getElement("logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem("loggedInUser");

        window.location.href = "index.html";

    });

}