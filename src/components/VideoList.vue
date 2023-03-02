<template>
  <div>
    <h2 class="description">Select a video to transcribe</h2>
    <div v-if="videos.length == 0">Loading your videos...</div>
    <div v-else class="video-container">
      <div class="videos">
        <div v-for="video in videos" :key="video.id" class="video card">
          <img :src="video.thumbUrl" alt="Video thumbnail" />
          <h5>{{ video.videoTitle }}</h5>
          <p>{{ "created at :  " + formattedDate(video.createdAt) }}</p>
          <button
            @click="handleClick(video)"
            :disabled="transcribting"
            class="trnscribe-button"
          >
            transcribe
          </button>
        </div>
      </div>
    </div>
    <VideoModal
      v-if="showModal"
      :video-url="selectedVideoUrl"
      :transcription="transcription"
      @closeModal="handleClickCloseModal"
    >
    </VideoModal>
    <div v-if="transcribting" class="loading-circle-container vidoe-modal">
      <div class="loading-circle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { Transcription } from "../types/transcription";
import { Video } from "../types/video";
import VideoModal from "./VideoModal.vue";

export default defineComponent({
  name: "VideoList",
  props: {
    videos: {
      type: Array as () => Video[],
      required: true,
    },
    transcribting: {
      type: Boolean,
      required: true,
    },
    transcription: {
      type: Object as () => Transcription,
      default: undefined,
    },
  },
  components: { VideoModal },
  setup(props, { emit }) {
    const selectedVideoUrl = ref<string>();
    const showModal = ref<boolean>(false);

    const handleClick = (video: Video) => {
      selectedVideoUrl.value = video.videoUrl;
      emit("transcribe", video.id);
    };

    watch(
      () => props.transcription,
      (transcription) => {
        console.log("here");

        if (transcription) {
          showModal.value = true;
        }
      }
    );
    const formattedDate = (date: string) => {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString();
    };

    const handleClickCloseModal = () => {
      showModal.value = false;
      selectedVideoUrl.value = undefined;
      emit("closeModal");
    };
    return {
      handleClick,
      formattedDate,
      selectedVideoUrl,
      showModal,
      handleClickCloseModal,
    };
  },
});
</script>

<style scoped>
img {
  max-width: 200px;
}

.card {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
}

.video-container {
  position: fixed;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  top: 100px;
  left: 20px;
}

.videos {
  display: flex;
  flex-wrap: nowrap; /* Make the flex container not wrap the items */
}

.video {
  flex: 0 0 auto; /* Prevent the item from growing or shrinking */
  margin-right: 10px; /* Add margin between the items */
}
.trnscribe-button {
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-block-end: 0;
  border-radius: 8px;
  font-weight: 600;
  min-height: 2.5rem;
  min-width: 5.5rem;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  background-color: #2c3b4e;
  color: #ffffff;
}

.description {
  position: fixed;
  top: 50px;
  left: 40%;
}

.loading-circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-circle {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #e0a12d;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
