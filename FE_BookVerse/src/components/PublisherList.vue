<template>
  <div class="publisher-list">
    <div v-for="pub in publishers" :key="pub._id" @click="$emit('select-publisher', pub)" class="publisher-item">
      <div>
        <b>{{ pub.TenNXB }}</b>
        <p>{{ pub.DiaChi }}</p>
        <small>{{ pub.SDT }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["publishers"],
};
</script>

<style scoped>
@import "../assets/css/publisher.css";
</style>
