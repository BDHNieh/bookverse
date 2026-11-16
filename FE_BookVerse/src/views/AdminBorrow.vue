<template>
  <HeaderAdmin />
  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content reveal-content">
        <h1 class="tittle">Book Detail</h1>
      </div>
    </div>
  </section>
  <div class="m-auto" style="max-width: 1400px">
    <BookBorrowList :borrows="borrows" :role="currentUser?.role" @refresh="fetchAllBorrows">
      <template #actions="{ item }">
        <!-- STAFF duyệt -->
        <div v-if="canApprove && item.TrangThai === 'Chờ duyệt'" class="d-flex gap-2 justify-content-end borrow-btn-box">
          <button class="cancel-button-borrow btn btn-success btn-sm" @click="handleApprove(item)">Accept</button>

          <button class="deny-button-borrow btn btn-danger btn-sm" @click="handleReject(item)">Deny</button>
        </div>

        <div v-else-if="canApprove && (item.TrangThai === 'Đang mượn' || item.TrangThai === 'Quá hạn')">
          <button class="cancel-button-borrow m-auto" @click="handleReturn(item)">Trả sách</button>
        </div>

        <!-- USER -->
        <span v-else class="text-muted small">
          <i class="fas fa-lock"></i>
        </span>
      </template>
    </BookBorrowList>
  </div>
  <FooterComp />
</template>

<script>
import BookBorrowList from "../components/BorrowList.vue";
import FooterComp from "../components/Footer.vue";
import HeaderAdmin from "../components/HeaderAdmin.vue";
import BookBorrowService from "../services/borrow.service";

export default {
  components: { BookBorrowList, HeaderAdmin, FooterComp },

  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    return {
      borrows: [],
      currentUser: user,
    };
  },

  computed: {
    isStaff() {
      return this.currentUser?.role === "staff";
    },
    canApprove() {
      return this.isStaff;
    },
  },

  methods: {
    async fetchAllBorrows() {
      try {
        this.borrows = await BookBorrowService.getAll();
      } catch (error) {
        console.error(error);
      }
    },

    async updateStatus(id, status) {
      try {
        const staffId = this.currentUser?._id;

        const payload = {
          TrangThai: status,
          MaNhanVien: staffId,
        };

        await BookBorrowService.update(id, payload);

        alert("Cập nhật thành công!");
        this.fetchAllBorrows();
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    },

    handleApprove(item) {
      if (confirm("Duyệt phiếu mượn này?")) {
        this.updateStatus(item._id, "Đang mượn");
      }
    },

    handleReject(item) {
      if (confirm("Từ chối phiếu mượn này?")) {
        this.updateStatus(item._id, "Đã từ chối");
      }
    },

    handleReturn(item) {
      if (confirm("Xác nhận đã nhận lại sách?")) {
        this.updateStatus(item._id, "Đã trả");
      }
    },
  },

  mounted() {
    console.log("ROLE:", this.currentUser);
    this.fetchAllBorrows();
  },
};
</script>

<style scoped>
@import "../assets/css/book.css";
</style>
