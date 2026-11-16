<template>
  <div class="profile-view">
    <div class="profile-view__row">
      <span class="profile-view__label">Username</span>
      <span class="profile-view__value">{{ user.Username }}</span>
    </div>

    <div class="profile-view__row">
      <span class="profile-view__label">Họ tên</span>
      <span class="profile-view__value">{{ user.HoTen }}</span>
    </div>

    <div class="profile-view__row">
      <span class="profile-view__label">Email</span>
      <span class="profile-view__value">{{ user.Email }}</span>
    </div>

    <div class="profile-view__row">
      <span class="profile-view__label">Địa chỉ</span>
      <span class="profile-view__value">{{ user.DiaChi }}</span>
    </div>

    <div class="profile-view__row">
      <span class="profile-view__label">SĐT</span>
      <span class="profile-view__value">{{ user.SoDienThoai }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
};
</script>
