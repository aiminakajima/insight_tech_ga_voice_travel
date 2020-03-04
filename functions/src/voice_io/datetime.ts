import * as Moment from 'moment-timezone'
import { isNullOrUndefined } from './utils';

export class DateTime
{
    /**
     * 現在日時を取得
     * @param moment 
     */
    static current(moment: Moment.Moment|null = null): Moment.Moment
    {
        let m: Moment.Moment;
        if(!moment)
        {
            m = DateTime.withTimeZone(Moment());
        }
        else
        {
            m = moment;
        }
        return m;
    }

    /**
     * タイムゾーンを考慮する
     */
    static withTimeZone(moment: Moment.Moment): Moment.Moment
    {
        return moment.tz('Asia/Tokyo');
    }

    /**
     * Unix時間からMomentを作成
     * @param timeStamp Unixタイムスタンプ
     */
    static getDateTimeFromUnixTime(timeStamp: number): Moment.Moment
    {
        return DateTime.withTimeZone(Moment.unix(timeStamp));
    }
    
    /**
     * 日付を文字列で取得
     */
    static getDateTimeString(moment: Moment.Moment, fotmat: string = 'YYYY-MM-DD'): string
    {
        return moment.format(fotmat);
    }

    static getCurrentDateTimeString(fotmat: string = 'YYYY-MM-DD'): string
    {
        return DateTime.current().format(fotmat);
    }

    /**
     * 日時1 - 日時2を unitsで取得する
     * @param moment1 日時1
     * @param moment2 日時1
     * @param units 単位
     */
    static diffBetweenDates(moment1: Moment.Moment, moment2: Moment.Moment, units: Moment.unitOfTime.Base): number
    {
        return moment1.diff(moment2, units);
    }
    
    /**
     * 指定した時・分の次の時間を取得する
     * @param hour 
     * @param minute 
     */
    static computeNextTime(hour: number, minute: number): Moment.Moment
    {
        const currTime = DateTime.current();
        const time = currTime.clone();
        time.hour(hour);
        time.minute(minute);
        time.second(0);
        time.millisecond(0);
        
        if(time < currTime)
            time.add(1, 'd');
        return time;
    }
    
    
    /**
     * 期間オブジェクト取得
     * @param d 
     */
    static duration(d: string, u?: Moment.unitOfTime.Base)
    {
        if(isNullOrUndefined(u))
            return Moment.duration(d);
        else
            return Moment.duration(d, u);
    }
}

export type DateTimeUnit = Moment.unitOfTime.Base;
