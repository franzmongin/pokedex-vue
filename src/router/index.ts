import PokedexHome from '@/components/PokedexHome.vue'
import PokemonDetails from '@/components/PokemonDetails.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: PokedexHome, name: 'PokedexHome' },
  {
    path: '/pokemon/:id',
    name: 'PokemonDetails',
    component: PokemonDetails
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
