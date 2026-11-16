<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRoute, useRouter } from "vue-router";
import PublisherService from "../services/publisher.service";
import categoryService from "../services/category.service";
import BookService from "../services/book.service";

export default {
  components: { Form, Field, ErrorMessage },

  data() {
    const bookFormSchema = yup.object().shape({
      TenSach: yup.string().required("Tên sách là bắt buộc").min(2).max(100),
      TacGia: yup.string().required("Tác giả là bắt buộc").min(3).max(50),
      MaNXB: yup.string().required("Nhà xuất bản là bắt buộc"),
      NamXuatBan: yup.number().typeError("Năm phải là số").required("Năm xuất bản là bắt buộc").max(new Date().getFullYear()),
      SoQuyen: yup.number().typeError("Số lượng phải là số").required("Số lượng là bắt buộc").integer().min(0),
      rate: yup.number().required(),
      MoTa: yup.string().max(1000),
    });

    return {
      bookFormSchema,
      publishers: [],
      categoryList: [],
      route: useRoute(),
      router: useRouter(),

      initialBook: {
        _id: "",
        TenSach: "",
        TacGia: "",
        MaNXB: "",
        NamXuatBan: "",
        SoQuyen: 0,
        image: "",
        rate: 0,
        MaTheLoai: [],
        MoTa: "",
      },
    };
  },

  async mounted() {
    await this.getAllPublishers();
    await this.getAllCategory();
    await this.getBook();
  },

  methods: {
    async getBook() {
      try {
        const data = await BookService.get(this.route.params.id);

        this.initialBook = {
          ...data,
          MaNXB: data.MaNXB?._id || data.MaNXB,
          MaTheLoai: data.MaTheLoai || [],
        };
        console.log("DATA BACKEND:", data);
      } catch (err) {
        console.error(err);
        alert("Lỗi tải sách");
      }
    },

    async getAllPublishers() {
      this.publishers = await PublisherService.getAll();
    },

    async getAllCategory() {
      this.categoryList = await categoryService.getAll();
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/book/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          this.initialBook.image = data.filename;
        }
      } catch {
        alert("Upload lỗi");
      }
    },

    cancel() {
      this.router.push("/staff/book");
    },

    async submitBook(values) {
      try {
        const book = {
          ...this.initialBook,
          ...values,
        };

        await BookService.update(this.initialBook._id, book);

        this.router.push("/staff/book");
      } catch (error) {
        console.error("Update lỗi:", error.response?.data || error);
      }
    },
    getCategoryName(id) {
      const found = this.categoryList.find((c) => c._id === id);
      return found ? found.TenTheLoai : "";
    },

    removeCategory(id) {
      this.initialBook.MaTheLoai = this.initialBook.MaTheLoai.filter((i) => i !== id);
    },

    addCategory(event) {
      const id = event.target.value;
      if (!id) return;

      if (!this.initialBook.MaTheLoai.includes(id)) {
        this.initialBook.MaTheLoai.push(id);
      }

      event.target.value = "";
    },
  },
};
</script>

<template>
  <div class="page-wrapper">
    <Form :key="initialBook._id" class="product-form" :validation-schema="bookFormSchema" :initial-values="initialBook" @submit="submitBook">
      <!-- SIDEBAR -->
      <aside class="form-sidebar">
        <div class="card">
          <h3 class="card-title">Hình ảnh sách</h3>

          <div class="image-preview-box">
            <img v-if="initialBook.image" :src="`/api/upload/${initialBook.image}`" />
            <div v-else class="placeholder">Chưa có ảnh</div>
          </div>

          <input ref="fileInput" type="file" accept="image/*" hidden @change="uploadImage" />

          <button type="button" class="btn-add-more" @click="triggerFileInput">Thay ảnh</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="form-main">
        <div class="card">
          <h3 class="card-title">Chỉnh sửa sách</h3>

          <div class="form-group">
            <label>Tên sách</label>
            <Field name="TenSach" />
            <ErrorMessage name="TenSach" class="error" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tác giả</label>
              <Field name="TacGia" />
            </div>

            <div class="form-group">
              <label>Nhà xuất bản</label>
              <Field name="MaNXB" as="select">
                <option value="">-- Chọn --</option>
                <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                  {{ pub.TenNXB }}
                </option>
              </Field>
            </div>
          </div>

          <div class="form-group">
            <label>Thể loại</label>

            <select @change="addCategory($event)">
              <option value="">-- Chọn thể loại --</option>
              <option v-for="tl in categoryList" :key="tl._id" :value="tl._id">
                {{ tl.TenTheLoai }}
              </option>
            </select>

            <div class="selected-categories">
              <span v-for="id in initialBook.MaTheLoai" :key="id" class="category-tag">
                {{ getCategoryName(id) }}
                <button type="button" @click="removeCategory(id)">x</button>
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả</label>
            <Field name="MoTa" as="textarea" />
          </div>

          <div class="form-row three-cols">
            <div class="form-group">
              <label>Số lượng</label>
              <Field name="SoQuyen" type="number" />
            </div>

            <div class="form-group">
              <label>Năm xuất bản</label>
              <Field name="NamXuatBan" type="number" />
            </div>

            <div class="form-group">
              <label>Đánh giá</label>
              <Field name="rate" type="number" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn" @click="cancel">Hủy</button>
            <button type="submit" class="btn">Cập nhật</button>
          </div>
        </div>
      </main>
    </Form>
  </div>
</template>

<style>
@import "../assets/css/book.css";
</style>
