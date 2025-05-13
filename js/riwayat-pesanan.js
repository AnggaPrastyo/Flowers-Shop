// File: js/riwayat-pesanan.js
// JavaScript untuk halaman riwayat pesanan

document.addEventListener("DOMContentLoaded", function () {
  // Cek apakah user sudah login
  if (!cekLogin()) {
    // Redirect ke halaman login jika belum login
    window.location.href = "login.html?redirect=riwayat-pesanan";
    return;
  }

  // Tampilkan data pengguna yang login
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    document.getElementById("sidebar-user-name").textContent =
      userData.nama || "Pengguna";
    document.getElementById("sidebar-user-email").textContent =
      userData.email || "user@example.com";
  }

  // Setup event listeners
  setupEventListeners();

  // Load data pesanan
  loadOrderData();

  // Setup filter status
  const filterStatus = document.getElementById("filter-status");
  if (filterStatus) {
    filterStatus.addEventListener("change", function () {
      filterOrdersByStatus(this.value);
    });
  }

  // Setup search order
  const searchInput = document.getElementById("search-order");
  if (searchInput) {
    const searchButton = searchInput.nextElementSibling;

    searchButton.addEventListener("click", function () {
      searchOrders(searchInput.value);
    });

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchOrders(this.value);
      }
    });
  }

  // Setup rating stars di modal review
  setupRatingStars();

  // Setup form submit review
  const submitReviewBtn = document.getElementById("submit-review");
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", submitReview);
  }

  // Setup sidebar logout button
  const sidebarLogout = document.getElementById("sidebar-logout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
});

// Fungsi untuk setup event listeners
function setupEventListeners() {
  // Event listener untuk tombol logout pada sidebar
  const sidebarLogout = document.getElementById("sidebar-logout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
}

// Fungsi untuk memuat data pesanan
function loadOrderData() {
  // Dalam aplikasi nyata, ini akan memuat data dari API/database
  // Untuk demo, kita gunakan data statis dari template HTML

  // Di implementasi sebenarnya, kita akan mengambil data pesanan dari server
  // berdasarkan user ID, lalu render hasilnya

  // Cek apakah ada data pesanan di localStorage (untuk demo)
  const orderData = JSON.parse(localStorage.getItem("userOrders"));

  if (orderData && orderData.length > 0) {
    // Render data pesanan dari localStorage
    renderOrders(orderData);
  } else {
    // Gunakan data yang sudah ada di HTML sebagai demo
    // Dalam aplikasi nyata, kita akan mengambil data dari server
    console.log("Menggunakan data demo yang sudah ada di HTML");
  }
}

// Fungsi untuk merender data pesanan
function renderOrders(orders) {
  const orderList = document.getElementById("order-list");

  // Kosongkan container
  orderList.innerHTML = "";

  // Untuk setiap pesanan, buat elemen dan tambahkan ke container
  orders.forEach((order) => {
    const orderElement = createOrderElement(order);
    orderList.appendChild(orderElement);
  });
}

// Fungsi untuk membuat elemen pesanan
function createOrderElement(order) {
  // Buat container untuk pesanan
  const orderItem = document.createElement("div");
  orderItem.className = "order-item";
  orderItem.setAttribute("data-status", order.status);

  // Buat isi HTML untuk pesanan
  orderItem.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <div class="order-id">#${order.id}</div>
                <div class="order-date">${order.date}</div>
            </div>
            <div class="order-status ${order.status}">${getStatusText(
    order.status
  )}</div>
        </div>
        
        <div class="order-products">
            ${createProductElements(order.products)}
        </div>
        
        <div class="order-footer">
            <div class="order-total">
                <span>Total Pesanan:</span>
                <span class="total-amount">${formatRupiah(order.total)}</span>
            </div>
            <div class="order-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetail('${
                  order.id
                }')">Detail</button>
                ${createActionButton(order.status, order.id)}
            </div>
        </div>
    `;

  return orderItem;
}

// Fungsi untuk membuat elemen produk dalam pesanan
function createProductElements(products) {
  let html = "";

  // Tampilkan hanya produk pertama
  if (products && products.length > 0) {
    const product = products[0];

    html += `
            <div class="product-item">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${formatRupiah(
                      product.price
                    )}</div>
                    <div class="product-quantity">x${product.quantity}</div>
                </div>
            </div>
        `;

    // Jika ada lebih dari satu produk, tampilkan pesan tambahan
    if (products.length > 1) {
      html += `<div class="more-items">+${
        products.length - 1
      } produk lainnya</div>`;
    }
  }

  return html;
}

// Fungsi untuk membuat tombol aksi berdasarkan status pesanan
function createActionButton(status, orderId) {
  switch (status) {
    case "pending":
      return `<button class="btn btn-sm btn-primary" onclick="payNow('${orderId}')">Bayar Sekarang</button>`;

    case "processing":
    case "shipped":
      return `<button class="btn btn-sm btn-primary" onclick="trackOrder('${orderId}')">Lacak</button>`;

    case "completed":
      return `<button class="btn btn-sm btn-outline-success" onclick="addReview('${orderId}')">Beri Ulasan</button>`;

    case "cancelled":
      return `<button class="btn btn-sm btn-primary" onclick="orderAgain('${orderId}')">Pesan Lagi</button>`;

    default:
      return "";
  }
}

// Fungsi untuk mendapatkan teks status pesanan
function getStatusText(status) {
  const statusMap = {
    pending: "Menunggu Pembayaran",
    processing: "Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return statusMap[status] || status;
}

// Fungsi untuk format mata uang Rupiah
function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk melihat detail pesanan
function viewOrderDetail(orderId) {
  console.log("Melihat detail pesanan:", orderId);

  // Set ID pesanan di modal
  document.getElementById("modal-order-id").textContent = orderId;
  document.getElementById("detail-order-id").textContent = orderId;

  // Dalam aplikasi nyata, kita akan mengambil detail pesanan dari server
  // dan mengisi modal dengan data tersebut

  // Setup tombol aksi sesuai status pesanan
  const btnActionOrder = document.getElementById("btn-action-order");

  // Dapatkan status pesanan dari elemen HTML
  const orderItem = document.querySelector(
    `.order-item[data-order-id="${orderId}"]`
  );
  const status = orderItem ? orderItem.dataset.status : "processing"; // default ke processing jika tidak ditemukan

  // Set teks dan fungsi tombol sesuai status
  switch (status) {
    case "pending":
      btnActionOrder.textContent = "Bayar Sekarang";
      btnActionOrder.onclick = () => payNow(orderId);
      break;

    case "processing":
    case "shipped":
      btnActionOrder.textContent = "Lacak Pesanan";
      btnActionOrder.onclick = () => trackOrder(orderId);
      break;

    case "completed":
      btnActionOrder.textContent = "Beri Ulasan";
      btnActionOrder.onclick = () => addReview(orderId);
      break;

    case "cancelled":
      btnActionOrder.textContent = "Pesan Lagi";
      btnActionOrder.onclick = () => orderAgain(orderId);
      break;
  }

  // Tampilkan modal
  const modal = new bootstrap.Modal(
    document.getElementById("orderDetailModal")
  );
  modal.show();
}

// Fungsi untuk lanjut pembayaran
function payNow(orderId) {
  console.log("Lanjut pembayaran untuk pesanan:", orderId);
  // Redirect ke halaman pembayaran dengan parameter order ID
  window.location.href = `pembayaran.html?order=${orderId}`;
}

// Fungsi untuk melacak pesanan
function trackOrder(orderId) {
  console.log("Melacak pesanan:", orderId);
  // Tampilkan modal detail pesanan dengan fokus pada tab lacak
  viewOrderDetail(orderId);
  // Scroll ke timeline
  document
    .getElementById("order-timeline")
    .scrollIntoView({ behavior: "smooth" });
}

// Fungsi untuk memberi ulasan
function addReview(orderId) {
  console.log("Memberi ulasan untuk pesanan:", orderId);

  // Set data produk ke dropdown
  const modal = new bootstrap.Modal(document.getElementById("reviewModal"));
  modal.show();
}

// Fungsi untuk pesan ulang
function orderAgain(orderId) {
  console.log("Pesan ulang untuk pesanan:", orderId);

  // Dalam aplikasi nyata, kita akan mengambil detail produk dari pesanan
  // dan menambahkannya ke keranjang, lalu redirect ke halaman keranjang

  alert("Produk dari pesanan #" + orderId + " telah ditambahkan ke keranjang");
  window.location.href = "keranjang.html";
}

// Fungsi untuk filter pesanan berdasarkan status
function filterOrdersByStatus(status) {
  console.log("Filter pesanan berdasarkan status:", status);

  const orderItems = document.querySelectorAll(".order-item");

  orderItems.forEach((item) => {
    if (status === "all" || item.getAttribute("data-status") === status) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Fungsi untuk mencari pesanan
function searchOrders(keyword) {
  console.log("Mencari pesanan dengan keyword:", keyword);

  const orderItems = document.querySelectorAll(".order-item");

  if (!keyword.trim()) {
    // Jika keyword kosong, tampilkan semua pesanan
    orderItems.forEach((item) => {
      item.style.display = "";
    });
    return;
  }

  keyword = keyword.toLowerCase();

  orderItems.forEach((item) => {
    const orderId = item.querySelector(".order-id").textContent.toLowerCase();
    const productNames = Array.from(item.querySelectorAll(".product-name")).map(
      (el) => el.textContent.toLowerCase()
    );

    // Cek apakah keyword ada di ID pesanan atau nama produk
    if (
      orderId.includes(keyword) ||
      productNames.some((name) => name.includes(keyword))
    ) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Fungsi untuk setup rating stars di modal review
function setupRatingStars() {
  const ratingStars = document.querySelectorAll(".star-rating .rating-star");
  const ratingInput = document.getElementById("rating-value");

  ratingStars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = parseInt(this.getAttribute("data-rating"));

      // Set nilai rating ke input hidden
      if (ratingInput) ratingInput.value = rating;

      // Update tampilan bintang
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove("bi-star");
          s.classList.add("bi-star-fill", "active");
        } else {
          s.classList.remove("bi-star-fill", "active");
          s.classList.add("bi-star");
        }
      });
    });

    // Efek hover
    star.addEventListener("mouseenter", function () {
      const rating = parseInt(this.getAttribute("data-rating"));

      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove("bi-star");
          s.classList.add("bi-star-fill");
        }
      });
    });

    star.addEventListener("mouseleave", function () {
      const currentRating = parseInt(ratingInput ? ratingInput.value : 0);

      ratingStars.forEach((s, index) => {
        if (index < currentRating) {
          s.classList.remove("bi-star");
          s.classList.add("bi-star-fill", "active");
        } else {
          s.classList.remove("bi-star-fill", "active");
          s.classList.add("bi-star");
        }
      });
    });
  });
}

// Fungsi untuk mengirim ulasan
function submitReview() {
  const productId = document.getElementById("product-select").value;
  const rating = document.getElementById("rating-value").value;
  const reviewText = document.getElementById("review-text").value;

  if (!productId || rating === "0" || !reviewText.trim()) {
    alert("Mohon lengkapi semua field yang diperlukan");
    return;
  }

  console.log("Mengirim ulasan:", {
    productId,
    rating,
    reviewText,
  });

  // Dalam aplikasi nyata, kita akan mengirim data ulasan ke server

  alert("Terima kasih atas ulasan Anda!");

  // Tutup modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("reviewModal")
  );
  modal.hide();

  // Reset form
  document.getElementById("review-form").reset();
  document.querySelectorAll(".star-rating .rating-star").forEach((star) => {
    star.classList.remove("bi-star-fill", "active");
    star.classList.add("bi-star");
  });
  document.getElementById("rating-value").value = "0";
}

// Fungsi untuk mengecek apakah user sudah login
function cekLogin() {
  if (typeof window.cekLogin === "function") {
    return window.cekLogin();
  } else {
    // Fallback untuk fungsi cekLogin jika tidak ada di window
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData !== null && userData.isLoggedIn === true;
  }
}

// Fungsi untuk logout
function logout() {
  if (typeof window.logout === "function") {
    window.logout();
  } else {
    // Fallback untuk fungsi logout jika tidak ada di window
    localStorage.removeItem("user");
    window.location.href = "index.html";
  }
}
