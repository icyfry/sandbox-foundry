<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Web3Utils } from '../utils/web3utils.ts';

const props = defineProps<{ web3Interact: Web3Utils }>();

let balance = ref<string>('');

onMounted(() => {
  props.web3Interact.getBalance().then((value) => {
    balance.value = value;
  }).catch((err) => {
    console.log(err)
  })
})
</script>

<template>
  <div class="fmview">
    Balance : {{ balance }}
  </div>

</template>

<style scoped>
.fmview {
  background-color: #616161;
}

.fmview li {
  list-style-type: none;
}
</style>
