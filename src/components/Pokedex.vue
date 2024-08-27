<template>
  <div class="pokedex">
    <h1>Pokédex</h1>

    <div class="controls">
      <div class="sort-by-control">
        <label for="sort-by">Sort by:</label>
        <select v-model="sortBy" id="sort-by">
          <option value="name">Name</option>
          <option value="id">ID</option>
          <option value="type">Type</option>
        </select>
      </div>

      <input v-model="searchQuery" type="text" placeholder="Search by name or type" />
    </div>

    <div class="pokemon-grid">
      <router-link
        v-for="pokemon in filteredAndSortedPokemons"
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
    <div class="total-weight">Total Weight of Pokémon on this page: {{ totalWeight }}</div>
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
import { computed, onMounted, ref } from 'vue'
import { usePokemonStore } from '../stores/pokemonStore'

const store = usePokemonStore()

const { pokemons, totalPages, currentPage } = storeToRefs(store)

// Sorting and searching state
const sortBy = ref('id')
const searchQuery = ref('')

const totalWeight = computed(() => {
  return filteredAndSortedPokemons.value.reduce((total, pokemon) => total + pokemon.weight, 0)
})

const filteredAndSortedPokemons = computed(() => {
  let filteredPokemons = pokemons.value

  // Filter by search query (name or type)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredPokemons = filteredPokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.types.some((type) => type.toLowerCase().includes(query))
    )
  }

  // Sort by the selected criteria
  return [...filteredPokemons].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'id') {
      return a.id - b.id
    } else if (sortBy.value === 'type') {
      return [...a.types].sort()[0].localeCompare([...b.types].sort()[0])
    }
    return 0
  })
})

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

.total-weight {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  row-gap: 0.5rem;
}

.controls label {
  margin-right: 0.5rem;
}

.controls input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 200px;
}

.controls select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 150px;
}
.controls .sort-by-control {
  flex-wrap: nowrap;
}
</style>
