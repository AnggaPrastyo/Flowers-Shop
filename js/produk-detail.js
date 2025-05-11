// File: js/produk-detail.js
// Script untuk halaman detail produk

// Fungsi untuk mengganti gambar utama saat klik thumbnail
function changeImage(imageSrc) {
  // Update main image
  const mainImage = document.getElementById("main-product-image");
  if (mainImage) {
    mainImage.src = imageSrc;
  }

  // Update active thumbnail
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumbnail) => {
    const thumbnailImg = thumbnail.querySelector("img");
    if (thumbnailImg && thumbnailImg.src === imageSrc) {
      thumbnail.classList.add("active");
    } else {
      thumbnail.classList.remove("active");
    }
  });
}

// Fungsi untuk update kuantitas produk
function updateQuantity(change) {
  const quantityInput = document.getElementById("quantity");
  if (!quantityInput) return;

  // Get current value
  let currentValue = parseInt(quantityInput.value);

  // Calculate new value
  let newValue = currentValue + change;

  // Make sure quantity is at least 1
  if (newValue < 1) {
    newValue = 1;
  }

  // Update input value
  quantityInput.value = newValue;
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(id, nama, harga) {
  // Cek apakah produk sudah ada di keranjang
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Dapatkan jumlah dari input
  const quantity = parseInt(document.getElementById("quantity").value);

  // Cari produk dalam keranjang
  const existingItemIndex = keranjang.findIndex((item) => item.id === id);

  if (existingItemIndex !== -1) {
    // Jika produk sudah ada, tambahkan jumlahnya
    keranjang[existingItemIndex].jumlah += quantity;
  } else {
    // Jika produk belum ada, tambahkan sebagai item baru
    keranjang.push({
      id: id,
      nama: nama,
      harga: harga,
      jumlah: quantity,
    });
  }

  // Simpan keranjang kembali ke localStorage
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  // Update badge jumlah keranjang
  updateJumlahKeranjang();

  // Tampilkan modal konfirmasi
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  cartModal.show();
}

// Fungsi untuk "Beli Sekarang" (tambah ke keranjang, lalu ke checkout)
function buyNow(id, nama, harga) {
  // Tambahkan ke keranjang
  addToCart(id, nama, harga);

  // Langsung arahkan ke checkout
  window.location.href = "keranjang.html";
}

// Fungsi untuk menampilkan review form atau login prompt
function setupReviewSection() {
  const reviewForm = document.getElementById("review-form");
  const loginPrompt = document.getElementById("review-login-prompt");

  // Cek apakah user sudah login
  const isLoggedIn = cekLogin();

  // Tampilkan form atau login prompt berdasarkan status login
  if (isLoggedIn) {
    reviewForm.style.display = "block";
    if (loginPrompt) loginPrompt.style.display = "none";
  } else {
    reviewForm.style.display = "none";
    if (loginPrompt) loginPrompt.style.display = "block";
  }
}

// Fungsi untuk setup rating stars
function setupRatingStars() {
  const ratingStars = document.querySelectorAll(".rating-star");

  // Tambahkan event listeners ke stars
  ratingStars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = parseInt(this.getAttribute("data-rating"));

      // Reset semua stars
      ratingStars.forEach((s) => {
        s.classList.remove("active");
        s.classList.remove("bi-star-fill");
        s.classList.add("bi-star");
      });

      // Set stars sesuai rating yang dipilih
      for (let i = 0; i < rating; i++) {
        ratingStars[i].classList.add("active");
        ratingStars[i].classList.remove("bi-star");
        ratingStars[i].classList.add("bi-star-fill");
      }

      // Set hidden input value untuk form
      const ratingInput = document.createElement("input");
      ratingInput.type = "hidden";
      ratingInput.name = "rating";
      ratingInput.value = rating;

      // Replace existing rating input if any
      const existingInput = document.querySelector('input[name="rating"]');
      if (existingInput) {
        existingInput.remove();
      }

      // Add to form
      const form = document.getElementById("product-review-form");
      if (form) {
        form.appendChild(ratingInput);
      }
    });

    // Hover effect
    star.addEventListener("mouseenter", function () {
      const rating = parseInt(this.getAttribute("data-rating"));

      // Highlight stars on hover
      for (let i = 0; i < rating; i++) {
        if (!ratingStars[i].classList.contains("active")) {
          ratingStars[i].classList.add("bi-star-half");
        }
      }
    });

    star.addEventListener("mouseleave", function () {
      ratingStars.forEach((s) => {
        if (!s.classList.contains("active")) {
          s.classList.remove("bi-star-half");
        }
      });
    });
  });
}

// Fungsi untuk setup form review
function setupReviewForm() {
  const form = document.getElementById("product-review-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const rating = document.querySelector('input[name="rating"]')?.value || 0;
      const reviewText = document.getElementById("review-text").value;

      // Validate input
      if (rating === 0) {
        alert("Silakan berikan rating");
        return;
      }

      if (!reviewText.trim()) {
        alert("Silakan tulis ulasan Anda");
        return;
      }

      // Dalam aplikasi sebenarnya, kirim data ke server
      // Untuk demo, kita hanya tampilkan alert
      alert(
        "Terima kasih atas ulasan Anda! Ulasan akan ditampilkan setelah dimoderasi."
      );

      // Reset form
      form.reset();

      // Reset stars
      const ratingStars = document.querySelectorAll(".rating-star");
      ratingStars.forEach((s) => {
        s.classList.remove("active");
        s.classList.remove("bi-star-fill");
        s.classList.add("bi-star");
      });
    });
  }
}

// Fungsi untuk mendapatkan parameter dari URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Fungsi untuk memuat data produk berdasarkan ID
function loadProductDetails() {
  // Dalam implementasi sebenarnya, ID akan diambil dari URL
  // dan data produk akan dimuat dari database/API
  const productId = getUrlParameter("id") || "1";

  // Untuk demo, kita gunakan data hard-coded
  // Dalam aplikasi nyata, gunakan fetch API untuk mengambil data

  // Contoh fetch data:
  // fetch(`api/products/${productId}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     updateProductUI(data);
  //   })
  //   .catch(error => {
  //     console.error('Error fetching product data:', error);
  //   });
}

// Initialize product page
document.addEventListener("DOMContentLoaded", function () {
  // Setup review form visibility
  setupReviewSection();

  // Setup rating stars
  setupRatingStars();

  // Setup review form submission
  setupReviewForm();

  // Load product details
  loadProductDetails();

  // Validate quantity input to always be a number and at least 1
  const quantityInput = document.getElementById("quantity");
  if (quantityInput) {
    quantityInput.addEventListener("input", function () {
      let value = this.value.replace(/[^0-9]/g, "");

      if (value === "" || parseInt(value) < 1) {
        value = 1;
      }

      this.value = value;
    });
  }

  // Input number validation
  const quantityInputs = document.querySelectorAll('input[type="number"]');
  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const min = parseInt(this.getAttribute("min")) || 1;
      if (this.value === "" || parseInt(this.value) < min) {
        this.value = min;
      }
    });
  });

  // Update keranjang badge
  updateJumlahKeranjang();
});
