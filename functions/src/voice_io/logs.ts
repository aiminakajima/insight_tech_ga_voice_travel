import { config } from './config';

/**
 * ログクラス
 */
export class Log
{
    static info = (...words: [any?, ...any[]]) =>
    {
        console.info.apply(console, words);
    }

    static debug = (...words: [any?, ...any[]]) =>
    {
        if(config.isDebug())
            console.info.apply(console, words);
    }

    static error = (...words: [any?, ...any[]]) =>
    {
        console.error.apply(console, words);
    }

    static warn = (...words: [any?, ...any[]]) =>
    {
        console.warn.apply(console, words);
    }

    static trace(...words: [any?, ...any[]])
    {
        if(config.isDebug())
            console.trace.apply(console, words);
    }
}