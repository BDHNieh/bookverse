import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";

// Template role
const readerMeta = {
  role: "reader",
  requiresAuth: true,
};

const staffMeta = {
  role: "staff",
  requiresAuth: true,
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Home" },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: { title: "Login" },
  },
  {
    path: "/staff/login",
    name: "StaffLogin",
    component: () => import("@/views/StaffLogin.vue"),
    meta: { title: "Staff Login" },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
    meta: { title: "Register" },
  },
  {
    path: "/borrow",
    name: "Borrow",
    component: () => import("@/views/UserBorrow.vue"),
    meta: { title: "Borrow" },
  },
  {
    path: "/book",
    name: "Book",
    component: () => import("@/views/Book.vue"),
    meta: { title: "Book" },
  },
  {
    path: "/publisher",
    name: "Publisher",
    component: () => import("@/views/Publisher.vue"),
    meta: { title: "Publisher" },
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: () => import("@/views/UserProfile.vue"),
    meta: { title: "Profile" },
  },
  {
    path: "/staff/home",
    name: "AdminHome",
    component: () => import("@/views/AdminDashboard.vue"),
    meta: { title: "Welcome back doctor", ...staffMeta },
  },
  {
    path: "/staff/book",
    name: "StaffBook",
    component: () => import("@/views/AdminBook.vue"),
    meta: { title: "Book Management", ...staffMeta },
  },
  {
    path: "/staff/book/add",
    name: "BookAdd",
    component: () => import("@/views/AdminBookAdd.vue"),
    meta: { title: "Book Add", ...staffMeta },
  },
  {
    path: "/staff/book/edit/:id",
    name: "BookEdit",
    component: () => import("@/views/EditBook.vue"),
    meta: { title: "Book Edit", ...staffMeta },
  },
  {
    path: "/staff/book/:id",
    name: "BookDetail",
    component: () => import("@/views/AdminBookDetail.vue"),
    meta: { title: "Book Detail", ...staffMeta },
  },
  {
    path: "/book/:id",
    name: "BookDetailUser",
    component: () => import("@/views/UserBookDetail.vue"),
    meta: { title: "Book Detail" },
  },
  {
    path: "/staff/publisher",
    name: "StaffPublisher",
    component: () => import("@/views/PublisherPage.vue"),
    meta: { title: "Publisher Management", ...staffMeta },
  },
  {
    path: "/staff/reader",
    name: "StaffReader",
    component: () => import("@/views/ReaderView.vue"),
    meta: { title: "Reader Management", ...staffMeta },
  },
  {
    path: "/staff/borrow",
    name: "StaffBorrow",
    component: () => import("@/views/AdminBorrow.vue"),
    meta: { title: "Borrow Management", ...staffMeta },
  },
  {
    path: "/staff/profile/:id",
    name: "StaffProfile",
    component: () => import("@/views/AdminProfile.vue"),
    meta: { title: "Profile Management", ...staffMeta },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "Not found" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: "smooth", // optional: cuộn mượt
    };
  },
});

// ROUTER GUARD
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | BookVerse` : "BookVerse";

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Nếu route cần đăng nhập mà chưa login
  if (to.meta.requiresAuth && !user) {
    alert("Please login!");
    const isStaffRoute = to.path.startsWith("/staff");
    return next({ name: isStaffRoute ? "StaffLogin" : "Login" });
  }

  // Nếu đã login mà cố vào login/register
  if (user && (to.path === "/login" || to.path === "/staff/login" || to.path === "/register")) {
    if (user.role === "staff") {
      return next("/staff/home");
    }
    return next("/");
  }

  // Nếu route có role mà role không đúng
  if (to.meta.role) {
    if (!user || user.role !== to.meta.role) {
      alert("Bạn không có quyền truy cập!");
      return next("/");
    }
  }

  next();
});

export default router;
