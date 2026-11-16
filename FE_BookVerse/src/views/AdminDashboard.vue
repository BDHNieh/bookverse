// ===== FILE: src/views/AdminDashboard.vue =====
<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import BookService from "../services/book.service";
import BorrowService from "../services/borrow.service";
import HeaderAdmin from "../components/HeaderAdmin.vue";
import FooterComp from "../components/Footer.vue";
import Chart from "chart.js/auto";
import { watch } from "vue";
import { ref as vueRef } from "vue";
import { onBeforeUnmount } from "vue";

const borrowCanvas = vueRef(null);
const statusCanvas = vueRef(null);

const books = ref([]);
const borrows = ref([]);

const fetchData = async () => {
  books.value = await BookService.getAll();
  borrows.value = await BorrowService.getAll();
};

// ===== WIDGET =====
const totalBorrowed = computed(() => borrows.value.length);

const overdue = computed(() => borrows.value.filter((b) => b.TrangThai === "Đang mượn" && new Date() > new Date(b.NgayTra)).length);

const totalBooksLeft = computed(() => books.value.reduce((sum, b) => sum + (b.SoQuyen || 0), 0));

const totalCategories = computed(() => {
  const set = new Set();
  books.value.forEach((b) => {
    (b.MaTheLoai || []).forEach((id) => set.add(id));
  });
  return set.size;
});

// ===== TOP USER =====
const topUsers = computed(() => {
  const map = {};

  borrows.value.forEach((b) => {
    if (b.TrangThai === "Đang mượn") {
      const name = b.docgia_info?.Username || "Không rõ";

      if (!map[name]) map[name] = 0;
      map[name]++;
    }
  });

  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

let borrowChart = null;
let statusChart = null;
const borrowByMonth = computed(() => {
  const months = Array(12).fill(0);

  borrows.value.forEach((b) => {
    if (b.NgayMuon) {
      const m = new Date(b.NgayMuon).getMonth();
      months[m]++;
    }
  });

  return months;
});

// trạng thái
const statusData = computed(() => {
  const map = {
    "Đã từ chối": 0,
    "Đang mượn": 0,
    "Đã trả": 0,
  };

  borrows.value.forEach((b) => {
    if (map[b.TrangThai] !== undefined) {
      map[b.TrangThai]++;
    }
  });

  return Object.values(map);
});

onMounted(async () => {
  await fetchData();
  await nextTick();

  // ===== BAR CHART =====
  borrowChart = new Chart(borrowCanvas.value, {
    type: "bar",
    data: {
      labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
      datasets: [
        {
          label: "Lượt mượn",
          data: borrowByMonth.value,
          backgroundColor: "#4f46e5",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });

  // ===== DOUGHNUT =====
  statusChart = new Chart(statusCanvas.value, {
    type: "doughnut",
    data: {
      labels: ["Đã từ chối", "Đang mượn", "Đã trả"],
      datasets: [
        {
          data: statusData.value,
          backgroundColor: ["#7c3aed", "#4f46e5", "#f59e0b"],
        },
      ],
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { display: false },
      },
    },
  });
});

watch(borrows, async () => {
  await nextTick();

  if (borrowChart) {
    borrowChart.data.datasets[0].data = borrowByMonth.value;
    borrowChart.update();
  }

  if (statusChart) {
    statusChart.data.datasets[0].data = statusData.value;
    statusChart.update();
  }
});

onBeforeUnmount(() => {
  borrowChart?.destroy();
  statusChart?.destroy();
});
</script>

<template>
  <HeaderAdmin />
  <div class="dashboard">
    <h1 class="title">Dashboard</h1>

    <!-- WIDGET -->
    <div class="widget-grid">
      <div class="widget">
        <h3>Đã mượn</h3>
        <p>{{ totalBorrowed }}</p>
      </div>

      <div class="widget">
        <h3>Thể loại</h3>
        <p>{{ totalCategories }}</p>
      </div>

      <div class="widget">
        <h3>Còn lại</h3>
        <p>{{ totalBooksLeft }}</p>
      </div>

      <div class="widget danger">
        <h3>Quá hạn</h3>
        <p>{{ overdue }}</p>
      </div>
    </div>

    <div class="chart-grid">
      <!-- BAR -->
      <div class="chart-box">
        <div class="chart-header">
          <h3>Lượt mượn theo tháng</h3>
          <span class="year">2026</span>
        </div>
        <canvas ref="borrowCanvas"></canvas>
      </div>

      <!-- DOUGHNUT -->
      <div class="chart-box">
        <div class="chart-header">
          <h3>Trạng thái mượn</h3>
        </div>
        <canvas ref="statusCanvas"></canvas>

        <!-- legend custom -->
        <div class="legend">
          <div><span class="dot orange"></span> Từ chối</div>
          <div><span class="dot brown"></span> Đang mượn</div>
          <div><span class="dot green"></span> Đã trả</div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-box">
      <h2 class="title">Top người dùng mượn nhiều nhất</h2>

      <table>
        <thead>
          <tr class="dashboard-topuser">
            <th>#</th>
            <th>Username</th>
            <th>Số sách mượn</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, index) in topUsers" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.count }}</td>
          </tr>

          <tr v-if="topUsers.length === 0">
            <td colspan="3">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <FooterComp />
</template>

<style>
@import "../assets/css/dashboard.css";
@import "../assets/css/book.css";
</style>
