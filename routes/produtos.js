const express = require('express');
const router = express.Router();
const myslq = require('../mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });


// RETORNA DADOS DE TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    myslq.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send({ response })
            }
        )
    });
});

// INSERE UM PRODUTO
router.post('/', upload.single('produto_imagem'), (req, res, next) => {
    console.log(req.file);

    myslq.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES ("?", 00.00)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                   mensagem: 'produto inserido com sucesso',
                   produtoCriado: {
                    id_produto: result.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                        request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos' 
                    }
                   } 
                }

                return res.status(201).send (response);
            }
        )
    });
});

// RETORNA DADOS DE 1 PRODUTO EM ESPECÍFICO
router.get('/:id_produto', (req, res, next) => {
    myslq.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
               
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    })
                }

                const response = {
                    produto: {
                     id_produto: result[0].id_produto,
                     nome: result[0].nome,
                     preco: result[0].preco,
                     request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos' 
                    }
                    } 
                 }
 
                 return res.status(200).send (response);
            }
        )
    });
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    myslq.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
                SET nome     = ?,
                    preco    = ?
            WHERE id_produto = ?`,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'produto atualizado com sucesso',
                    produtoAtualizado: {
                     id_produto: req.body.id_produto,
                     nome: req.body.nome,
                     preco: req.body.preco,
                     request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um produto especifico',
                        url: 'http://localhost:3000/produtos/' + req.body.id_produto
                    }
                    } 
                 }
 
                 return res.status(202).send (response);
            }
        )
    });
});

// EXCLUI UM PRODUTO 
router.delete('/', (req, res, next) => {
    myslq.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, resultado, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});


// EXPORTA O MÓDULO DE ROTAS
module.exports = router;