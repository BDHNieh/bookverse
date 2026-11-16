<template>
  <div class="page-wrapper">
    <Form :key="initialBook._id" class="product-form" :validation-schema="bookFormSchema" :initial-values="initialBook" @submit="submitBook">
      <aside class="form-sidebar">
        <div class="card">
          <h3 class="card-title">Book Images</h3>

          <div class="image-display">
            <div class="image-preview-box">
              <img v-if="initialBook.image" :src="`/api/upload/${initialBook.image}`" />
              <div v-else class="placeholder">No Image</div>
            </div>
          </div>

          <!-- Input ẩn để chọn file -->
          <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="uploadImage" />

          <!-- Nút thêm ảnh mới -->
          <button type="button" class="btn-add-more" @click="triggerFileInput">Add Another Image</button>
        </div>
      </aside>

      <main class="form-main">
        <div class="card">
          <h3 class="card-title">Thông tin</h3>

          <div class="form-group">
            <label>Tên Sách</label>
            <Field name="TenSach" type="text" placeholder="Enter book name" />
            <ErrorMessage name="TenSach" class="error" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tác Giả</label>
              <Field name="TacGia" type="text" />
            </div>
            <div class="form-group">
              <label>Nhà xuất bản</label>
              <Field name="MaNXB" as="select">
                <option value="" disabled>-- Chọn NXB --</option>
                <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                  {{ pub.TenNXB }}
                </option>
              </Field>
            </div>
          </div>

          <div class="form-group">
            <label>Thể loại</label>

            <div class="category-box">
              <!-- SELECT -->
              <select @change="addCategory($event)" class="category-select">
                <option value="">-- Chọn thể loại --</option>
                <option v-for="tl in categoryList" :key="tl._id" :value="tl._id">
                  {{ tl.TenTheLoai }}
                </option>
              </select>

              <!-- TAG ĐÃ CHỌN -->
              <div class="selected-categories">
                <span v-for="id in initialBook.MaTheLoai" :key="id" class="category-tag">
                  {{ getCategoryName(id) }}
                  <button type="button" @click="removeCategory(id)"><font-awesome-icon icon="xmark" /></button>
                </span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả</label>
            <Field name="MoTa" as="textarea" placeholder="Nhập mô tả sách..." />
            <ErrorMessage name="MoTa" class="error" />
          </div>

          <div class="form-row three-cols">
            <div class="form-group">
              <label>Số lượng</label>
              <Field name="SoQuyen" type="number" />
            </div>
            <div class="form-group">
              <label>Năm Phát Hành</label>
              <Field name="NamXuatBan" type="number" />
            </div>
            <div class="form-group">
              <label>Đánh giá</label>
              <Field name="rate" type="number" step="1" :max="5" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn" @click="cancel">Cancel</button>
            <button type="submit" class="btn">Add Book</button>
          </div>
        </div>
      </main>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import PublisherService from "../services/publisher.service";
import categoryService from "../services/category.service";
import BookService from "../services/book.service";

export default {
  components: { Form, Field, ErrorMessage },

  data() {
    const bookFormSchema = yup.object().shape({
      TenSach: yup.string().required("Book name is required").min(2, "Book name must be at least 2 characters").max(100, "Book name must be at most 100 characters"),

      TacGia: yup.string().required("Author is required").min(3, "Author name must be at least 3 characters").max(50, "Author name must be at most 50 characters"),

      MaNXB: yup.string().required("Publisher is required"),

      NamXuatBan: yup.number().typeError("Year must be a number").required("Year is required").max(new Date().getFullYear(), "Year cannot be in the future"),

      SoQuyen: yup.number().typeError("Quantity must be a number").required("Quantity is required").integer("Quantity must be an integer").min(0, "Quantity cannot be negative"),

      rate: yup
        .number()
        .transform((val) => (isNaN(val) ? undefined : val))
        .required(),

      MoTa: yup.string().max(1000, "Mô tả tối đa 1000 ký tự"),
    });

    return {
      bookFormSchema,
      publishers: [],
      categoryList: [],

      initialBook: {
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

  mounted() {
    this.getAllPublishers();
    this.getAllCategory();
  },

  methods: {
    async getAllPublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log("get error NXB:", error);
      }
    },

    async getAllCategory() {
      try {
        this.categoryList = await categoryService.getAll();
      } catch (error) {
        console.log("get error Category:", error);
      }
    },

    // Mở dialog chọn file
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // Upload file lên server
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
        } else {
          alert(data.message || "Upload image successfully");
        }
      } catch (err) {
        alert("Upload error");
      }
    },

    cancel() {
      this.$router.push("/staff/book");
    },

    // Submit form sách
    async submitBook(values) {
      try {
        const book = {
          ...values,
          image: this.initialBook.image,
          MaTheLoai: this.initialBook.MaTheLoai,
        };

        console.log("BOOK gửi đi:", book);

        await BookService.create(book);
        alert("Thêm sách thành công");
        this.$router.push("/staff/book");
      } catch (error) {
        console.log("Lỗi thêm sách:", error);
      }
    },

    getCategoryName(id) {
      const found = this.categoryList.find((c) => c._id === id);
      return found ? found.TenTheLoai : "";
    },

    removeCategory(id) {
      this.initialBook.MaTheLoai = this.initialBook.MaTheLoai.filter((item) => item !== id);
    },

    addCategory(event) {
      const id = event.target.value;
      if (!id) return;

      if (!this.initialBook.MaTheLoai.includes(id)) {
        this.initialBook.MaTheLoai = [...this.initialBook.MaTheLoai, id];
      }

      event.target.value = "";
    },

    removeCategory(id) {
      this.initialBook.MaTheLoai = this.initialBook.MaTheLoai.filter((i) => i !== id);
    },
  },
};
</script>

<style>
@import "../assets/css/book.css";
</style>
