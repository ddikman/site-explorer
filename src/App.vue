<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useScroll } from '@vueuse/core'

interface SiteData {
  name: string;
  url: string;
  captured: string;
  screens: Screen[];
}

interface Screen {
  name: string;
  img: string;
}

const fileUrl = ref('/example/example.json')

const screens = ref<Screen[]>([]);
const site = ref<SiteData | null>();
onMounted(async () => {
  site.value = await fetch(fileUrl.value).then((res) => res.json()) as SiteData;
  screens.value = site.value.screens
});

function getAnchor(screen: Screen) {
  return screen.name.toLowerCase().replace(/ /g, '-');
}


const page = ref<HTMLElement | null>(null);
const { y } = useScroll(page, { behavior: 'smooth' })
const showTopButton = computed(() => {
  return y.value > 100;
})

const formatDateTime = (date: string) => {
  return new Date(date).toString()
}

</script>

<template>
  <div ref="page" class="page" v-if="site">
    <h1 id="top"> {{ site.name }} </h1>

    <div id="information">
      <dl>
        <dt>Site URL</dt>
        <dd>{{ site.url }}</dd>
        <dt>Captured at</dt>
        <dd>{{ formatDateTime(site.captured) }}</dd>
        <dt>Share</dt>
        <dd><a href="">http://localhost:5077/?file=xxx</a></dd>
      </dl>
    </div>

    <h2>Overview</h2>
    <div class="overview">
      <fieldset class="mini" v-for="screen in screens" :key="screen.name">
        <legend> {{  screen.name }}</legend>
        <a :href="`#${getAnchor(screen)}`"><img :src="`${screen.img}`" /></a>
      </fieldset>
    </div>

    
    <h2>All screens</h2>
    <fieldset v-for="screen in screens" :key="screen.name" :id="getAnchor(screen)">
      <legend> {{  screen.name }}</legend>
      <img :src="`${screen.img}`" />
    </fieldset>

    <transition name="fade">
      <a href="#top"><div id="top-button" v-if="showTopButton">Top</div></a>
    </transition>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  border-radius: 4px;
}

h2 {
  margin-top: 3rem;
}

fieldset:not(:first-child) {
  margin-top: 3rem;
}

.page {
  padding: 2em;
  height: 100vh;
  overflow-y: scroll;
}

.mini {
  display: inline-block;
  width: 200px;
  max-height: 200px;
  overflow-y: hidden;
  margin: 0 1rem 1rem 0;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 5px #ccc;
}


.overview {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.overview fieldset {
  margin: 0;
}

#top-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  color: white;
  background: rgb(66, 151, 145);
  border-radius: 4px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overview fieldset:hover {
  border: 1px solid rgb(191, 3, 195);
  background-color: rgb(187, 117, 188);
}
.overview fieldset:hover legend {
  background-color:  rgb(191, 3, 195);;
  font-weight: bold;
  color: white;
}

</style>
