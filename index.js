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
const port = process.env.PORT || 3000

//MODELO DO OBJETO DO BANCO DE DADOS
const Person = mongoose.model(' Person', {
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    gender: {
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
    address: {
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
    }, 
    type_delivery: {
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
    },
    type_delivery: {
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

//ROTA DE TESTE PARA VER SE O SERVIDOR ESTÁ FUNCIONANDO
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

//ROTA PRA REGISTRAR USUÁRIOS NO BANCO DE DADOS
app.post('/register-employee', async (req, res) => {

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO 
    const name = req.body.name
    const position = req.body.position
    const gender = req.body.gender

    //VERIFICA SE O USUÁRIO ENVIOU O NOME DO FUNCIONÁRIO
    if(!name) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Informe um nome" })
    }

    //VERIFICA SE O CARGO DO FUNCIONÁRIO FOI ENVIADO
    if(!position) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Informe o cargo do funcionário"} )
    }

    //VERIFICA SE O GÊNERO DO FUNCIONÁRIO FOI ENVIADO
    if(!gender) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Informe o gênero do funcionário" })
    }

    //VERIFICA SE O FUNCIONÁRIO FOI CADASTRADO NO BANCO DE DADOS RETORNANDO TRUE OU FALSE
    const personExist = await Person.findOne({ name: name })

    //VERIFICA SE personExist É TRUE, SE FOR RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO, SE NÃO FOR CRIA UM NOVO USUÁRIO NO BANCO DE DADOS
    if(personExist) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Funcionário já cadastrado" })
    }else {
        //CRIA UM NOVO FUNCIONNÁRIO NO BANCO DE DADOS
        const person = new Person({
            name: name,
            position: position,
            gender: gender
        })

        //SALVA O NOVO FUNCIONÁRIO NO BANCO DE DADOS
        await person.save()

        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "success", message: `Funcionári${String(gender).toLowerCase() === "masculino"  ? 'o' : 'a'} ${name}, cadastrado com sucesso!` })
    }
})

//ROTA PARA DELETAR USUÁRIOS DO BANCO DE DADOS
app.delete('/delete-employee/:id', async (req, res ) => {
    //PEGA O ID DO USUÁRIO ENVIADO PELA URL
    const id  = req.params.id

    //VERIFICASE A PESSOA EXISTENO BANCO DE DADOS
    const personExist = await Person.findById(id)

    //VERIFICA SE personExist É VERDDADEIRO  OU FALSO
    if(!personExist) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Funcionário não encontrado" })
    } else {
        //DELETA O USUÁRIO DO BANCO DE DADOS
        await Person.findByIdAndDelete(id)

        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "success", message: `Funcionári${String(personExist.gender).toLowerCase() === "masculino" ? 'o' : 'a'} ${personExist.name} deletado com sucesso!` })   
    }
})

//ROTA PARA ATUALIZAR USUÁRIOS DO BANCO DE DADOS
app.put('/update-employee/:id', async (req, res) => {
    //PEGA O ID DO USUÁRIO ENVIADO PELA URL
    const id  = req.params.id

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO 
    const name = req.body.name
    const position = req.body.position
    const gender = req.body.gender

    //VERIFICASE A PESSOA EXISTENO BANCO DE DADOS
    const personExist = await Person.findById(id)

    //VERIFICA SE personExist É VERDDADEIRO  OU FALSO
    if(!personExist) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Funcionário não encontrado" })
    } else {
        //ATUALIZA O USUÁRIO DO BANCO DE DADOS
        await Person.findByIdAndUpdate(id, {
            name: name ? name : personExist.name,
            position: position ? position : personExist.position,
            gender: gender ? gender : personExist.gender
        })

        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "success", message: `Funcionári${String(gender).toLowerCase() === "masculino" ? 'o' : 'a'} ${name} atualizado com sucesso!` })
    }
})

//LISTA TODOS OS VEICULOS DO BANCO DE DADOS
app.get('/vehicles', async (req, res) => {
    //PROCURA NO BANCO DE DADOS POR TODOS OS VEICULOS CADASTRADOS
    const vehicles = await Vehicle.find()

    //VERIFICA SE O ARRAY DE VEICULOS ESTÁ VAZIO
    if(vehicles.length === 0) {
        //VERIFICA SE TEM ALGUM USUÁRIO CADASTRADO, SE NÃO TIVER RETORNA MENSAGEM DE FEEDBACK
        return res.send("Nenhum veículo encontrado")
    }else{
        //RETORNA OS DADOS PARA FEEDBACK DO USUÁRIO
        return res.send(vehicles)
    }
})

//ROTA PRA REGISTRAR VEICULOS NO BANCO DE DADOS
app.post('/register-vehicle', async (req, res) => {

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO 
    const license_plate = req.body.license_plate

    //VERIFICA SE O USUÁRIO ENVIOU A PLACA DO VEÍCULO
    if(!license_plate) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Informe a placa do veículo" })
    }

    //VERIFICA SE O VEÍCULO FOI CADASTRADO NO BANCO DE DADOS RETORNANDO TRUE OU FALSE
    const vehicleExist = await Vehicle.findOne({ license_plate: license_plate })

    //VERIFICA SE vehicleExist É TRUE, SE FOR RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO, SE NÃO FOR CRIA UM NOVO VEÍCULO NO BANCO DE DADOS
    if(vehicleExist) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Veículo já cadastrado" })
    }else {
        //CRIA UM NOVO VEÍCULO NO BANCO DE DADOS
        const vehicle = new Vehicle({
            license_plate: license_plate
        })

        //SALVA O NOVO VEÍCULO NO BANCO DE DADOS
        await vehicle.save()

        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "success", message: `Veículo com placa ${license_plate}, cadastrado com sucesso!` })
    }
})

//rROTA PARA DELETAR VEICULOS NO BANCO DE DADOS
app.delete('/delete-vehicle/:id', async (req, res) => {
    //PEGA O ID DO CEÍCULO DA URL
    const id = req.params.id

    //VARIAVEL DE CONTROLE PARA VER SE O VECULO EXISTE NO BANCO DE DADOS 
    const vehicleExist = await Vehicle.findById(id)

    //VERIFICA SE O VEICULO ESTÁ CADASTRADO NO BANCO DE DADOS
    if(!vehicleExist) {
        //MOSTRA MENSAGE DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Veículo não encontrado" })
    } else {
        //PROCURA PELO VEICULO NO BANCO DE DADOS E O EXCLUI 
        await Vehicle.findByIdAndDelete(id)
        //MOSTRA MENSAGE DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "success", message: `Veículo com a placa ${vehicleExist.license_plate} deletado com sucesso!` })        
    }
})

//ROTA PARA ATUALIZAR VEICULOS NO BANCO DE DADOS
app.put('/update-vehicle/:id', async (req, res) => {
    //PEGA O ID DO CEÍCULO DA URL
    const id = req.params.id

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO 
    const license_plate = req.body.license_plate

    //VARIAVEL DE CONTROLE PARA VER SE O VECULO EXISTE NO BANCO DE DADOS 
    const vehicleExist = await Vehicle.findById(id)

    //VERIFICA SE O VEICULO ESTÁ CADASTRADO NO BANCO DE DADOS
    if(!vehicleExist) {
        //MOSTRA MENSAGE DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "error", message: "Veículo não encontrado" })
    } else {
        //PROCURA PELO VEICULO NO BANCO DE DADOS E O ATUALIZA 
        await Vehicle.findByIdAndUpdate(id, {
            license_plate: license_plate ? license_plate : vehicleExist.license_plate
        })
        //MOSTRA MENSAGE DE FEEDBACK PARA O USUÁRIO
        return res.send({ type: "success", message: `Veículo com a placa ${license_plate}, atualizado com sucesso!` })        
    }
})

//LISTA TODOS OS PEDIDOS DO BANCO DE DADOS
app.get('/orders', async (req, res) => {
    //PROCURA NO BANCO DE DADOS POR TODOS OS VEICULOS CADASTRADOS
    const orders = await Order.find()

    //VERIFICA SE O ARRAY DE VEICULOS ESTÁ VAZIO
    if(orders.length === 0) {
        //VERIFICA SE TEM ALGUM PEDIDO CADASTRADO, SE NÃO TIVER RETORNA MENSAGEM DE FEEDBACK
        return res.send("Nenhum pedido encontrado")
    }else{
        //RETORNA OS DADOS PARA FEEDBACK DO USUÁRIO
        return res.send(orders)
    }
})

//ROTA PRA REGISTRAR PEDIDOS NO BANCO DE DADOS
app.post('/register-order', async (req, res) => {

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO 
    const location = req.body.location
    const client = req.body.client
    const clothes = req.body.clothes
    const zone = req.body.zone
    const description = req.body.description

    //VERIFICA SE O USUÁRIO ENVIOU A LOCALIZAÇÃO DO PEDIDO
    if(!location) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send("Informe a localização do pedido")
    }

    //VERIFICA SE O USUÁRIO ENVIOU O NOME DO CLIENTE DO PEDIDO
    if(!client) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send("Informe o nome do cliente do pedido")
    }

    //VERIFICA SE O USUÁRIO ENVIOU AS ROUPAS DO PEDIDO
    if(!clothes) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send("Informe as roupas do pedido")
    }

    //VERIFICA SE O USUÁRIO ENVIOU A ZONA DE ENTREGA DO PEDIDO
    if(!zone) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send("Informe a zona de entrega do pedido")
    }

    //VERIFICA SE O USUÁRIO ENVIOU A DESCRIÇÃO DO PEDIDO
    if(!description) {
        //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
        return res.send("Informe a descrição do pedido")
    }

    //CRIA UM NOVO PEDIDO NO BANCO DE DADOS
    const order = new Order({
        location: location,
        client: client,
        clothes: clothes,
        zone: zone,
        description: description
    })

    //SALVA O NOVO PEDIDO NO BANCO DE DADOS
    await order.save()

    //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
    return res.send(`Pedido do cliente ${client}, cadastrado com sucesso!`)
})

//ROTA PARA DELETAR PEDIDOS  NO BANCO DE DADOS
app.delete('/delete-order/:id', async (req, res) => {
    //PEGA O ID DA PELA URL
    const id = req.params.id

    //VARIAVEL DE CONTROLE PARA VER SE O PEDIDO EXISTE NO BANCO DE DADOS
    const orderExist = await Order.findById(id)

    if(!orderExist) {
        //MOSTRA MENSAGEM DE ERRO PARA O USUÁRIO
        return res.send("Pedido não encontrado")
    }else {
        await Order.findByIdAndDelete(id)
        //MOSTRA MENSAGEM DE FEEDBACK PARAO USUÁRIO
        return res.send(`Pedido do cliente ${orderExist.name}, deletado com sucesso!`)
    }
})

//ROTA PARA ATUALIZAR PEDIDOS  NO BANCO DE DADOS
app.put('/update-order/:id', async (req, res) => {
    //PEGA O ID DA PELA URL
    const id = req.params.id

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO
    const location = req.body.location
    const client = req.body.client
    const clothes = req.body.clothes
    const zone = req.body.zone
    const description = req.body.description

    //VARIAVEL DE CONTROLE PARA VER SE O PEDIDO EXISTE NO BANCO DE DADOS
    const orderExist = await Order.findById(id)

    if(!orderExist) {
        //MOSTRA MENSAGEM DE ERRO PARA O USUÁRIO
        return res.send({ "message": "Pedido não encontrado" })
    }else {
        await Order.findByIdAndUpdate(id, {
            location: location ? location : orderExist.location,
            client: client ? client : orderExist.client,
            clothes: clothes ? clothes : orderExist.clothes,
            zone: zone ? zone : orderExist.zone,
            description: description ? description : orderExist.description
        })
        //MOSTRA MENSAGEM DE FEEDBACK PARAO USUÁRIO
        return res.send({ "message": `Pedido do cliente ${client}, atualizado com sucesso!` })
    }
})

//LISTA TODAS AS ENTREGAS DO BANCO DE DADOS
app.get('/invoices', async (req, res) => {
    //PROCURA NO BANCO DE DADOS POR TODOS OS VEICULOS CADASTRADOS
    const invoices = await Invoice.find()

    //VERIFICA SE O ARRAY DE VEICULOS ESTÁ VAZIO
    if(invoices.length === 0) {
        //VERIFICA SE TEM ALGUM PEDIDO ENTREGADO CADASTRADO, SE NÃO TIVER RETORNA MENSAGEM DE FEEDBACK
        return res.send("Nenhuma nota fiscal encontrada")
    }else{
        //RETORNA OS DADOS PARA FEEDBACK DO USUÁRIO
        return res.send(invoices)
    }
})

//ROTA PRA REGISTRAR AS ENTREGAS NO BANCO DE DADOS
app.post('/register-invoice', async (req, res) => {

    //PEGA OS DADOS ENVIADOS POR REQUISISAO PELO USUÁRIO 
    const date = req.body.date
    const status = req.body.status
    const start_time = req.body.start_time
    const delivery_time = req.body.delivery_time
    const delivery_person_name = req.body.delivery_person_name
    const employees_name = req.body.employees_name
    const license_plate = req.body.license_plate

    //CRIA UMA NOVA NOTA FISCAL NO BANCO DE DADOS
    const invoice = new Invoice({
        date: date,
        status: status,
        start_time: start_time,
        delivery_time: delivery_time,
        delivery_person_name: delivery_person_name,
        employees_name: employees_name,
        license_plate: license_plate
    })

    //SALVA A NOVA NOTA FISCAL NO BANCO DE DADOS
    await invoice.save()

    //RETORNA MENSAGEM DE FEEDBACK PARA O USUÁRIO
    return res.send(`Nota fisca
        
        l do cliente ${delivery_person_name}, cadastrada com sucesso!`)
})

//ROTA PARA DELETAR AS ENTREGAS DO BANCO DE DADOS
app.delete('/delete-invoice/:id', async (req, res) => {
    //PEGA O ID DA NOTA FISCAL PELA URL
    const id = req.params.id

    //VARIAVEL DE CONTROLE PARA VER SE A NOTA FISCAL EXISTE NO BANCO DE DADOS
    const invoiceExist = await Invoice.findById(id)

    if(!invoiceExist) {
        return res.json("Nota fiscal não encontrada!")
    }  else {
        await Invoice.findByIdAndDelete(id)
        return res.json(`Nota fiscal do  cliente ${invoiceExist.delivery_person_name}, deletada xom sucessso!!!`)
    }
  
})

//FAZ A CONEXAO COM O BANCO DE DADOS E INICIA O SERVIDOR 
mongoose.connect(`mongodb+srv://${user_name}:${password}@cluster0.lflwc8k.mongodb.net/?appName=Cluster0`)
.then(() => {
    console.log("✅ Conectado ao servidor (MongoDB)")

    app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`)
    })
})

.catch((error) => {
    console.error("Erro ao tentar se conectar ao MongoDB")
    console.error(error)
})