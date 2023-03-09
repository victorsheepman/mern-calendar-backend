const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const {getEventos, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events')
const { check } = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos')
const {isDate} = require('../helpers/isDate')

const router = Router();

router.use(validarJWT)

router.get(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio es obligatoria').custom(isDate),
        check('end', 'fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ]
    ,getEventos)

router.post('/', [ [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'fecha de inicio es obligatoria').custom(isDate),
    check('end', 'fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
]],crearEvento)

router.put('/:id', actualizarEvento)

router.delete('/:id', eliminarEvento)
module.exports = router