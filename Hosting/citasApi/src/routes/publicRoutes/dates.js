const express = require('express');
const router = express.Router();

const mysqlConnection = require('../../database');

router.get('/datesEmployeeDay/:id_empleado/:dia', (req, res) => {
    const {id_empleado, dia} = req.params;
    mysqlConnection.query(`select citas.hora_entrada, citas.hora_salida
        from citas, empleados_servicios 
        where citas.id_empleado_servicio = empleados_servicios.id_empleado_servicio
        and citas.fecha = '${dia}'
        and empleados_servicios.id_empleado = ${id_empleado}
        order by citas.hora_entrada;`, (err, rows, fields) => {
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
    });
});

router.get('/getUserDate/:id_cita', (req, res) => {
    const {id_cita} = req.params;
    mysqlConnection.query(`select c.fecha, c.hora_entrada, c.hora_salida, c.costo, 
        concat(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno ) as nombre, 
        u.telefono, u.correo, concat(e.nombre, ' ', e.apellido_paterno, ' ', e.apellido_materno ) as empleado, s.nombre as servicio 
        from citas c, usuarios u, empleados_servicios es, servicios s, empleados e 
        where c.id_cita = ${id_cita} 
        and c.id_usuario =u.id_usuario 
        and c.id_empleado_servicio = es.id_empleado_servicio 
        and es.id_empleado =e.id_empleado 
        and es.id_servicio = s.id_servicio;`, (err, rows, fields) => {
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
    });
});
    
router.get('/dates', (req, res) => {
    mysqlConnection.query('SELECT * FROM citas', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/dates/:id_cita', (req, res) => {
    const { id_cita } = req.params;
    mysqlConnection.query('SELECT * FROM citas WHERE id_cita = ?', [id_cita], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    })
});

router.post('/dates', (req, res) => {
    const { id_cita, id_empleado_servicio, fecha, hora_entrada, hora_salida, id_usuario, costo } = req.body;
    const query = `
        CALL datesAddOrEdit(?, ?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [id_cita, id_empleado_servicio, fecha, hora_entrada, hora_salida, id_usuario, costo], (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.put('/dates/:id_cita', (req, res) => {
    const { id_empleado_servicio, fecha, hora_entrada, hora_salida, id_usuario, costo } = req.body;
    const { id_cita } = req.params;
    const query = 'CALL datesAddOrEdit(?, ?, ?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [id_cita, id_empleado_servicio, fecha, hora_entrada, hora_salida, id_usuario, costo], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'Date updated', rows});
        } else {
            console.log(err);
        }
    });
});

router.delete('/dates/:id_cita', (req, res) => {
    const {id_cita} = req.params;
    mysqlConnection.query('DELETE FROM citas WHERE id_cita = ?', [id_cita], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'Date deleted'});
        } else {
            console.log(err);
        }
    });
}); 

module.exports = router;