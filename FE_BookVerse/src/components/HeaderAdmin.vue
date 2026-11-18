<template>
  <!-- HEADER TOP -->
  <section class="header__top">
    <div class="container">
      <div class="header__top-left">
        <a href="mailto:bookverse.support@gmail.com">
          <font-awesome-icon icon="envelope" />
          <span>bookverse.support@gmail.com</span>
        </a>

        <a href="#">
          <font-awesome-icon icon="phone" />
          <span>0123456789</span>
        </a>
      </div>

      <div class="header__top-right">
        <a href="#"><font-awesome-icon :icon="['fab', 'x-twitter']" /></a>
        <a href="#"><font-awesome-icon :icon="['fab', 'facebook']" /></a>
        <a href="#"><font-awesome-icon :icon="['fab', 'youtube']" /></a>
      </div>
    </div>
  </section>

  <!-- HEADER -->
  <header class="header headerUser">
    <div class="container header__bar">
      <router-link to="/staff/home" class="header__logo">
        <span class="header__logo-mark"><font-awesome-icon icon="book-open" /></span>
        <span class="header__logo-text">Book<span>Verse</span></span>
      </router-link>

      <nav class="nav header__nav">
        <ul class="nav__list">
          <li>
            <router-link to="/staff/home" class="nav__list-item">
              <font-awesome-icon icon="compass" />
              <span>Trang chủ</span>
            </router-link>
          </li>
          <li>
            <router-link to="/staff/book" class="nav__list-item">
              <font-awesome-icon icon="book-open" />
              <span>Sách</span>
            </router-link>
          </li>
          <li>
            <router-link to="/staff/borrow" class="nav__list-item">
              <font-awesome-icon icon="hand-holding" />
              <span>Mượn sách</span>
            </router-link>
          </li>
          <li>
            <router-link to="/staff/publisher" class="nav__list-item">
              <font-awesome-icon icon="building" />
              <span>Nhà Phát Hành</span>
            </router-link>
          </li>
          <li>
            <router-link to="/staff/reader" class="nav__list-item">
              <font-awesome-icon icon="user" />
              <span>Độc giả</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="header__tools">
        <div class="header__search">
          <input v-model="search" class="search__bar" type="text" placeholder="Tìm kiếm..." />
          <button class="search__button" @click="handleSearch">
            <font-awesome-icon icon="magnifying-glass" />
          </button>
        </div>

        <div class="header__action">
        <div class="user-profile">
          <div class="user_padding" @click="toggleMenu">
            <div class="avatar">
              <img v-if="isLogin" :src="avatar" alt="avatar" />
              <font-awesome-icon v-else icon="user" class="text-white" />
            </div>

            <span class="username">{{ Username }}</span>
            <font-awesome-icon icon="chevron-down" class="arrow-down" :class="{ rotate: showMenu }" />
          </div>
          <!-- DROPDOWN -->
          <transition name="dropdown">
            <div v-if="showMenu" class="user-dropdown">
              <button class="dropdown-item" @click="goProfile">
                <font-awesome-icon icon="user" />
                Thông Tin
              </button>
              <button class="dropdown-item" @click="logout">
                <font-awesome-icon icon="right-from-bracket" />
                Đăng Xuất
              </button>
            </div>
          </transition>
        </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
@import "../assets/css/home.css";
</style>

<script>
import avatarImg from "../assets/image/avt.jpg";

export default {
  name: "HeaderAdmin",

  data() {
    return {
      search: "",
      avatar: avatarImg,
      isLogin: false,
      showMenu: false,
      Username: "Admin",
    };
  },

  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      this.isLogin = true;
      this.Username = user.Username || "Admin";
    }
  },

  methods: {
    handleSearch() {
      console.log("Search:", this.search);
    },

    logout() {
      localStorage.clear();
      location.reload();
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    goProfile() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      this.$router.push(`/staff/profile/${user._id}`);
    },
  },
};
</script>
