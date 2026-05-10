<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm border">
      <h1 class="h3 mb-0 text-primary"><i class="bi bi-globe"></i> {{ t.titulo }}</h1>
      <div class="btn-group shadow-sm">
        <button @click="idioma = 'es'" class="btn btn-sm" :class="idioma === 'es' ? 'btn-primary' : 'btn-outline-primary'">ES</button>
        <button @click="idioma = 'en'" class="btn btn-sm" :class="idioma === 'en' ? 'btn-primary' : 'btn-outline-primary'">EN</button>
        <button @click="idioma = 'pt'" class="btn btn-sm" :class="idioma === 'pt' ? 'btn-primary' : 'btn-outline-primary'">PT</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card h-100 shadow-sm border-primary">
          <div class="card-body">
            <h5 class="card-title text-primary"><i class="bi bi-person-plus"></i> {{ t.regUsuario }}</h5>
            <form @submit.prevent="crearUsuario">
              <input v-model="nuevoUsuario.nombre" type="text" class="form-control mb-2" :placeholder="t.nombrePlaceholder" required>
              <input v-model="nuevoUsuario.email" type="text" class="form-control mb-2" :placeholder="t.emailPlaceholder" required>
              <button type="submit" class="btn btn-primary w-100">{{ t.btnGuardar }}</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card h-100 shadow-sm border-success">
          <div class="card-body">
            <h5 class="card-title text-success"><i class="bi bi-box-seam"></i> {{ t.regProducto }}</h5>
            <form @submit.prevent="crearProducto">
              <input v-model="nuevoProducto.nombre" type="text" class="form-control mb-2" :placeholder="t.prodPlaceholder" required>
              <input v-model="nuevoProducto.precio" type="number" step="0.01" class="form-control mb-2" :placeholder="t.precioPlaceholder" required>
              <button type="submit" class="btn btn-success w-100">{{ t.btnGuardar }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm mb-4 border-warning">
      <div class="card-header bg-warning text-dark fw-bold">
        <i class="bi bi-cart-check"></i> {{ t.crearPedido }}
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label fw-bold">{{ t.seleccionarCliente }}</label>
            <select v-model="pedido.usuario" class="form-select">
              <option value="" disabled>{{ t.seleccionar }}</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nombre }}</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-bold">{{ t.seleccionarProds }}</label>
            <select v-model="pedido.productos" class="form-select" multiple style="height: 100px;">
              <option v-for="p in productos" :key="p.id" :value="p.id">{{ p.nombre }} - ${{ p.precio }}</option>
            </select>
          </div>
        </div>
        <button @click="registrarPedido" class="btn btn-warning w-100 fw-bold" :disabled="!pedido.usuario || pedido.productos.length === 0">
          {{ t.btnConfirmar }}
        </button>
      </div>
    </div>

    <div class="card shadow-sm border-dark">
      <div class="card-header bg-dark text-white">{{ t.historial }}</div>
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ t.tablaCliente }}</th>
              <th>{{ t.tablaProds }}</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pedidos" :key="p.id">
              <td>#{{ p.id }}</td>
              <td>{{ p.usuario_nombre }}</td>
              <td>
                <span v-for="nom in p.productos_nombres" :key="nom" class="badge bg-secondary me-1">{{ nom }}</span>
              </td>
              <td class="text-success fw-bold">${{ p.total_pedido }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';

// --- i18n ---
const idioma = ref('es');
const diccionario = {
  es: {
    titulo: "E-Commerce Semana 5", regUsuario: "Nuevo Cliente", regProducto: "Nuevo Producto",
    nombrePlaceholder: "Nombre (letras y números)", emailPlaceholder: "Correo (Regex)",
    prodPlaceholder: "Nombre Producto", precioPlaceholder: "Precio", btnGuardar: "Guardar",
    crearPedido: "Realizar Pedido (ACID)", seleccionarCliente: "Elegir Cliente",
    seleccionarProds: "Elegir Productos (Ctrl + Click)", seleccionar: "Seleccione...",
    btnConfirmar: "Confirmar Pedido", historial: "Historial de Ventas (REST)",
    tablaCliente: "Cliente", tablaProds: "Productos",
    errEmail: "Correo no válido", errNombre: "Nombre no válido"
  },
  en: {
    titulo: "E-Commerce Week 5", regUsuario: "New Customer", regProducto: "New Product",
    nombrePlaceholder: "Name (letters & numbers)", emailPlaceholder: "Email (Regex)",
    prodPlaceholder: "Product Name", precioPlaceholder: "Price", btnGuardar: "Save",
    crearPedido: "Place Order (ACID)", seleccionarCliente: "Select Customer",
    seleccionarProds: "Select Products (Ctrl + Click)", seleccionar: "Select...",
    btnConfirmar: "Confirm Order", historial: "Sales History (REST)",
    tablaCliente: "Customer", tablaProds: "Products",
    errEmail: "Invalid email", errNombre: "Invalid name"
  },
  pt: {
    titulo: "E-Commerce Semana 5", regUsuario: "Novo Cliente", regProducto: "Novo Produto",
    nombrePlaceholder: "Nome (letras e números)", emailPlaceholder: "E-mail (Regex)",
    prodPlaceholder: "Nome do Produto", precioPlaceholder: "Preço", btnGuardar: "Salvar",
    crearPedido: "Fazer Pedido (ACID)", seleccionarCliente: "Escolher Cliente",
    seleccionarProds: "Escolher Produtos (Ctrl + Click)", seleccionar: "Selecione...",
    btnConfirmar: "Confirmar Pedido", historial: "Histórico de Vendas (REST)",
    tablaCliente: "Cliente", tablaProds: "Produtos",
    errEmail: "E-mail inválido", errNombre: "Nome inválido"
  }
};

const t = computed(() => diccionario[idioma.value]);

// --- ESTADOS ---
const usuarios = ref([]);
const productos = ref([]);
const pedidos = ref([]);
const nuevoUsuario = ref({ nombre: '', email: '' });
const nuevoProducto = ref({ nombre: '', precio: '' });
const pedido = ref({ usuario: '', productos: [] });

// --- MÉTODOS ---
const sincronizarTodo = async () => {
  try {
    const [u, p, ped] = await Promise.all([api.get('usuarios/'), api.get('productos/'), api.get('pedidos/')]);
    usuarios.value = u.data; productos.value = p.data; pedidos.value = ped.data;
  } catch (e) { console.error("Error API REST"); }
};

const crearUsuario = async () => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  if (!regexNombre.test(nuevoUsuario.value.nombre)) return alert(t.value.errNombre);
  if (!regexEmail.test(nuevoUsuario.value.email)) return alert(t.value.errEmail);
  try {
    await api.post('usuarios/', nuevoUsuario.value);
    nuevoUsuario.value = { nombre: '', email: '' };
    await sincronizarTodo();
  } catch (e) { alert("Error"); }
};

const crearProducto = async () => {
  try {
    await api.post('productos/', nuevoProducto.value);
    nuevoProducto.value = { nombre: '', precio: '' };
    await sincronizarTodo();
  } catch (e) { alert("Error"); }
};

const registrarPedido = async () => {
  try {
    await api.post('pedidos/', pedido.value);
    pedido.value = { usuario: '', productos: [] };
    await sincronizarTodo();
    alert("¡Pedido Transaccional Exitoso!");
  } catch (e) { alert("Error en Transacción ACID"); }
};

onMounted(sincronizarTodo);
</script>