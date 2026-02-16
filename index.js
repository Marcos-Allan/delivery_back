//IMPORTAÇÃO DAS BOBLIOTECAS
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

//INICIA AS VARIAVEIS DE AMBIENTE PARA SDEGURANCA DA APLICACAO
require('dotenv').config()

//CONFIGURAÇÃO DA APLICAÇÃO
const app = express()
app.use(express.json())
app.use(cors())

//CONFIGURALÇOES DO MONGODB
const user_name = process.env.USER_NAME
const password = process.env.PASSWORD

//MODELO DO OBJETO DO BANCO DE DADOS
const Person = mongoose.model('Person', {
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }
});

//MODELO DO OBJETO DO BANCO DE DADOS
const Order = mongoose.model('Order', {
    location: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    clothes: {
        type: String,
        required: true
    },
    zone: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

//MODELO DO OBJETO DO BANCO DE DADOS
const Invoice = mongoose.model('Invoice', {
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    delivery_time: {
        type: String,
        required: true
    },
    delivery_person_name: {
        type: String,
        required: true
    },
    employees_name: {
        type: String,
        required: true
    },
    license_plate: {
        type: String,
        required: true
    }
});

//MODELO DO OBJETO DO BANCO DE DADOS
const Vehicle = mongoose.model('Vehicle', {
    license_plate: {
        type: String,
        required: true 
    },
});

app.get('/', async (req, res) => {
    return res.send('Teste de rota, rota funcionando!')
})

//LISTA TODOS OS USUÁRIOS DO BANCO DE DADOS
app.get('/employees', async (req, res) => {
    //PROCURA NO BANCO DE DADOS POR TODOS OS USUÁRIOS CADASTRADOS
    const persons = await Person.find()

    //VERIFICA SE O ARRAY DE USUÁRIOS ESTÁ VAZIO
    if(persons.length === 0) {
        //VERIFICA SE TEM ALGUM USUÁRIO CADASTRADO, SE NÃO TIVER RETORNA MENSAGEM DE FEEDBACK
        return res.send("Nenhum usuário encontrado")
    }else{
        //RETORNA OS DADOS PARA FEEDBACK DO USUÁRIO
        return res.send(persons)
    }
})

mongoose.connect(`mongodb+srv://${user_name}:${password}@cluster0.lflwc8k.mongodb.net/?appName=Cluster0`)
.then(() => {
    console.log("✅ Conectado ao servidor (MongoDB)")

    app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3000}`)
    })
})
.catch((error) => {
    console.error("❌ Erro ao tentar se conectar ao MongoDB")
    console.error(error)
})