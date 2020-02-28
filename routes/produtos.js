const express = require('express');
const router = express.Router();


// retorna todos produtos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'retorna todos os produtos'
    });
});

// insere um produto
router.post('/', (req, res, next) => {
    
const produto = {
    nome: req.body.nome,
    preco: req.body.preco
};
    
    res.status(201).send ({
        mensagem: 'insere um produto',
        produtoCriado: produto
    });
});

// retorna os dados de 1 produto
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'ID especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'voce passou um ID'
        })
    }
});

// altera 1 produto
router.patch('/', (req, res, next) => {
    res.status(201).send ({
        mensagem: 'produto alterado'
    });
});

// exclui um produto
router.delete('/', (req, res, next) => {
    res.status(201).send ({
        mensagem: 'produto excluido'
    });
});



module.exports = router;