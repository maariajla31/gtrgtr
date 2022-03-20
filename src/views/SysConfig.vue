<template>
  <div class="tabs-container">
    <ul class="nav nav-tabs ps-5">
      <li class="nav-item">
        <router-link to="payouts" class="nav-link">
          <i class="fas fa-cash-register"></i>
          Herramientas de Pago
        </router-link>
      </li>
      <li class="nav-item d-none">
        <router-link to="schedules-configuration" class="nav-link">
          <i class="bi bi-gear-fill"></i>
          Clases
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="profile-permissions" class="nav-link">
          <i class="bi bi-people"></i>
          Permisos por perfil
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="user-profiles" class="nav-link">
          <i class="bi bi-person"></i>
          Perfiles por usuario
        </router-link>
      </li>
    </ul>
    <div class="container subscription-container">
      <router-view></router-view>
    </div>
  </div>
  <div class="sys-config d-none">
    <h1>System Configuration</h1>
    <ul>
      <li>Bitcion Wallet que recibe pagos</li>
      <li>Calendarizar Clases en vivo</li>
      <li>
        Rangos
        <ul>
          <li>Secuencia</li>
          <li>Nombre</li>
          <li>Requisitos</li>
          <li>Imagen / icono</li>
          <li>Foto de portada</li>
        </ul>
      </li>
      <li>Perfiles de usuarios: Que pantallas ve cada perfil</li>
      <li>Administrar usuarios</li>
      <li>Imagenes de Inicio para usuarios</li>
    </ul>
    <ul>
      <li>
        Pagos con Bitcoin
        <ul>
          <li>Pago incompleto</li>
          <li>Se vencio la cotización</li>
          <li>Wallet cliente incorrecta</li>
          <li>Cliente Sin Wallet</li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        Verificar ReLogin con otro usuario y más ventanas abiertas, se
        actualizan las otras ventanas abiertas
      </li>
      <li>
        Permitir configuraciones por usuario:
        <ul>
          <li>Formato de fecha</li>
          <li>zona horaria</li>
          <li>idioma</li>
          <li>pago minimo</li>
          <li>saldo congelado</li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "sys-cofig"
});
</script>
<style lang="scss" scoped>
.tabs-container {
  margin-left: -($spacer * 1.5) !important;
  margin-right: -($spacer * 1.5) !important;
}
.subscription-container {
  margin-top: $spacer;
  padding-left: ($spacer * 1.5) !important;
  padding-right: ($spacer * 1.5) !important;
}
</style>
