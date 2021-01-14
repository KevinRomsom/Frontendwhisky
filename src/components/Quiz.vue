<template>
  <div id="Quiz">
    <div class="row">
      <div class="col-md-6">
        <form class="form-inline">
          <div class="form-group">
            <label for="connect">WebSocket connection:</label>
            <button id="connect" class="btn btn-default" type="submit" :disabled="connected == true" @click.prevent="connect">Connect</button>
            <button id="disconnect" class="btn btn-default" type="submit" :disabled="connected == false" @click.prevent="disconnect">Disconnect
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <button id="start game" class="btn btn-default" type="submit" :disabled="gamestarted == true" v-show="connected" @click.prevent="startgame">Start Game</button>
      </div>
    </div>
    <h1>Quiz</h1>
    <div class="row">
      <div class="col-md-3">

        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
          <!-- nog aan te passen variable lijst received message-->
            <tr v-for="(item, index) in received_messages_player" :key="item">
              <td>{{ item }}</td>
              <td>{{ received_message_score[index] }}</td>
            </tr>
          </tbody>

        </table>
      </div>

      <div class="col-md-8">
        <h1 v-bind:class="question.questiontoask">{{ question.questiontoask}}</h1>
        <div class="row">
          <div class="col-md-8">
            <ul>
              <li v-for="answer in question.answers" :key="answer">
                <button  id="send" class="btn btn-default" type="submit" @click="sendanswer(answer)">
                  {{ answer }}
                </button>
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <table id="conversation" class="table table-striped">
              <thead>
              <tr>
                <th>Player</th>
                <th>Result</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in results" :key="item">
                <td>{{ playerresult[index] }}</td>
                <td>{{ item }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>

  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
name: "Quiz",
  data() {
    return {
      received_messages_player: [],
      received_message_score: [],
      send_message: null,
      connected: false,
      gamestarted: false,

      question: {
        questionid: 0,
        questiontoask: "Placeholdquestion",
        answers: [],
      },

      results: [],
      playerresult: [],
    };
  },

  methods: {
  //meerdere send maken voor verschillende dingen
    sendanswer(answer) {
      if (this.stompClient && this.stompClient.connected) {
        //hier nog de player naam/id meegeven
        //zorgen dat de player van deze client ook te vinden is op deze pagina
        const msg = { content: answer, id: this.question.questionid };
        console.log(JSON.stringify(msg));
        this.stompClient.send("/app/personanswer", JSON.stringify(msg), {});
      }
    },
    send() {
      console.log("Send message:" + this.send_message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { name: this.send_message };
        console.log(JSON.stringify(msg));
        this.stompClient.send("/app/hello", JSON.stringify(msg), {});
      }
    },
    startgame() {
      if(this.stompClient && this.stompClient.connected){
        const msg = { content: "start"};
        console.log(JSON.stringify(msg));
        this.stompClient.send("app/newquestion", JSON.stringify(msg), {});
      }
    },
    connect() {
      this.socket = new SockJS("http://localhost:8080/gs-guide-websocket");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
          {},
          frame => {
            this.connected = true;
            console.log(frame);
            //hier kunnen nog meer subscribes bij komen.
            this.stompClient.subscribe("/topic/greetings", tick => {
              console.log(tick);
              console.log(tick.body);
              this.received_messages_player.push(JSON.parse(tick.body).content);
              this.received_messages_score.push(JSON.parse(tick.body).score);
            });
            //dest nog veranderen!!
            this.stompClient.subscribe("/topic/resultplayer", tick => {
              console.log(tick);
              //nog variable naam toevoegen -> (tick.body).score
              this.results.push(JSON.parse(tick.body));
              this.playerresult.push(JSON.parse(tick.body));
            });
            this.stompClient.subscribe("/topic/nextquestion", tick => {
              console.log(tick);
              this.question.questionid.push(JSON.parse(tick.body).questionidback)
              this.question.questiontoask.push(JSON.parse(tick.body).questionback);
              this.question.answers.push(JSON.parse(tick.body).answersback);
            });
          },
          error => {
            console.log(error);
            this.connected = false;
          }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    }
  },

  mounted() {
    // this.connect();
  }
};

</script>

<style scoped>

</style>