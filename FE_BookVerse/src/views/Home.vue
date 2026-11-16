<template>
  <!-- HEADER -->
  <HeaderUser />
  <div class="headerUser">
    <!-- MAIN -->
    <main class="main">
      <!-- HERO -->
      <section class="hero">
        <div class="container hero__inner">
          <div class="hero__text">
            <span class="hero__badge">Thư viện số BookVerse</span>
            <h4 class="hero__eyebrow">Chúng tôi chuyên về tri thức</h4>
            <h1 class="hero__title">Chia sẻ sách <span>&amp; Truyền cảm hứng</span></h1>
            <p class="hero__desc">Khám phá, mượn và quản lý sách dễ dàng. Cuốn sách yêu thích tiếp theo của bạn đang chờ ở đây.</p>

            <div class="hero__actions">
              <button class="button" @click="$router.push('/book')">Bắt đầu ngay</button>
              <button class="button button--ghost" @click="$router.push('/borrow')">Mượn sách</button>
            </div>
          </div>

          <div class="hero__visual">
            <div class="hero__blob"></div>
            <img class="hero__img" src="../assets/image/hero-books.png" alt="BookVerse" />
          </div>
        </div>
      </section>

      <!-- SUCCESS -->
      <section class="success">
        <div class="container">
          <div class="success__tittle-box">
            <h2 class="tittle success__tittle">Nhà xuất bản nổi bật trong tháng</h2>
          </div>

          <div class="success-list">
            <div class="success__card" v-for="publisher in publishers" :key="publisher.name">
              <img :src="publisher.img" class="card-img" />

              <div class="card-content">
                <h5 class="card-name">{{ publisher.name }}</h5>
                <p class="card-sub">{{ publisher.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- REVEAL -->
      <section class="reveal_home">
        <div class="container">
          <div class="reveal__content">
            <h1 class="tittle">Chúng tôi yêu sách</h1>
            <p class="reveal__sub">Nơi dành cho mọi độc giả</p>
            <p class="reveal__desc">Cuốn sách yêu thích tiếp theo của bạn đang chờ bạn.</p>
            <button class="button reveal__button">Khám phá sách</button>
          </div>
        </div>
      </section>

      <!-- CAREPACK -->
      <section class="carepack">
        <div class="container">
          <div class="carepack__item" v-for="pack in packs" :key="pack.title">
            <div class="carepack__card">
              <div class="carepack__content">
                <h3 class="tittle carepack-tittle">{{ pack.title }}</h3>

                <ul class="carepack__list">
                  <li class="carepack__content-item" v-for="item in pack.items" :key="item">
                    {{ item }}
                  </li>
                </ul>

                <h3 class="carepack__cost">{{ pack.price }}</h3>
              </div>
            </div>

            <div class="carepack__circle">
              <div class="circle__avt">
                <img :src="pack.img" class="circle__img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq">
        <div class="container">
          <div class="faq__content">
            <h1 class="faq__tittle">Câu hỏi thường gặp</h1>

            <ul class="faq__list">
              <li class="faq__item" :class="{ open: faq.open }" v-for="(faq, index) in faqs" :key="faq.q">
                <p class="faqqus" @click="toggleFaq(index)">
                  {{ faq.q }}
                </p>

                <span class="faqans" v-show="faq.open">
                  {{ faq.a }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
  <FooterComp />
</template>

<script>
import HeaderUser from "@/components/HeaderUser.vue";
import FooterComp from "@/components/Footer.vue";

export default {
  name: "HomePage",

  components: {
    HeaderUser,
    FooterComp,
  },

  data() {
    return {
      search: "",

      publishers: [
        {
          name: "Haruki Murakami",
          img: new URL("../assets/image/Haruki Murakami.png", import.meta.url).href,
          desc: "Nhà văn Nhật Bản nổi tiếng toàn cầu với những tiểu thuyết mang màu sắc siêu thực.",
        },
        {
          name: "Stephen King",
          img: new URL("../assets/image/Stephen King.png", import.meta.url).href,
          desc: "Ông hoàng truyện kinh dị sở hữu hàng trăm tác phẩm bán chạy nhất thế giới.",
        },
        {
          name: "Agatha Christie",
          img: new URL("../assets/image/Agatha Christie.png", import.meta.url).href,
          desc: "Nữ hoàng trinh thám nổi tiếng với các tiểu thuyết tội phạm bán chạy mọi thời đại.",
        },
      ],

      packs: [
        {
          title: "The Tunnel to Summer, the Exit of Goodbyes",
          price: "Sách mới",
          img: new URL("../assets/image/tunnel.png", import.meta.url).href,
          items: ["Tác giả: Mei Hachimoku", "Thể loại: Science", "Đánh giá: 5 / 5", "Số trang: 320"],
        },
        {
          title: "The Mimosa Confessions",
          price: "Sách phổ biến",
          img: new URL("../assets/image/mimosa.png", import.meta.url).href,
          items: ["Tác giả: Mei Hachimoku", "Thể loại: Romance", "Đánh giá: 5 / 5", "Số trang: 335"],
        },
        {
          title: "Wait For Me Yesterday in Spring",
          price: "Đề xuất",
          img: new URL("../assets/image/spring.png", import.meta.url).href,
          items: ["Tác giả: Mei Hachimoku", "Thể loại: Tragedy", "Đánh giá: 4 / 5", "Số trang: 464"],
        },
      ],

      faqs: [
        {
          q: "Làm thế nào để mượn sách?",
          a: "Bạn có thể duyệt sách và gửi yêu cầu mượn.",
          open: false,
        },
        {
          q: "Tôi có thể giữ sách bao lâu?",
          a: "Thông thường là 2 tuần.",
          open: false,
        },
        {
          q: "Tôi có thể đặt trước sách không?",
          a: "Có, bạn sẽ được thông báo khi sách có sẵn.",
          open: false,
        },
        {
          q: "Nếu trả sách trễ thì sao?",
          a: "Có thể bị phạt một khoản phí nhỏ.",
          open: false,
        },
      ],
    };
  },

  methods: {
    handleSearch() {
      console.log("Search:", this.search);
    },

    toggleFaq(index) {
      this.faqs[index].open = !this.faqs[index].open;
    },
  },
};
</script>

<style>
@import "../assets/css/home.css";
</style>
