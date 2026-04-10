import type { Request, Response, NextFunction } from "express"
import { env } from "node:process"
import { Channel } from "../models/channels.models.ts"

export const addChannel = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.userInfo.role !== 'admin') {
        res.status(401).json({ message: 'Only users with admin role can create a channel.' })
        return
    }

    const data = req.body

    if (
        !data ||
        !data.name
    ) {
        res.status(400).json({ message: 'The required parameters were not submited' })
        return
    }

    if (!data.rtmpPathName) {
        data.rtmpPathName = data.name.toLowerCase().replaceAll(' ', '-')
        let countSimilarNames = await Channel.countDocuments({ rtmpPathName: data.rtmpPathName });
        if (countSimilarNames >= 1) {
            let numberedAlias = 0
            let variantRtmpPathName: string
            do {
                numberedAlias += 1
                variantRtmpPathName = `${data.rtmpPathName}-${numberedAlias}`
                countSimilarNames = await Channel.countDocuments({ rtmpPathName: variantRtmpPathName })
            } while (countSimilarNames >= 1)
            data.rtmpPathName = variantRtmpPathName
        }
    } else {
        let countSimilarNames = await Channel.countDocuments({ rtmpPathName: data.rtmpPathName });
        if (countSimilarNames >= 1) {
            res.status(400).json({ message: `Requested pathname already associated to another channel.` })
            return
        }
    }

    try {
        const newChannel = new Channel({ name: data.name, rtmpPathName: data.rtmpPathName, iconURI: data.iconURI! })
        newChannel.save()
        res.status(201).json({ message: `New channel '${data.name}' was created!` })
        return
    } catch (err) {
        res.status(500).json({ message: 'Internal server error. Try again later.' })
        return
    }
}

export const getChannels = async (req: Request, res: Response, next: NextFunction) => {
    let data = req.query

    if (!data.page) {
        data.page = `${1}`
    }
    if (!data.pageSize) {
        data.pageSize = `${15}`
    }

    if (typeof +data.page !== 'number' || typeof +data.pageSize !== 'number') {
        res.status(400).json({ message: "The queries 'page' and 'pageSize' should be a number" })
        return
    }

    const totalItems = await Channel.countDocuments({});
    const totalPages = Math.ceil(totalItems / +data.pageSize)

    if (+data.page < totalPages) {
        res.status(404).json({ message: "Page requested not found" })
        return
    }

    const offset = (+data.page - 1) * +data.pageSize

    if (!data.search) {
        data.search = ''
    }

    try {
        const channels = await Channel.find({ $text: { $search: data.search } })
            .skip(offset)
            .limit(+data.pageSize)

        res.status(200).json({
            items: channels,
            page: +data.page,
            totalItems,
            totalPages,
            _links: {
                self: `/channels?page=${+data.page}${data.search !== '' && `&search=${data.search}`}`,
                next: +data.page + 1 <= totalPages && `/channels?page=${+data.page + 1}${data.search !== '' && `&search=${data.search}`}`,
                prev: +data.page - 1 > 0 && `/channels?page=${+data.page - 1}${data.search !== '' && `&search=${data.search}`}`,
            }

        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error. Try again later." })
        return
    }
}