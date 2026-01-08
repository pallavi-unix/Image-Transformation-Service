<template>
  <div id="app">
    <h1>Image Transformation Service</h1>
    <ImageUpload />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImageUpload from "./components/ImageUpload.vue";

export default defineComponent({
  name: "App",
  components: { ImageUpload },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 2rem;
}
</style>
