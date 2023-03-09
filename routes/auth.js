const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const {validarCampos} = require('../middlewares/validar-campos')
const {crearUsuario, loginUsuario, revalidarToken}= require('../controllers/auth')
const {validarJWT} = require('../middlewares/validar-jwt')
router.post(
    '/new',
    [
        //middlewares
        check('name', 'el nombre es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password debe tener 6 caracteres').isLength({min:6}),
        validarCampos
    ], 
    crearUsuario
);

router.post(
    '/login',
    [
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password debe tener 6 caracteres').isLength({min:6})
    ],
    loginUsuario
)

router.get('/renew', validarJWT, revalidarToken )

module.exports = router;