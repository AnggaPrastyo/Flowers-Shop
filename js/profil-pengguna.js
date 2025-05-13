// File: js/profil-pengguna.js
// JavaScript untuk halaman profil pengguna

document.addEventListener("DOMContentLoaded", function () {
  // Cek apakah user sudah login
  if (!cekLogin()) {
    // Redirect ke halaman login jika belum login
    window.location.href = "login.html?redirect=profil-pengguna";
    return;
  }

  // Tampilkan data pengguna yang login
  loadUserData();

  // Setup event listeners
  setupEventListeners();

  // Setup toggle password
  setupPasswordToggles();
});

// Fungsi untuk memuat data pengguna
function loadUserData() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Update sidebar user info
  document.getElementById("sidebar-user-name").textContent =
    userData.nama || "Pengguna";
  document.getElementById("sidebar-user-email").textContent =
    userData.email || "user@example.com";

  // Update form fields
  document.getElementById("nama").value = userData.nama || "";
  document.getElementById("username").value = userData.username || "";
  document.getElementById("email").value = userData.email || "";
  document.getElementById("telepon").value = userData.telepon || "";

  // Optional fields
  if (userData.tanggal_lahir) {
    document.getElementById("tanggal_lahir").value = userData.tanggal_lahir;
  }

  if (userData.jenis_kelamin) {
    document.getElementById("jenis_kelamin").value = userData.jenis_kelamin;
  }
}

// Fungsi untuk setup event listeners
function setupEventListeners() {
  // Form profil
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", updateProfile);
  }

  // Form password
  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", updatePassword);
  }

  // Button save address
  const saveAddressBtn = document.getElementById("save-address-btn");
  if (saveAddressBtn) {
    saveAddressBtn.addEventListener("click", saveAddress);
  }

  // Logout button
  const logoutBtn = document.getElementById("sidebar-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Navbar logout button
  const navLogoutBtn = document.getElementById("tombol-logout");
  if (navLogoutBtn) {
    navLogoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
}

// Fungsi untuk update profil
function updateProfile(e) {
  e.preventDefault();

  // Get current user data
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Update with new values
  userData.nama = document.getElementById("nama").value;
  userData.username = document.getElementById("username").value;
  userData.email = document.getElementById("email").value;
  userData.telepon = document.getElementById("telepon").value;

  // Optional fields
  const tanggalLahir = document.getElementById("tanggal_lahir").value;
  if (tanggalLahir) {
    userData.tanggal_lahir = tanggalLahir;
  }

  const jenisKelamin = document.getElementById("jenis_kelamin").value;
  if (jenisKelamin) {
    userData.jenis_kelamin = jenisKelamin;
  }

  // Save updated user data
  localStorage.setItem("user", JSON.stringify(userData));

  // Show success message
  const successAlert = document.getElementById("profile-success-alert");
  successAlert.style.display = "block";

  // Hide the alert after 3 seconds
  setTimeout(() => {
    successAlert.style.display = "none";
  }, 3000);

  // Update sidebar and header info
  document.getElementById("sidebar-user-name").textContent = userData.nama;
  const namaUserElements = document.querySelectorAll(".nama-user");
  namaUserElements.forEach((element) => {
    element.textContent = userData.nama;
  });
}

// Fungsi untuk update password
function updatePassword(e) {
  e.preventDefault();

  // Get password values
  const currentPassword = document.getElementById("current_password").value;
  const newPassword = document.getElementById("new_password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  // Get current user data
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Simple validation (for demo) - in real app, check against stored password hash
  // For demo purposes, we're just making sure fields are filled
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Mohon isi semua field password");
    return;
  }

  // Check if new passwords match
  if (newPassword !== confirmPassword) {
    alert("Password baru dan konfirmasi password tidak cocok");
    return;
  }

  // Check if new password length is at least 8 characters
  if (newPassword.length < 8) {
    alert("Password baru harus minimal 8 karakter");
    return;
  }

  // Update password
  userData.password = newPassword;

  // Save updated user data
  localStorage.setItem("user", JSON.stringify(userData));

  // Show success message
  const successAlert = document.getElementById("password-success-alert");
  successAlert.style.display = "block";

  // Hide the alert after 3 seconds
  setTimeout(() => {
    successAlert.style.display = "none";
  }, 3000);

  // Reset form
  document.getElementById("password-form").reset();
}

// Fungsi untuk save address
function saveAddress() {
  // Get form values
  const addressId = document.getElementById("address_id").value;
  const addressLabel = document.getElementById("address_label").value;
  const addressName = document.getElementById("address_name").value;
  const addressPhone = document.getElementById("address_phone").value;
  const addressProvince = document.getElementById("address_province").value;
  const addressCity = document.getElementById("address_city").value;
  const addressDistrict = document.getElementById("address_district").value;
  const addressFull = document.getElementById("address_full").value;
  const addressPostal = document.getElementById("address_postal").value;
  const addressMain = document.getElementById("address_main").checked;

  // Get current user data
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Initialize addresses array if not exists
  if (!userData.addresses) {
    userData.addresses = [];
  }

  // Generate new address object
  const newAddress = {
    id: addressId ? addressId : Date.now().toString(),
    label: addressLabel,
    name: addressName,
    phone: addressPhone,
    province: addressProvince,
    city: addressCity,
    district: addressDistrict,
    fullAddress: addressFull,
    postalCode: addressPostal,
    isMain: addressMain,
  };

  // If set as main, update other addresses
  if (addressMain) {
    userData.addresses.forEach((address) => {
      address.isMain = false;
    });
  }

  // Check if it's an update or new address
  if (addressId) {
    // Update existing address
    const index = userData.addresses.findIndex(
      (address) => address.id === addressId
    );
    if (index !== -1) {
      userData.addresses[index] = newAddress;
    }
  } else {
    // Add new address
    userData.addresses.push(newAddress);
  }

  // Save updated user data
  localStorage.setItem("user", JSON.stringify(userData));

  // Refresh the address list
  renderAddresses();

  // Hide modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addAddressModal")
  );
  modal.hide();

  // Show success message
  const successAlert = document.getElementById("address-success-alert");
  successAlert.style.display = "block";

  // Hide the alert after 3 seconds
  setTimeout(() => {
    successAlert.style.display = "none";
  }, 3000);
}

// Fungsi untuk menampilkan daftar alamat
function renderAddresses() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const addressList = document.getElementById("address-list");

  if (!addressList) return;

  addressList.innerHTML = "";

  if (!userData.addresses || userData.addresses.length === 0) {
    addressList.innerHTML = `
      <div class="text-center py-4">
        <p class="text-muted">Anda belum menambahkan alamat</p>
      </div>
    `;
    return;
  }

  // Render each address
  userData.addresses.forEach((address) => {
    const addressItem = document.createElement("div");
    addressItem.className = "address-item";
    addressItem.dataset.id = address.id;

    addressItem.innerHTML = `
      <div class="address-header">
        <div class="address-label">${address.label}</div>
        ${
          address.isMain ? '<div class="address-badge primary">Utama</div>' : ""
        }
      </div>
      <div class="address-info">
        <div class="address-name">${address.name}</div>
        <div class="address-phone">${address.phone}</div>
        <div class="address-text">
          ${address.fullAddress}, ${address.district}, ${address.city}, ${
      address.province
    }, ${address.postalCode}
        </div>
      </div>
      <div class="address-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="editAddress('${
          address.id
        }')">
          <i class="bi bi-pencil"></i> Edit
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteAddress('${
          address.id
        }')">
          <i class="bi bi-trash"></i> Hapus
        </button>
        ${
          !address.isMain
            ? `
          <button class="btn btn-sm btn-outline-secondary" onclick="setAsMain('${address.id}')">
            <i class="bi bi-check-circle"></i> Jadikan Utama
          </button>
        `
            : ""
        }
      </div>
    `;

    addressList.appendChild(addressItem);
  });
}

// Fungsi untuk edit alamat
function editAddress(id) {
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  if (!userData.addresses) return;

  const address = userData.addresses.find((addr) => addr.id === id);

  if (!address) return;

  // Populate modal with address data
  document.getElementById("address_id").value = address.id;
  document.getElementById("address_label").value = address.label;
  document.getElementById("address_name").value = address.name;
  document.getElementById("address_phone").value = address.phone;
  document.getElementById("address_province").value = address.province;
  document.getElementById("address_city").value = address.city;
  document.getElementById("address_district").value = address.district;
  document.getElementById("address_full").value = address.fullAddress;
  document.getElementById("address_postal").value = address.postalCode;
  document.getElementById("address_main").checked = address.isMain;

  // Update modal title
  document.getElementById("addAddressModalLabel").textContent = "Edit Alamat";

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("addAddressModal"));
  modal.show();
}

// Fungsi untuk hapus alamat
function deleteAddress(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;

  const userData = JSON.parse(localStorage.getItem("user")) || {};

  if (!userData.addresses) return;

  // Filter out the address to delete
  userData.addresses = userData.addresses.filter(
    (address) => address.id !== id
  );

  // Save updated user data
  localStorage.setItem("user", JSON.stringify(userData));

  // Refresh address list
  renderAddresses();

  // Show success message
  const successAlert = document.getElementById("address-success-alert");
  successAlert.style.display = "block";
  successAlert.textContent = "Alamat berhasil dihapus!";

  // Hide the alert after 3 seconds
  setTimeout(() => {
    successAlert.style.display = "none";
    successAlert.textContent = "Alamat berhasil diperbarui!";
  }, 3000);
}

// Fungsi untuk set alamat sebagai utama
function setAsMain(id) {
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  if (!userData.addresses) return;

  // Update all addresses
  userData.addresses.forEach((address) => {
    address.isMain = address.id === id;
  });

  // Save updated user data
  localStorage.setItem("user", JSON.stringify(userData));

  // Refresh address list
  renderAddresses();

  // Show success message
  const successAlert = document.getElementById("address-success-alert");
  successAlert.style.display = "block";
  successAlert.textContent = "Alamat utama berhasil diubah!";

  // Hide the alert after 3 seconds
  setTimeout(() => {
    successAlert.style.display = "none";
    successAlert.textContent = "Alamat berhasil diperbarui!";
  }, 3000);
}

// Fungsi untuk setup password toggles
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);
      const icon = this.querySelector("i");

      if (targetInput.type === "password") {
        targetInput.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
      } else {
        targetInput.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
      }
    });
  });
}

// Reset address form when modal is opened
document.addEventListener("DOMContentLoaded", function () {
  const addAddressModal = document.getElementById("addAddressModal");

  if (addAddressModal) {
    addAddressModal.addEventListener("show.bs.modal", function () {
      // Reset form
      document.getElementById("address_id").value = "";
      document.getElementById("address_label").value = "";
      document.getElementById("address_name").value = "";
      document.getElementById("address_phone").value = "";
      document.getElementById("address_province").value = "";
      document.getElementById("address_city").value = "";
      document.getElementById("address_district").value = "";
      document.getElementById("address_full").value = "";
      document.getElementById("address_postal").value = "";
      document.getElementById("address_main").checked = false;

      // Reset modal title
      document.getElementById("addAddressModalLabel").textContent =
        "Tambah Alamat Baru";
    });
  }

  // Render addresses on load
  renderAddresses();
});

// Fungsi untuk memeriksa status login
function cekLogin() {
  // Jika ada fungsi global untuk cek login, gunakan fungsi tersebut
  if (typeof window.cekLogin === "function") {
    return window.cekLogin();
  }

  // Fallback jika tidak ada fungsi global
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData !== null && userData.isLoggedIn === true;
}

// Fungsi untuk logout
function logout() {
  // Jika ada fungsi global untuk logout, gunakan fungsi tersebut
  if (typeof window.logout === "function") {
    window.logout();
  } else {
    // Fallback untuk logout
    localStorage.removeItem("user");
    window.location.href = "index.html";
  }
}
