<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  borrows: { type: Array, default: () => [] },
  role: { type: String, default: "user" },
});
const normalize = (s) => s?.trim().toLowerCase();

const emit = defineEmits(["refresh", "approve", "reject"]);

const currentTab = ref("all");

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "Chờ duyệt", label: "Chờ duyệt" },
  { id: "Đang mượn", label: "Đang mượn" },
  { id: "Đã trả", label: "Đã trả" },
  { id: "Đã hủy", label: "Đã hủy" },
  { id: "Đã từ chối", label: "Đã từ chối" },
  { id: "overdue", label: "Quá hạn" }, // computed
];

// format ngày
const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

const isStaff = computed(() => props.role === "staff");

// hạn trả
const getDueDate = (item) => {
  if (!item.NgayTra) return "---";
  return new Date(item.NgayTra).toLocaleDateString("vi-VN");
};

const checkOverdue = (item) => {
  const status = normalize(item.TrangThai);

  if (status === "quá hạn") return true;

  if (status !== "đang mượn" || !item.NgayTra) return false;

  const today = new Date();
  const due = new Date(item.NgayTra);

  // reset giờ về 00:00:00
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return today > due;
};

// filter
const filteredBorrows = computed(() => {
  let result = [...props.borrows];

  if (currentTab.value !== "all") {
    if (currentTab.value === "overdue") {
      result = result.filter((b) => checkOverdue(b));
    } else {
      result = result.filter((b) => normalize(b.TrangThai) === normalize(currentTab.value));
    }
  }

  return result;
});

// count
const countByStatus = (status) => {
  let data = props.borrows;

  if (status === "all") return data.length;

  if (status === "overdue") {
    return data.filter((b) => checkOverdue(b)).length;
  }

  return data.filter((b) => normalize(b.TrangThai) === normalize(status)).length;
};
</script>

<template>
  <div class="borrow-container">
    <h2 class="title">Lịch sử mượn sách</h2>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" :class="['tab-btn', { active: currentTab === tab.id }]" @click="currentTab = tab.id">
        {{ tab.label }}
        <span class="count">{{ countByStatus(tab.id) }}</span>
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-wrapper">
      <table class="borrow-table">
        <thead>
          <tr>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Trạng thái</th>
            <th v-if="isStaff">Người mượn</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <!-- Có data -->
          <tr v-for="item in filteredBorrows" :key="item._id">
            <td>
              <div class="book-cell">
                <img :src="item.sach_info?.image || '/src/assets/image/Stephen King.png'" class="thumb" />
                <div class="borrow-book-detail">
                  <div class="book-name">
                    {{ item.sach_info?.TenSach || "Không xác định" }}
                  </div>
                  <small class="text-muted">
                    {{ item.sach_info?.TacGia }}
                  </small>
                </div>
              </div>
            </td>

            <td>{{ formatDate(item.NgayMuon) }}</td>

            <td :class="{ overdue: checkOverdue(item) }">
              {{ getDueDate(item) }}
            </td>

            <td>
              <span class="status" :class="checkOverdue(item) ? 'Quáhạn' : item.TrangThai.replace(/\s/g, '')">
                {{ checkOverdue(item) ? "Quá hạn" : item.TrangThai }}
              </span>
            </td>
            <td v-if="isStaff" class="text-muted">
              {{ item.docgia_info?.HoTen || "Không rõ" }}
            </td>
            <td>
              <div class="actions">
                <!-- slot custom -->
                <slot name="actions" :item="item"></slot>
              </div>
            </td>
          </tr>

          <!-- Không có data -->
          <tr v-if="filteredBorrows.length === 0">
            <td colspan="5" class="empty-table">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/css/book.css";
</style>
