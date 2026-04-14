import type { Request, Response, NextFunction } from "express"
import { env } from "node:process"
import { Channel } from "../models/channels.models.ts"
import { Program } from "../models/programs.models.ts"
import { checkTimeOverlap } from "../services/timeOverlap.ts"
import { type NrRange } from "../services/numberRange.ts"

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

    if (+data.page > totalPages) {
        res.status(404).json({ message: "Page requested not found" })
        return
    }

    const offset = (+data.page - 1) * +data.pageSize

    if (!data.search) {
        data.search = ''
    }

    try {
        let channels
        channels = await Channel.aggregate([{
            "$match": {
                "name": { "$regex": data.search, "$options": "i" }
            }
        }])
            .skip(offset)
            .limit(+data.pageSize)


        res.status(200).json({
            items: channels,
            page: +data.page,
            totalItems,
            totalPages,
            _links: {
                self: `/channels?page=${+data.page}${data.search !== '' ? `&search=${data.search}` : ''}`,
                next: +data.page + 1 <= totalPages ? `/channels?page=${+data.page + 1}${data.search !== '' ? `&search=${data.search}` : ''}` : undefined,
                prev: +data.page - 1 > 0 ? `/channels?page=${+data.page - 1}${data.search !== '' ? `&search=${data.search}` : ''}` : undefined,
            }

        })
        return
    } catch (err) {
        res.status(500).json({ message: "Internal server error. Try again later." })
        return
    }
}

export const getChannel = async (req: Request, res: Response, next: NextFunction) => {
    let data = req.query

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const weekday = data.weekday ? data.weekday : ''
    if (weekday !== '' && !weekdays.includes(weekday as string)) {
        res.status(400).json({ message: 'The requested weekday is not valid.' })
        return
    }

    try {
        const programInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
        if (programInfo === null) {
            res.status(404).json({ message: 'Channel not found' })
            return
        }

        const channelProgramsInfo = weekday !== '' ? await Program.find({ channelId: programInfo._id, weekdays: (weekday as string) }) : await Program.find({ channelId: programInfo._id })

        interface iProgram {
            _id: any, //! Resolve this later...
            name: string,
            startTime: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`,
            endTime: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`,
            weekdays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[],
            type: 'byYTChannel' | 'byYTPlaylist',
            ytChannelId ?: string,
            ytPlaylistId ?: string,
        }

        const programs: iProgram[] = []
    channelProgramsInfo.forEach(programInfo => {
        programs.push(
            {
                _id: programInfo._id,
                name: programInfo.name,
                startTime: programInfo.startTime,
                endTime: programInfo.endTime,
                weekdays: programInfo.weekdays,
                type: programInfo.type,
                ytChannelId: programInfo.type === 'byYTChannel' ? programInfo.ytChannelId : undefined,
                ytPlaylistId: programInfo.type === 'byYTPlaylist' ? programInfo.ytPlaylistId : undefined,
            }
        )
    });

    res.status(200).json(
        {
            _id: programInfo._id,
            name: programInfo.name,
            rtmpPathName: programInfo.rtmpPathName,
            iconURI: programInfo.iconURI,
            programsFiltersUsed: weekday !== '' ? {
                weekday: weekday
            } : undefined,
            programs: programs
        }
    )
} catch (err) {
    res.status(500).json({ message: 'Internal server error. Try again later.' })
    return
}
}

export const editChannel = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.userInfo.role !== 'admin') {
        res.status(401).json({ message: 'Only users with admin role can edit a channel.' })
        return
    }

    const data = req.body

    if (
        !data ||
        (!data.name && !data.rtmpPathName && !data.iconURI)
    ) {
        res.status(400).json({ message: 'The required parameters were not submited' })
        return
    }

    const currprogramInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })

    if (currprogramInfo === null || currprogramInfo === undefined) {
        res.status(404).json({ message: 'Channel not found' })
        return
    }

    const updatedprogramInfo: { name?: string, rtmpPathName?: string, iconURI?: string } = {}
    if (data.name && data.name !== currprogramInfo.name) {
        updatedprogramInfo.name = data.name
    }
    if (data.rtmpPathName && data.rtmpPathName !== currprogramInfo.rtmpPathName) {
        updatedprogramInfo.rtmpPathName = data.rtmpPathName
    }
    if (data.iconURI && data.iconURI !== currprogramInfo.iconURI) {
        updatedprogramInfo.iconURI = data.iconURI
    }

    if (updatedprogramInfo.name === undefined && updatedprogramInfo.rtmpPathName === undefined && updatedprogramInfo.iconURI === undefined) {
        res.status(400).json({ message: 'Requested values already associated to the channel' })
        return
    } else {
        try {
            const updatedChannel = await Channel.findByIdAndUpdate(currprogramInfo._id, updatedprogramInfo)
            res.status(200).json({ message: 'Channel updated!' })
            return

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        }
    }
}

export const deleteChannel = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.userInfo.role !== 'admin') {
        res.status(401).json({ message: 'Only users with admin role can edit a program.' })
        return
    }

    const programInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })

    if (programInfo === null || programInfo === undefined) {
        res.status(404).json({ message: 'Program not found' })
        return
    }

    try {
        const programsToDelete = await Program.find({ channelId: programInfo._id })
        if (programsToDelete !== null) {
            programsToDelete.forEach(async (program) => {
                const deleteProgram = await Program.findByIdAndDelete(program._id)
                res.status(204).json(null)
                return
            });
        }

        const deleteChannel = await Channel.findByIdAndDelete(programInfo._id)
    } catch (err) {
        res.status(500).json({ message: 'Internal server error. Try again later.' })
        return
    }
}

export const addProgram = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.userInfo.role !== 'admin') {
        res.status(401).json({ message: 'Only users with admin role can edit a channel.' })
        return
    }

    const data = req.body

    if (
        !data ||
        !data.name ||
        !data.startTime ||
        !data.endTime ||
        !data.weekdays ||
        !data.maxVideos ||
        !data.type ||
        (!data.ytChannelId && data.type === 'byYTChannel') ||
        (!data.ytPlaylistId && data.type === 'byYTPlaylist') ||
        !data.ytVideoSearchMode ||
        data.ytVideoInvertedOrder === undefined
    ) {
        res.status(400).json({ message: 'The required parameters were not submited' })
        return
    }

    const programInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })

    if (programInfo === null || programInfo === undefined) {
        res.status(404).json({ message: 'Channel not found' })
        return
    }

    let timelineConflicts = false
    const weekdays = data.weekdays

    for (const weekday of weekdays) {
        const programs = await Program.find({ channelId: programInfo._id, weekdays: weekday })
        for (const program of programs) {
            if (checkTimeOverlap(data, program)) {
                timelineConflicts = true
                break
            }
        };
        if (timelineConflicts) break
    }

    if (timelineConflicts) {
        res.status(409).json({ message: `There are conflicts in the timetable.` })
        return
    } else {
        try {
            const newProgram = new Program({
                channelId: programInfo._id,
                name: data.name,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                weekdays: data.weekdays,
                maxVideos: data.maxVideos,
                type: data.type,
                ytChannelId: data.type == 'byYTChannel' ? data.ytChannelId : undefined,
                ytPlaylistId: data.type == 'byYTPlaylist' ? data.ytPlaylistId : undefined,
                ytVideoSearchMode: data.ytVideoSearchMode,
                ytVideoInvertedOrder: data.ytVideoInvertedOrder
            })
            await newProgram.save()

            res.status(200).json({ message: `New program created for '${programInfo.name}'.` })
            return
        } catch (err) {
            res.status(500).json({ message: 'Internal server error. Try again later.' })
            return
        }
    }
}

export const getProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const channelInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
            .catch((err) => {
                res.status(500).json({ message: 'Internal Server Error' })
                return
            })

        const programInfo = await Program.findById(req.params.programId)
            .catch((err) => {
                res.status(500).json({ message: 'Internal Server Error' })
                return
            })

        if (programInfo === null || programInfo === undefined || channelInfo === null || channelInfo === undefined || !channelInfo._id.equals(programInfo.channelId)) {
            res.status(404).json({ message: 'Program not found' })
            return
        }

        res.status(200).json({
            _id: programInfo._id,
            name: programInfo.name,
            description: programInfo.description,
            startTime: programInfo.startTime,
            endTime: programInfo.endTime,
            weekdays: programInfo.weekdays,
            maxVideos: programInfo.maxVideos,
            type: programInfo.type,
            ytChannelId: programInfo.type === 'byYTChannel' ? programInfo.ytChannelId : undefined,
            ytPlaylistId: programInfo.type === 'byYTPlaylist' ? programInfo.ytPlaylistId : undefined,
            ytVideoSearchMode: programInfo.ytVideoSearchMode,
            ytVideoInvertedOrder: programInfo.ytVideoInvertedOrder
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Try again later.' })
        return
    }
}

export const editProgram = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.userInfo.role !== 'admin') {
        res.status(401).json({ message: 'Only users with admin role can edit a program.' })
        return
    }

    const programInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })

    const currProgramInfo = await Program.findById(req.params.programId)
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })



    if (currProgramInfo === null || currProgramInfo === undefined || programInfo === null || programInfo === undefined || !programInfo._id.equals(currProgramInfo.channelId)) {
        res.status(404).json({ message: 'Program not found' })
        return
    }

    const data = req.body

    if (
        !data ||
        (
            data.name &&
            data.description &&
            data.startTime &&
            data.endTime &&
            data.weekdays &&
            data.maxVideos &&
            data.type &&
            data.ytChannelId &&
            data.ytPlaylistId &&
            data.ytVideoSearchMode &&
            data.ytVideoInvertedOrder
        )
    ) {
        res.status(400).json({ message: 'The required parameters were not submited' })
        return
    }

    const updatedProgramInfo: {
        name?: string,
        description?: string,
        startTime?: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`,
        endTime?: string,
        weekdays?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[],
        maxVideos?: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`,
        type?: string,
        ytChannelId?: string,
        ytPlaylistId?: string,
        ytVideoSearchMode?: string,
        ytVideoInvertedOrder?: boolean
    } = {}

    if (data.name && data.name !== currProgramInfo.name) {
        updatedProgramInfo.name = data.name
    }
    if (data.description && data.description !== currProgramInfo.description) {
        updatedProgramInfo.description = data.description
    }
    if (data.maxVideos && data.maxVideos !== currProgramInfo.maxVideos) {
        updatedProgramInfo.maxVideos = data.maxVideos
    }
    if (data.ytVideoSearchMode && data.ytVideoSearchMode !== currProgramInfo.ytVideoSearchMode) {
        updatedProgramInfo.ytVideoSearchMode = data.ytVideoSearchMode
    }
    if (data.ytVideoInvertedOrder !== undefined && data.ytVideoInvertedOrder !== currProgramInfo.ytVideoInvertedOrder) {
        updatedProgramInfo.ytVideoInvertedOrder = data.ytVideoInvertedOrder
    }
    if (data.type && data.type !== currProgramInfo.type) {
        if (data.type === 'byYTChannel') {
            if (data.ytChannelId && data.ytChannelId !== currProgramInfo.ytChannelId) {
                updatedProgramInfo.type = data.type
                updatedProgramInfo.ytChannelId = data.ytChannelId
            } else {
                res.status(400).json({ message: "Requested to update program to stream by a YouTube channel but not provided it's ID" })
                return
            }
        } else if (data.type === 'byYTPlaylist') {
            if (data.ytPlaylistId && data.ytPlaylistId !== currProgramInfo.ytPlaylistId) {
                updatedProgramInfo.type = data.type
                updatedProgramInfo.ytPlaylistId = data.ytPlaylistId
            } else {
                res.status(400).json({ message: "Requested to update program to stream by a YouTube playlist but not provided it's ID" })
                return
            }
        }
    }
    if (data.startTime || data.endTime || data.weekdays) {
        let timelineConflicts = false
        const weekdays = data.weekdays ? data.weekdays : currProgramInfo.weekdays

        for (const weekday of weekdays) {
            const programs = await Program.find({ channelId: programInfo._id, weekdays: weekday })
            for (const program of programs) {
                if (checkTimeOverlap(data, program)) {
                    timelineConflicts = true
                    break
                }
            };
            if (timelineConflicts) break
        }

        if (timelineConflicts) {
            res.status(409).json({ message: `There are conflicts in the timetable.` })
            return
        } else {
            if (data.startTime && data.startTime !== currProgramInfo.startTime) {
                updatedProgramInfo.startTime = data.startTime
            }
            if (data.endTime && data.endTime !== currProgramInfo.endTime) {
                updatedProgramInfo.endTime = data.endTime
            }
            if (data.weekdays && data.weekdays !== currProgramInfo.weekdays) {
                updatedProgramInfo.weekdays = data.weekdays
            }
            if (
                updatedProgramInfo.name === undefined &&
                updatedProgramInfo.description === undefined &&
                updatedProgramInfo.maxVideos === undefined &&
                updatedProgramInfo.ytVideoSearchMode === undefined &&
                updatedProgramInfo.ytVideoInvertedOrder === undefined &&
                updatedProgramInfo.type === undefined &&
                updatedProgramInfo.ytChannelId === undefined &&
                updatedProgramInfo.ytPlaylistId === undefined &&
                updatedProgramInfo.startTime === undefined &&
                updatedProgramInfo.endTime === undefined &&
                updatedProgramInfo.weekdays === undefined
            ) {
                res.status(400).json({ message: 'Requested values already associated to the program' })
                return
            } else {
                try {
                    const updatedProgram = await Program.findByIdAndUpdate(currProgramInfo._id, updatedProgramInfo)
                    res.status(200).json({ message: 'Program updated!' })
                    return

                } catch (err) {
                    res.status(500).json({ message: 'Internal Server Error' })
                    return
                }
            }
        }
    }

    if (
        updatedProgramInfo.name === undefined &&
        updatedProgramInfo.description === undefined &&
        updatedProgramInfo.maxVideos === undefined &&
        updatedProgramInfo.ytVideoSearchMode === undefined &&
        updatedProgramInfo.ytVideoInvertedOrder === undefined &&
        updatedProgramInfo.type === undefined &&
        updatedProgramInfo.ytChannelId === undefined &&
        updatedProgramInfo.ytPlaylistId === undefined &&
        updatedProgramInfo.startTime === undefined &&
        updatedProgramInfo.endTime === undefined &&
        updatedProgramInfo.weekdays === undefined
    ) {
        res.status(400).json({ message: 'Requested values already associated to the program' })
        return
    } else {
        try {
            const updatedProgram = await Program.findByIdAndUpdate(currProgramInfo._id, updatedProgramInfo)
            res.status(200).json({ message: 'Program updated!' })
            return

        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        }
    }
}

export const deleteProgram = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.userInfo.role !== 'admin') {
        res.status(401).json({ message: 'Only users with admin role can edit a program.' })
        return
    }

    const programInfo = await Channel.findOne({ rtmpPathName: req.params.channel })
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })

    const programToDelete = await Program.findById(req.params.programId)
        .catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        })

    if (programToDelete === null || programToDelete === undefined || programInfo === null || programInfo === undefined || !programInfo._id.equals(programToDelete.channelId)) {
        res.status(404).json({ message: 'Program not found' })
        return
    }

    try {
        const deleteProgram = await Program.findByIdAndDelete(programToDelete._id)
        res.status(204).json(null)
        return
    } catch (err) {
        res.status(500).json({ message: 'Internal server error. Try again later.' })
        return
    }
}