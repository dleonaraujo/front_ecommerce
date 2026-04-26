<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">🛒 Sistema de Gestión E-Commerce</h1>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title"><i class="bi bi-people-fill"></i> Registro de Usuarios</h5>
            <form @submit.prevent="crearUsuario">
              <input v-model="nuevoUsuario.nombre" type="text" class="form-control mb-2" placeholder="Nombre completo" required>
              <input v-model="nuevoUsuario.email" type="email" class="form-control mb-2" placeholder="Correo electrónico" required>
              <button type="submit" class="btn btn-primary w-100">Guardar Usuario</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title"><i class="bi bi-box-seam"></i> Inventario de Productos</h5>
            <form @submit.prevent="crearProducto">
              <input v-model="nuevoProducto.nombre" type="text" class="form-control mb-2" placeholder="Nombre del producto" required>
              <input v-model="nuevoProducto.precio" type="number" step="0.01" class="form-control mb-2" placeholder="Precio ($)" required>
              <button type="submit" class="btn btn-success w-100">Guardar Producto</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h5 class="card-title"><i class="bi bi-cart-plus"></i> Crear Nuevo Pedido</h5>
        <div class="row">
          <div class="col-md-5">
            <label>Cliente:</label>
            <select v-model="pedido.usuario" class="form-select">
              <option value="" disabled>Seleccione un cliente</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nombre }}</option>
            </select>
          </div>
          <div class="col-md-7">
            <label>Productos (Ctrl + click para varios):</label>
            <select v-model="pedido.productos" class="form-select" multiple>
              <option v-for="p in productos" :key="p.id" :value="p.id">
                {{ p.nombre }} - ${{ p.precio }}
              </option>
            </select>
          </div>
        </div>
        <button @click="registrarPedido" class="btn btn-warning w-100 mt-3" :disabled="!pedido.usuario || pedido.productos.length === 0">
          Registrar Pedido
        </button>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title"><i class="bi bi-list-check"></i> Historial de Pedidos</h5>
        <div v-if="pedidos.length === 0" class="alert alert-info">No hay pedidos registrados.</div>
        <table v-else class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pedidos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.usuario_nombre }}</td>
              <td>{{ p.productos_nombres ? p.productos_nombres.join(', ') : 'Sin productos' }}</td>
              <td>{{ new Date(p.fecha).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

// Estados
const usuarios = ref([]);
const productos = ref([]);
const pedidos = ref([]);

const nuevoUsuario = ref({ nombre: '', email: '' });
const nuevoProducto = ref({ nombre: '', precio: '' });
const pedido = ref({ usuario: '', productos: [] });

// --- LA FUNCIÓN DE FETCH (OBTENER DATOS) ---
const fetchDatos = async () => {
  try {
    const [uRes, pRes, pedRes] = await Promise.all([
      api.get('usuarios/'),
      api.get('productos/'),
      api.get('pedidos/')
    ]);
    usuarios.value = uRes.data;
    productos.value = pRes.data;
    pedidos.value = pedRes.data;
    console.log("Datos sincronizados con el servidor");
  } catch (error) {
    console.error("Error al traer datos:", error);
  }
};

// Acciones
const crearUsuario = async () => {
  try {
    await api.post('usuarios/', nuevoUsuario.value);
    nuevoUsuario.value = { nombre: '', email: '' };
    await fetchDatos(); // Recargar la lista para que aparezca en el select
    alert("Usuario creado");
  } catch (e) { alert("Error al crear usuario"); }
};

const crearProducto = async () => {
  try {
    await api.post('productos/', nuevoProducto.value);
    nuevoProducto.value = { nombre: '', precio: '' };
    await fetchDatos(); // Recargar la lista
    alert("Producto creado");
  } catch (e) { alert("Error al crear producto"); }
};

const registrarPedido = async () => {
  try {
    await api.post('pedidos/', pedido.value);
    pedido.value = { usuario: '', productos: [] };
    await fetchDatos(); // Recargar historial
    alert("Pedido registrado con éxito");
  } catch (e) { alert("Error al registrar pedido"); }
};

// Cargar al inicio
onMounted(fetchDatos);
</script>

<style scoped>
.card { margin-top: 10px; border-radius: 12px; }
.btn { font-weight: bold; }
</style>