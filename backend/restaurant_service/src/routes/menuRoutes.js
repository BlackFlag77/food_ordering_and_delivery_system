const router = require('express').Router({ mergeParams: true });
const auth = require('../middleware/auth');
const ctrl = require('../controllers/menuController');

router.use(auth);
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;