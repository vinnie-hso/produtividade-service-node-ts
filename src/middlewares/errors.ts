import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {

    // Handled errors
    if (error instanceof CustomError) {
        const { statusCode, errors, logging } = error;
        if (logging) {
            console.error(JSON.stringify({
                code: error.statusCode,
                errors: error.errors,
                stack: error.stack,
            }, null, 2));
        }

        return response.status(statusCode).send({ errors });
    }

    // Unhandled errors
    // console.error(JSON.stringify(error, null, 2));
    return response.status(500).send({ errors: [{ message: "Something went wrong" }] });
};