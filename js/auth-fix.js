// Flowers Shop - Hybrid Authentication System
// FIXED: Registrasi → Login page (bukan langsung dashboard)

class FlowersAuthHybrid {
  constructor() {
    this.apiBase = "/flowers_shop/api/";
    this.useAPI = true; // Set false untuk mode demo saja
    this.init();
  }

  init() {
    console.log("FlowersAuth Hybrid initialized");
    this.bindEvents();
    this.checkAuthStatus();
    this.addDemoButtons();
  }

  bindEvents() {
    // Register form
    const registerForm =
      document.getElementById("registerForm") ||
      document.getElementById("registrasi-form");
    if (registerForm) {
      // Remove existing listeners
      const newForm = registerForm.cloneNode(true);
      registerForm.parentNode.replaceChild(newForm, registerForm);

      newForm.addEventListener("submit", (e) => this.handleRegister(e));
    }

    // Login form
    const loginForm =
      document.getElementById("loginForm") ||
      document.getElementById("login-form");
    if (loginForm) {
      // Remove existing listeners
      const newForm = loginForm.cloneNode(true);
      loginForm.parentNode.replaceChild(newForm, loginForm);

      newForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Logout buttons
    const logoutBtns = document.querySelectorAll(
      '.logout-btn, [onclick*="logout"]'
    );
    logoutBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleLogout(e));
    });
  }

  async handleRegister(e) {
    e.preventDefault();

    const form = e.target;

    // Get form values (support both naming conventions)
    const name = this.getFormValue(form, ["name", "nama"]);
    const username = this.getFormValue(form, ["username"]);
    const email = this.getFormValue(form, ["email"]);
    const password = this.getFormValue(form, ["password"]);
    const confirmPassword = this.getFormValue(form, [
      "confirm_password",
      "konfirmasi_password",
    ]);
    const phone = this.getFormValue(form, ["phone", "telepon"]);
    const address = this.getFormValue(form, ["address", "alamat"]);

    // Validation
    if (!name || !email || !password) {
      this.showAlert("Nama, email, dan password harus diisi!", "error");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      this.showAlert("Password dan konfirmasi password tidak cocok!", "error");
      return;
    }

    if (password.length < 6) {
      this.showAlert("Password minimal 6 karakter!", "error");
      return;
    }

    try {
      this.showLoading(true);

      if (this.useAPI) {
        // Try API first
        const success = await this.registerViaAPI({
          name,
          email,
          password,
          confirm_password: confirmPassword,
        });

        if (!success) {
          // Fallback to localStorage
          this.registerViaLocalStorage({
            name,
            username,
            email,
            password,
            phone,
            address,
          });
        }
      } else {
        // Direct localStorage
        this.registerViaLocalStorage({
          name,
          username,
          email,
          password,
          phone,
          address,
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      this.showAlert("Terjadi kesalahan, menggunakan mode demo...", "warning");
      this.registerViaLocalStorage({
        name,
        username,
        email,
        password,
        phone,
        address,
      });
    } finally {
      this.showLoading(false);
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = this.getFormValue(form, ["email"]);
    const password = this.getFormValue(form, ["password"]);

    if (!email || !password) {
      this.showAlert("Email dan password harus diisi!", "error");
      return;
    }

    try {
      this.showLoading(true);

      if (this.useAPI) {
        // Try API first
        const success = await this.loginViaAPI({ email, password });

        if (!success) {
          // Fallback to localStorage
          this.loginViaLocalStorage(email, password);
        }
      } else {
        // Direct localStorage
        this.loginViaLocalStorage(email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showAlert("Terjadi kesalahan, menggunakan mode demo...", "warning");
      this.loginViaLocalStorage(email, password);
    } finally {
      this.showLoading(false);
    }
  }

  async registerViaAPI(data) {
    try {
      const response = await fetch(this.apiBase + "register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        this.showAlert(
          "Registrasi berhasil via API! Data tersimpan ke database. Silakan login.",
          "success"
        );
        // FIXED: Redirect ke login.html
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
        return true;
      } else {
        throw new Error(result.message || "API registration failed");
      }
    } catch (error) {
      console.error("API Register failed:", error);
      return false;
    }
  }

  registerViaLocalStorage(data) {
    const userData = {
      nama: data.name,
      username: data.username || data.email.split("@")[0],
      email: data.email,
      telepon: data.phone || "",
      alamat: data.address || "",
      password: data.password, // In real app, this should be hashed
      isLoggedIn: false, // FIXED: Jangan auto login, user harus login manual
    };

    // Simpan data user tanpa login
    const existingUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );
    existingUsers.push(userData);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

    this.showAlert(
      "Registrasi berhasil! Akun lokal dibuat. Silakan login.",
      "success"
    );

    // FIXED: Redirect ke login.html, bukan index.html
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  }

  async loginViaAPI(data) {
    try {
      const response = await fetch(this.apiBase + "login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Store user data
        if (result.user) {
          const userData = {
            nama: result.user.name,
            email: result.user.email,
            isLoggedIn: true,
            loginMethod: "api",
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        this.showAlert("Login berhasil via API!", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
        return true;
      } else {
        throw new Error(result.message || "API login failed");
      }
    } catch (error) {
      console.error("API Login failed:", error);
      return false;
    }
  }

  loginViaLocalStorage(email, password) {
    // FIXED: Cek dari registeredUsers array, bukan single user
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );
    const foundUser = registeredUsers.find((user) => user.email === email);

    if (foundUser) {
      if (foundUser.password === password) {
        // Set user sebagai logged in
        const userData = {
          nama: foundUser.nama,
          username: foundUser.username,
          email: foundUser.email,
          telepon: foundUser.telepon,
          alamat: foundUser.alamat,
          isLoggedIn: true,
          loginMethod: "localStorage",
        };
        localStorage.setItem("user", JSON.stringify(userData));

        this.showAlert("Login berhasil dengan akun lokal!", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        this.showAlert("Password salah!", "error");
      }
    } else {
      // Fallback: cek single user format (backward compatibility)
      const singleUser = JSON.parse(localStorage.getItem("user"));
      if (singleUser && singleUser.email === email) {
        if (singleUser.password === password) {
          singleUser.isLoggedIn = true;
          singleUser.loginMethod = "localStorage";
          localStorage.setItem("user", JSON.stringify(singleUser));

          this.showAlert("Login berhasil dengan akun lokal!", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        } else {
          this.showAlert("Password salah!", "error");
        }
      } else {
        this.showAlert(
          "Email tidak ditemukan. Silakan daftar terlebih dahulu.",
          "error"
        );
      }
    }
  }

  async handleLogout(e) {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData && userData.loginMethod === "api" && this.useAPI) {
        // Logout via API
        await fetch(this.apiBase + "logout.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Clear current user session
      localStorage.removeItem("user");

      this.showAlert("Logout berhasil!", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  }

  checkAuthStatus() {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.isLoggedIn) {
      this.updateAuthUI(true, userData.nama || userData.email);
    } else {
      this.updateAuthUI(false);
    }
  }

  // Demo functions - FIXED: Jangan auto login untuk demo registration
  createDemoAccount() {
    const userData = {
      nama: "User Demo",
      username: "demo",
      email: "demo@example.com",
      telepon: "081234567890",
      alamat: "Jl. Contoh No. 123, Samarinda",
      password: "demo123", // Add password for demo
      isLoggedIn: false, // FIXED: Jangan auto login
    };

    // Save to registeredUsers instead of direct login
    const existingUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    // Check if demo user already exists
    const existingDemo = existingUsers.find(
      (user) => user.email === userData.email
    );
    if (!existingDemo) {
      existingUsers.push(userData);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
    }

    this.showAlert(
      "Akun demo berhasil dibuat! Email: demo@example.com, Password: demo123",
      "success"
    );
    setTimeout(() => {
      window.location.href = "login.html"; // FIXED: Redirect ke login
    }, 3000);
  }

  loginWithDemo() {
    const userData = {
      nama: "User Demo",
      email: "demo@example.com",
      isLoggedIn: true,
      loginMethod: "demo",
    };

    localStorage.setItem("user", JSON.stringify(userData));
    this.showAlert("Login berhasil dengan akun demo!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }

  // Add demo buttons to auth pages
  addDemoButtons() {
    const isLoginPage = window.location.href.includes("login.html");
    const isRegisterPage =
      window.location.href.includes("registrasi.html") ||
      window.location.href.includes("register.html");

    if (isLoginPage || isRegisterPage) {
      const authBox =
        document.querySelector(".auth-box") ||
        document.querySelector(".auth-card") ||
        document.querySelector(".auth-container");

      if (authBox && !document.querySelector(".demo-container")) {
        const demoContainer = document.createElement("div");
        demoContainer.className = "demo-container";
        demoContainer.style.cssText = `
                    text-align: center;
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                `;

        demoContainer.innerHTML = `
                    <h5 style="margin-bottom: 1rem; color: #6c757d;">Opsi Demo Cepat</h5>
                    <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #6c757d;">
                        ${
                          isLoginPage
                            ? "Login dengan: demo@example.com / demo123"
                            : "Untuk testing, buat akun demo:"
                        }
                    </p>
                    <button type="button" class="demo-btn" style="
                        background: linear-gradient(135deg, #6d878c, #5c7378);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        margin: 0 5px;
                        transition: all 0.3s ease;
                    ">
                        ${isLoginPage ? "Login Demo" : "Buat Akun Demo"}
                    </button>
                `;

        const demoBtn = demoContainer.querySelector(".demo-btn");
        demoBtn.addEventListener("click", () => {
          if (isLoginPage) {
            this.loginWithDemo();
          } else {
            this.createDemoAccount();
          }
        });

        demoBtn.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-2px)";
          this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        });

        demoBtn.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0)";
          this.style.boxShadow = "none";
        });

        authBox.appendChild(demoContainer);
      }
    }
  }

  // Utility functions
  getFormValue(form, fieldNames) {
    for (let name of fieldNames) {
      const field = form.querySelector(`[name="${name}"], #${name}`);
      if (field && field.value) {
        return field.value.trim();
      }
    }
    return "";
  }

  updateAuthUI(isLoggedIn, userName = "") {
    // Update navigation based on auth status
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userNameSpan = document.getElementById("userName");

    if (isLoggedIn) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (userNameSpan) userNameSpan.textContent = userName;
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (userNameSpan) userNameSpan.textContent = "";
    }

    // Call existing update function if available
    if (typeof updateUISetelahLogin === "function") {
      updateUISetelahLogin();
    }
  }

  showAlert(message, type = "info") {
    // Remove existing alerts
    const existingAlert = document.querySelector(".flowers-alert");
    if (existingAlert) {
      existingAlert.remove();
    }

    const alert = document.createElement("div");
    alert.className = `flowers-alert flowers-alert-${type}`;
    alert.innerHTML = `
            <div class="flowers-alert-content">
                <span class="flowers-alert-icon">
                    ${
                      type === "success"
                        ? "✅"
                        : type === "error"
                        ? "❌"
                        : type === "warning"
                        ? "⚠️"
                        : "ℹ️"
                    }
                </span>
                <span class="flowers-alert-message">${message}</span>
                <button class="flowers-alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    // Add styles if not present
    if (!document.querySelector("#flowers-alert-styles")) {
      const style = document.createElement("style");
      style.id = "flowers-alert-styles";
      style.textContent = `
                .flowers-alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideInRight 0.3s ease-out;
                }
                .flowers-alert-content {
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: 'Arial', sans-serif;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .flowers-alert-success .flowers-alert-content {
                    background: linear-gradient(135deg, #4ade80, #22c55e);
                    color: white;
                }
                .flowers-alert-error .flowers-alert-content {
                    background: linear-gradient(135deg, #f87171, #ef4444);
                    color: white;
                }
                .flowers-alert-warning .flowers-alert-content {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    color: white;
                }
                .flowers-alert-info .flowers-alert-content {
                    background: linear-gradient(135deg, #60a5fa, #3b82f6);
                    color: white;
                }
                .flowers-alert-close {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                .flowers-alert-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(alert);

    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 5000);
  }

  showLoading(show) {
    const submitBtns = document.querySelectorAll(
      'button[type="submit"], .btn-submit'
    );
    submitBtns.forEach((btn) => {
      if (show) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML =
          '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite; margin-right: 8px;"></span> Loading...';
      } else {
        btn.disabled = false;
        if (btn.dataset.originalText) {
          btn.innerHTML = btn.dataset.originalText;
        }
      }
    });

    // Add spin animation if not present
    if (!document.querySelector("#spin-animation")) {
      const style = document.createElement("style");
      style.id = "spin-animation";
      style.textContent =
        "@keyframes spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.flowersAuth = new FlowersAuthHybrid();
});

// Global functions for backward compatibility
function buatAkunDemo() {
  if (window.flowersAuth) {
    window.flowersAuth.createDemoAccount();
  }
}

function loginDenganDemo() {
  if (window.flowersAuth) {
    window.flowersAuth.loginWithDemo();
  }
}

function logoutDemo() {
  if (window.flowersAuth) {
    window.flowersAuth.handleLogout({ preventDefault: () => {} });
  }
}
