<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>

        <h2>Edição de usuário</h2>
        <hr>

        <div class="columns is-centered">
            <div class="column is-half">
                <div v-if="error != undefined">
                    <div class="notification is-danger">
                         {{ error }}
                    </div>
                    <br>
                </div>
                <p>Nome</p>
                <input type="text" placeholder="Nome do usuário" class="input" v-model="name">
                <p>Email</p>
                <input type="email" placeholder="email@email.com" class="input" v-model="email">
                <hr>
                <button class="button is-success" @click="update()">Editar</button>
            </div>
        </div>
    </div>
</template>

<script>

    import axios from 'axios'

export default {

    created() {

        // let req = {
        //     headers: {
        //         Authorization: "Bearer " + localStorage.getItem('token')
        //     }
        // }

        axios.get(`http://localhost:8080/user/${this.$route.params.id}`).then(res => {
            console.log(res);

            this.name = res.data.name
            this.email = res.data.email
            this.id = res.data.id

        }).catch(err => {
            console.log(err.response);
            this.$route.push({name: 'Home'})
        })
    },
    data(){
        return {
            name: '',
            email: '',
            id: -1,
            error: undefined
        }
    },
    methods:{
        update(){
            axios.put("http://localhost:8080/user", {
                name: this.name,
                email: this.email,
                id: this.id
            }).then(res => {
                console.log(res);
                this.$router.push({name: 'users'})
            }).catch((err) => {
                console.log(err);
                this.error = "Error"
            })
      }
    }
    
    
}
</script>

<style scoped>



</style>