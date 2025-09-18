<template>
  <section class="popup">
    <div class="popup__container">
      
      <Tabs 
        :names="modalTabs"
        :selectedModalTab="selectedModalTab"
        @changeModalTab="changeModalTab"
      >
        <component :is="currentComponent" />
      </Tabs>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

import Tabs from "@/components/Tabs.vue";
import Feed from "./popup/Feed.vue";
import Statistics from "./popup/Statistics.vue";

const modalTabs = [
  {name: "/popup/feed", label: "Накормить"},
  {name: "/popup/statistics", label: "Статистика"},
];

const selectedModalTab = ref("/popup/feed");

const changeModalTab = (tabName: string) => {
  selectedModalTab.value = tabName;
}

const currentComponent = computed(() => {
  return selectedModalTab.value === "/popup/feed" ? Feed : Statistics;
});

</script>