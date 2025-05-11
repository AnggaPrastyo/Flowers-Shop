// File: js/auth.js
// Script untuk halaman login dan registrasi

// Fungsi untuk toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    if (icon) {
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    }
  } else {
    input.type = "password";
    if (icon) {
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
  }
}

// Fungsi untuk validasi email
function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Fungsi untuk validasi password
function validatePassword(password) {
  // Minimal 8 karakter
  return password.length >= 8;
}

// Fungsi untuk validasi nomor telepon
function validatePhone(phone) {
  // Format nomor telepon Indonesia: +62 atau 08 diikuti 8-12 digit
  const re = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
  return re.test(phone);
}

// Fungsi untuk validasi form login
function validateLoginForm() {
  let isValid = true;

  // Validasi email
  const email = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  if (!email.value) {
    showError(email, emailError, "Email harus diisi");
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError(email, emailError, "Format email tidak valid");
    isValid = false;
  } else {
    hideError(email, emailError);
  }

  // Validasi password
  const password = document.getElementById("password");
  const passwordError = document.getElementById("password-error");

  if (!password.value) {
    showError(password, passwordError, "Password harus diisi");
    isValid = false;
  } else {
    hideError(password, passwordError);
  }

  return isValid;
}

// Fungsi untuk validasi form registrasi
function validateRegistrationForm() {
  let isValid = true;

  // Validasi nama
  const nama = document.getElementById("nama");
  const namaError = document.getElementById("nama-error");

  if (!nama.value) {
    showError(nama, namaError, "Nama harus diisi");
    isValid = false;
  } else {
    hideError(nama, namaError);
  }

  // Validasi username
  const username = document.getElementById("username");
  const usernameError = document.getElementById("username-error");

  if (!username.value) {
    showError(username, usernameError, "Username harus diisi");
    isValid = false;
  } else if (username.value.length < 4) {
    showError(username, usernameError, "Username minimal 4 karakter");
    isValid = false;
  } else {
    hideError(username, usernameError);
  }

  // Validasi email
  const email = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  if (!email.value) {
    showError(email, emailError, "Email harus diisi");
    isValid = false;
  } else if (!validateEmail(email.value)) {
    showError(email, emailError, "Format email tidak valid");
    isValid = false;
  } else {
    hideError(email, emailError);
  }

  // Validasi telepon
  const telepon = document.getElementById("telepon");
  const teleponError = document.getElementById("telepon-error");

  if (!telepon.value) {
    showError(telepon, teleponError, "Nomor telepon harus diisi");
    isValid = false;
  } else if (!validatePhone(telepon.value)) {
    showError(
      telepon,
      teleponError,
      "Format nomor telepon tidak valid (contoh: 08123456789)"
    );
    isValid = false;
  } else {
    hideError(telepon, teleponError);
  }

  // Validasi alamat
  const alamat = document.getElementById("alamat");
  const alamatError = document.getElementById("alamat-error");

  if (!alamat.value) {
    showError(alamat, alamatError, "Alamat harus diisi");
    isValid = false;
  } else {
    hideError(alamat, alamatError);
  }

  // Validasi password
  const password = document.getElementById("password");
  const passwordError = document.getElementById("password-error");

  if (!password.value) {
    showError(password, passwordError, "Password harus diisi");
    isValid = false;
  } else if (!validatePassword(password.value)) {
    showError(password, passwordError, "Password minimal 8 karakter");
    isValid = false;
  } else {
    hideError(password, passwordError);
  }

  // Validasi konfirmasi password
  const konfirmasiPassword = document.getElementById("konfirmasi_password");
  const konfirmasiPasswordError = document.getElementById(
    "konfirmasi-password-error"
  );

  if (!konfirmasiPassword.value) {
    showError(
      konfirmasiPassword,
      konfirmasiPasswordError,
      "Konfirmasi password harus diisi"
    );
    isValid = false;
  } else if (konfirmasiPassword.value !== password.value) {
    showError(
      konfirmasiPassword,
      konfirmasiPasswordError,
      "Konfirmasi password tidak sesuai"
    );
    isValid = false;
  } else {
    hideError(konfirmasiPassword, konfirmasiPasswordError);
  }

  // Validasi syarat dan ketentuan
  const syarat = document.getElementById("syarat");
  const syaratError = document.getElementById("syarat-error");

  if (!syarat.checked) {
    syaratError.textContent = "Anda harus menyetujui syarat dan ketentuan";
    syaratError.classList.add("show");
    isValid = false;
  } else {
    syaratError.textContent = "";
    syaratError.classList.remove("show");
  }

  return isValid;
}

// Fungsi untuk menampilkan error
function showError(input, errorElement, message) {
  input.parentElement.classList.add("error");
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

// Fungsi untuk menyembunyikan error
function hideError(input, errorElement) {
  input.parentElement.classList.remove("error");
  errorElement.textContent = "";
  errorElement.classList.remove("show");
}

// Fungsi untuk handle form login submit
function handleLoginSubmit(e) {
  e.preventDefault();

  if (validateLoginForm()) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember")?.checked || false;

    // Untuk demo, simpan data login di localStorage
    const userData = {
      email: email,
      nama: email.split("@")[0], // Gunakan bagian pertama email sebagai nama
      isLoggedIn: true,
      rememberMe: rememberMe,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    // Tampilkan pesan sukses (bisa diganti dengan redirect)
    alert("Login berhasil!");

    // Redirect ke halaman utama atau halaman sebelumnya
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");

    if (redirect) {
      window.location.href = redirect + ".html";
    } else {
      window.location.href = "index.html";
    }
  }
}

// Fungsi untuk handle form registrasi submit
function handleRegistrationSubmit(e) {
  e.preventDefault();

  if (validateRegistrationForm()) {
    const nama = document.getElementById("nama").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const telepon = document.getElementById("telepon").value;
    const alamat = document.getElementById("alamat").value;
    const password = document.getElementById("password").value;

    // Untuk demo, simpan data registrasi di localStorage
    const userData = {
      nama: nama,
      username: username,
      email: email,
      telepon: telepon,
      alamat: alamat,
      password: password, // Dalam aplikasi nyata, password seharusnya di-hash
      isLoggedIn: true,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    // Tampilkan pesan sukses (bisa diganti dengan redirect)
    alert("Registrasi berhasil!");

    // Redirect ke halaman utama
    window.location.href = "index.html";
  }
}

// Fungsi untuk mengecek apakah user sudah login
function checkLoginStatus() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  return userData.isLoggedIn === true;
}

// Fungsi untuk update UI berdasarkan status login
function updateUIBasedOnLoginStatus() {
  const isLoggedIn = checkLoginStatus();
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Elemen yang perlu diupdate
  const tombolLogin = document.getElementById("tombol-login");
  const mobileLogin = document.getElementById("mobile-login");
  const tombolUser = document.getElementById("tombol-user");
  const namaUser = document.querySelector(".nama-user");

  if (isLoggedIn) {
    // User sudah login
    if (tombolLogin) tombolLogin.style.display = "none";
    if (mobileLogin) mobileLogin.style.display = "none";
    if (tombolUser) {
      tombolUser.style.display = "block";
      if (namaUser) {
        namaUser.textContent = userData.nama || "Pengguna";
      }
    }
  } else {
    // User belum login
    if (tombolLogin) tombolLogin.style.display = "block";
    if (mobileLogin) mobileLogin.style.display = "block";
    if (tombolUser) tombolUser.style.display = "none";
  }
}

// Fungsi untuk logout
function logout() {
  // Ambil data user saat ini
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Hapus status login
  userData.isLoggedIn = false;

  // Jika rememberMe aktif, simpan kembali data user tanpa status login
  // Jika tidak, hapus data user sepenuhnya
  if (userData.rememberMe) {
    localStorage.setItem("user", JSON.stringify(userData));
  } else {
    localStorage.removeItem("user");
  }

  // Update UI
  updateUIBasedOnLoginStatus();

  // Tampilkan pesan
  alert("Logout berhasil!");

  // Redirect ke halaman utama
  window.location.href = "index.html";
}

// Initialize auth pages
document.addEventListener("DOMContentLoaded", function () {
  // Form login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Form registrasi
  const registrasiForm = document.getElementById("registrasi-form");
  if (registrasiForm) {
    registrasiForm.addEventListener("submit", handleRegistrationSubmit);
  }

  // Tombol logout
  const tombolLogout = document.getElementById("tombol-logout");
  if (tombolLogout) {
    tombolLogout.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Update UI berdasarkan status login
  updateUIBasedOnLoginStatus();

  // Update badge keranjang
  if (typeof updateJumlahKeranjang === "function") {
    updateJumlahKeranjang();
  }
});

// Dalam fungsi handleRegistrationSubmit
function handleRegistrationSubmit(e) {
  e.preventDefault();

  console.log("Memproses registrasi..."); // Tambahkan debug log

  if (validateRegistrationForm()) {
    // ...Kode lainnya...
    console.log("Data yang akan disimpan:", userData); // Log data yang disimpan

    localStorage.setItem("user", JSON.stringify(userData));

    console.log("Registrasi berhasil!"); // Konfirmasi registrasi

    // ...Kode lainnya...
  }
}

// Dalam fungsi handleLoginSubmit
function handleLoginSubmit(e) {
  e.preventDefault();

  console.log("Memproses login..."); // Tambahkan debug log

  if (validateLoginForm()) {
    // ...Kode lainnya...

    console.log("Data login:", userData); // Log data login

    localStorage.setItem("user", JSON.stringify(userData));

    // ...Kode lainnya...
  }
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Loaded, menyiapkan event listeners..."); // Debug log

  // Form login
  const loginForm = document.getElementById("login-form");
  console.log("Login form found:", !!loginForm); // Log apakah form ditemukan

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
    console.log("Login form event listener terpasang");
  }

  // Form registrasi
  const registrasiForm = document.getElementById("registrasi-form");
  console.log("Registrasi form found:", !!registrasiForm); // Log apakah form ditemukan

  if (registrasiForm) {
    registrasiForm.addEventListener("submit", handleRegistrationSubmit);
    console.log("Registrasi form event listener terpasang");
  }
});

// Registrasi pengguna baru (jalankan di konsol browser)
function testRegistrasi() {
  const userData = {
    nama: "user",
    username: "testuser",
    email: "test@gmail.com",
    telepon: "0812",
    alamat: "sangatta",
    password: "12345678",
    isLoggedIn: true,
  };

  localStorage.setItem("user", JSON.stringify(userData));
  console.log("Test user berhasil didaftarkan");

  // Memperbarui UI jika fungsi tersedia
  if (typeof updateUIBasedOnLoginStatus === "function") {
    updateUIBasedOnLoginStatus();
  } else {
    console.log("Fungsi updateUI tidak tersedia");
  }

  return "Registrasi berhasil, silakan refresh halaman";
}

// Login pengguna (jalankan di konsol browser)
function testLogin() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  userData.isLoggedIn = true;

  localStorage.setItem("user", JSON.stringify(userData));
  console.log("Login berhasil dengan user:", userData);

  // Memperbarui UI jika fungsi tersedia
  if (typeof updateUIBasedOnLoginStatus === "function") {
    updateUIBasedOnLoginStatus();
  } else {
    console.log("Fungsi updateUI tidak tersedia");
  }

  return "Login berhasil, silakan refresh halaman";
}

// Fungsi untuk memperbaiki form registrasi agar menampilkan notifikasi
function perbaikiFormRegistrasi() {
  console.log("Memperbaiki form registrasi...");

  const registrasiForm = document.getElementById("registrasi-form");
  if (registrasiForm) {
    // Reset form
    const newForm = registrasiForm.cloneNode(true);
    registrasiForm.parentNode.replaceChild(newForm, registrasiForm);

    // Tambahkan event listener baru
    newForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form registrasi disubmit");

      // Dapatkan nilai dari form
      const nama = document.getElementById("nama")?.value;
      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;

      if (nama && email && password) {
        // Simpan data user
        const userData = {
          nama: nama,
          email: email,
          isLoggedIn: true,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Tampilkan notifikasi
        tampilkanNotifikasi(
          "Registrasi berhasil! Anda akan dialihkan ke halaman utama.",
          "success"
        );

        // Redirect setelah delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        tampilkanNotifikasi("Mohon isi semua field yang diperlukan", "error");
      }
    });

    console.log("Form registrasi diperbaiki");
  }
}

// Fungsi untuk memperbaiki form login
function perbaikiFormLogin() {
  console.log("Memperbaiki form login...");

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    // Reset form
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);

    // Tambahkan event listener baru
    newForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form login disubmit");

      // Dapatkan nilai dari form
      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;

      if (email && password) {
        // Simpan data user
        const userData = {
          email: email,
          nama: email.split("@")[0],
          isLoggedIn: true,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Tampilkan notifikasi
        tampilkanNotifikasi(
          "Login berhasil! Anda akan dialihkan ke halaman utama.",
          "success"
        );

        // Redirect setelah delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        tampilkanNotifikasi("Mohon isi email dan password", "error");
      }
    });

    console.log("Form login diperbaiki");
  }
}

// Fungsi untuk mengecek apakah ada produk di keranjang
function cekKeranjang() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const totalItems = keranjang.reduce((total, item) => total + item.jumlah, 0);

  // Update badge keranjang
  const badgeKeranjang = document.querySelectorAll(".badge-keranjang");
  badgeKeranjang.forEach((badge) => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });

  return totalItems;
}

// Fungsi untuk menambahkan produk ke keranjang dengan notifikasi
function tambahKeKeranjangDenganNotifikasi(id, nama, harga, jumlah = 1) {
  // Ambil data keranjang dari localStorage
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Cek apakah produk sudah ada di keranjang
  const index = keranjang.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Jika produk sudah ada, tambah jumlahnya
    keranjang[index].jumlah += jumlah;
  } else {
    // Jika produk belum ada, tambahkan produk baru
    keranjang.push({
      id: id,
      nama: nama,
      harga: harga,
      jumlah: jumlah,
    });
  }

  // Simpan kembali ke localStorage
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  // Update tampilan jumlah item di keranjang
  cekKeranjang();

  // Tampilkan notifikasi
  tampilkanNotifikasi(`${nama} berhasil ditambahkan ke keranjang!`, "success");
}

// Jalankan perbaikan saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  console.log("Menjalankan perbaikan keranjang dan notifikasi...");

  // Perbaiki link keranjang di semua halaman
  perbaikiLinkKeranjang();

  // Perbaiki form login/registrasi jika di halaman yang sesuai
  if (window.location.href.includes("login.html")) {
    perbaikiFormLogin();
  } else if (window.location.href.includes("registrasi.html")) {
    perbaikiFormRegistrasi();
  }

  // Periksa keranjang
  cekKeranjang();

  // Tambahkan event listener untuk tombol "Pesan Sekarang"
  const tombolPesan = document.querySelectorAll(".cta-pesan");
  tombolPesan.forEach((tombol) => {
    // Clone tombol untuk menghapus event listener lama
    const newTombol = tombol.cloneNode(true);
    tombol.parentNode.replaceChild(newTombol, tombol);

    // Tambahkan event listener baru
    newTombol.addEventListener("click", function (e) {
      e.preventDefault();

      // Cek login
      const isLoggedIn =
        JSON.parse(localStorage.getItem("user"))?.isLoggedIn === true;

      if (isLoggedIn) {
        // Ambil data produk dari atribut data-*
        const id = this.getAttribute("data-id") || "1";
        const nama = this.getAttribute("data-nama") || "Bunga";
        const harga = parseInt(this.getAttribute("data-harga") || "100000");

        // Tambahkan ke keranjang dengan notifikasi
        tambahKeKeranjangDenganNotifikasi(id, nama, harga);
      } else {
        // Tampilkan notifikasi login
        tampilkanNotifikasi(
          "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang",
          "error"
        );

        // Redirect ke halaman login setelah delay
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      }
    });
  });
});
