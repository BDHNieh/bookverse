<script setup>
import { ref, onMounted } from "vue";
import BookService from "../services/book.service";
import erImg from "../assets/image/mimosa.png";
import { useRouter } from "vue-router";

const router = useRouter();

const books = ref([]);
const loading = ref(false);
const viewMode = ref("grid");

const getAllBooks = async () => {
  loading.value = true;
  try {
    const data = await BookService.getAll();

    books.value = data.map((book) => ({
      ...book,
      image: book.image ? `http://localhost:3000/api/upload/${book.image}` : erImg,
      rate: book.rate ?? 0,
    }));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const deleteBook = async (id) => {
  if (!confirm("Delete this book?")) return;

  try {
    await BookService.delete(id);
    getAllBooks();
  } catch (err) {
    console.error(err);
  }
};

const goToDetail = (id) => {
  router.push(`/staff/book/${id}`);
};

onMounted(getAllBooks);
</script>

<template>
  <div class="admin-book">
    <!-- HEADER -->
    <div class="admin-book-header">
      <h2 class="transparent">Quản lý sách</h2>

      <router-link class="btn-add" :to="{ name: 'BookAdd' }"> Add Book </router-link>
    </div>

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
        <span class="result-count">{{ books.length }} results</span>
      </div>
    </div>

    <div :class="['book-grid', viewMode]">
      <div v-for="book in books" :key="book._id" class="book-card" @click="goToDetail(book._id)">
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

        <!-- INFO -->
        <div class="book-title-box">
          <h3 class="book-title">
            {{ book.TenSach }}
          </h3>

          <p class="book-price">{{ book.TacGia }} • {{ book.nxb_info?.TenNXB }}</p>

          <div class="book-rating">
            <font-awesome-icon v-for="n in 5" :key="n" :icon="n <= book.rate ? ['fas', 'star'] : ['far', 'star']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/css/book.css";
</style>
