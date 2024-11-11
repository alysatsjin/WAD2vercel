app.component("nav-bar", {
    template:
        `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="index.html">RentMyTools
                <i class="fa-solid fa-house"></i>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            <!-- To Show Only After User Login -->    
            <div v-if="isLoggedIn" class="ms-auto">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a href="searchProducts.html">
                            <button class="btn btn-outline-primary" type="submit">Search</button>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="profile.html">Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="cart.html">
                            Cart <i class="fa-solid fa-cart-shopping"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-outline-secondary" type="submit" @click=logout()>Logout</button>
                    </li>
                </ul>
            </div>
            <div v-else class="ms-auto">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a href="searchProducts.html">
                            <button class="btn btn-outline-primary" type="submit">Search</button>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="register.html">Register</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="login.html">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="cart.html">
                            Cart <i class="fa-solid fa-cart-shopping"></i>
                        </a>
                    </li>
                </ul>
            </div>
            </div>
        </div>
    </nav>
    <div id='logoutAlert'></div>
    `,

    computed: {
        isLoggedIn() {
            return !!sessionStorage.getItem('userId');
        }
    },

    methods: {
        logout() {
            sessionStorage.setItem('userId', "")
            this.showFloatingAlert('Successfully logged out')
        },
        showFloatingAlert(message, type = 'success', redirectUrl='index.html',delay = 1000) {
            // Create the alert div
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible floating-alert fade`;
            alertDiv.role = 'alert';
        
            // Set the alert message with close button
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              `;
        
            // Append to alert container
            document.getElementById('logoutAlert').appendChild(alertDiv);
        
            // Show the alert by adding 'show' class after a brief delay
            setTimeout(() => alertDiv.classList.add('show'), 10);
        
            // Remove the alert after a specified delay
            setTimeout(() => {
                alertDiv.classList.remove('show');
                alertDiv.addEventListener('transitionend', () => alertDiv.remove());
            }, delay + 500); // Delay plus the fade out time
            if (type == 'success') {
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, delay);
            }
        }
    }
})

app.component("template-footer", {
    template: `<footer class="text-center mt-5 mb-3 text-center">
            &copy; 2024 RentMyTools. All rights reserved.
        </footer>`
})