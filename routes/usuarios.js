const express = require('express');
const router = express.Router();
const myslq = require('../mysql').pool;
const md5 = require('md5');

router.post('/cadastro', (req, res, next) => {
    myslq.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        md5.hash(req.body.senha, 10, (errMd5, hash) => {
            if (errMd5) { return res.status(500).send({ error: errMd5 }) }
            conn.query('INSERT INTO usuarios (email, senha) values (?,?)', [req.body.email, hash],
            (error, results) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                response = {
                    mensagem: 'usuario criado com sucesso',
                    usuarioCriado: {
                        id_usuario: results.insertId,
                        email: req.body.email
                    }
                }
                return res.status(201).send(response)
            })
            
        })
    })
});


module.exports = router;