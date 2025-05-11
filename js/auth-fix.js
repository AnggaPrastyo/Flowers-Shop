// File: auth-fix.js
// Script untuk memperbaiki masalah login/registrasi

// Fungsi untuk membuat akun demo
function buatAkunDemo() {
  // Data pengguna demo
  const userData = {
    nama: "User Demo",
    username: "demo",
    email: "demo@example.com",
    telepon: "081234567890",
    alamat: "Jl. Contoh No. 123, Samarinda",
    isLoggedIn: true,
  };

  // Simpan data user di localStorage
  localStorage.setItem("user", JSON.stringify(userData));

  // Update tampilan UI
  updateUISetelahLogin();

  // Update badge keranjang jika ada
  if (typeof updateJumlahKeranjang === "function") {
    updateJumlahKeranjang();
  }

  alert("Akun demo berhasil dibuat! Anda sekarang sudah login.");

  // Refresh halaman untuk melihat perubahan
  window.location.reload();
}

// Fungsi untuk login dengan akun demo
function loginDenganDemo() {
  // Cek apakah sudah ada data user
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Update status login
  userData.isLoggedIn = true;

  // Simpan kembali ke localStorage
  localStorage.setItem("user", JSON.stringify(userData));

  // Update UI
  updateUISetelahLogin();

  alert("Login berhasil dengan akun demo!");

  // Refresh halaman atau redirect ke halaman utama
  window.location.href = "index.html";
}

// Fungsi untuk logout
function logoutDemo() {
  // Hapus status login dari user data
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  userData.isLoggedIn = false;
  localStorage.setItem("user", JSON.stringify(userData));

  // Update UI
  updateUISetelahLogin();

  alert("Logout berhasil!");

  // Refresh halaman
  window.location.reload();
}

// Fungsi untuk mengecek apakah user sudah login
function cekStatusLogin() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  return userData.isLoggedIn === true;
}

// Fungsi untuk memperbaiki form login
function perbaikiFormLogin() {
  console.log("Memperbaiki form login...");

  // Hapus form duplikat jika ada
  const formLogin = document.querySelectorAll("#login-form");
  if (formLogin.length > 1) {
    // Hapus form yang kedua
    formLogin[1].remove();
    console.log("Form login duplikat dihapus");
  }

  // Dapatkan form login yang tersisa
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    // Hapus event listener lama (jika ada)
    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);

    // Tambahkan event listener baru
    newLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form login submit");

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email && password) {
        // Simpan data user untuk demo
        const userData = {
          email: email,
          nama: email.split("@")[0],
          isLoggedIn: true,
        };

        // Simpan ke localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        alert("Login berhasil!");

        // Redirect ke halaman utama
        window.location.href = "index.html";
      } else {
        alert("Mohon isi email dan password");
      }
    });

    console.log("Event listener form login diperbaiki");
  }
}

// Fungsi untuk memperbaiki form registrasi
function perbaikiFormRegistrasi() {
  console.log("Memperbaiki form registrasi...");

  // Hapus form duplikat jika ada
  const formRegistrasi = document.querySelectorAll("#registrasi-form");
  if (formRegistrasi.length > 1) {
    // Hapus form yang kedua
    formRegistrasi[1].remove();
    console.log("Form registrasi duplikat dihapus");
  }

  // Dapatkan form registrasi yang tersisa
  const registrasiForm = document.getElementById("registrasi-form");

  if (registrasiForm) {
    // Hapus event listener lama (jika ada)
    const newRegistrasiForm = registrasiForm.cloneNode(true);
    registrasiForm.parentNode.replaceChild(newRegistrasiForm, registrasiForm);

    // Tambahkan event listener baru
    newRegistrasiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form registrasi submit");

      const nama = document.getElementById("nama")?.value;
      const username = document.getElementById("username")?.value;
      const email = document.getElementById("email")?.value;
      const telepon = document.getElementById("telepon")?.value;
      const alamat = document.getElementById("alamat")?.value;
      const password = document.getElementById("password")?.value;

      if (nama && email && password) {
        // Simpan data user untuk demo
        const userData = {
          nama: nama,
          username: username || email.split("@")[0],
          email: email,
          telepon: telepon || "",
          alamat: alamat || "",
          isLoggedIn: true,
        };

        // Simpan ke localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        alert("Registrasi berhasil!");

        // Redirect ke halaman utama
        window.location.href = "index.html";
      } else {
        alert("Mohon isi data yang diperlukan");
      }
    });

    console.log("Event listener form registrasi diperbaiki");
  }
}

// Tambahkan tombol demo login/register ke halaman
function tambahkanTombolDemo() {
  // Cek halaman saat ini
  const isLoginPage = window.location.href.includes("login.html");
  const isRegisterPage = window.location.href.includes("registrasi.html");

  if (isLoginPage || isRegisterPage) {
    // Buat container untuk tombol demo
    const demoContainer = document.createElement("div");
    demoContainer.className = "demo-container";
    demoContainer.style.textAlign = "center";
    demoContainer.style.marginTop = "1.5rem";
    demoContainer.style.padding = "1rem";
    demoContainer.style.backgroundColor = "#f8f9fa";
    demoContainer.style.borderRadius = "8px";

    // Tambahkan judul
    const demoTitle = document.createElement("h5");
    demoTitle.textContent = "Opsi Demo Cepat";
    demoTitle.style.marginBottom = "1rem";
    demoContainer.appendChild(demoTitle);

    // Tambahkan deskripsi
    const demoDesc = document.createElement("p");
    demoDesc.textContent = "Untuk keperluan testing, gunakan opsi berikut:";
    demoDesc.style.fontSize = "0.9rem";
    demoDesc.style.marginBottom = "1rem";
    demoContainer.appendChild(demoDesc);

    // Tambahkan tombol demo
    const demoButton = document.createElement("button");
    demoButton.textContent = isLoginPage
      ? "Login dengan Akun Demo"
      : "Buat Akun Demo";
    demoButton.className = "btn-submit";
    demoButton.style.backgroundColor = "#6d878c";
    demoButton.style.marginBottom = "0.5rem";
    demoButton.addEventListener("click", function () {
      if (isLoginPage) {
        loginDenganDemo();
      } else {
        buatAkunDemo();
      }
    });
    demoContainer.appendChild(demoButton);

    // Tambahkan container ke halaman
    const authBox = document.querySelector(".auth-box");
    if (authBox) {
      authBox.appendChild(demoContainer);
    }
  }
}

// Jalankan perbaikan saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, menjalankan perbaikan...");

  // Perbaiki form login/registrasi
  if (window.location.href.includes("login.html")) {
    perbaikiFormLogin();
  } else if (window.location.href.includes("registrasi.html")) {
    perbaikiFormRegistrasi();
  }

  // Tambahkan tombol demo
  tambahkanTombolDemo();

  // Update UI berdasarkan status login
  if (typeof updateUISetelahLogin === "function") {
    updateUISetelahLogin();
  }
});
