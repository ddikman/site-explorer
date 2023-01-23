<script setup lang="ts">

import { ref } from 'vue';
import SiteData from '../models/SiteData';

defineProps<{site: SiteData}>()

const formatDateTime = (date: string) => {
  return new Date(date).toString()
}

const currentUrl = ref(window.location.href)

</script>

<template>
    <div id="information">
        
      <div class="meta">
        <div class="row">
            <div class="meta-card">
                <span>Site URL</span>
                <span>{{ site.url }}</span>
            </div>
            <div class="meta-card">
                <span>Captured at</span>
                <span>{{ formatDateTime(site.captured) }}</span>
            </div>
        </div>
        
        <div class="row">
            <div class="meta-card">
                <span>Share</span>
                <span><a :href="currentUrl">{{ currentUrl }}</a></span>
            </div>
        </div>

        <div class="row" v-if="site.meta && site.meta.relatedUrls">
            <div class="meta-card">
                <span>Related URLs</span>
                <span v-for="url in site.meta.relatedUrls">
                    <a :href="url">{{ url }}</a>
                </span>
            </div>
        </div>
      </div>

      <p>
        <a href="/">Choose another file</a> | <a href="{{ currentUrl }}">Reload</a>
      </p>
    </div>
</template>

<style scoped>

#information {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.meta {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 0 5px #ccc;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.row .meta-card:not(:last-child) {
    border-right: 1px solid #ccc;
}

.row:not(:last-child) {
    border-bottom: 1px solid #ccc;
}

.meta-card {
    display: table-cell;
    padding: 10px;
    flex-grow: 1;
}

.meta-card span {
    display: block;
    text-align: left;
}

.meta-card span:first-child {
    font-size: 0.7em;
}


</style>