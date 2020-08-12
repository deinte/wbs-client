<template>
    <div class="row">
        <div class="col-md-4">
            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">
                        {{ currentRoom.roomName }}
                    </h1>
                </div>
                <div class="list">
                    <label class="list-item" v-for="player in currentRoom.players" v-bind:key="player">
                        <latte-initials :initials="getInitials(player.username)"
                                        class="avatar radius-squircle avatar-48px list-item-prefix"></latte-initials>
                        <div class="list-item-caption">
                            <strong>{{ player.username }}</strong>
                            <span class="text-soft">Extra informatie</span>
                        </div>
                        <span>punten</span>
                    </label>
                </div>
                <div class="btn-group">
                    <latte-ripple as="button" class="ce-ripple btn btn-pill btn-contained btn-primary"
                                  v-clipboard:copy="currentLink" v-clipboard:success="onCopy">
                        <i class="mdi mdi-link-variant"></i><span>Kopieer link</span>
                    </latte-ripple>
                </div>
            </div>
            <div class="panel" v-if="currentRoom.roomOwner === currentPlayer.username">
                <div class="panel-header">
                    <span class="panel-title">Kamer Eigenaar</span>
                </div>
                <div class="btn-group">
                    <latte-ripple as="button" class="ce-ripple btn btn-pill btn-contained btn-primary"
                                  @click="startGame">
                        <i class="mdi mdi-play"></i><span>Start spel</span>
                    </latte-ripple>
                </div>

            </div>
        </div>
        <div class="col-md-8">
            <div class="panel" v-if="state === 'myTurn'">
                <div class="panel-header">
                    <h1 class="panel-title">
                        Vul een nieuw woord in
                    </h1>
                </div>
                <div class="panel-body">
                    <form @submit.prevent="submitWord">
                        <div class="form-group">
                            <label>Welk woord wil je kiezen?</label>
                            <input type="text" class="form-control" v-model="word">
                            <label>Wat is de betekenis?</label>
                            <input type="text" class="form-control" v-model="meaning">
                        </div>
                        <button type="submit" class="btn btn-contained btn-primary"><span>Submit</span></button>
                    </form>
                </div>
            </div>
            <div class="panel" v-else-if="state === 'submitMeaning'">
                <div class="panel-header">
                    <h1 class="panel-title">
                        Wat betekent het woord {{ currentWord }}
                    </h1>
                </div>
                <div class="panel-body">
                    <form @submit.prevent="submitMeaning">
                        <div class="form-group">
                            <label>Wat is de betekenis?</label>
                            <input type="text" class="form-control" v-model="meaning">
                        </div>
                        <button type="submit" class="btn btn-contained btn-primary"><span>Submit</span></button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'InGame',
        data() {
            return {
                currentRoom: this.$store.state.currentRoom,
                currentPlayer: this.$store.state.currentPlayer,
                currentPlayers: this.$store.state.currentPlayers,
                state: null,
                meaning: '',
                word: '',
                currentWord: null,
                currentLink: location.href
            }
        },
        created: function () {
            if (this.$store.state.currentRoom === null || this.$store.state.currentPlayer === null) {
                if (this.$route.params.roomId !== undefined) {
                    this.$router.push('/rooms/' + this.$route.params.roomId + '/join');
                } else {
                    this.$router.push('/rooms')
                }
            } else {
                this.$socket.emit('getRoomInfo', {
                    roomName: this.$route.params.roomId
                });
            }
        },
        sockets: {
            updateRoom(data) {
                this.currentRoom = data;
                this.currentPlayers = data.players;
                this.$store.state.currentRoom = data;
                this.$store.state.currentPlayers = data.players;
            },
            roomInfo(data) {
                if (data.roomName === null || data.roomName === undefined) {
                    this.$router.push('/');
                }
            },
            async wordSubmitted(data) {
                this.currentWord = data.word;
                if (this.currentPlayer.username !== data.playerUsername) {
                    this.state = 'submitMeaning';
                    await this.$latte.ui.snackbar.create({
                        message: "Wat betekent het woord \"" + this.currentWord + "\" volgens jou?"
                    });
                } else {
                    this.state = 'Wait';
                    await this.$latte.ui.snackbar.create({
                        message: "Wacht tot iedereen zijn betekenis van het woord \"" + this.currentWord + "\" heeft ingegeven."
                    });
                }
            },
            async newTurn(data) {
                console.log(this.currentPlayer.username + data);
                if (this.currentPlayer.username === data) {
                    this.state = 'myTurn';
                    await this.$latte.ui.snackbar.create({
                        message: "Jouw beurt, kies een woord en vul de beschrijving in."
                    });
                } else {
                    this.myTurn = false;
                    await this.$latte.ui.notification.create({
                        title: "Nieuwe ronde",
                        message: data + " is aan de beurt."
                    });
                }
            }
        },
        methods: {
            getInitials(str) {
                if (str.indexOf(' ') === -1) {
                    // If string has a space return first 2 char's
                    return str[0] + str[1];
                } else {
                    // If string has no space return first char of first 2 parts.
                    str = str.split(' ');
                    return str[0][0] + str[1][0];
                }
            },
            async startGame() {
                if (this.currentPlayers.length >= 3) {
                    console.log("Start spel");
                    this.$socket.emit('startGame', this.$store.state.currentRoom);
                } else {
                    await this.$latte.ui.snackbar.create({
                        message: "Om het spel te starten heb je minstens 3 spelers nodig!"
                    });
                }
            },
            async submitWord() {
                if (this.meaning !== null && this.word !== null) {
                    this.$socket.emit('submitWord', {
                        data: {
                            roomName: this.currentRoom.roomName,
                            username: this.currentPlayer.username
                        },
                        word: this.word,
                        meaning: this.meaning
                    });
                    this.state = null;
                    this.meaning = null;
                } else {
                    await this.$latte.ui.notification.create({
                        title: 'Error',
                        color: 'error',
                        icon: 'exclamation-thick',
                        message: 'Je hebt niet alles ingevuld'
                    });
                }
            },
            /**
             * addMeaning
             * Checks if field 'Meaning' is filled in and sends emit to server
             * Else we're sending the player a error message
             */
            async submitMeaning() {
                if (this.meaning !== null) {
                    this.$socket.emit('submitMeaning', {
                        meaning: this.meaning,
                        username: this.currentPlayer.username,
                        roomName: this.currentRoom.roomName
                    });
                    this.state = null;
                } else {
                    await this.$latte.ui.notification.create({
                        title: 'Error',
                        icon: 'exclamation-thick',
                        color: 'error',
                        message: 'Je hebt niet alles ingevuld'
                    })
                }
            },
            async onCopy() {
                await this.$latte.ui.snackbar.create({
                    message: "Link gekopieerd"
                });
            }
        }
    }
</script>