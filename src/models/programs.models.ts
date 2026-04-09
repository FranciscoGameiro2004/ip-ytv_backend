import mongoose, { Schema } from "mongoose";

const programSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    flexibleTime: {
        type: Boolean,
        required: true,
        default: false,
    },
    startTime: {
        type: Schema.Types.Date,
        required: true,
    },
    endTime: {
        type: Schema.Types.Date,
        required: function () {
            return this.flexibleTime
        },
    },
    weekdays: {
        type: [String],
        enum: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: true,
    },
    maxVideos: {
        type: Schema.Types.Int32,
        min: 1,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['byYTChannel', 'byYTPlaylist'],
    },
    ytChannelId: {
        type: String,
        required: function () {
            return this.type === 'byYTChannel'
        },
        enable: function () {
            return this.type === 'byYTChannel'
        },
    },
    ytPlaylistId: {
        type: String,
        required: function () {
            return this.type === 'byYTPlaylist'
        },
        enable: function () {
            return this.type === 'byYTPlaylist'
        },
    },
    ytVideoSearchMode: {
        type: String,
        required: true,
        enum: ['alwaysNewer', 'episode']
    },
    ytVideoInvertedOrder: {
        type: Boolean,
        required: true,
        default: false,
    },
    ytLastVideoId: {
        type: String,
        required: false,
    }
})

export const Program = mongoose.model('Program', programSchema)