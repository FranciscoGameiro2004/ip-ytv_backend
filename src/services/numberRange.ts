//! This file is a temporary **WORKAROUND** due to the fact `ts-number-range` package is unmaintained and broken
// Original code from https://github.com/Feirell/ts-number-range/tree/master

type _NumbersToNRec<
    Nr extends number,
    Counter extends any[],
    Accumulator extends number
    > =
    Counter['length'] extends Nr ?
        Accumulator :
        _NumbersToNRec<Nr, [any, ...Counter], Accumulator | Counter['length']>;

export type NumbersToN<
    Nr extends number
    > =
    Nr extends Nr ?
        number extends Nr ?
            number :
            Nr extends 0 ?
                never :
                _NumbersToNRec<Nr, [], 0> :
        never;


export type NrRange<
    Start extends number,
    End extends number
    > =
    Exclude<NumbersToN<End>, NumbersToN<Start>>;