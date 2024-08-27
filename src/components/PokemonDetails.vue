<template>
  <div class="details-page">
    <div class="details-card">
      <template v-if="pokemon">
        <div class="pokemon-info-container">
          <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />

          <div class="pokemon-info">
            <div class="pokemon-main-info">
              <h1>{{ pokemon.name }}</h1>
              <h2>ID: {{ pokemon.id }}</h2>
            </div>
            <p class="pokemon-types">{{ pokemon.types.join(', ') }}</p>
            <p class="pokemon-physical-info">
              <span class="bold-text">Height:</span> {{ pokemon.height }}<br />
              <span class="bold-text">Weight:</span> {{ pokemon.weight }}
            </p>
            <div class="pokemon-abilities">
              <div v-for="(ability, index) in pokemon.abilities" :key="index" class="ability-box">
                {{ ability }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <p>No pokémon for this id for now !</p>
      </template>

      <button class="return-button" @click="goBack">Return to Pokédex</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemonStore'
import { type Pokemon } from '@/types/pokemon'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = usePokemonStore()
const pokemon = ref<Pokemon>()

const pokemonId = Number(route.params.id)

const goBack = () => {
  router.push({ name: 'Pokedex' }) // Navigate back to the main list of Pokémon
}

onMounted(() => {
  const cachedPokemon = store.pokemonsCache.get(Math.ceil(pokemonId / store.pokemonsPerPage))

  if (cachedPokemon) {
    pokemon.value = cachedPokemon.find((p) => p.id === pokemonId)
  }
})
</script>

<style scoped>
.details-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
.details-card {
  background-color: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  flex-grow: 1;
}

.pokemon-info-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.pokemon-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-right: 2rem;
}

.pokemon-info {
  flex-grow: 1;
}

.pokemon-main-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pokemon-main-info h1 {
  font-size: 2rem;
  color: #333;
  text-transform: capitalize;
}

.pokemon-main-info h2 {
  font-size: 1.2rem;
  color: #6c757d;
}

.pokemon-types {
  margin-bottom: 1rem;
}

.pokemon-physical-info {
  margin-bottom: 1rem;
}

.bold-text {
  font-weight: bold;
  color: #333;
}

.pokemon-abilities {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.ability-box {
  text-transform: capitalize;
  background-color: #e0e0e0;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
}

.return-button {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.return-button:hover {
  background-color: #0056b3;
}
</style>
