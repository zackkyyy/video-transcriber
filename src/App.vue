<template>
  <div class="header">
    <img
      class="logo"
      src="https://f.hubspotusercontent00.net/hubfs/541808/Logotype%202020/GetAccept-Logo.png"
    />
  </div>
  <VideoList
    :videos="videos"
    :transcription="transcription"
    :transcribting="transcribting"
    @transcribe="handleTranscribe"
    @closeModal="handleClickCloseModal"
  ></VideoList>
</template>
<script lang="ts">
import { ref, onMounted } from "vue";
import { Video } from "./types/video";
import VideoList from "./components/VideoList.vue";
import { Transcription } from "./types/transcription";

export default {
  components: {
    VideoList,
  },
  setup() {
    const videos = ref<Video[]>([]);
    const transcription = ref<Transcription>();
    const transcribting = ref<boolean>(false);

    onMounted(async () => {
      fetchVideos();
    });

    const fetchVideos = async () => {
      const response = await fetch("http://localhost:3000/videos");
      videos.value = await response.json();
    };

    const handleClickCloseModal = () => {
      transcribting.value = false;
    };

    const handleTranscribe = async (id: string) => {
      transcribting.value = true;
      transcription.value = undefined;
      const result = await fetch(`http://localhost:3000/transcriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: id,
        }),
      });

      const { id: transcriptionId }: Transcription = await result.json();

      await pollTranscription(transcriptionId);
    };

    const pollTranscription = async (
      id: string,
      retry: number = 0
    ): Promise<void> => {
      if (retry >= 5) {
        return Promise.reject("Max retries reached");
      }
      setTimeout(async () => {
        const result = await fetch(
          `http://localhost:3000/transcriptions/${id}`
        );
        const data: Transcription = await result.json();
        if (data.status !== "completed") {
          return pollTranscription(id, retry + 1);
        }

        transcription.value = data;
        transcribting.value = false;
      }, 1500);
    };

    return {
      videos,
      handleTranscribe,
      handleClickCloseModal,
      transcription,
      transcribting,
    };
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  height: 7%;
}
.logo {
  height: 40px;
  width: 200px;
  position: absolute;
  top: 9px;
  left: 20px;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.top-container {
  position: absolute;
  top: 100px;
  left: 20px;
}
.logo-container {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
