import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { User } from "../models/users.models.ts"

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body

    if (
        !data.username ||
        !data.email ||
        !data.password
    ) {
        res.status(400).json({ message: 'The required parameters were not submited' })
        return
    }

    const sameUsernameCount = await User.countDocuments({username: data.username});
    if (sameUsernameCount >= 1) {
        res.status(409).json({ message: `There is already registered user ${data.username}` })
        return
    }

    let newUserRole: 'admin' | 'user' = 'user'

    const count = await User.countDocuments({});
    if (count < 1) {
        newUserRole = 'admin'
    }


    bcrypt.hash(data.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({ message: err.message })
            return
        }

        try {
            const newUser = new User({ username: data.username, email: data.email, hash, role: newUserRole })
            newUser.save()
            res.status(204).json(null)
            return
        } catch {
            res.status(500).json({ message: 'Internal server error. Try again later.' })
            return
        }
    })
}