<template>
  <div>
    <h2>Gestión de Productos</h2>

    <form @submit.prevent="crearProducto">
      <input v-model="nuevoProducto.nombre" placeholder="Nombre" required />
      <input v-model="nuevoProducto.precio" type="number" placeholder="Precio" required />
      <button type="submit">Agregar Producto</button>
    </form>

    <hr />

    <ul>
      <li v-for="prod in productos" :key="prod.id">
        {{ prod.nombre }} - ${{ prod.precio }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const productos = ref([]);
const nuevoProducto = ref({ nombre: '', precio: '' });

const obtenerProductos = async () => {
  const response = await api.get('productos/');
  productos.value = response.data;
};

const crearProducto = async () => {
  await api.post('productos/', nuevoProducto.value);
  nuevoProducto.value = { nombre: '', precio: '' }; // Limpiar
  obtenerProductos(); // Refrescar lista
};

onMounted(obtenerProductos);
</script>