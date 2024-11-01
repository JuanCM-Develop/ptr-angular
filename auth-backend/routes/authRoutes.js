const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

/*
router.post('/register', async (req, res) => {
    console.log('Ruta /register alcanzada');
    // El resto de tu código
});

router.get('/register', async (req, res) => { 
    console.log('Ruta /register alcanzada');
    res.status(200).send('Esta es la ruta de registro.');
});
*/

// Ruta de registro
router.post('/register', async (req, res) => {
    
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('El usuario ya existe');
        }
        
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Cambiado a un objeto JSON
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => 
    {
        try
        {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(404).send('Usuario no encontrado');
        
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ error: 'Contraseña incorrecta' });
        
            const token = jwt.sign({ userId: user._id }, 'secret_key');
            res.status(200).json({ token });
        } catch (error)
        {
            res.status(500).json({ error: error.message });
        }
    

    
    }
);

module.exports = router;
