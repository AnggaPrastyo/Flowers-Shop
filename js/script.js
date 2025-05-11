// File: js/script.js
// File JavaScript utama untuk semua fungsi website

// ===== BAGIAN KERANJANG =====

// Fungsi untuk menangani klik pada tombol "Pesan Sekarang"
function pesanProduk(id, nama, harga) {
  // Cek apakah user sudah login
  const sudahLogin = cekLogin();

  if (sudahLogin) {
    // Jika sudah login, tambahkan ke keranjang
    tambahKeKeranjang(id, nama, harga);
    tampilkanPesan("Produk berhasil ditambahkan ke keranjang!", "success");
  } else {
    // Jika belum login, tampilkan pesan login
    tampilkanPopupLogin();
  }
}

// Fungsi untuk memeriksa status login
function cekLogin() {
  // Untuk demo, gunakan localStorage untuk menyimpan status login
  const userData = localStorage.getItem("user");
  return userData !== null;
}

// Fungsi untuk menambahkan produk ke keranjang
function tambahKeKeranjang(id, nama, harga) {
  // Ambil data keranjang dari localStorage
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Cek apakah produk sudah ada di keranjang
  const index = keranjang.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Jika produk sudah ada, tambah jumlahnya
    keranjang[index].jumlah += 1;
  } else {
    // Jika produk belum ada, tambahkan produk baru
    keranjang.push({
      id: id,
      nama: nama,
      harga: harga,
      jumlah: 1,
    });
  }

  // Simpan keranjang yang sudah diupdate
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  // Update tampilan jumlah item di keranjang
  updateJumlahKeranjang();
}

// Fungsi untuk update tampilan jumlah item di keranjang
// Ganti fungsi updateJumlahKeranjang dengan yang berikut
function updateJumlahKeranjang() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const totalItems = keranjang.reduce((total, item) => total + item.jumlah, 0);

  const badgeKeranjang = document.querySelectorAll(".badge-keranjang");
  badgeKeranjang.forEach((badge) => {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  });
}

// Fungsi untuk menampilkan popup login
function tampilkanPopupLogin() {
  // Buat elemen popup
  const popupOverlay = document.createElement("div");
  popupOverlay.className = "popup-overlay";
  popupOverlay.innerHTML = `
      <div class="popup-login">
        <div class="popup-header">
          <h4>Login Diperlukan</h4>
          <button onclick="tutupPopup()" class="tombol-tutup">&times;</button>
        </div>
        <div class="popup-body">
          <p>Anda perlu login terlebih dahulu untuk menambahkan produk ke keranjang.</p>
          <div class="popup-buttons">
            <a href="login.html" class="tombol-login">Login</a>
            <a href="register.html" class="tombol-daftar">Daftar</a>
            <button onclick="tutupPopup()" class="tombol-batal">Batal</button>
          </div>
        </div>
      </div>
    `;

  // Tambahkan popup ke body
  document.body.appendChild(popupOverlay);

  // Tambahkan style CSS jika belum ada
  tambahkanStylePopup();
}

// Fungsi untuk menutup popup
function tutupPopup() {
  const popup = document.querySelector(".popup-overlay");
  if (popup) {
    popup.remove();
  }
}

// Fungsi untuk menampilkan pesan notifikasi
function tampilkanPesan(pesan, tipe = "info") {
  // Buat elemen pesan
  const elemenPesan = document.createElement("div");
  elemenPesan.className = `notifikasi ${tipe}`;
  elemenPesan.innerHTML = `
      <div class="notifikasi-konten">
        <span>${pesan}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="tombol-tutup">&times;</button>
      </div>
    `;

  // Tambahkan ke body
  document.body.appendChild(elemenPesan);

  // Tambahkan style CSS jika belum ada
  tambahkanStylePopup();

  // Hilangkan pesan setelah 3 detik
  setTimeout(() => {
    elemenPesan.classList.add("hilang");
    setTimeout(() => {
      elemenPesan.remove();
    }, 500);
  }, 3000);
}

// Fungsi untuk menambahkan style popup jika belum ada
function tambahkanStylePopup() {
  if (!document.getElementById("style-popup")) {
    const styleElement = document.createElement("style");
    styleElement.id = "style-popup";
    styleElement.textContent = `
        /* Style untuk badge keranjang */
        .badge-keranjang {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #f3c9b1;
          color: #36486b;
          font-size: 12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        /* Style untuk popup login */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .popup-login {
          background-color: white;
          width: 90%;
          max-width: 400px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .popup-header {
          padding: 15px 20px;
          background-color: #89aaaf;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .popup-header h4 {
          margin: 0;
          font-size: 18px;
        }
        
        .popup-body {
          padding: 20px;
        }
        
        .popup-body p {
          margin-top: 0;
          margin-bottom: 20px;
          color: #36486b;
        }
        
        .popup-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .tombol-login, .tombol-daftar, .tombol-batal {
          padding: 10px 15px;
          border-radius: 4px;
          text-decoration: none;
          text-align: center;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
        }
        
        .tombol-login {
          background-color: #89aaaf;
          color: white;
          flex: 1;
        }
        
        .tombol-daftar {
          background-color: #f3c9b1;
          color: #36486b;
          flex: 1;
        }
        
        .tombol-batal {
          background-color: #e9ecef;
          color: #36486b;
          flex: 1;
          border: none;
        }
        
        .tombol-tutup {
          background: none;
          border: none;
          font-size: 24px;
          color: white;
          cursor: pointer;
          line-height: 1;
        }
        
        /* Style untuk notifikasi */
        .notifikasi {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px;
          border-radius: 4px;
          background-color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          max-width: 300px;
          transition: opacity 0.5s;
        }
        
        .notifikasi.hilang {
          opacity: 0;
        }
        
        .notifikasi .notifikasi-konten {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .notifikasi.success {
          border-left: 4px solid #2ecc71;
        }
        
        .notifikasi.error {
          border-left: 4px solid #e74c3c;
        }
        
        .notifikasi.info {
          border-left: 4px solid #3498db;
        }
        
        .notifikasi .tombol-tutup {
          color: #adb5bd;
          font-size: 18px;
          margin-left: 10px;
        }
      `;
    document.head.appendChild(styleElement);
  }
}

// ===== BAGIAN USER (LOGIN/REGISTER) =====

// Fungsi untuk menangani login
function prosesLogin(e) {
  if (e) e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    // Untuk demo, login selalu berhasil
    // Pada implementasi sebenarnya, ini akan melakukan API call ke backend
    const userData = {
      email: email,
      nama: email.split("@")[0],
    };

    // Simpan data user di localStorage (untuk demo)
    localStorage.setItem("user", JSON.stringify(userData));

    // Tampilkan pesan sukses dan redirect ke halaman utama
    tampilkanPesan(
      "Login berhasil! Mengalihkan ke halaman utama...",
      "success"
    );

    // Redirect setelah delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    return false;
  } else {
    tampilkanPesan("Silakan isi semua field", "error");
    return false;
  }
}

// Fungsi untuk menangani register
function prosesRegister(e) {
  if (e) e.preventDefault();

  const nama = document.getElementById("nama")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const konfirmasiPassword = document.getElementById(
    "konfirmasi_password"
  )?.value;

  if (nama && email && password && konfirmasiPassword) {
    if (password !== konfirmasiPassword) {
      tampilkanPesan("Password dan konfirmasi password tidak cocok", "error");
      return false;
    }

    // Untuk demo, registrasi selalu berhasil
    // Pada implementasi sebenarnya, ini akan melakukan API call ke backend
    const userData = {
      nama: nama,
      email: email,
    };

    // Simpan data user di localStorage (untuk demo)
    localStorage.setItem("user", JSON.stringify(userData));

    // Tampilkan pesan sukses dan redirect ke halaman utama
    tampilkanPesan(
      "Registrasi berhasil! Mengalihkan ke halaman utama...",
      "success"
    );

    // Redirect setelah delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    return false;
  } else {
    tampilkanPesan("Silakan isi semua field", "error");
    return false;
  }
}

// Fungsi untuk logout
function logout() {
  // Hapus data user dari localStorage
  localStorage.removeItem("user");

  // Tampilkan pesan sukses
  tampilkanPesan("Logout berhasil", "success");

  // Update UI
  updateUISetelahLogin();
}

// Fungsi untuk update UI setelah login/logout
function updateUISetelahLogin() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const tombolLogin = document.getElementById("tombol-login");
  const mobileLogin = document.getElementById("mobile-login");
  const tombolUser = document.getElementById("tombol-user");

  if (userData) {
    // User sudah login
    if (tombolLogin) tombolLogin.style.display = "none";
    if (mobileLogin) mobileLogin.style.display = "none";
    if (tombolUser) {
      tombolUser.style.display = "block";

      // Update dropdown menu jika ada
      const namaUser = document.querySelector(".nama-user");
      if (namaUser) namaUser.textContent = userData.nama || "Pengguna";
    }
  } else {
    // User belum login
    if (tombolLogin) tombolLogin.style.display = "block";
    if (mobileLogin) mobileLogin.style.display = "block";
    if (tombolUser) tombolUser.style.display = "none";
  }
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Update jumlah keranjang
  updateJumlahKeranjang();

  // Update UI berdasarkan status login
  updateUISetelahLogin();

  // Tambahkan event handler untuk tombol pesan sekarang
  const tombolPesan = document.querySelectorAll(".cta-pesan");
  tombolPesan.forEach((tombol) => {
    tombol.addEventListener("click", function (e) {
      e.preventDefault();

      // Ambil data produk dari atribut data-*
      const id = this.getAttribute("data-id") || "1";
      const nama = this.getAttribute("data-nama") || "Bunga";
      const harga = parseInt(this.getAttribute("data-harga") || "100000");

      // Panggil fungsi pesan produk
      pesanProduk(id, nama, harga);
    });
  });

  // Setup form login
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", prosesLogin);
  }

  // Setup form register
  const formRegister = document.getElementById("form-register");
  if (formRegister) {
    formRegister.addEventListener("submit", prosesRegister);
  }

  // Setup tombol logout
  const tombolLogout = document.getElementById("tombol-logout");
  if (tombolLogout) {
    tombolLogout.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Tambahkan event listener untuk dropdown toggle jika ada
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu) {
        dropdownMenu.classList.toggle("show");
      }
    });
  }

  // Tutup dropdown saat klik di luar
  document.addEventListener("click", function (e) {
    if (!e.target.matches(".dropdown-toggle")) {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      dropdowns.forEach((dropdown) => {
        if (dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
        }
      });
    }
  });
});

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

// Tambahkan kode JavaScript berikut di script.js atau buat file baru sidebar.js

// Fungsi untuk menangani klik di luar sidebar
function closeSidebarOnClickOutside() {
  // Dapatkan elemen sidebar
  const navbar = document.querySelector(".navbar-collapse");

  // Dapatkan tombol toggle
  const toggleButton = document.querySelector(".navbar-toggler");

  // Dapatkan elemen body
  const body = document.body;

  // Tambahkan event listener pada body
  body.addEventListener("click", function (event) {
    // Periksa apakah sidebar sedang terbuka
    if (navbar.classList.contains("show")) {
      // Periksa apakah klik terjadi di luar sidebar dan bukan pada tombol toggle
      if (
        !navbar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        // Tutup sidebar dengan "mengklik" tombol toggle
        toggleButton.click();
      }
    }
  });
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  closeSidebarOnClickOutside();
});
