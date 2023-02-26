/*
 * Run the project and access the documentation at: http://localhost:3000/doc
 *
 * Use the command below to generate the documentation without starting the project:
 * $ npm start
 *
 * Use the command below to generate the documentation at project startup:
 * $ npm run start-gendoc
 */

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const express = require('express')
const cors = require('cors')
const app = express()


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/inputFiles'));

/* Routes */
const router = require('./routes')

/* Middlewares */
app.use(cors({
  origin: '*'
}))
app.use(router)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(3000, () => {
  console.log("Server is running!\nAPI documentation: http://localhost:3000/doc")
})
