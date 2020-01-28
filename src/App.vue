<template>
  <v-app>
    <v-content>
      <Clients/>
    </v-content>
  </v-app>
</template>

<script>
import Clients from './components/Clients'

export default {
  name: 'App',

  components: {
    Clients,
  },
}
</script>
