import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/users.models.ts"
import { env } from "node:process"
import { Error } from "mongoose"

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body

    if (
        !data ||
        !data.username ||
        !data.password
    ) {
        res.status(400).json({ message: 'The required parameters were not submited' })
        return
    }

    const user = await User.findOne({ username: data.username })
    if (user === null) {
        res.status(404).json({ message: 'User not found' })
        return
    }

    bcrypt.compare(data.password, user.hash, (err, result) => {
        if (result) {
            jwt.sign({ username: user.username, role: user.role }, env.JWT_SECRET!, {}, (error: Error, token) => {
                if (!error) {
                    res.status(200).json({ token: token })
                    return
                } else {
                    res.status(500).json({ message: 'Internal server error.' })
                    return
                }
            })
        } else {
            res.status(404).json({ message: 'Incorrect password' })
            return
        }
    })
}

export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body

    if (
        !data ||
        !data.token
    ) {
        res.status(400).json({ message: 'A JWT token was not submited' })
        return
    }

    //! Correct this  (error ts(7006))
    jwt.verify(data.token, env.JWT_SECRET!, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: err.message })
            return
        } else {
            res.locals.userInfo = decoded
            next()
        }
    })
}