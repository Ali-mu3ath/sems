const r = require('express').Router();
const a = require('../middleware/auth.middleware');
const c = require('../controllers/meter.controller');

r.post('/', a, c.createMeter);            
r.get('/', a, c.getMeters);              
r.post('/reading', a, c.addReading);    
r.get('/:meterId/latest', a, c.latest); 

// تعديل + حذف
r.put('/:meterId', a, c.updateMeter);    
r.delete('/:meterId', a, c.deleteMeter);

module.exports = r;
