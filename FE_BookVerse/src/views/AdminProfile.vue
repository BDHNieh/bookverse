<template>
  <HeaderAdmin />
  <div class="m-auto" style="max-width: 1200px">
    <ProfileLayout :user="user" :allowAvatar="false" :allowPassword="false" @updateUser="updateUser" />
  </div>
  <FooterComp />
</template>

<script>
import ProfileLayout from "../components/ProfileLayout.vue";
import StaffService from "../services/staff.service";
import HeaderAdmin from "../components/HeaderAdmin.vue";
import FooterComp from "../components/Footer.vue";

export default {
  components: { ProfileLayout, HeaderAdmin, FooterComp },

  data() {
    return {
      user: {},
    };
  },

  methods: {
    async loadUser() {
      const userLocal = JSON.parse(localStorage.getItem("user"));

      if (!userLocal || !userLocal.token) {
        this.$router.push("/staff/login");
        return;
      }

      const id = this.$route.params.id;
      const data = await StaffService.get(id);

      this.user = {
        ...data,
        HoTen: data.HoTenNV,
      };
    },

    async updateUser(data) {
      const id = this.$route.params.id;

      const payload = {
        ...data,
        HoTenNV: data.HoTen,
      };

      await StaffService.update(id, payload);

      const newData = await StaffService.get(id);

      this.user = {
        ...newData,
        HoTen: newData.HoTenNV,
      };
    },
  },

  mounted() {
    this.loadUser();
  },
};
</script>
