<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
#app {
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s linear;
}
.fade-enter {
  transform: translateX(-100%);
  opacity: 0.5;
}
.fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
