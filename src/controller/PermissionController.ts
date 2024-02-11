import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Permission } from "../entity/Permission";
import ResHelper, { HttpErrorStatus, HttpSuccessStatus } from "../helper/ResponseHelper";
import { Like } from "typeorm";

export class PermissionController {
    private static get repo() {
        return AppDataSource.getRepository(Permission)
    }

    static async save(request: Request, response: Response, next: NextFunction) {
        const {name, code, description, relatedActionsEndpoints} = request.body
        const res = new ResHelper()
        try {
            const permission = Object.assign(new Permission(), {
                name,
                code,
                description,
                relatedActionsEndpoints
            })
            await PermissionController.repo.save(permission)
            res.sendSuccessRes(response, HttpSuccessStatus.Created)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async findById(request: Request, response: Response, next: NextFunction) {
        let id = +request.params.id
        const res = new ResHelper()
        try {
            if(!id) {
                throw "id is invalid"
            }
            const permission = await PermissionController.repo.findOne({
                where: {id}
            })
            if(!permission) {
                throw "no permission for this id"
            }
            res.setData(permission)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
        } catch(err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async findByQuery(request: Request, response: Response, next: NextFunction) {
        const {query} = request.params
        const res = new ResHelper()
        try {
            const permissions = await PermissionController.repo.createQueryBuilder("permission")
            .where("permission.name LIKE :query", {query: `%${query}%`})
            .orWhere("permission.code LIKE :query", {query: `%${query}%`})
            .orWhere("permission.description LIKE :query", {query: `%${query}%`})
            .getMany()

            res.setData(permissions)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
            

        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }


}