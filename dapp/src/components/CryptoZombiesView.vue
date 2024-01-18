<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Zombie, Web3Utils } from '../utils/web3utils.ts';

const props = defineProps<{ web3Interact: Web3Utils }>();

let zombies = ref<Zombie[]>([]);

onMounted(() => {
  props.web3Interact.getZombiesForAccount().then((value) => {
    zombies.value = value;
  }).catch((err) => {
    console.log(err)
  })
})
</script>

<template>
  <div class="zombieview">
    <h2>Account : {{ props.web3Interact.account }}</h2>
    <ul>
      <li v-for="item in zombies">
        🧟 {{ item.name }} {{ item.dna }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.zombieview {
  background-color: #616161;
}

.zombieview li {
  list-style-type: none;
}
</style>
