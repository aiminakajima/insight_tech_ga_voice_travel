import { VoiceIO } from './voice_io/voice_io_interface';
import { QueryPhaseType } from './enums';


// session attributes
export class SessionAttributes
{
    private handlerInput: VoiceIO.IHandlerInput;
    
    /**
     * 生成
     * @param handlerInput 
     */
    static order(handlerInput: VoiceIO.IHandlerInput): SessionAttributes
    {
        return new SessionAttributes(handlerInput);
    }
    
    /**
     * コンストラクタ
     * @param handlerInput 
     */
    constructor(handlerInput: VoiceIO.IHandlerInput)
    {
        this.handlerInput = handlerInput;
    }
    
    private _getSessiontAttributes(): { [key: string]: any }
    {
        return this.handlerInput.getSessionAttribute();
    }
    
    /**
     * 全てのセッション情報を取得
     */
    public getAllSession(): { [key: string]: any }
    {
        return this._getSessiontAttributes();
    }
    
    // ユーザーID
    public setUserId(userId: string): void
    {
        const attribute = this._getSessiontAttributes();
        attribute.userId = userId;
    }
    
    public getUserId(): string
    {
        const attribute = this._getSessiontAttributes();
        return (attribute.userId !== undefined) ? attribute.userId : '';
    }
    
    // フェーズ
    public setPhase(phase: QueryPhaseType|null)
    {
        const attribute = this._getSessiontAttributes();
        if(phase !== null)
            attribute.phase = phase;
        else
            delete attribute.phase;
    }
    
    public getPhase(): QueryPhaseType
    {
        const attribute = this._getSessiontAttributes();
        return (attribute.phase !== undefined) ? attribute.phase : QueryPhaseType.Unknown;
    }
    
    /**
     * フリーテキストを追加する
     * @param text フリーテキスト
     */
    public appendFreeText(text: string, newLine: boolean = true)
    {
        const attribute = this._getSessiontAttributes();
        if(attribute.free_text === undefined)
            attribute.free_text = [];
        let len = attribute.free_text.length;
        if(len >= 1 && !newLine)
            len = len - 1;
        
        if(newLine)
            attribute.free_text[len] = text;
        else
        {
            if(attribute.free_text[len] === undefined)
                attribute.free_text[len] = '';
            attribute.free_text[len] += text;
        }
    }
    
    /**
     * フリーテキスト配列を取得する
     */
    public getAppendFreeText(): string[] | null
    {
        const attribute = this._getSessiontAttributes();
        if(attribute.free_text === undefined)
            return null;
        return attribute.free_text;
    }
    
    // debug継続モード
    public setContinuousMode(mode: boolean): void
    {
        const attribute = this._getSessiontAttributes();
        attribute.continuousMode = mode;
    }
    public getContinuousMode(): boolean
    {
        const attribute = this._getSessiontAttributes();
        return (attribute.continuousMode !== undefined) ? attribute.continuousMode : false;
    }
    
    // 最後に話したスピーチテキスト
    public setLastSpeechText(text: string): void
    {
        const attribute = this._getSessiontAttributes();
        attribute.lastSpeechText = text;
    }

    public getLastSpeechText(): string
    {
        const attribute = this._getSessiontAttributes();
        return (attribute.lastSpeechText !== undefined) ? attribute.lastSpeechText : '';
    }

    // 最後に話したリプロンプトテキスト
    public setLastRepromptText(text: string)
    {
        const attribute = this._getSessiontAttributes();
        attribute.lastRepromptText = text;
    }

    public getLastRepromptText(): string
    {
        const attribute = this._getSessiontAttributes();
        return (attribute.lastRepromptText !== undefined) ? attribute.lastRepromptText : '';
    }
}
