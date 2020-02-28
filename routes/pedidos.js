const express = require('express');
const router = express.Router();


// retorna todos pedidos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'retorna pedidos'
    });
});

// insere um pedido
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }
    
    res.status(201).send ({
        mensagem: 'o pedido foi criado',
        pedidoCriado: pedido
    });
});

// retorna os dados de um pedido
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
        res.status(200).send({
            mensagem: 'detalhes do pedido',
            id_pedido: id
        });
});

// exclui um pedido
router.delete('/', (req, res, next) => {
    res.status(201).send ({
        mensagem: 'pedido excluido'
    });
});



module.exports = router;