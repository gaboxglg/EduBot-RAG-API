const jwt = require('jsonwebtoken');

const loginUser = (email, password) => {
    // Simulamos la validación de un usuario en la base de datos
    if (email === 'admin@edubot.com' && password === '123456') {
        
        // Si las credenciales son correctas, fabricamos el token
        const payload = { 
            id: 1, 
            email: email, 
            rol: 'admin' 
        };

        // Firmamos el token con la clave secreta y le damos 2 horas de vida
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        
        return token;
    }
    
    // Si falla, lanzamos un error
    throw new Error('Credenciales inválidas');
};

module.exports = { loginUser };