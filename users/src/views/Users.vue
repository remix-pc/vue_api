<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <h1>Painel Adm</h1>
        <table class="table">
            <thead>
                <th>Nome: </th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Ações</th>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td v-if="user.role == 0">User</td>
                    <td v-if="user.role == 1">Admin</td>
                    <td>
                        <router-link :to="{name: 'Edit', params: {id: user.id}}">
                            <button class="button is-success">Editar</button>
                        </router-link>
                         |
                        <button class="button is-danger" @click="showModalUser(user.id)">Deletar</button>
                    </td>
                </tr>
            </tbody>
        </table>


        <div :class="{ modal: true, 'is-active': showModal }">
            <div class="modal-background">
                <div class="modal-content">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title">Você quer realmente deletar este usuário?</p>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <p>Você vai apagar os dados! Deseja mesmo deletar este usuário ou cancelar?</p>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <a href="#" class="card-footer-item" @click="hideModal()">Cancelar</a>
                            <a href="#" class="card-footer-item" @click="deleteUser()">Sim, deletar</a>
                        </footer>
                    </div>
                </div>
                <button class="modal-close is-large" aria-label="close" @click="hideModal()"></button>
            </div>
        </div>




    </div>
</template>

<script>

import axios from 'axios'

export default {

    created() {

        let req = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }

        axios.get("http://localhost:8080/user", req).then(res => {
            console.log(res);
            this.users = res.data

        }).catch(err => {
            console.log(err.response);
        })
    },
    data() {
        return {
            users: [],
            showModal: false,
            deleteUserId: -1
        }
    },
    methods: {
        hideModal() {
            this.showModal = false
        },
        showModalUser(id) {
            this.deleteUserId = id
            this.showModal = true
        },
        deleteUser() {

            // let req = {
            //     headers: {
            //         Authorization: "Bearer " + localStorage.getItem('token')
            //     }
            // }

            axios.delete("http://localhost:8080/user/" + this.deleteUserId).then(res => {
                console.log(res);
                this.showModal = false
                this.users = this.users.filter(u => u.id != this.deleteUserId)
            }).catch(err => {
                console.log(err);
                this.showModal = false
            })
        }
    }

}
</script>

<style scoped></style>