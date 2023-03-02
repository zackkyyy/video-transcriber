<template>
  <div>
    <div class="vidoe-modal">
      <button class="close-button" @click="handeCloseClick()">x</button>
      <video controls width="600" ref="myVideoPlayer" @play="onPlay">
        <source :src="transcription.videoUrl" />
      </video>
      <div>
        <span class="subtitle" v-for="(word, index) in words" :key="index">
          {{ word }}
        </span>
      </div>
      <div class="transcription">
        <p>{{ transcription.text }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Transcription } from "../types/transcription";
import { DateTime } from "luxon";

export default defineComponent({
  props: {
    videoUrl: {
      type: String,
    },
    transcription: {
      type: Object as () => Transcription,
      default: () => ({}),
    },
  },

  setup(props, { emit }) {
    const time = ref(0);
    const words = ref<string[]>([]);
    const maxTime: number = Math.max(
      ...props.transcription?.words?.map((word) => +word.end)
    );

    const timer = () => {
      setTimeout(() => {
        const frame = DateTime.now().toMillis() - time.value;
        const word = props.transcription.words.find(
          (word) => word.start < frame && word.end > frame
        );
        if (word) {
          if (!words.value.includes(word.text)) {
            words.value.push(word.text);
          }
          if (words.value.length >= 4) {
            words.value.splice(0);
          }
          console.log(words.value);
        }
        if (frame > maxTime) {
          return;
        }
        timer();
      }, 100);
    };
    const onPlay = () => {
      time.value = DateTime.now().toMillis();
      timer();
    };
    const handeCloseClick = () => {
      emit("closeModal");
    };

    console.log(words.value);
    return {
      handeCloseClick,
      words,
      onPlay,
    };
  },
});
</script>

<style>
.transcription {
  margin-top: 100px;
  font-size: 16px;
}

.vidoe-modal {
  background-color: white;
  width: 500px;
  height: 500px;
}

.vidoe-modal {
  width: 100%;
  min-width: 800px;
  overflow: hidden;
  position: relative;
}

.vidoe-modal video {
  position: relative;
  max-width: 50%;
  height: auto;
  top: 40%;
  left: 20%;
  transform: translate(-50%, -50%);
}

.close-button {
  background-color: #e0a12d;
  top: 0;
  right: 0;
  position: absolute;
  width: 20px;
  height: 20px;
  color: black;
}

.subtitle {
  background-color: #444;
  color: #fff;
  margin-left: 10px;
  font-size: 18px;
  position: sticky;
}
</style>
