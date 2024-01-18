<script setup lang="ts">
import CryptoZombiesView from './components/CryptoZombiesView.vue'
import FundMeView from './components/FundMeView.vue'
import { MetaMaskInpageProvider } from "@metamask/providers";
import { onBeforeMount, ref } from 'vue'
import { Web3Utils } from './utils/web3utils.ts';

// Metamask injected
declare global {
  var ethereum: MetaMaskInpageProvider;
}


const web3Interact: any = ref<Web3Utils>(new Web3Utils(window.ethereum));


onBeforeMount((): void => {
  initializeApp();
});

function initializeApp(): void {
  web3Interact.value.initialize();
}

window.ethereum.on('accountsChanged', (): void => initializeApp());
window.ethereum.on('chainChanged', (): void => initializeApp());
</script>

<template>
  <h1>
    Test DAPP
  </h1>
  <div class="tech">
    <ul>
      <li>NetworkId : {{ web3Interact.networkId }}</li>
      <li>Account : {{ web3Interact.account }}</li>
      <li v-if="web3Interact.cryptoZombiesContract !== undefined">CryptoZombies contract : {{
        web3Interact.cryptoZombiesContract.options.address }}</li>
      <li v-if="web3Interact.fundmeContract !== undefined">FundMe contract : {{
        web3Interact.fundmeContract.options.address }}</li>
    </ul>
  </div>
  <h2>CryptoZombies</h2>
  <button v-on:click="web3Interact.createRandomZombie('test')">Create a Random Zombie</button>
  <CryptoZombiesView v-if="web3Interact.cryptoZombiesContract !== undefined" :web3Interact="web3Interact" />
  <h2>FundMe</h2>
  <button v-on:click="web3Interact.fund(100)">Fund 100</button>
  <button v-on:click="web3Interact.withdraw()">withdraw</button>
  <FundMeView v-if="web3Interact.fundmeContract !== undefined" :web3Interact="web3Interact" />
</template>

<style scoped>
.tech {
  background-color: #616161;
  font-family: 'Courier New', Courier, monospace;
  text-align: left;
}

.tech ul {
  list-style-type: none;
}

.logo {
  height: 4em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
