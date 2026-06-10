const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ 
            estado: 'Error', 
            mensaje: 'Acceso denegado. Se requiere un token de autenticación.' 
        });
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodificado;
        next();
    } catch (error) {
        return res.status(401).json({ 
            estado: 'Error', 
            mensaje: 'Token inválido o expirado.' 
        });
    }
};

module.exports = { verifyToken };