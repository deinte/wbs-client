<template>
    <div class="hello">
      <router-link to="/rooms/create">Create room</router-link>
    </div>
</template>

<script>
    export default {
        name: 'Hey',
        props: {
            msg: String
        }
    }
</script>