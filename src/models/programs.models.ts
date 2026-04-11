import mongoose, { Schema, Types } from "mongoose";

interface ProgramInterface extends Document {
    channelId: Types.ObjectId;
    name: string;
    description?: string;
    flexibleTime: boolean;
    startTime: string;
    endTime: string;
    weekdays: ('Mon' | 'Tue' | 'Wen' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
    maxVideos: number;
    type: 'byYTChannel' | 'byYTPlaylist';
    ytChannelId?: string;
    ytPlaylistId?: string;
    ytVideoSearchMode: 'alwaysNewer' | 'episode';
    ytVideoInvertedOrder: boolean;
    ytLastVideoId?: string;
}

const programSchema = new Schema<ProgramInterface>({
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
        required: false,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    weekdays: {
        type: [String],
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: true,
    },
    maxVideos: {
        type: Number,
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
        required: false,
    },
    ytPlaylistId: {
        type: String,
        required: false,
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

export const Program = mongoose.model<ProgramInterface>('Program', programSchema)