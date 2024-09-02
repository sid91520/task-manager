const express=require('express')
const bodyparser=require('body-parser')
const mysql=require('mysql')
const multer=require('multer')
const cors=require('cors')
const app=express()
const port=5000

app.use(cors())
app.use(bodyparser.json())
const upload = multer({ dest: 'uploads/' });
const db = mysql.createConnection({
    host: '127.0.0.1',
    port:'3306',
    user: 'root',
    password: 'sid91520@sharma',
    database: 'task_manager'
});
db.connect(err=>{
    if(err) throw err;
    console.log('mysql connected')
})

app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


app.post('/api/tasks', (req, res) => {
    const { title, description, image } = req.body;
    db.query('INSERT INTO tasks (title, description, image) VALUES (?, ?, ?)', [title, description, image], (err, results) => {
        if (err) {
            console.error('Error inserting task:', err); // Log the error
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, title, description, image });
    });
});


app.put('/api/tasks/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null; 
    db.query('UPDATE tasks SET title = ?, description = ?, image = ? WHERE id = ?', [title, description, image, id], (err, results) => {
        if (err) {
            console.error(err); 
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, title, description, image });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send(); // No content
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});