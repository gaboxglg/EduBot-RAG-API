const express = require('express');
const router = express.Router();
const { loginUser } = require('../services/auth.service');

router.post('/login', (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ 
            estado: 'Error', 
            mensaje: 'Por favor ingrese email y password.' 
        });
    }

    try {
        const token = loginUser(email, password);
        res.status(200).json({ 
            estado: 'Éxito', 
            mensaje: 'Login correcto',
            token: token 
        });
    } catch (error) {
        res.status(401).json({ 
            estado: 'Error', 
            mensaje: error.message 
        });
    }
});

module.exports = router;