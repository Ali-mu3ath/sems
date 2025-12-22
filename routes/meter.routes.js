const r = require('express').Router();
const a = require('../middleware/auth.middleware');
const c = require('../controllers/meter.controller');

r.post('/reading', a, c.addReading);
r.get('/:id/latest', a, c.latest);

module.exports = r;
 