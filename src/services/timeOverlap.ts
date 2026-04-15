import { type NrRange } from "./numberRange.ts"

interface TimeRange {
    startTime: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`,
    endTime: `${NrRange<0, 24>}:${NrRange<0, 60>}:${NrRange<0, 60>}`
}

interface CheckTimeOverlapsInterface {
    timeRangeA: TimeRange,
    timeRangeB: TimeRange,
}

export function checkTimeOverlap(timeRangeA: TimeRange, timeRangeB: TimeRange) {
    let timelineConflicts = false

    const convertedTimeRangeA = {
        startTime: timeRangeA.startTime.split(':').reduce((prev: number, val: string, idx: number) => { return prev + +val * (60 ** (2 - idx)) }, 0),
        endTime: timeRangeA.endTime.split(':').reduce((prev: number, val: string, idx: number) => { return prev + +val * (60 ** (2 - idx)) }, 0)
    }

    const convertedTimeRangeB = {
        startTime: timeRangeB.startTime.split(':').reduce((prev: number, val: string, idx: number) => { return prev + +val * (60 ** (2 - idx)) }, 0),
        endTime: timeRangeB.endTime.split(':').reduce((prev: number, val: string, idx: number) => { return prev + +val * (60 ** (2 - idx)) }, 0)
    }

    if ((convertedTimeRangeA.endTime > convertedTimeRangeB.startTime && convertedTimeRangeB.endTime > convertedTimeRangeA.endTime)) {
        timelineConflicts = true
    }

    return timelineConflicts
}