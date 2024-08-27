<template>
  <div class="pokedex">
    <h1>Pokédex</h1>
    <div class="pokemon-grid">
      <router-link
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        :to="{ name: 'PokemonDetails', params: { id: pokemon.id } }"
        class="pokemon-card"
      >
        <Card>
          <div class="pokemon-info">
            <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
            <div class="pokemon-details">
              <h3 class="pokemon-name bold-text">{{ pokemon.name }}</h3>
              <p><span class="bold-text">Types:</span> {{ pokemon.types.join(', ') }}</p>
            </div>
            <div class="pokemon-id">
              <p><strong>ID:</strong> {{ pokemon.id }}</p>
            </div>
          </div>
        </Card>
      </router-link>
    </div>

    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="store.changePage(page)"
        :class="['pagination-button', { active: page === currentPage }]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { usePokemonStore } from '../stores/pokemonStore'

const store = usePokemonStore()

const { pokemons, totalPages, currentPage } = storeToRefs(store)

onMounted(() => {
  store.fetchPokemons()
})
</script>

<style scoped>
.pokedex {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 400px));
  gap: 1.5rem;
  justify-content: center;
}

.pokemon-card {
  width: 100%;
  background-color: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.pokemon-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.pokemon-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pokemon-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0;
}

.pokemon-name {
  text-transform: capitalize;
}

.pokemon-details {
  flex-grow: 1;
  text-align: center;
  padding: 0 1rem;
}

.pokemon-id {
  flex-shrink: 0;
  text-align: right;
  font-weight: bold;
  font-size: 0.9rem;
  color: #6c757d;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination-button {
  background-color: #f8f9fa;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  min-width: 48px;
}

.pagination-button:hover {
  background-color: #007bff;
  color: white;
}

.pagination-button.active {
  background-color: #007bff;
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #333;
}

.bold-text {
  font-weight: bold;
}
</style>
