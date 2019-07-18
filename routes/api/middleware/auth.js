const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("")[1];

        const decoded = jwt.verify(token, process.env.JWT_KEY || 'miClave');
        req.userData = decoded;
        //console.log(decoded);
        /* verificar tipo ? u otro auth*/

      next();
    } catch (error) {
        return res.status(401).json({
            message:'no esta autorizado'
        });
    }
};
