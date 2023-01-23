<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useScroll } from '@vueuse/core'

import SiteData from './models/SiteData';
import Screen from './models/Screen'

import AppSiteMetadata from './components/AppSiteMetadata.vue';

const file = new URLSearchParams(window.location.search).get('file')
const fileUrl = ref(window.location.origin + '/example/example.json')

const screens = ref<Screen[]>([]);
const site = ref<SiteData | null>();
onMounted(async () => {
  if (file) {
    fileUrl.value = decodeURI(file)
    site.value = await fetch(fileUrl.value).then((res) => res.json()) as SiteData;
    screens.value = site.value.screens
  }
});

function getAnchor(screen: Screen) {
  return screen.name.toLowerCase().replace(/ /g, '-');
}

function getImageUrl(url: string) {
  if (url.startsWith('http')) {
    return url;
  }

  const pathArray = fileUrl.value.split('/');
  let folderUrl = pathArray.slice(0, -1).join('/');
  if (!url.startsWith('/')) {
    folderUrl += '/';
  }
  return folderUrl + url;
}

const page = ref<HTMLElement | null>(null);
const { y } = useScroll(page, { behavior: 'smooth' })
const showTopButton = computed(() => {
  return y.value > 100;
})

function openFile() {
  const encoded = encodeURI(fileUrl.value)
  window.location.href = `/?file=${encoded}`
}

</script>

<template>
  <div ref="page" class="page" v-if="site">
    <h1 id="top"> {{ site.name }} </h1>

    <AppSiteMetadata :site="site" />

    <h2>Overview</h2>
    <div class="overview">
      <fieldset class="mini" v-for="screen in screens" :key="screen.name">
        <legend> {{  screen.name }}</legend>
        <a :href="`#${getAnchor(screen)}`"><img :src="`${getImageUrl(screen.url)}`" /></a>
      </fieldset>
    </div>

    
    <h2>All screens</h2>
    <fieldset v-for="screen in screens" :key="screen.name" :id="getAnchor(screen)">
      <legend> {{  screen.name }}</legend>
      <img :src="`${getImageUrl(screen.url)}`" />
    </fieldset>

    <transition name="fade">
      <a href="#top"><div id="top-button" v-if="showTopButton">Top</div></a>
    </transition>
  </div>
  <div v-else>
    <h1>What's your file?</h1>
    <div class="url-input">
      <input type="text" v-model="fileUrl" />
      <button @click="openFile">GO!</button>
    </div>
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

.url-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}

input {
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding: 8px;
  border-radius: 4px;
  outline: none;
  border: 1px solid gray;
}

button {
  border-radius: 4px;
  outline: none;
  border: 1px solid gray;
  background-color: rgb(66, 151, 145);
  color: white;
  cursor: pointer;
  margin-left: 8px;
}

</style>
