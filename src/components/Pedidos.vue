<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-light border rounded shadow-sm">
      <h1 class="h4 mb-0 text-primary"><i class="bi bi-shield-lock"></i> {{ t.titulo }}</h1>
      <div class="btn-group">
        <button @click="idioma = 'es'" class="btn btn-sm" :class="idioma==='es'?'btn-primary':'btn-outline-primary'">ES</button>
        <button @click="idioma = 'en'" class="btn btn-sm" :class="idioma==='en'?'btn-primary':'btn-outline-primary'">EN</button>
        <button @click="idioma = 'pt'" class="btn btn-sm" :class="idioma==='pt'?'btn-primary':'btn-outline-primary'">PT</button>
      </div>
    </div>

    <div v-if="!estaAutenticado" class="row justify-content-center my-5">
      <div class="col-md-5">
        <div class="card border-danger shadow">
          <div class="card-header bg-danger text-white text-center fw-bold">
            <i class="bi bi-key-fill"></i> Acceso Restringido (JWT)
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label small fw-bold">Usuario de Django</label>
              <input v-model="loginData.username" type="text" class="form-control" placeholder="admin" required>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Contraseña</label>
              <input v-model="loginData.password" type="password" class="form-control" placeholder="••••••••" required>
            </div>
            <button @click="ejecutarLogin" class="btn btn-danger w-100 fw-bold">Obtener Bearer Token</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="alert alert-success d-flex justify-content-between align-items-center shadow-sm mb-4">
        <span><i class="bi bi-unlock-fill"></i> Sesión protegida mediante <strong>Bearer Token JWT</strong></span>
        <button @click="cerrarSesion" class="btn btn-sm btn-outline-danger">Cerrar Sesión</button>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card border-primary h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-title text-primary">{{ t.regUsuario }}</h6>
              <input v-model="nuevoUsuario.nombre" class="form-control mb-2" :placeholder="t.nombrePlaceholder">
              <input v-model="nuevoUsuario.email" class="form-control mb-2" :placeholder="t.emailPlaceholder">
              <button @click="crearUsuario" class="btn btn-primary w-100">{{ t.btnGuardar }}</button>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card border-success h-100 shadow-sm">
            <div class="card-body">
              <h6 class="card-title text-success">{{ t.regProducto }}</h6>
              <input v-model="nuevoProducto.nombre" class="form-control mb-2" :placeholder="t.prodPlaceholder">
              <input v-model="nuevoProducto.precio" type="number" class="form-control mb-2" :placeholder="t.precioPlaceholder">
              <button @click="crearProducto" class="btn btn-success w-100">{{ t.btnGuardar }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-warning mb-4 shadow-sm">
        <div class="card-body">
          <h6 class="fw-bold">{{ t.crearPedido }}</h6>
          <div class="row">
            <div class="col-md-6 mb-2">
              <select v-model="pedido.usuario" class="form-select">
                <option value="">{{ t.seleccionar }}</option>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nombre }}</option>
              </select>
            </div>
            <div class="col-md-6 mb-2">
              <select v-model="pedido.productos" class="form-select" multiple>
                <option v-for="p in productos" :key="p.id" :value="p.id">{{ p.nombre }} (${{ p.precio }})</option>
              </select>
            </div>
          </div>
          <button @click="registrarPedido" class="btn btn-warning w-100 fw-bold">{{ t.btnConfirmar }}</button>
        </div>
      </div>

      <div class="card border-dark shadow-sm">
        <div class="card-header bg-dark text-white">{{ t.historial }}</div>
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th><th>{{ t.tablaCliente }}</th><th>{{ t.tablaProds }}</th><th class="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pedidos" :key="p.id">
                <td>#{{ p.id }}</td>
                <td class="fw-bold">{{ p.usuario_nombre }}</td>
                <td><span v-for="n in p.productos_nombres" :key="n" class="badge bg-secondary me-1">{{ n }}</span></td>
                <td class="text-end text-success fw-bold">{{ t.moneda }}{{ p.total_pedido || '0.00' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';

// --- INTERNACIONALIZACIÓN ---
const idioma = ref('es');
const diccionario = {
  es: { titulo: "E-Commerce + JWT Secure", regUsuario: "Registro Cliente", regProducto: "Registro Producto", nombrePlaceholder: "Nombre (Regex)", emailPlaceholder: "Email (Regex)", prodPlaceholder: "Producto", precioPlaceholder: "Precio", btnGuardar: "Guardar", crearPedido: "Pedido Transaccional (ACID)", seleccionar: "Elegir Cliente", btnConfirmar: "Confirmar Compra", historial: "Ventas REST (Bearer Token)", tablaCliente: "Cliente", tablaProds: "Productos", moneda: "$", errRegex: "Error: Formato Regex no válido" },
  en: { titulo: "E-Commerce + JWT Secure", regUsuario: "Customer Registration", regProducto: "Product Registration", nombrePlaceholder: "Name (Regex)", emailPlaceholder: "Email (Regex)", prodPlaceholder: "Product", precioPlaceholder: "Price", btnGuardar: "Save", crearPedido: "ACID Transactional Order", seleccionar: "Select Customer", btnConfirmar: "Confirm Order", historial: "REST Sales (Bearer Token)", tablaCliente: "Customer", tablaProds: "Products", moneda: "$", errRegex: "Error: Invalid Regex format" },
  pt: { titulo: "E-Commerce + JWT Seguro", regUsuario: "Registro de Cliente", regProducto: "Registro de Produto", nombrePlaceholder: "Nome (Regex)", emailPlaceholder: "E-mail (Regex)", prodPlaceholder: "Produto", precioPlaceholder: "Preço", btnGuardar: "Salvar", crearPedido: "Pedido Transacional (ACID)", seleccionar: "Selecionar Cliente", btnConfirmar: "Confirmar Pedido", historial: "Vendas REST (Bearer Token)", tablaCliente: "Cliente", tablaProds: "Produtos", moneda: "R$", errRegex: "Erro: Formato Regex inválido" }
};
const t = computed(() => diccionario[idioma.value]);

// --- ESTADOS Y LOGIN ---
const estaAutenticado = ref(!!localStorage.getItem('token'));
const loginData = ref({ username: '', password: '' });
const usuarios = ref([]); const productos = ref([]); const pedidos = ref([]);
const nuevoUsuario = ref({ nombre: '', email: '' });
const nuevoProducto = ref({ nombre: '', precio: '' });
const pedido = ref({ usuario: '', productos: [] });

const ejecutarLogin = async () => {
  try {
    const respuesta = await api.post('login/', loginData.value);
    localStorage.setItem('token', respuesta.data.access);
    estaAutenticado.value = true;
    await sincronizar();
  } catch (e) { alert("Credenciales incorrectas"); }
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  estaAutenticado.value = false;
  window.location.reload();
};

const sincronizar = async () => {
  if (!estaAutenticado.value) return;
  try {
    const [u, p, ped] = await Promise.all([api.get('usuarios/'), api.get('productos/'), api.get('pedidos/')]);
    usuarios.value = u.data; productos.value = p.data; pedidos.value = ped.data;
  } catch (e) { if (e.response?.status === 401) cerrarSesion(); }
};

const crearUsuario = async () => {
  const rEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rNombre = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!rNombre.test(nuevoUsuario.value.nombre) || !rEmail.test(nuevoUsuario.value.email)) return alert(t.value.errRegex);
  try {
    await api.post('usuarios/', nuevoUsuario.value);
    nuevoUsuario.value = { nombre: '', email: '' }; 
    sincronizar();
  } catch (e) { alert("Error al guardar"); }
};

const crearProducto = async () => {
  try {
    await api.post('productos/', nuevoProducto.value);
    nuevoProducto.value = { nombre: '', precio: '' }; 
    sincronizar();
  } catch (e) { alert("Error al guardar"); }
};

const registrarPedido = async () => {
  try {
    await api.post('pedidos/', pedido.value);
    pedido.value = { usuario: '', productos: [] }; 
    sincronizar();
    alert("¡Pedido realizado con éxito!");
  } catch (e) { alert("Error en la transacción ACID"); }
};

onMounted(sincronizar);
</script>