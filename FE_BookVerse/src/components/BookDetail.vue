<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import BookService from "../services/book.service";
import BorrowService from "../services/borrow.service";
import BorrowForm from "../components/BorrowForm.vue";
import erImg from "../assets/image/Stephen King.png";

const router = useRouter();
const route = useRoute();
const emit = defineEmits(["borrow"]);
const activeTab = ref("detail");
const user = ref(JSON.parse(localStorage.getItem("user")));

const isStaff = computed(() => {
  return user.value?.role === "staff";
});

const relatedBooks = ref([]);

const getRelatedBooks = async () => {
  try {
    const data = await BookService.getRelated(route.params.id);

    relatedBooks.value = data.map((item) => ({
      ...item,
      image: item.image ? `http://localhost:3000/api/upload/${item.image}` : erImg,
      rate: item.rate ?? 0,
    }));
  } catch (err) {
    console.error(err);
  }
};

const showBorrowForm = ref(false);

const visitsCount = ref(0);
const target = Math.floor(Math.random() * 50) + 10;

const animateCount = () => {
  const duration = 3500;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);

    visitsCount.value = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const book = ref({});

const getBook = async () => {
  try {
    const data = await BookService.get(route.params.id);

    book.value = {
      ...data,
      image: data.image ? `http://localhost:3000/api/upload/${data.image}` : erImg,
      rate: data.rate ?? 0,
    };
    await getRelatedBooks();
    // console.log(book.value.theloai_info);
  } catch (err) {
    console.error(err);
  }
};

const handleEdit = () => {
  router.push(`/staff/book/edit/${book.value._id}`);
};

const handleDelete = async () => {
  if (!confirm("Are you sure?")) return;

  try {
    await BookService.delete(book.value._id);
    alert("Delete success!");

    // quay về list
    router.push("/staff/book");
  } catch (error) {
    console.error(error);
    alert("Delete failed!");
  }
};

onMounted(() => {
  getBook();
  animateCount();
});

const handleBorrow = () => {
  showBorrowForm.value = true;
};

const confirmBorrow = async (payload) => {
  try {
    await BorrowService.create(payload); // gọi API
    alert("Đã gửi yêu cầu mượn sách!");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi mượn sách!");
  }
};

const handleAddCart = () => {
  console.log("Thêm vào giỏ:");
};
</script>

<template>
  <div>
    <BorrowForm v-if="showBorrowForm && book._id" :book="book" @close="showBorrowForm = false" @confirm="confirmBorrow" />

    <!-- BOOK DETAIL -->
    <div v-if="book._id" class="book-detail">
      <div class="book-image_detail">
        <img :src="book.image" alt="book" />
      </div>

      <div class="book-info">
        <h2 class="title">{{ book.TenSach }}</h2>

        <div class="meta">
          <p><font-awesome-icon icon="user" /> Author: {{ book.TacGia }}</p>
          <p><font-awesome-icon icon="user" /> Publisher: {{ book.nxb_info?.TenNXB }}</p>
          <p><font-awesome-icon icon="book" /> Còn: {{ book.SoQuyen }}</p>
          <p><font-awesome-icon icon="eye" /> People are viewing this right now: {{ visitsCount }}</p>
          <p>Publication year: {{ book.NamXuatBan }}</p>
        </div>

        <div class="rating">
          <font-awesome-icon icon="star" class="star" />
          {{ book.rate || 0 }} / 5
        </div>

        <div class="actions">
          <template v-if="!isStaff">
            <button class="btn" @click="handleBorrow">
              <font-awesome-icon icon="book-open" />
              Mượn
            </button>

            <button class="btn" @click="handleAddCart">
              <font-awesome-icon icon="cart-shopping" />
              Thêm vào giỏ hàng
            </button>
          </template>

          <!-- STAFF -->
          <template v-else>
            <button class="btn" @click="handleEdit">
              <font-awesome-icon icon="pen" />
              Chỉnh sửa
            </button>

            <button class="btn" @click="handleDelete">
              <font-awesome-icon icon="trash" />
              Xóa
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="review-section">
      <!-- TABS -->
      <div class="review-tabs">
        <button class="tab" :class="{ active: activeTab === 'detail' }" @click="activeTab = 'detail'">Chi tiết sản phẩm</button>

        <button class="tab" :class="{ active: activeTab === 'review' }" @click="activeTab = 'review'">Đánh giá</button>
      </div>

      <!-- TAB: DETAIL -->
      <div v-if="activeTab === 'detail'" class="review-box">
        <table class="detail-table">
          <tr>
            <td>Tên sách</td>
            <td>{{ book.TenSach }}</td>
          </tr>

          <tr>
            <td>Tác giả</td>
            <td>{{ book.TacGia }}</td>
          </tr>

          <tr>
            <td>Nhà xuất bản</td>
            <td>{{ book.nxb_info?.TenNXB }}</td>
          </tr>

          <tr>
            <td>Năm xuất bản</td>
            <td>{{ book.NamXuatBan }}</td>
          </tr>

          <tr>
            <td>Số lượng còn lại</td>
            <td>{{ book.SoQuyen }}</td>
          </tr>

          <tr>
            <td>Ngôn ngữ</td>
            <td>English</td>
          </tr>

          <tr>
            <td>Thể loại</td>
            <td>
              <span v-for="cate in book.theloai_info || []" :key="cate._id" class="tag">
                {{ cate.TenTheLoai }}
              </span>
            </td>
          </tr>

          <tr>
            <td>Mô tả</td>
            <td>{{ book.MoTa || "Chưa có mô tả" }}</td>
          </tr>
        </table>
      </div>

      <!-- TAB: REVIEW -->
      <div v-if="activeTab === 'review'" class="review-box">
        <h3 class="review-title">Đánh giá khách hàng</h3>

        <div class="review-summary">
          <div class="summary-left">
            <div class="stars">
              <font-awesome-icon v-for="n in 5" :key="n" icon="star" />
            </div>
            <p>4.33 / 5</p>
            <span>Dựa trên 3 đánh giá</span>
          </div>

          <div class="summary-middle">
            <div v-for="i in 5" :key="i" class="progress-row">
              <span>{{ 6 - i }} ★</span>
              <div class="bar">
                <div class="fill" :style="{ width: (6 - i) * 10 + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="summary-right">
            <button class="btn">Viết đánh giá</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RELATED -->
    <div class="related-section">
      <h2 class="related-title">You may also like</h2>

      <div class="related-list">
        <div v-for="item in relatedBooks" :key="item._id" class="book-card" @click="router.push(`/book/${item._id}`)">
          <div class="book-image-box">
            <img :src="item.image" class="book-image" />

            <div class="book-actions">
              <button class="action-btn" @click.stop>
                <font-awesome-icon icon="link" />
              </button>
              <button class="action-btn" @click.stop>
                <font-awesome-icon icon="magnifying-glass" />
              </button>
              <button class="action-btn" @click.stop>
                <font-awesome-icon icon="cart-shopping" />
              </button>
              <button class="action-btn" @click.stop>
                <font-awesome-icon icon="heart" />
              </button>
            </div>
          </div>

          <div class="book-title-box">
            <h3 class="book-title">{{ item.TenSach }}</h3>

            <p class="book-price">{{ item.TacGia }} • {{ item.nxb_info?.TenNXB }}</p>

            <div class="book-rating">
              <font-awesome-icon v-for="n in 5" :key="n" :icon="n <= item.rate ? ['fas', 'star'] : ['far', 'star']" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/css/book.css";
</style>
