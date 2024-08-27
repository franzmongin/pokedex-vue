import type { Pokemon } from '@/types/pokemon'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonsCache = ref<Map<number, Pokemon[]>>(new Map())
  const pokemons = ref<Pokemon[]>([])
  const totalPokemons = ref<number>(151)
  const pokemonsPerPage = ref<number>(10)
  const currentPage = ref<number>(1)
  const totalPages = computed(() => Math.ceil(totalPokemons.value / pokemonsPerPage.value))

  const fetchPokemons = async (): Promise<void> => {
    const page = currentPage.value

    if (pokemonsCache.value.has(page)) {
      pokemons.value = pokemonsCache.value.get(page)!
      return
    }

    const offset = (page - 1) * pokemonsPerPage.value

    // Fetch the Pokémon data for this page
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${Math.min(
        pokemonsPerPage.value,
        totalPokemons.value - offset
      )}&offset=${offset}`
    )
    const data = await response.json()
    const { results } = data

    const detailedPokemons: Pokemon[] = []

    // Fetch details for each Pokémon
    for (const result of results) {
      const pokemonResponse = await fetch(result.url)
      const pokemonData = await pokemonResponse.json()

      const pokemon: Pokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map((type: any) => type.type.name),
        height: pokemonData.height,
        weight: pokemonData.weight,
        abilities: pokemonData.abilities.map((ability: any) => ability.ability.name),
        image: pokemonData.sprites.other['official-artwork'].front_default
      }

      detailedPokemons.push(pokemon)
    }

    // Cache the Pokémon data for this page
    pokemonsCache.value.set(page, detailedPokemons)

    pokemons.value = detailedPokemons
  }

  // Change page and fetch data
  const changePage = async (page: number) => {
    currentPage.value = page
    await fetchPokemons()
  }

  return {
    pokemons,
    totalPokemons,
    currentPage,
    pokemonsPerPage,
    fetchPokemons,
    changePage,
    totalPages,
    pokemonsCache
  }
})
