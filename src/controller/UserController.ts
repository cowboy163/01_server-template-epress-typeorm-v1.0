import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import ResHelper, { HttpErrorStatus, HttpSuccessStatus } from "../helper/ResponseHelper"

export class UserController {

    private static get repo() {
        return AppDataSource.getRepository(User)
    }

    static async all(request: Request, response: Response, next: NextFunction) {
        const res = new ResHelper()
        try {
            const data = await UserController.repo.find()
            res.setData(data)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const res = new ResHelper()
        try {
            if(!id) {
                throw "id is invalid"
            }
            const user = await UserController.repo.findOne({
                where: { id }
            })
            if (!user) {
                throw "unregistered user"
            }
            res.setData(user)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;
        const res = new ResHelper()
        try {
            const user = Object.assign(new User(), {
                firstName,
                lastName,
                age
            })
            await UserController.repo.save(user)        
            res.sendSuccessRes(response, HttpSuccessStatus.Created)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const res = new ResHelper()
        try {
            if(!id) {
                throw "invalid id"
            }
            let userToRemove = await UserController.repo.findOneBy({ id })
            if (!userToRemove) {
                throw "this user not exist"
            }
            await UserController.repo.remove(userToRemove)
            res.sendSuccessRes(response, HttpSuccessStatus.Deleted)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }
}