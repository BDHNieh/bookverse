<template>
  <HeaderUser />
  <div class="m-auto" style="max-width: 1200px">
    <ProfileLayout :user="user" @updateUser="updateUser" @reloadUser="loadUser" />
  </div>
  <FooterComp />
</template>

<script>
import ProfileLayout from "../components/ProfileLayout.vue";
import HeaderUser from "../components/HeaderUser.vue";
import FooterComp from "../components/Footer.vue";
import ReaderService from "../services/reader.service";

export default {
  components: { ProfileLayout, HeaderUser, FooterComp },

  data() {
    return {
      user: {},
    };
  },

  methods: {
    async loadUser() {
      const userLocal = JSON.parse(localStorage.getItem("user"));

      if (!userLocal || !userLocal.token) {
        this.$router.push("/login");
        return;
      }
      const id = this.$route.params.id;
      this.user = await ReaderService.get(id);
    },

    async updateUser(data) {
      const id = this.$route.params.id;

      await ReaderService.update(id, data);

      this.user = await ReaderService.get(id); // lấy lại dữ liệu chuẩn từ server

      // RQ-09: đồng bộ ảnh đại diện vào localStorage và báo cho Header cập nhật ngay (không cần đăng nhập lại)
      const userLocal = JSON.parse(localStorage.getItem("user"));
      if (userLocal) {
        userLocal.Avatar = this.user.Avatar;
        localStorage.setItem("user", JSON.stringify(userLocal));
        window.dispatchEvent(new Event("user-updated"));
      }
    },
  },

  mounted() {
    this.loadUser();
  },
};
</script>
