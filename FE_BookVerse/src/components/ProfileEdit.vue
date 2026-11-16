<template>
  <div class="profile-edit">
    <h3>Chỉnh sửa thông tin</h3>

    <form @submit.prevent="submit">
      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.HoTen" placeholder="Họ tên" />
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.Email" placeholder="Email" />
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.DiaChi" placeholder="Địa chỉ" />
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.SoDienThoai" placeholder="SĐT" />
      </div>

      <button type="submit" class="profile-edit__btn">Lưu</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ["form"],

  data() {
    return {
      localForm: {},
      isSubmitting: false,
    };
  },

  watch: {
    form: {
      immediate: true,
      handler(val) {
        this.localForm = { ...val };
      },
    },
  },

  methods: {
    submit(e) {
      if (e) e.preventDefault();

      if (this.isSubmitting) return;

      this.isSubmitting = true;

      console.log("SUBMIT 1 LẦN:", this.localForm);

      this.$emit("submit", this.localForm);

      setTimeout(() => {
        this.isSubmitting = false;
      }, 500);
    },
  },
};
</script>
