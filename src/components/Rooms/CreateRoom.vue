<template>
    <div class="row">
        <div class="col-md-12">
            <form @submit.prevent="makeRoom">
                <div class="panel">
                    <div class="panel-header">
                        <span class="header-title">Hey</span>
                    </div>
                    <div class="panel-body">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Vul je naam in" v-model="username"/>
                        </div>
                        <div class="form-group">
                            <input type="text" id="password" class="form-control" placeholder="Vul het wachtwoord in"
                                   v-model="password"/>
                        </div>
                    </div>
                    <div class="btn-group">
                        <latte-ripple as="button" class="ce-ripple btn btn-pill btn-contained btn-primary" type="submit">
                            <i class="mdi mdi-login-variant"></i><span>Maak kamer</span>
                        </latte-ripple>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'CreateRoom',
        data() {
            return {
                isConnected: false,
                socketMessage: '',
                password: null,
                username: null,
                currentPlayer: null,
                currentRoom: null
            }
        },
        created() {
            if (this.$store.state.currentRoom !== null) {
                this.$socket.emit('getRoomInfo', {
                    roomName: this.$store.state.currentRoom.roomName,
                    page: 'CreateRoom'
                })
            }
        },
        methods: {
            async makeRoom() {
                if(this.username !== null && this.username !== '' && this.password !== null && this.password !== '') {
                    this.$socket.emit('createRoom', {
                        username: this.username,
                        roomPassword: this.password,
                    });
                    this.password = null;
                } else {
                    await this.$latte.ui.notification.create({
                        color: "error",
                        icon: "exclamation-thick",
                        message: "<strong>Error</strong><br>Je hebt niet alles ingevuld"
                    });
                }
            }
        },
        sockets: {
            joinedRoom(data) {
                console.log(data);
                this.currentPlayer = data.currentPlayer;
                this.currentRoom = data.room;
                this.$store.state.currentPlayer = data.currentPlayer;
                this.$store.state.currentRoom = data.room;
                this.$store.state.currentPlayers = data.players;
                this.$router.push('/rooms/' + this.$store.state.currentRoom.roomName);
            },
            roomInfo(data) {
                if (data.roomName !== null) {
                    this.$socket.emit('playerLeft', this.$store.state.currentPlayer);
                }
                this.$store.state.currentRoom = null;
                this.$store.state.currentPlayers = null;
                this.$store.state.currentPlayer = null;
            },
        }
    }
</script>