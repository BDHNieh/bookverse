<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BookService from "../services/book.service";
import erImg from "../assets/image/mimosa.png";
import CategoryService from "../services/category.service";
import { computed } from "vue";

const filteredBooks = computed(() => {
  if (selectedCategories.value.length === 0) return books.value;

  return books.value.filter((book) => {
    if (!Array.isArray(book.MaTheLoai)) return false;

    return book.MaTheLoai.some((catId) => selectedCategories.value.includes(catId.toString()));
  });
});

const categories = ref([]);
const selectedCategories = ref([]);

const books = ref([]);
const loading = ref(false);
const viewMode = ref("grid");
const router = useRouter();

const getAllBooks = async () => {
  loading.value = true;

  try {
    const data = await BookService.getAll();

    books.value = data.map((book) => ({
      ...book,
      image: book.image ? `http://localhost:3000/api/upload/${book.image}` : erImg,
    }));
  } catch (error) {
    console.error("Lỗi lấy sách:", error);
  } finally {
    loading.value = false;
  }
};

const goToDetail = (id) => {
  router.push(`/book/${id}`);
};

const getAllCategories = async () => {
  try {
    categories.value = await CategoryService.getAll();
  } catch (error) {
    console.error("Lỗi lấy thể loại:", error);
  }
};

onMounted(() => {
  getAllBooks();
  getAllCategories();
});
</script>

<template>
  <section class="book-page">
    <!-- FILTER -->
    <aside class="filter-sidebar">
      <div class="filter-box">
        <div class="filter-title">Availability</div>

        <div class="filter-content">
          <label>
            <input type="checkbox" />
            In stock (11)
          </label>

          <label class="disabled">
            <input type="checkbox" disabled />
            Out of stock (0)
          </label>
        </div>
      </div>

      <div class="filter-box">
        <div class="filter-title">Category</div>

        <div class="filter-content">
          <label v-for="cat in categories" :key="cat._id" :class="{ active: selectedCategories.includes(cat._id) }">
            <input type="checkbox" :value="cat._id" v-model="selectedCategories" />
            {{ cat.TenTheLoai }}
          </label>
        </div>
      </div>

      <div class="filter-box">
        <div class="filter-title">More Filters</div>
      </div>
    </aside>

    <!-- BOOK AREA -->
    <div class="book-area">
      <!-- SORT BAR -->
      <div class="sort-bar">
        <div class="view-buttons">
          <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
            <font-awesome-icon icon="grip-vertical" />
          </button>

          <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
            <font-awesome-icon icon="bars" />
          </button>
        </div>

        <div class="sort-right">
          <button class="sort-btn">Sort By</button>

          <span class="result-count"> {{ filteredBooks.length }} results </span>
        </div>
      </div>

      <div :class="['book-grid', viewMode]">
        <div v-for="book in filteredBooks" :key="book._id" class="book-card" @click="goToDetail(book._id)">
          <!-- XÓA -->
          <!-- <p>{{ book.MaTheLoai }}</p> -->
          <div class="book-image-box">
            <img :src="book.image" class="book-image" />
            <div class="book-actions">
              <button class="action-btn">
                <font-awesome-icon icon="link" />
              </button>

              <button class="action-btn">
                <font-awesome-icon icon="magnifying-glass" />
              </button>

              <button class="action-btn">
                <font-awesome-icon icon="cart-shopping" />
              </button>

              <button class="action-btn">
                <font-awesome-icon icon="heart" />
              </button>
            </div>
          </div>

          <div class="book-title-box">
            <h3 class="book-title">
              {{ book.TenSach }}
            </h3>

            <p class="book-price">{{ book.TacGia }} • {{ book.nxb_info?.TenNXB }}</p>
            <div class="book-rating">
              <div class="book-rating">
                <font-awesome-icon v-for="n in 5" :key="n" :icon="n <= book.rate ? ['fas', 'star'] : ['far', 'star']" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@import "../assets/css/book.css";
</style>
