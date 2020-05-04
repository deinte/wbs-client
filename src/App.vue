<template>
    <div id="app">
        <div class="notice notice-error" v-if="error != null">{{ error }}</div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name: 'App',
        data() {
            return {
                error: null
            }
        },
        created: function () {
            if (this.$store.state.currentPlayer !== null && this.$store.state.currentRoom !== 0) {
                console.log("There was an session, trying to restore");
                this.$socket.emit('resumeSession', {
                    user: this.$store.state.currentPlayer,
                    room: this.$store.state.currentRoom
                });
            } else {
                console.log("Nothing found");
            }
            if(!this.$socket.connected) {
                //jej
                console.log("not connected");
            }
        },
        sockets: {
            async err(data) {
                //this.error = data;
                let self = this;
                await this.$latte.ui.notification.create({
                    title: 'Error',
                    color: "error",
                    icon: "exclamation-thick",
                    message: data
                });
                setTimeout(function () {
                    self.error = null;
                }, 6000);
            }
        }
    }
</script>
