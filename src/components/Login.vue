<template>
  <div id="Login">
    <input type="text" v-model="input.username">
    <input type="password" v-model="input.password">
    <button @click="login()">Login</button>

  </div>





</template>

<script>
const axios = require('axios');

export default {
  name: "Login",

  data(){
    return{
      input:{
        username: "",
        password: "",
      },

      responseFromBackend: null,

      userid: null,

    };


  },

  methods: {
    login(){
      if(this.input.username != "" && this.input.password != ""){
        axios.get('http://localhost:9000/login', { params: this.axiosParams })
            //krijgt alleen maar content terug. In browser ctrl+shift+c en dan netwerk
        .then(response => this.responseFromBackend = response.data)
        .catch(error => {console.log(error)})
        .finally(()=>{

          this.userid = this.responseFromBackend.userid
        });

        if(this.responseFromBackend != null){
          if(this.userid != ""){
            this.$emit("authenticated", true);
            this.$router.replace({ name: "Home", params: { id: this.userid }})
          }

        }
      }
    }
  },

  computed: {
    axiosParams(){
      const params = new URLSearchParams();
      params.append('username', this.input.username);
      params.append('password', this.input.password)
      return params;
    }
  },

  //mounted is een soort initialize
  // mounted: function(){
  //
  // }
}
</script>

<style scoped>

</style>