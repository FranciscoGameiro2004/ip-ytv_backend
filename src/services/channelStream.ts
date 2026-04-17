import ffmpeg from "@ts-ffmpeg/fluent-ffmpeg"
import { exec, execSync } from "node:child_process";

export class ChannelStream {
    channel: string;
    #ffmpegCommand: ffmpeg.FfmpegCommand;
    initialize: () => void;
    run: () => void;
    kill: () => void;
    #info: {
        currVideoFrame: number,
        prevVideoFrame: number,
        diffVideoFrame: number,
        currTotalVideoFrame: number,

        frames: number,
        videoIdx: number,

        feedURI: string,
        feedIdx: number,

        prgrmIdx: number,
        totalIdxdPrgrms: number,
        prgrms: any[],
    };
    #getVideoFrames: (idx: number, callback: (e: Error | null, c?: string | null) => void) => void;
    #getNewIndex: (prevIdx: number) => number;
    #checkPrograms: () => Promise<void>;
    #downloadVideo: (videoURL: string) => Promise<void>;

    constructor(channel: string) {
        this.channel = channel;

        this.#info = {
            currVideoFrame: 0,
            prevVideoFrame: 0,
            diffVideoFrame: 0,
            currTotalVideoFrame: 0,

            frames: 0,
            videoIdx: 1,

            feedURI: '',
            feedIdx: 0,

            prgrmIdx: 0,
            totalIdxdPrgrms: 0,
            prgrms: [],
        }

        this.#getVideoFrames = (idx, callback) => {
            ffmpeg.ffprobe(`media/video${idx}.mp4`, function (err, metadata) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, metadata.streams[1].nb_frames);
                }
            });
        }

        this.#getNewIndex = (prevIdx) => {
            if (prevIdx >= 3) {
                return 1
            } else {
                return prevIdx + 1
            }
        }

        this.#checkPrograms = async () => { }
        //! 2    ^

        this.#downloadVideo = async (videoURL) => {
            try {
                console.log(`A realizar o download do vídeo ${videoURL}`);
                exec(
                    `yt-dlp -t mp4 -S "res:1080" --force-overwrites -o "media/video${this.#info.videoIdx}.%(ext)s" "${videoURL}"`,
                    (err, output) => {
                        if (err) {
                            throw err;
                        }
                        // log the output received from the command
                        console.log("Download concluído");
                    },
                );
            } catch (err) {
                console.log("Download não sucedido");
            }
        }

        this.#ffmpegCommand = ffmpeg(`../streams/${this.channel}/playlist.txt`)
            .inputOptions(["-re", "-f concat", "-safe 0", "-stream_loop -1"])
            .outputOptions([
                "-c:v h264_qsv",
                "-c:a copy",
                "-preset veryfast",
                "-hls_flags delete_segments",
                "-f hls",
                "-vf scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
            ])
            .on("start", (commandLine) => {
                this.#getVideoFrames(this.#info.videoIdx, (err, frameNum) => {
                    if (!err && frameNum) {
                        this.#info.currTotalVideoFrame = +frameNum;
                    }
                });
            })
            .on("progress", async (progress) => {
                //! 3 - Lógica download e check programas
                this.#info.prevVideoFrame = this.#info.currVideoFrame;
                this.#info.currVideoFrame = progress.frames;

                this.#info.diffVideoFrame = this.#info.currVideoFrame - this.#info.prevVideoFrame;
                this.#info.frames += this.#info.diffVideoFrame;

                if (this.#info.frames > this.#info.currTotalVideoFrame) {
                    this.#info.frames -= this.#info.currTotalVideoFrame;
                    this.#info.videoIdx = this.#getNewIndex(this.#info.videoIdx);
                    this.#info.feedIdx += 1;
                    this.#getVideoFrames(this.#info.videoIdx, (err, frameNum) => {
                        if (!err && frameNum) {
                            this.#info.currTotalVideoFrame = +frameNum;
                        }
                    });
                }
            })
            .on("end", () => {
            })
            .on("stderr", (stderrLine) => {
            })
            .on("error", (err) => {
            })
            .save(`../streams/${this.channel}/hls_output/output.m3u8`);

        this.initialize = () => { }
        //! 1 ^
        this.run = () => {
            this.#ffmpegCommand.run()
        },
        this.kill = () => {
            this.#ffmpegCommand.kill('SIGSTOP')
        }
    }
}
