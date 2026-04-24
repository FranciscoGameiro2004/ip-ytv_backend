import ffmpeg from "@ts-ffmpeg/fluent-ffmpeg"
import { exec, execSync } from "node:child_process";
import { env } from "node:process";
import { Program } from "../models/programs.models.ts";
import { Channel } from "../models/channels.models.ts";
import { format } from "date-and-time";
import Parser from "rss-parser";
import { type NrRange } from "./numberRange.ts";
import { connectDB } from "../models/index.ts";

export class ChannelStream {
    // Private Information Props
    #info: {
        channel: string, // Channel that is associated to a stream

        timeSnapshot: {
            weekday: string,
            date: string,
            time: number,
        }

        programIndex: number,
        programs: any[],

        feed: any[],
        feedURL: string,
        feedIndex: number,

        streamIndex: number,
    }

    // FFmpeg Stream command
    #ffmpegCommand: ffmpeg.FfmpegCommand

    constructor(channel: string) {
        this.#info = {
            channel: channel,
            timeSnapshot: {
                weekday: 'Mon',
                date: '01/01/1900',
                time: 0
            },

            programIndex: -1,
            programs: [],

            feedIndex: 0,
            feedURL: '',
            feed: [],

            streamIndex: 1,
        }

        this.#ffmpegCommand = ffmpeg(`./streams/${channel}/playlist.txt`)
            .inputOptions(["-re", "-f concat", "-safe 0", "-stream_loop -1"])
            .outputOptions([
                "-c:v libx264",
                "-c:a copy",
                "-preset ultrafast",
                "-hls_flags delete_segments",
                "-hls_time 15",
                "-f hls",
                "-vf scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
            ])
            .on("start", (commandLine) => {
                /* console.log(`Transmitindo`);
                getVideoFrames(videoIdx, (err, frameNum) => {
                    if (!err) {
                        currTotalVideoFrame = frameNum;
                    }
                }); */
            })
            .on("progress", async (progress) => {
                console.log(progress)
            })
            .on("stderr", (stderrLine) => {
                console.log(`FFmpeg stderr: ${stderrLine}`);
            })
            .on("error", (err) => {
                console.error(`Stream error: `, err);
            });
    }

    // Public Methods
    async start() {
        this.#createTimeSnapshot()

        try {
            const todaysPrograms = await this.#getTodaysPrograms()
            if (todaysPrograms === null) {
                throw new Error("Error on finding today's programs.")
            }

            const filteredPrograms = todaysPrograms.filter((program) => this.#timeInSeconds(program.startTime) >= this.#info.timeSnapshot.time)
            this.#info.programs = filteredPrograms

            this.#getNextProgram()

            this.#createFiller(300, () => {
                this.#ffmpegCommand.save(`./streams/${this.#info.channel}/hls_output/output.m3u8`);
                this.#ffmpegCommand.run()

                while (this.#info.streamIndex !== 1) {
                    console.log('Before:', this.#info.streamIndex)
                    this.#downloadVideo(this.#info.feed[this.#info.feedIndex].link, this.#info.streamIndex)
                    this.#info.feedIndex += 1
                    this.#changeStreamIndex()
                    if (this.#info.streamIndex == 1) {
                        console.log('FLAG!')
                    }
                    console.log('After:', this.#info.streamIndex)
                    console.log('---')
                }
            })

        } catch (err) {
            console.error('Could not initialize stream. \n', err)
        }
    }

    kill() {
        this.#ffmpegCommand.kill('SIGSTOP')
    }

    // Private Methods
    #getNextProgram() {
        this.#info.programIndex += 1
        this.#createNewFeed()
    }

    #createTimeSnapshot() {
        const currDate = new Date()

        this.#info.timeSnapshot = {
            weekday: format(currDate, 'ddd'),
            date: format(currDate, 'DD/MM/YYYY'),
            time: format(currDate, 'HH:mm:ss').split(':').reduce((prev: number, val: string, idx: number) => { return prev + +val * (60 ** (2 - idx)) }, 0),
        }
    }

    #timeInSeconds(time: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`) {
        return time.split(':').reduce((prev: number, val: string, idx: number) => { return prev + +val * (60 ** (2 - idx)) }, 0)
    }

    #changeStreamIndex() {
        if (this.#info.streamIndex === 3) {
            this.#info.streamIndex = 1
        } else {
            this.#info.streamIndex += 1
        }
    }

    async #downloadVideo(ytVideoLink: string, vidIdx: number) {
        try {
            console.log(`A realizar o download do vídeo ${ytVideoLink}`);
            execSync(`yt-dlp -t mp4 -S "res:1080" --force-overwrites -o "./streams/${this.#info.channel}/media/video${vidIdx}.%(ext)s" "${ytVideoLink}"`);
        } catch (err) {
            console.log("Download não sucedido");
        }
    }

    async #getTodaysPrograms() {
        const currWeekday = format(new Date(), 'ddd')
        try {
            const newPrograms = await Program.find({ weekdays: currWeekday })
            return newPrograms
        } catch (err) {
            console.log('Could not obtain new programs', err)
            return null
        }
    }

    async #createFiller(threshold: number = 300 /* 5 Minutes by default */, endCallback: () => void) {
        this.#createTimeSnapshot()

        const timeInterval = this.#timeInSeconds(this.#info.programs[this.#info.programIndex].startTime) - this.#info.timeSnapshot.time
        if (timeInterval > threshold) {
            const fillerCommand = ffmpeg(`./streams/filler.mp4`)
                .inputOptions([`-stream_loop ${Math.floor(timeInterval / 8) - 1}`])
                .outputOptions([
                    "-c copy",
                ])
                .on("error", (err) => {
                    console.error(`Error: `, err);
                })
                .on("stderr", (stderrLine) => {
                    console.log(`FFmpeg stderr: ${stderrLine}`);
                })
                .once("end", () => {
                    endCallback()
                });
            fillerCommand.save(`./streams/${this.#info.channel}/media/video${this.#info.streamIndex}.mp4`)
            fillerCommand.run()
            this.#changeStreamIndex()
        }
    }

    async #createNewFeed() {
        this.#info.feedIndex = 0

        const program = this.#info.programs[this.#info.programIndex]

        if (program.type === 'byYTChannel') {
            this.#info.feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${program.ytChannelId}`
        } else {
            this.#info.feedURL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${program.ytPlaylistId}`
        }

        const parser = new Parser()
        const newFeed = await parser.parseURL(this.#info.feedURL)

        this.#info.feed = newFeed.items
    }
}

connectDB()
const stream = new ChannelStream('another-channel')
stream.start()