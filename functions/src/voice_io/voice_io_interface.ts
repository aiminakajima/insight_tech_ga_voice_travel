import { SpeechLanguageData } from './gdf/gdf_interface_lang';


export namespace VoiceIO
{
    export class FatalError extends Error
    {
        private code: number;
        
        constructor(code: number, message: string)
        {
            super(message);
            this.name = new.target.name;
            this.code = code;
        }
        
        public json()
        {
            return { name: this.name, code: this.code, message: this.message }
        }
    }
    
    /**
     * コンフィグクラス
     */
    export interface IConfig
    {
        /**
         * 環境更新
         */
        updateEnvDebug(): void;
        
        /**
         * デバッグモードかどうか
         */
        isDebug(): boolean;
        
        /**
         * アプリIDの追加文字列
         */
        postAppId(): string;
        
        /**
         * サーバーが本番向けかどうか
         */
        isProductionServerType(): boolean;
    }   
    
    export interface ProcessEnv
    {
        get<T>(key: string): T;
        set<T>(ket: string, value: T): void;
        all(): any;
    }
    
    /**
     * スロット情報
     */
    export interface SlotResultValue
    {
        slotName: string,
        value: string,
        id: string|null,
    }

    /**
     * レスポンス
     */
    export interface IResponse 
    {
    }
    
    /**
     * 
     */
    export interface ISpeechInfo
    {
        /**
         * テキスト取得
         */
        appendInfo(data: SpeechLanguageData, isSecond?: boolean): void;
        getSpeechText(): string;
        getRepromptText(): string|null;
        setRepromptText(text: string): void;
        appendSuggestion(text: string): void;
        replace(searchValue: string, relaceValue: string): void;
    }
    
    export interface IReplaceText
    {
        convertSpeechFullText(text: string): string;
        replaceText(text: string): string;
    }
    
    export interface SSMLReplaceWord
    {
        word: string | RegExp,
        replace: string,
    }
    
    export interface SSMLSettings
    {
        totalSpeedRate?: number,
        replaceWords?: [SSMLReplaceWord],
    }
    
    /**
     * 
     */　
    export interface IHandlerInput
    {
        /**
         * コンフィグ取得
         */
        getConfig(): VoiceIO.IConfig;
        
        /**
         * セッション開始のデバッグ情報
         */
        debugSessionRequest(): Promise<void>;
        
        /**
         * インテント名
         */
        getIntentName(): string;
        
        /**
         * インテント情報
         */
        getIntentInfo(): any;
        
        /**
         * ロケール
         */
        getLocale(): string;
        
        /**
         * 会話のフルテキスト取得
         */
        getFullConversationText(): string | null;
        
        /**
         * レスポンス作成
         * @param speechInfo 
         */
        computeResponse(speechInfo: ISpeechInfo, convert: IReplaceText): Promise<IResponse>;
        computeRepromptRepeatResponse(appendText:string|null, convert: IReplaceText): Promise<IResponse>;
        
        /**
         * セッション情報取得
         */
        getSessionAttribute(): any;
        
        /**
         * Google Dialogflow コンテンツ設定
         * @param contentsName コンテンツ名
         */
        setGDFContents(contentsName: string|null): void;
        /**
         * Google Dialogflow コンテンツ削除
         * @param contentsName コンテンツ名
         */
        deleteGDFContents(contentsName: string): void;
        
        /**
         * アクセストークン取得
         */
        getUserAccessToken(): string|null;
        
        /**
         * handlerInputの slotの中の情報を取得する
         * @param slotName スロット名
         */
        getSlotResolutionValue(slotName: string): SlotResultValue | null;
        
        /**
         * handlerInputの slotの中の情報を取得する
         * @param slotName スロット名
         */
        getAllSlotResolutionValue(slotName: string): SlotResultValue[] | null;
    }

}
