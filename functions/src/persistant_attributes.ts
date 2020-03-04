import * as admin from 'firebase-admin';
import { VoiceIO } from './voice_io/voice_io_interface';
import { DateTime } from './voice_io/datetime';
import { isNullOrUndefined } from 'util';


const db_uri = 'https://travel-voice.firebaseio.com/';

const app = admin.initializeApp(
    {
        credential: admin.credential.applicationDefault(),
        databaseURL: db_uri,   //データベースのURL
    });
const database = app.database();

// collections
const collection_users = 'users';
const collection_statistics = 'statistics';

const key_wakeup_count = 'wakeup_count';
const key_original_lang = 'original_lang';
const key_travel_type = 'travel_type';
const key_fellow = 'fellow';
const key_timestamp = 'timestamp';

/**
 * DBクラス
 */
export class PersistantAttributes
{
    private userId: string | null;
    
    /**
     * 生成
     * @param handlerInput 
     */
    static order(handlerInput?: VoiceIO.IHandlerInput, userId?: string): PersistantAttributes
    {
        return new PersistantAttributes(handlerInput, userId);
    }
    
    /**
     * コンストラクタ
     * @param handlerInput
     */
    constructor(handlerInput?: VoiceIO.IHandlerInput, userId?: string)
    {
        if(!isNullOrUndefined(userId))
            this.userId = userId;
        else
            this.userId = null;
    }
    
    /**
     * 起動回数設定
     * @param count 起動回数
     */
    public async setWakeupCount(count: number): Promise<void>
    {
        const ref = database.ref(this.getStatisticsPath());
        const info = { wakeup_count: count};
        await ref.update(info);
    }
    
    /**
     * 起動回数取得
     */
    public async getWakeupCount(): Promise<number>
    {
        const ref = database.ref(`${this.getStatisticsPath()}/${key_wakeup_count}`);
        return new Promise(
            (resolve) => 
            {
                ref.on('value', (snapshot: admin.database.DataSnapshot | null) => 
                {
                    if(snapshot)
                    {
                        const val = parseInt(snapshot.val());
                        if(!isNaN(val))
                        {
                            resolve(val);
                            return;
                        }
                    }
                    resolve(0);
                });
            }
        );
    }
    
    public async setOriginalText(lang: string, text: string): Promise<void>
    {
        const ref = database.ref(this.getUserPath());
        const info: any = {};
        info[key_original_lang] = lang;
        info[lang] = text;
        info[key_timestamp] = DateTime.current().unix();
        await ref.update(info);
    }
    
    public async setTravelType(travelType: string): Promise<void>
    {
        const ref = database.ref(this.getUserPath());
        const info: any = {};
        info[key_travel_type] = travelType;
        await ref.update(info);
    }
    
    public async setFellowType(fellowType: string): Promise<void>
    {
        const ref = database.ref(this.getUserPath());
        const info: any = {};
        info[key_fellow] = fellowType;
        await ref.update(info);
    }
    
    public async getAllUsersData(): Promise<any | null>
    {
        const ref = database.ref(collection_users);
        const data = await new Promise(
            (resolve) => 
            {
                ref.on('value', (snapshot: admin.database.DataSnapshot | null) => 
                {
                    resolve(snapshot?.val());
                });
            });
        return data;
    }
    
    /**
     * データを全て消去
     */
    public async deleteAll(): Promise<boolean>
    {
        const ref = database.ref(collection_users);
        return new Promise(
            async (resolve) => 
            {
                await ref.remove(e =>
                    {
                        resolve(e? false: true);
                    });
            });
    }
    
    // ユーザーパス
    private getUserPath(): string
    {
        return `${collection_users}/${this.userId}/`;
    }
    
    // ユーザーパス
    private getStatisticsPath(): string
    {
        return `${collection_statistics}/`;
    }
}
