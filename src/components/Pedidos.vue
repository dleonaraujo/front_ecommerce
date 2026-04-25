<template>
  <div class="shop-container">
    <h1>🛒 Sistema de Gestión E-Commerce</h1>

    <div class="grid-admin">
      <section class="card">
        <h3>👥 Registro de Usuarios</h3>
        <div class="form-group">
          <input v-model="nuevoUsuario.nombre" placeholder="Nombre completo" />
          <input v-model="nuevoUsuario.email" placeholder="Correo electrónico" />
          <button @click="crearUsuario" :disabled="!nuevoUsuario.nombre || !nuevoUsuario.email">Guardar Usuario</button>
        </div>
      </section>

      <section class="card">
        <h3>📦 Inventario de Productos</h3>
        <div class="form-group">
          <input v-model="nuevoProducto.nombre" placeholder="Nombre del producto" />
          <input v-model="nuevoProducto.precio" type="number" placeholder="Precio ($)" />
          <button @click="crearProducto" :disabled="!nuevoProducto.nombre || !nuevoProducto.precio">Guardar Producto</button>
        </div>
      </section>
    </div>

    <section class="card pedido-box">
      <h3>📝 Crear Nuevo Pedido</h3>
      <div class="form-pedido">
        <label>Cliente:</label>
        <select v-model="pedido.usuario">
          <option value="" disabled>Seleccione un cliente</option>
          <option v-for="user in usuarios" :key="user.id" :value="user.id">{{ user.nombre }}</option>
        </select>

        <label>Productos (Ctrl + click para varios):</label>
        <select v-model="pedido.productos" multiple class="select-multi">
          <option v-for="prod in productos" :key="prod.id" :value="prod.id">
            {{ prod.nombre }} - ${{ prod.precio }}
          </option>
        </select>
        
        <button class="btn-primary" @click="registrarPedido" :disabled="!pedido.usuario || pedido.productos.length === 0">
          Registrar Pedido
        </button>
      </div>
    </section>

    <section class="card">
      <h3>History de Pedidos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in historial" :key="p.id">
            <td>#{{ p.id }}</td>
            <td><strong>{{ p.usuario_nombre }}</strong></td>
            <td>
              <span v-for="prod in p.productos_detalles" :key="prod.id" class="badge">
                {{ prod.nombre }}
              </span>
            </td>
            <td>{{ new Date(p.creado_en).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

// Estados
const usuarios = ref([]);
const productos = ref([]);
const historial = ref([]);
const nuevoUsuario = ref({ nombre: '', email: '' });
const nuevoProducto = ref({ nombre: '', precio: '' });
const pedido = ref({ usuario: '', productos: [] });

const cargarDatos = async () => {
  try {
    const [u, p, h] = await Promise.all([
      api.get('usuarios/'),
      api.get('productos/'),
      api.get('pedidos/')
    ]);
    usuarios.value = u.data;
    productos.value = p.data;
    historial.value = h.data;
  } catch (e) { console.error("Error de conexión"); }
};

const crearUsuario = async () => {
  await api.post('usuarios/', nuevoUsuario.ref);
  nuevoUsuario.value = { nombre: '', email: '' };
  cargarDatos();
};

const crearProducto = async () => {
  await api.post('productos/', nuevoProducto.value);
  nuevoProducto.value = { nombre: '', precio: '' };
  cargarDatos();
};

const registrarPedido = async () => {
  await api.post('pedidos/', pedido.value);
  pedido.value = { usuario: '', productos: [] };
  cargarDatos();
  alert("¡Pedido realizado!");
};

onMounted(cargarDatos);
</script>

<style scoped>
.shop-container { max-width: 900px; margin: 0 auto; font-family: sans-serif; color: #333; }
.grid-admin { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.card { border: 1px solid #eee; padding: 20px; border-radius: 8px; background: #f9f9f9; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 10px; }
input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.select-multi { height: 100px; }
.btn-primary { background: #42b983; color: white; font-weight: bold; padding: 12px; border: none; cursor: pointer; width: 100%; margin-top: 10px; }
.btn-primary:disabled { background: #ccc; }
table { width: 100%; border-collapse: collapse; background: white; }
th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
.badge { background: #e0f2f1; color: #00695c; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; margin-right: 5px; }
</style>