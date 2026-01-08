<template>
  <div class="upload-container">
    <h2>Image Upload</h2>

    <input type="file" accept="image/*" @change="onFileChange" />

    <button @click="uploadImage" :disabled="!selectedFile">
      Upload & Process
    </button>

    <div v-if="originalUrl" class="images">
      <h3>Original Image</h3>
      <img :src="originalUrl" alt="Original" />
    </div>

    <div v-if="processedUrl" class="images">
      <h3>Processed Image (Background Removed + Flipped)</h3>

      <div class="checkerboard">
        <img :src="processedUrl" alt="Processed" />
      </div>
      <button class="copy-btn" @click="copyShareUrl">
        Copy Share URL
      </button>

      <button
        v-if="originalUrl && processedUrl"
        @click="deleteImages"
        class="delete-btn"
      >
        Delete Images
      </button>


      <p v-if="copied" class="copied-text">✅ Link copied!</p>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "ImageUpload",

  setup() {
    const selectedFile = ref<File | null>(null);
    const originalUrl = ref<string | null>(null);
    const processedUrl = ref<string | null>(null);
    const shareUrl = ref<string | null>(null);
    const copied = ref(false);
    const errorMessage = ref<string | null>(null);

    const onFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0];
      }
    };

    const uploadImage = async () => {
      if (!selectedFile.value) return;

      const formData = new FormData();
      formData.append("image", selectedFile.value);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/image/process",
          formData
        );

        originalUrl.value = `http://localhost:5000${response.data.original}`;
        processedUrl.value = `http://localhost:5000${response.data.processed}`;
        shareUrl.value = processedUrl.value;

        copied.value = false;
        errorMessage.value = null;
      } catch (err: any) {
        console.error(err);
        errorMessage.value =
          err.response?.data?.error || "Image processing failed";
      }
    };

    const deleteImages = async () => {
        try {
          await axios.delete("http://localhost:5000/api/image/delete", {
            data: {
              original: originalUrl.value?.replace("http://localhost:5000", ""),
              processed: processedUrl.value?.replace("http://localhost:5000", ""),
            },
          });

          originalUrl.value = null;
          processedUrl.value = null;
          errorMessage.value = null;
        } catch (err) {
          console.error(err);
          errorMessage.value = "Failed to delete images";
        }
      };
      
    const copyShareUrl = async () => {
      if (!shareUrl.value) return;

      await navigator.clipboard.writeText(shareUrl.value);
      copied.value = true;

      setTimeout(() => {
        copied.value = false;
      }, 2000);
    };

    return {
      selectedFile,
      originalUrl,
      processedUrl,
      errorMessage,
      copied,
      onFileChange,
      uploadImage,
      copyShareUrl,
      deleteImages,
    };
  },
});
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.copy-btn {
  margin-top: 10px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.copied-text {
  color: green;
  margin-top: 5px;
}

.images {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.images img {
  max-width: 300px;
}

.checkerboard {
  width: 300px;
  height: 300px;
  background-color: #ccc;
  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%),
    linear-gradient(-45deg, #eee 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #eee 75%),
    linear-gradient(-45deg, transparent 75%, #eee 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.checkerboard img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.error {
  color: red;
}
</style>
