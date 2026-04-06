// index.js
const express = require('express');
const app = express();
const PORT = 3000;

// Endpoint untuk mendapatkan data JSON
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Ini response JSON',
    data: [1, 2, 3, 4, 5]
  });
});

let users = [
  { id: 1, name: 'Alice', email: 'alice@email.com' },
  { id: 2, name: 'Bob', email: 'bob@email.com' }
]; 

app.get('/api/users', (req, res) => {
    res.json(users)
})

// Endpoint dengan parameter
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({
    user_id: userId,
    name: `User ${userId}`
  });
});

app.get('/', (req, res) => {
  res.send('Hello World 123!')
})

app.post('/', (req, res) => {
    res.send('Got a POST Request')
})

app.put('/user', (req, res) => {
    res.send("Got a PUT request at /user")
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});