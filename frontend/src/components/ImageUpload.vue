<template>
  <div class="upload-container">
    <h2>🌿 Image Playground</h2>

    <!-- Drop Zone -->
    <div class="drop-zone" @click="openFileDialog">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />

      <p v-if="!selectedFile">
        Drag & drop an image here or <span>browse</span>
      </p>
      <p v-else>
        Selected: <strong>{{ selectedFile.name }}</strong>
      </p>
    </div>

    <!-- Upload Button -->
    <button
      class="primary-btn"
      @click="uploadImage"
      :disabled="!selectedFile || isLoading"
    >
      {{ isLoading ? "Processing... ✨" : "Upload & Transform 🚀" }}
    </button>

    <!-- Images Grid -->
    <div v-if="originalUrl && processedUrl" class="image-grid" ref="imagesContainer">
      <div class="image-card original">
        <h3>Original 📷</h3>
        <img :src="originalUrl" alt="Original" />
      </div>

      <div class="image-card processed">
        <h3>Processed 🪄</h3>
        <div class="checkerboard">
          <img :src="processedUrl" alt="Processed" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="originalUrl && processedUrl" class="actions">
      <button class="secondary-btn" @click="copyShareUrl">
        Copy Share URL ✂️
      </button>

      <button class="delete-btn" @click="deleteImages">
        Delete 🗑️
      </button>
    </div>

    <!-- Copied Text -->
    <p v-if="copied" class="copied-text">✅ Link copied!</p>

    <!-- Error Message -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import axios from "axios";
import confetti from "canvas-confetti";

export default defineComponent({
  name: "ImageUpload",

  setup() {
    const fileInput = ref<HTMLInputElement | null>(null);
    const imagesContainer = ref<HTMLDivElement | null>(null);
    const selectedFile = ref<File | null>(null);
    const originalUrl = ref<string | null>(null);
    const processedUrl = ref<string | null>(null);
    const shareUrl = ref<string | null>(null);
    const copied = ref(false);
    const errorMessage = ref<string | null>(null);
    const isLoading = ref(false);

    // File selection handler
    const onFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0];
      } else {
        selectedFile.value = null;
      }
    };

    // Open file dialog
    const openFileDialog = () => {
      fileInput.value?.click();
    };

    // Launch confetti animation
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    };

    // Upload and process image
    const uploadImage = async () => {
      if (!selectedFile.value) {
        errorMessage.value = "Please select an image first";
        return;
      }

      isLoading.value = true;
      errorMessage.value = null;

      const formData = new FormData();
      formData.append("image", selectedFile.value);

      try {
        const response = await axios.post(
          "https://image-transformation-service-backend.onrender.com/api/image/process",
          formData
        );

        const BACKEND_URL =
          "https://image-transformation-service-backend.onrender.com";

        originalUrl.value = `${BACKEND_URL}${response.data.original}`;
        processedUrl.value = `${BACKEND_URL}${response.data.processed}`;
        shareUrl.value = processedUrl.value;

        copied.value = false;

        // 🎉 Confetti animation
        launchConfetti();

        // ⬇ Scroll to images section after DOM updates
        await nextTick();
        if (imagesContainer.value) {
          imagesContainer.value.scrollIntoView({ behavior: "smooth", block: "start" });
        }

      } catch (err: any) {
        console.error(err);
        errorMessage.value =
          err.response?.data?.error || "Image processing failed";
      } finally {
        isLoading.value = false;
      }
    };

    // Delete images
    const deleteImages = async () => {
      try {
        const BACKEND_URL =
          "https://image-transformation-service-backend.onrender.com";
        await axios.delete(`${BACKEND_URL}/api/image/delete`, {
          data: {
            original: originalUrl.value?.replace(BACKEND_URL, ""),
            processed: processedUrl.value?.replace(BACKEND_URL, ""),
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

    // Copy share URL
    const copyShareUrl = async () => {
      if (!shareUrl.value) return;

      await navigator.clipboard.writeText(shareUrl.value);
      copied.value = true;

      setTimeout(() => {
        copied.value = false;
      }, 2000);
    };

    return {
      fileInput,
      imagesContainer,
      selectedFile,
      originalUrl,
      processedUrl,
      errorMessage,
      copied,
      isLoading,
      onFileChange,
      openFileDialog,
      uploadImage,
      copyShareUrl,
      deleteImages,
    };
  },
});
</script>

<style scoped>
/* Container */
.upload-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #e6f4ea; /* pastel green */
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
}

h2 {
  margin-bottom: 1rem;
  color: #276749; /* darker green */
  font-weight: 700;
  text-align: center;
}

/* Drop Zone */
.drop-zone {
  width: 100%;
  padding: 2rem;
  border: 2px dashed #a0d9a5;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f0fff4;
}

.drop-zone:hover {
  border-color: #38a169;
  background: #e6f9eb;
}

.drop-zone span {
  color: #38a169;
  font-weight: 600;
  font-style: italic;
}

/* Buttons */
button {
  padding: 0.6rem 1.2rem;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.primary-btn {
  background: #b2f5ea; /* pastel mint */
  color: #1c4532;
  margin-top: 1rem;
}

.primary-btn:hover {
  background: #81e6d9;
}

.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.secondary-btn {
  background: #c6f6d5; /* pastel green */
  color: #276749;
}

.secondary-btn:hover {
  background: #9ae6b4;
}

.delete-btn {
  background-color: #fed7d7; /* pastel red */
  color: #9b2c2c;
}

.delete-btn:hover {
  background-color: #feb2b2;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* Copied Text */
.copied-text {
  color: #2f855a;
  margin-top: 5px;
  font-weight: 600;
}

/* Error Message */
.error {
  color: #e53e3e;
  margin-top: 0.5rem;
  font-weight: 600;
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
}

.image-card {
  text-align: center;
  background: #f0fff4; /* pastel cream-green */
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.image-card:hover {
  transform: translateY(-5px);
}

.image-card h3 {
  margin-bottom: 0.5rem;
}

/* Image styling */
.image-card img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  margin-top: 0.5rem;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.image-card img:hover {
  transform: scale(1.05) rotate(-1deg);
}

/* Checkerboard Background */
.checkerboard {
  width: 100%;
  height: 300px;
  background-color: #d8f8e4; /* pastel green */
  background-image: 
    linear-gradient(45deg, #f0fff4 25%, transparent 25%), 
    linear-gradient(-45deg, #f0fff4 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #f0fff4 75%), 
    linear-gradient(-45deg, transparent 75%, #f0fff4 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
</style>
