const router = require('express').Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { add, update, remove, list } = require('../controllers/menuItemController');


router.get('/', auth, roles('restaurant'), list);
router.post('/', auth, roles('restaurant'), add);
router.put('/:id', auth, roles('restaurant'), update);
router.delete('/:id', auth, roles('restaurant'), remove);


module.exports = router;
