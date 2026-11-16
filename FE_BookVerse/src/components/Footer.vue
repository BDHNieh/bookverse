<template>
  <div class="w-full mx-auto footer">
    <!-- Top footer -->
    <div class="footer__grid">
      <!-- About -->
      <div>
        <h3 class="mb-3 footer-chapter">About BookVerse</h3>
        <p class="max-w-xs footer-content">BookVerse is a modern library management system designed to help readers explore, organize, and manage books easily.</p>
      </div>

      <!-- Books -->
      <div>
        <h3 class="mb-3 footer-chapter">Books</h3>
        <ul class="space-y-1 footer-content">
          <li>Browse Books</li>
          <li>New Arrivals</li>
          <li>Popular Books</li>
          <li>Book Categories</li>
        </ul>
      </div>

      <!-- Library -->
      <div>
        <h3 class="mb-3 footer-chapter">Library</h3>
        <ul class="footer-content">
          <li>Search Books</li>
          <li>My Reading List</li>
          <li>Borrow History</li>
          <li>Library Locations</li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="mb-3 footer-chapter">Contact Us</h3>

        <ul class="footer-content space-y-2">
          <li class="flex items-center gap-2">
            <font-awesome-icon icon="location-dot" />
            <span>Can Tho, Vietnam</span>
          </li>

          <li class="flex items-center gap-2">
            <font-awesome-icon icon="phone" />
            <span>+84 123 456 789</span>
          </li>

          <li class="flex items-center gap-2">
            <font-awesome-icon icon="clock" />
            <span>08:00 AM - 08:00 PM</span>
          </li>

          <li class="flex items-center gap-2">
            <font-awesome-icon icon="envelope" />
            <span>bookverse.support@gmail.com</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Bottom footer -->
  <div class="flex flex-wrap justify-between items-center gap-4 footer-bottom">
    <p class="text-sm footer__bottom-content">© 2026 BookVerse. All rights reserved.</p>

    <div class="flex justify-around">
      <ul class="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 footer__bottom-content">
        <li>Browse Books</li>
        <li>Library</li>
        <li>Categories</li>
        <li>Privacy Policy</li>
        <li>Support</li>
      </ul>
    </div>

    <div class="footer-brand footer__bottom-content"></div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
@import "../assets/css/home.css";
</style>
