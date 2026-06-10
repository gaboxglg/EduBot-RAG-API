const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Buscamos el token en los headers de la petición
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no hay token, el patovica no te deja pasar
    if (!token) {
        return res.status(403).json({ 
            estado: 'Error', 
            mensaje: 'Acceso denegado. Se requiere un token de autenticación.' 
        });
    }

    try {
        // 3. Si hay token, validamos que sea real y no esté vencido usando tu JWT_SECRET
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardamos los datos del usuario decodificados en la request por si los necesitamos
        req.user = decodificado; 
        
        // 4. Todo bien, le abrimos la puerta para que pase al controlador/servicio
        next(); 
    } catch (error) {
        return res.status(401).json({ 
            estado: 'Error', 
            mensaje: 'Token inválido o expirado.' 
        });
    }
};

module.exports = { verifyToken };