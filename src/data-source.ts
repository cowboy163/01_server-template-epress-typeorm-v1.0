import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { CLog, isProduction } from "./AppHelper"
import * as dotenv from "dotenv"
import * as path from 'path'

dotenv.config()

// define if use replication
let dbReplication = false

// get entity path
const entityPath = path.join(__dirname + '/entity/**/*.ts')

// check port
const dbPort = isProduction()? +process.env.PRO_PORT : +process.env.DEV_PORT
if(isNaN(dbPort)) {
    CLog.bad(`Invalid DB PORT: ===> ${dbPort}`)
    process.exit(1)
}

// choose database
const dataSource:DataSourceOptions = isProduction()? {
    type: 'postgres',
    port: +process.env.PRO_PORT,
    schema: process.env.PRO_SCHEMA,
}:{
    type: 'postgres',
    port: +process.env.DEV_PORT,
    schema: process.env.DEV_SCHEMA,
}
const dataCredential = isProduction()? {
    host: process.env.PRO_HOST,
    username: process.env.PRO_USER,
    password: process.env.PRO_PASSWORD,
    database: process.env.PRO_DATABASE
}:{
    host: process.env.DEV_HOST,
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE
}

// other check
CLog.ok(`Server Path: ===> ${__dirname}`)
CLog.ok(`Entity Path: ===> ${entityPath}`)
CLog.ok(`DB REPLICATION: ===> ${dbReplication}`)
CLog.ok(`DB Info:
[Master] ===> ${dataCredential.host}, ${dataCredential.database},
[Slave] ===> ${process.env.SLAVE_HOST}, ${process.env.SLAVE_DATABASE}
`)

const options: DataSourceOptions = {...dataSource,
    replication: {
        master: {...dataCredential},
        slaves: dbReplication? [{
            host: process.env.SLAVE_HOST,
            username: process.env.SLAVE_USER,
            password: process.env.SLAVE_PASSWORD,
            database: process.env.SLAVE_DATABASE
        }] : [],
    },    
    synchronize: false,
    logging: ["error"],
    extra: {
        connectionLimit: 50
    },
    maxQueryExecutionTime: 3000,
    entities: [
        entityPath
    ],
    migrations: [
        process.env.DB_MIGRATIONS
    ],
    subscribers: [
        process.env.DB_SUBSCRIBERS
    ],
}


export const AppDataSource = new DataSource(options)
