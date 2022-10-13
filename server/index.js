const express = require('express')
const app = express()
const port = 3001


app.use(express.urlencoded({extended: false}))
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/tracker', (req, res) => {
  console.log(req.body);
  res.send(200)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))