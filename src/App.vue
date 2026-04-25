<script setup>
import Pedidos from './components/Pedidos.vue'
</script>

<template>
  <header>
    <h1>🛒 Mi Tienda Online</h1>
  </header>

  <main>
    <Pedidos />
  </main>
</template>

<style>
/* Estilos básicos para que no se vea desordenado */
body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; }
</style>