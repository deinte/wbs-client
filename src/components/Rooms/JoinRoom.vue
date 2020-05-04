<template>
    <div class="row">
        <div class="panel">
            <div class="panel-header">
                <span class="header-title">Join {{ this.roomName }} van <span v-if="roomOwner != null">{{ this.roomOwner }}</span></span>
            </div>
            <div class="panel-body">
                <form @submit.prevent="joinRoom">
                    <div class="form-group">
                        <label>Naam</label>
                        <input type="text" class="form-control" v-model="username">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="text" class="form-control" v-model="password">
                    </div>
                    <button type="submit" class="btn btn-contained btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "JoinRoom",
        date() {
            return {
                roomName: '',
                roomOwner: null
            }
        },
        created: function () {
            this.$socket.emit('getRoomInfo', {
                roomName: this.$route.params.roomId
            });
        },
        methods: {
            joinRoom: function () {
                this.$socket.emit('joinRoom', {
                    username: this.username,
                    roomName: this.$route.params.roomId,
                    password: this.password
                });
            }
        },
        mounted: function() {
            this.$socket.on('')
        },
        sockets: {
            roomInfo(data) {
                console.log(data);
                if(data.roomName !== null) {
                    this.roomName = data.roomName;
                    this.roomOwner = data.roomOwner;
                } else {
                    this.$router.push('/');
                }
            },
            joinedRoom(data) {
                this.$store.state.currentPlayer = data.currentPlayer;
                this.$store.state.currentRoom = data.room;
                this.$store.state.currentPlayers = data.players;
                this.$router.push('/rooms/' + this.$store.state.currentRoom.roomName);
            },
        }
    }
</script>

<style scoped>

</style>