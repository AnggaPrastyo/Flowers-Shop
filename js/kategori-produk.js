// File: js/kategori.js
// JavaScript untuk halaman kategori produk

document.addEventListener("DOMContentLoaded", function () {
  // Setup click handlers untuk kategori
  const categoryLinks = document.querySelectorAll(".category-nav .nav-link");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      categoryLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Get selected category
      const category = this.getAttribute("data-category");

      // Filter products
      filterProductsByCategory(category);
    });
  });

  // Setup sortings
  document.getElementById("sort-by").addEventListener("change", function () {
    applyFilters();
  });

  // Setup price range filter
  document
    .getElementById("price-range")
    .addEventListener("change", function () {
      applyFilters();
    });

  // Setup search
  const searchInput = document.getElementById("search-product");
  const searchButton = searchInput.nextElementSibling;

  searchButton.addEventListener("click", function () {
    applyFilters();
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      applyFilters();
    }
  });

  // Inisialisasi awal: tampilkan semua produk
  filterProductsByCategory("all");
});

// Fungsi untuk memfilter produk berdasarkan kategori
function filterProductsByCategory(category) {
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach((item) => {
    if (category === "all" || item.getAttribute("data-category") === category) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });

  // Reset other filters and apply them again
  resetFilters();
  applyFilters();
}

// Fungsi untuk reset filter lainnya
function resetFilters() {
  document.getElementById("sort-by").value = "newest";
  document.getElementById("price-range").value = "all";
  document.getElementById("search-product").value = "";
}

// Fungsi untuk mendapatkan produk yang terlihat (tidak di-hide oleh kategori)
function getVisibleProducts() {
  return Array.from(document.querySelectorAll(".product-item")).filter(
    (item) => {
      return item.style.display !== "none";
    }
  );
}

// Fungsi untuk menerapkan semua filter dan urutan
function applyFilters() {
  // Dapatkan semua produk yang terlihat (yang tidak disembunyikan oleh filter kategori)
  let visibleProducts = getVisibleProducts();

  // Terapkan filter harga
  const priceRange = document.getElementById("price-range").value;
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);

    visibleProducts = visibleProducts.filter((item) => {
      const priceText = item.querySelector(".product-price").textContent;
      const price = parseInt(priceText.replace(/[^\d]/g, ""));

      if (max === undefined) {
        // Jika "300000-up"
        return price >= min;
      } else {
        return price >= min && price <= max;
      }
    });
  }

  // Terapkan filter pencarian
  const searchQuery = document
    .getElementById("search-product")
    .value.toLowerCase();
  if (searchQuery) {
    visibleProducts = visibleProducts.filter((item) => {
      const title = item
        .querySelector(".product-title")
        .textContent.toLowerCase();
      return title.includes(searchQuery);
    });
  }

  // Sembunyikan semua produk terlebih dahulu
  document.querySelectorAll(".product-item").forEach((item) => {
    item.style.display = "none";
  });

  // Tampilkan produk yang lolos filter
  visibleProducts.forEach((item) => {
    item.style.display = "";
  });

  // Terapkan pengurutan pada produk yang terlihat
  const sortBy = document.getElementById("sort-by").value;
  sortProducts(sortBy);

  // Update pagination jika produk yang terlihat sedikit
  updatePagination(visibleProducts.length);
}

// Fungsi untuk mengurutkan produk
function sortProducts(sortBy) {
  const productList = document.getElementById("product-list");
  const products = Array.from(productList.children);

  products.sort((a, b) => {
    const priceA = parseInt(
      a.querySelector(".product-price").textContent.replace(/[^\d]/g, "")
    );
    const priceB = parseInt(
      b.querySelector(".product-price").textContent.replace(/[^\d]/g, "")
    );
    const nameA = a.querySelector(".product-title").textContent;
    const nameB = b.querySelector(".product-title").textContent;

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "name-asc":
        return nameA.localeCompare(nameB);
      case "name-desc":
        return nameB.localeCompare(nameA);
      default: // newest
        return 0; // Tidak mengubah urutan
    }
  });

  // Terapkan urutan baru ke DOM
  products.forEach((product) => {
    productList.appendChild(product);
  });
}

// Fungsi untuk update pagination berdasarkan jumlah item yang terlihat
function updatePagination(visibleCount) {
  const paginationContainer = document.querySelector(".pagination-container");

  if (visibleCount === 0) {
    // Tampilkan pesan jika tidak ada produk yang cocok
    const productList = document.getElementById("product-list");

    // Cek jika pesan sudah ada
    if (!document.getElementById("no-products-message")) {
      const message = document.createElement("div");
      message.id = "no-products-message";
      message.className = "text-center py-5";
      message.innerHTML = `
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <h4 class="mt-3">Produk Tidak Ditemukan</h4>
                <p>Maaf, tidak ada produk yang cocok dengan kriteria filter Anda.</p>
                <button class="btn btn-primary mt-2" onclick="resetFilters(); applyFilters();">
                    Reset Filter
                </button>
            `;

      productList.innerHTML = "";
      productList.appendChild(message);
    }

    paginationContainer.style.display = "none";
  } else {
    // Hapus pesan jika ada
    const noProductsMessage = document.getElementById("no-products-message");
    if (noProductsMessage) {
      noProductsMessage.remove();
    }

    // Tampilkan pagination jika produk cukup banyak
    paginationContainer.style.display = visibleCount > 8 ? "block" : "none";
  }
}

// Fungsi global untuk reset semua filter (digunakan oleh tombol reset)
function resetAllFilters() {
  // Reset kategori
  const allCategoryLink = document.querySelector(
    '.category-nav .nav-link[data-category="all"]'
  );
  allCategoryLink.click();

  // Reset filter lainnya
  resetFilters();

  // Terapkan ulang filter (tanpa filter)
  applyFilters();
}
