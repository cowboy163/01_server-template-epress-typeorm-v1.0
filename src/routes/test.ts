import {Router} from 'express'
import {UserController} from '../controller/UserController'
import { PermissionController } from '../controller/PermissionController'

const testRoute = Router()

testRoute.get("/users", UserController.all)
testRoute.get("/users/:id", UserController.one)
testRoute.post("/users", UserController.save)
testRoute.delete("/users/:id", UserController.remove)

// permission test
// testRouter.get("/permissions")
testRoute.post("/permission", PermissionController.save)
testRoute.get("/permission/getById/:id", PermissionController.findById)
testRoute.get("/permission/getByQuery/:query?", PermissionController.findByQuery)
// testRoute.("")


export default testRoute