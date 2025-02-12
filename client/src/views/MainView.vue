<template>
  <div class="container mt-5">
    <!-- Header Card -->
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg text-center p-4">
          <div class="card-body">
            <h1 class="mb-4 text-5xl font-bold">
              Welcome to <span class="text-warning">Milky Way Casino!</span>
            </h1>
            <p class="lead">
              This casino is designed purely for entertainment. No real money is
              used—just play and have fun!
            </p>
            <p>
              The aim is to offer you the thrill of casino-style games without
              the worry of losing money. You can earn points, experience the joy
              of winning, and have a fantastic time!
            </p>
            <p>Contact: <span class="text-primary">0092-###-0000000</span></p>
            <!-- <p> Bank Account: <a class="text-accent" href="/">############</a></p> -->
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <!-- Card 1: Slots -->
        <div class="col-md-6 mb-6">
          <div class="card shadow-lg">
            <figure class="h-52 overflow-hidden">
              <img
                class="object-cover w-full h-full"
                src="/roulette.jpg"
                alt="Roller Dice"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">Roller Dice</h2>
              <p class="lead">Spin the slots and win!</p>
              <div class="card-actions d-flex justify-content-end">
                <button
                  class="btn btn-warning btn-lg"
                  v-on:click="rouletteRoute"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Poker -->
        <div class="col-md-6 mb-6">
          <div class="card shadow-lg">
            <figure class="h-52 overflow-hidden">
              <img
                class="object-cover w-full h-full"
                src="/slots.jpg"
                alt="Lucky Coin"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">Lucky Coin</h2>
              <p class="lead">Test your luck!</p>
              <div class="card-actions d-flex justify-content-end">
                <button class="btn btn-warning btn-lg" v-on:click="coinRoute">
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js" setup>
import { useRouter } from 'vue-router';
const router = useRouter()

const rouletteRoute =  () => {
  router.push('/roulette')
}
const coinRoute  =() => {
  router.push('/flip-coin')
}
</script>
