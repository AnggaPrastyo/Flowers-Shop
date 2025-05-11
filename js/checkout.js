// File: js/checkout.js
// JavaScript untuk halaman checkout

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  if (!cekLogin()) {
    // Redirect to login page if not logged in
    window.location.href = "login.html";
    return;
  }

  // Initialize checkout process
  initCheckout();
});

// Checkout initialization
function initCheckout() {
  // Load cart data
  loadKeranjang();

  // Initialize checkout steps
  initCheckoutSteps();

  // Initialize event listeners
  initEventListeners();

  // Initialize form validation
  initFormValidation();
}

// Load keranjang data and display in checkout
function loadKeranjang() {
  // Get keranjang data from localStorage
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Get elements
  const keranjangKosong = document.getElementById("keranjang-kosong");
  const keranjangItems = document.getElementById("keranjang-items");
  const keranjangBody = document.getElementById("keranjang-body");

  // Check if keranjang is empty
  if (keranjang.length === 0) {
    keranjangKosong.style.display = "block";
    keranjangItems.style.display = "none";

    // Disable next button
    document.getElementById("btn-next-step1").disabled = true;
    document.getElementById("btn-next-step1").classList.add("disabled");

    return;
  }

  // Clear keranjang body
  keranjangBody.innerHTML = "";

  // Populate keranjang items
  keranjang.forEach((item, index) => {
    const row = document.createElement("tr");
    row.classList.add("keranjang-item");
    row.setAttribute("data-id", item.id);

    // Format price to IDR
    const formattedPrice = formatRupiah(item.harga);
    const formattedTotal = formatRupiah(item.harga * item.jumlah);

    row.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <img src="img/Produk/bunga${item.id}.jpeg" alt="${item.nama}" class="item-image">
            <div class="item-details">
              <div class="item-name">${item.nama}</div>
              <div class="item-price">${formattedPrice}</div>
            </div>
          </div>
        </td>
        <td>${formattedPrice}</td>
        <td>
          <div class="quantity-control">
            <button type="button" class="quantity-btn btn-decrease" data-id="${item.id}">
              <i class="bi bi-dash"></i>
            </button>
            <input type="number" class="quantity-input" value="${item.jumlah}" min="1" max="99" data-id="${item.id}" readonly>
            <button type="button" class="quantity-btn btn-increase" data-id="${item.id}">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </td>
        <td class="item-total">${formattedTotal}</td>
        <td>
          <button type="button" class="btn-remove" data-id="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

    keranjangBody.appendChild(row);
  });

  // Update summary
  updateSummary();

  // Add event listeners for quantity buttons
  addQuantityListeners();
}

// Add event listeners for quantity control buttons
function addQuantityListeners() {
  // Increase quantity buttons
  document.querySelectorAll(".btn-increase").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      updateQuantity(id, 1);
    });
  });

  // Decrease quantity buttons
  document.querySelectorAll(".btn-decrease").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      updateQuantity(id, -1);
    });
  });

  // Remove buttons
  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      removeItem(id);
    });
  });
}

// Update item quantity
function updateQuantity(id, change) {
  // Get keranjang data
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Find item index
  const index = keranjang.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Update quantity
    keranjang[index].jumlah += change;

    // Ensure quantity is at least 1
    if (keranjang[index].jumlah < 1) {
      keranjang[index].jumlah = 1;
    }

    // Update quantity display
    const quantityInput = document.querySelector(
      `.quantity-input[data-id="${id}"]`
    );
    if (quantityInput) {
      quantityInput.value = keranjang[index].jumlah;
    }

    // Update total price
    const totalCell = quantityInput.closest("tr").querySelector(".item-total");
    if (totalCell) {
      totalCell.textContent = formatRupiah(
        keranjang[index].harga * keranjang[index].jumlah
      );
    }

    // Save updated keranjang
    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    // Update summary
    updateSummary();

    // Update badge
    updateJumlahKeranjang();
  }
}

// Remove item from keranjang
function removeItem(id) {
  // Get keranjang data
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Filter out the item to remove
  keranjang = keranjang.filter((item) => item.id !== id);

  // Save updated keranjang
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  // Remove item row
  const row = document.querySelector(`.keranjang-item[data-id="${id}"]`);
  if (row) {
    row.remove();
  }

  // Check if keranjang is now empty
  if (keranjang.length === 0) {
    document.getElementById("keranjang-kosong").style.display = "block";
    document.getElementById("keranjang-items").style.display = "none";

    // Disable next button
    document.getElementById("btn-next-step1").disabled = true;
    document.getElementById("btn-next-step1").classList.add("disabled");
  }

  // Update summary
  updateSummary();

  // Update badge
  updateJumlahKeranjang();
}

// Update order summary
function updateSummary() {
  // Get keranjang data
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Calculate subtotal
  const subtotal = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );

  // Get selected city for shipping calculation
  let shippingCost = 0;
  const selectedCity = document.getElementById("kota")?.value;

  // Calculate shipping cost based on selected city
  if (selectedCity) {
    shippingCost = calculateShippingCost(selectedCity);
  }

  // Update shipping cost display based on selected city
  if (document.getElementById("shipping-standard-price")) {
    document.getElementById("shipping-standard-price").textContent =
      formatRupiah(shippingCost);
  }

  // Total payment
  const totalPayment = subtotal + shippingCost;

  // Total items
  const totalItems = keranjang.reduce((total, item) => total + item.jumlah, 0);

  // Update all summary sections in all steps
  for (let i = 1; i <= 4; i++) {
    // Update total items
    const totalItemsEl = document.getElementById(
      `total-items${i > 1 ? "-step" + i : ""}`
    );
    if (totalItemsEl) totalItemsEl.textContent = totalItems;

    // Update subtotal
    const subtotalEl = document.getElementById(
      `subtotal${i > 1 ? "-step" + i : ""}`
    );
    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);

    // Update shipping cost
    const shippingEl = document.getElementById(
      `biaya-pengiriman${i > 1 ? "-step" + i : ""}`
    );
    if (shippingEl) shippingEl.textContent = formatRupiah(shippingCost);

    // Update total payment
    const totalEl = document.getElementById(
      `total-pembayaran${i > 1 ? "-step" + i : ""}`
    );
    if (totalEl) totalEl.textContent = formatRupiah(totalPayment);
  }
}

// Calculate shipping cost based on city
function calculateShippingCost(city) {
  switch (city) {
    case "Samarinda Seberang":
      return 15000;
    case "Samarinda Kota":
      return 25000;
    case "Tenggarong":
      // For Tenggarong, we need to calculate based on weight
      // For demo purposes, assume weight is 1kg
      const weight = 1;
      return 15000 * weight;
    case "Luar Kota":
      return 45000;
    default:
      return 0;
  }
}

// Initialize multi-step checkout
function initCheckoutSteps() {
  // Step navigation buttons
  const btnNextStep1 = document.getElementById("btn-next-step1");
  const btnPrevStep2 = document.getElementById("btn-prev-step2");
  const btnNextStep2 = document.getElementById("btn-next-step2");
  const btnPrevStep3 = document.getElementById("btn-prev-step3");
  const btnNextStep3 = document.getElementById("btn-next-step3");
  const btnPrevStep4 = document.getElementById("btn-prev-step4");
  const btnSubmitOrder = document.getElementById("btn-submit-order");

  // Step containers
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  const step4 = document.getElementById("step-4");

  // Progress indicators
  const progressSteps = document.querySelectorAll(".progress-step");

  // Step 1 -> Step 2
  btnNextStep1.addEventListener("click", function () {
    step1.style.display = "none";
    step2.style.display = "block";
    window.scrollTo(0, 0);

    // Update progress indicators
    progressSteps[0].classList.add("completed");
    progressSteps[1].classList.add("active");
  });

  // Step 2 -> Step 1
  btnPrevStep2.addEventListener("click", function () {
    step2.style.display = "none";
    step1.style.display = "block";
    window.scrollTo(0, 0);

    // Update progress indicators
    progressSteps[0].classList.remove("completed");
    progressSteps[1].classList.remove("active");
  });

  // Step 2 -> Step 3
  btnNextStep2.addEventListener("click", function () {
    // Validate address form
    if (validateAddressForm()) {
      step2.style.display = "none";
      step3.style.display = "block";
      window.scrollTo(0, 0);

      // Update progress indicators
      progressSteps[1].classList.add("completed");
      progressSteps[2].classList.add("active");
    }
  });

  // Step 3 -> Step 2
  btnPrevStep3.addEventListener("click", function () {
    step3.style.display = "none";
    step2.style.display = "block";
    window.scrollTo(0, 0);

    // Update progress indicators
    progressSteps[1].classList.remove("completed");
    progressSteps[2].classList.remove("active");
  });

  // Step 3 -> Step 4
  btnNextStep3.addEventListener("click", function () {
    step3.style.display = "none";
    step4.style.display = "block";
    window.scrollTo(0, 0);

    // Update progress indicators
    progressSteps[2].classList.add("completed");
    progressSteps[3].classList.add("active");

    // Update confirmation information
    updateConfirmationInfo();
  });

  // Step 4 -> Step 3
  btnPrevStep4.addEventListener("click", function () {
    step4.style.display = "none";
    step3.style.display = "block";
    window.scrollTo(0, 0);

    // Update progress indicators
    progressSteps[2].classList.remove("completed");
    progressSteps[3].classList.remove("active");
  });

  // Submit order
  btnSubmitOrder.addEventListener("click", function (e) {
    e.preventDefault();

    // Check if bukti pembayaran is uploaded
    const buktiPembayaran =
      document.getElementById("bukti-pembayaran").files[0];

    if (!buktiPembayaran) {
      // Show error message
      tampilkanPesan(
        "Silakan upload bukti pembayaran terlebih dahulu",
        "error"
      );
      return;
    }

    // Process order
    processOrder();
  });
}

// Initialize additional event listeners
function initEventListeners() {
  // City select change event
  // Lanjutan file checkout.js yang terpotong sebelumnya

  // City select change event
  const kotaSelect = document.getElementById("kota");
  if (kotaSelect) {
    kotaSelect.addEventListener("change", function () {
      updateSummary();
    });
  }

  // Payment method change event
  const paymentTransfer = document.getElementById("payment-transfer");
  const paymentQris = document.getElementById("payment-qris");
  const detailTransfer = document.getElementById("detail-transfer");
  const detailQris = document.getElementById("detail-qris");

  if (paymentTransfer && paymentQris) {
    paymentTransfer.addEventListener("change", function () {
      if (this.checked) {
        detailTransfer.style.display = "block";
        detailQris.style.display = "none";
      }
    });

    paymentQris.addEventListener("change", function () {
      if (this.checked) {
        detailTransfer.style.display = "none";
        detailQris.style.display = "block";
      }
    });
  }

  // File upload preview
  const buktiPembayaran = document.getElementById("bukti-pembayaran");
  const previewBukti = document.getElementById("preview-bukti");
  const previewImage = document.getElementById("preview-image");
  const btnRemovePreview = document.getElementById("btn-remove-preview");

  if (buktiPembayaran) {
    buktiPembayaran.addEventListener("change", function () {
      const file = this.files[0];

      if (file) {
        // Check file type
        const fileType = file.type;
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
          tampilkanPesan(
            "Hanya file JPG, JPEG, dan PNG yang diperbolehkan",
            "error"
          );
          this.value = "";
          return;
        }

        // Check file size (max 2MB)
        const fileSize = file.size / 1024 / 1024; // in MB
        if (fileSize > 2) {
          tampilkanPesan("Ukuran file maksimal 2MB", "error");
          this.value = "";
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          previewBukti.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove preview button
  if (btnRemovePreview) {
    btnRemovePreview.addEventListener("click", function () {
      buktiPembayaran.value = "";
      previewBukti.style.display = "none";
    });
  }
}

// Initialize form validation
function initFormValidation() {
  const form = document.getElementById("checkoutForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.classList.add("was-validated");
    });
  }
}

// Validate address form
function validateAddressForm() {
  // Get form elements
  const namaPenerima = document.getElementById("nama-penerima");
  const teleponPenerima = document.getElementById("telepon-penerima");
  const provinsi = document.getElementById("provinsi");
  const kota = document.getElementById("kota");
  const kecamatan = document.getElementById("kecamatan");
  const alamatLengkap = document.getElementById("alamat-lengkap");

  // Check if form elements exist
  if (
    !namaPenerima ||
    !teleponPenerima ||
    !provinsi ||
    !kota ||
    !kecamatan ||
    !alamatLengkap
  ) {
    return false;
  }

  // Check if all required fields are filled
  let isValid = true;

  // Validate nama penerima
  if (namaPenerima.value.trim() === "") {
    namaPenerima.classList.add("is-invalid");
    isValid = false;
  } else {
    namaPenerima.classList.remove("is-invalid");
    namaPenerima.classList.add("is-valid");
  }

  // Validate telepon penerima
  if (teleponPenerima.value.trim() === "") {
    teleponPenerima.classList.add("is-invalid");
    isValid = false;
  } else {
    teleponPenerima.classList.remove("is-invalid");
    teleponPenerima.classList.add("is-valid");
  }

  // Validate provinsi
  if (provinsi.value === "") {
    provinsi.classList.add("is-invalid");
    isValid = false;
  } else {
    provinsi.classList.remove("is-invalid");
    provinsi.classList.add("is-valid");
  }

  // Validate kota
  if (kota.value === "") {
    kota.classList.add("is-invalid");
    isValid = false;
  } else {
    kota.classList.remove("is-invalid");
    kota.classList.add("is-valid");
  }

  // Validate kecamatan
  if (kecamatan.value.trim() === "") {
    kecamatan.classList.add("is-invalid");
    isValid = false;
  } else {
    kecamatan.classList.remove("is-invalid");
    kecamatan.classList.add("is-valid");
  }

  // Validate alamat lengkap
  if (alamatLengkap.value.trim() === "") {
    alamatLengkap.classList.add("is-invalid");
    isValid = false;
  } else {
    alamatLengkap.classList.remove("is-invalid");
    alamatLengkap.classList.add("is-valid");
  }

  // If not valid, show error message
  if (!isValid) {
    tampilkanPesan("Silakan lengkapi semua field yang wajib diisi", "error");
  }

  return isValid;
}

// Update confirmation information
function updateConfirmationInfo() {
  // Get shipping information
  const namaPenerima = document.getElementById("nama-penerima").value;
  const teleponPenerima = document.getElementById("telepon-penerima").value;
  const provinsi = document.getElementById("provinsi").value;
  const kota = document.getElementById("kota").value;
  const kecamatan = document.getElementById("kecamatan").value;
  const alamatLengkap = document.getElementById("alamat-lengkap").value;
  const catatan = document.getElementById("catatan").value;

  // Get payment information
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;
  let bankName = "";

  if (paymentMethod === "transfer") {
    bankName = document
      .querySelector('input[name="bank"]:checked')
      .value.toUpperCase();
  }

  // Get product information
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Update shipping information in confirmation step
  const konfirmasiPengiriman = document.getElementById("konfirmasi-pengiriman");
  konfirmasiPengiriman.innerHTML = `
    <p><strong>Nama Penerima:</strong> ${namaPenerima}</p>
    <p><strong>Nomor Telepon:</strong> ${teleponPenerima}</p>
    <p><strong>Alamat:</strong> ${alamatLengkap}, ${kecamatan}, ${kota}, ${provinsi}</p>
    ${catatan ? `<p><strong>Catatan:</strong> ${catatan}</p>` : ""}
  `;

  // Update payment information in confirmation step
  const konfirmasiPembayaran = document.getElementById("konfirmasi-pembayaran");
  if (paymentMethod === "transfer") {
    konfirmasiPembayaran.innerHTML = `
      <p><strong>Metode Pembayaran:</strong> Transfer Bank</p>
      <p><strong>Bank:</strong> ${bankName}</p>
    `;
  } else {
    konfirmasiPembayaran.innerHTML = `
      <p><strong>Metode Pembayaran:</strong> QRIS</p>
      <p><strong>Aplikasi:</strong> GoPay, OVO, Dana, ShopeePay, dll</p>
    `;
  }

  // Update product information in confirmation step
  const konfirmasiProduk = document.getElementById("konfirmasi-produk");
  konfirmasiProduk.innerHTML = "";

  // Create product list table
  const table = document.createElement("table");
  table.className = "table table-sm";

  // Table header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Produk</th>
      <th>Jumlah</th>
      <th>Harga</th>
    </tr>
  `;
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");
  keranjang.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.jumlah}</td>
      <td>${formatRupiah(item.harga * item.jumlah)}</td>
    `;
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  konfirmasiProduk.appendChild(table);
}

// Process order
function processOrder() {
  // Generate order number
  const orderNumber = generateOrderNumber();

  // Get shipping information
  const namaPenerima = document.getElementById("nama-penerima").value;
  const teleponPenerima = document.getElementById("telepon-penerima").value;
  const provinsi = document.getElementById("provinsi").value;
  const kota = document.getElementById("kota").value;
  const kecamatan = document.getElementById("kecamatan").value;
  const alamatLengkap = document.getElementById("alamat-lengkap").value;
  const catatan = document.getElementById("catatan").value;

  // Get payment information
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;
  let bankName = "";

  if (paymentMethod === "transfer") {
    bankName = document
      .querySelector('input[name="bank"]:checked')
      .value.toUpperCase();
  }

  // Get product information
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Calculate totals
  const subtotal = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );
  const shippingCost = calculateShippingCost(kota);
  const totalPayment = subtotal + shippingCost;

  // Create order object
  const order = {
    orderNumber: orderNumber,
    orderDate: new Date().toISOString(),
    customer: {
      name: namaPenerima,
      phone: teleponPenerima,
      address: {
        province: provinsi,
        city: kota,
        district: kecamatan,
        fullAddress: alamatLengkap,
        notes: catatan,
      },
    },
    payment: {
      method: paymentMethod,
      bank: bankName,
      amount: totalPayment,
      status: "pending", // pending, confirmed, canceled
    },
    shipping: {
      cost: shippingCost,
      status: "pending", // pending, processing, shipped, delivered
    },
    items: keranjang,
    subtotal: subtotal,
    total: totalPayment,
  };

  // Save order to localStorage (for demo)
  // In a real app, this would be sent to a server
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem("keranjang");

  // Update cart badge
  updateJumlahKeranjang();

  // Show success modal
  document.getElementById("nomor-pesanan").textContent = orderNumber;
  const modal = new bootstrap.Modal(
    document.getElementById("pesananBerhasilModal")
  );
  modal.show();
}

// Generate unique order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `FS${year}${month}${day}${random}`;
}

// Format currency to IDR
function formatRupiah(number) {
  return "Rp " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
