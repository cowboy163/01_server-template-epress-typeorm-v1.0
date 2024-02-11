import * as express from "express"
// import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
// import { Routes } from "./routes"
import { User } from "./entity/User"
import { CLog } from "./AppHelper"
import * as cors from "cors"
import routes from './routes'


const SERVER_PORT = process.env.HTTP_PORT

// SEEDCODE CHECK
if(process.env.SEEDCODE !== 'jurong2024') {
    CLog.bad("Start Server need correct env SEEDCODE!")
    process.exit(1)
}

AppDataSource.initialize().then(async () => {
    CLog.ok("Data Source has been initialized!")
    
    // create express app
    const app = express()
    app.disable('x-powered-by')

    app.use(express.json())

    app.use('*', cors())

    app.use("/", routes)
    app.listen(SERVER_PORT)

    CLog.ok(`NODE_ENV is : ${process.env.NODE_ENV}.\n Express server has started on port ${SERVER_PORT}.`)

}).catch(error => CLog.bad("Error Server Initializing...", error))
