import { VoiceIO } from './voice_io/voice_io_interface';
import { readCodeVersion, generateRandomHexString } from './voice_io/utils';
import { Log } from './voice_io/logs';
import { config } from './voice_io/config';
import { SessionAttributes } from './session_attributes';
import * as language from './language';
import * as dateTimeUtil from './voice_io/datetime';
import { LanguageInfo } from './lang/language_info';
import { QueryPhaseType } from './enums';
import { PersistantAttributes } from './persistant_attributes';

// dialogflow contents
const contentsQueryDebug = 'debug';
const contentsFreeWord = 'free_word';
const contentsBooleanPositive = 'boolean_positive';
const contentsBooleanNeegative = 'boolean_negative';
const contentsTravelType = 'travel_type';

/**
 * Block - Agreement
 */
const blockAskAgreement = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.block_agreement);
    
    // コンテンツ指定
    handlerInput.setGDFContents(contentsBooleanPositive);
    handlerInput.setGDFContents(contentsBooleanNeegative);

     // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.Agreement);
}

/**
 * Block - Ask Exists Another
 */
const blockAskExistsAnother = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.ask_exists_another);
    
    // コンテンツ指定
    handlerInput.setGDFContents(contentsBooleanPositive);
    handlerInput.setGDFContents(contentsBooleanNeegative);

     // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.ExistsAnother);
}

/**
 * Block - Ask Details
 */
const blockAskDetail = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.ask_details);
    
    // コンテンツ指定
    handlerInput.setGDFContents(contentsFreeWord);
    
    // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.FreeContents)
}

/**
 * Block - Ask More Details
 */
const blockAskMoreDetails = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.ask_more_details);
    
    // コンテンツ指定
    handlerInput.setGDFContents(contentsFreeWord);
    handlerInput.setGDFContents(contentsBooleanNeegative);
    
     // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.FreeContentsMore);
}


/**
 * Block - Ask Travel Type
 */
const blockAskTravelType = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.ask_travel_type);

    // コンテンツ指定
    handlerInput.setGDFContents(contentsTravelType);
    
    // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.TravelType)
}

/**
 * Block - Ask Fellow Type
 */
const blockAskFellowType = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.ask_fellow_type);
    
    // コンテンツ指定
    handlerInput.setGDFContents(contentsFreeWord);
    
    // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.Fellow);
}

/**
 * Block - Thanks
 */
const blockThanks = (handlerInput: VoiceIO.IHandlerInput, lang: LanguageInfo, speechInfo: VoiceIO.ISpeechInfo): void =>
{
    // 応答メッセージ
    speechInfo.appendInfo(lang.thanks);
    
    // コンテンツ指定
    handlerInput.setGDFContents(contentsFreeWord);
    
    // フェーズ
    SessionAttributes.order(handlerInput).setPhase(QueryPhaseType.Fellow);
}


/**
 * 
 */
export class TravelVoiceApplication
{
    private handlerInput: VoiceIO.IHandlerInput;
    private startTime: number;
    private lang: any;
    
    constructor(handlerInput: VoiceIO.IHandlerInput)
    {
        this.handlerInput = handlerInput;
        this.startTime = (new Date).getTime();
        this.lang = language.getWithLocale(handlerInput.getLocale());
    }
    
    public getHandlerInput(): VoiceIO.IHandlerInput
    {
        return this.handlerInput;
    }
    
    public getLanguage(): LanguageInfo
    {
        return this.lang;    
    }
    
    public async intentPrologue(): Promise<void>
    {
        // 環境アップデート
        config.updateEnvDebug();
        
        // バージョン
        const version = readCodeVersion();
        Log.debug(`version: ${version}`);
        
        // 必要ならユーザーIDを生成
        const sessionAttributes = SessionAttributes.order(this.handlerInput);
        if(sessionAttributes.getUserId().length <= 0)
            sessionAttributes.setUserId(this.generateUserId());
        
        // デバッグフラグ
        if(config.isDebug())
            this.handlerInput.setGDFContents(contentsQueryDebug);
        
        try
        {
            // デバッグ
            await this.handlerInput.debugSessionRequest();
        }
        catch(e)
        {
        }
    }
    
    public intentEpilogue(): void
    {
        const now = (new Date).getTime();
        Log.debug(`[${this.handlerInput.getIntentName()}] processing time: ${now - this.startTime}ms`);
    }
    
    /**
     * 処理の前の事前チェック
     * @param handlerInput 
     * @param speechInfo 
     */
    public commonValidiation(speechInfo: VoiceIO.ISpeechInfo): boolean
    {
        // handler
        // const handlerInput = this.handlerInput;
        
        return true;
        // throw Error();
    }
    
    /**
     * SessionAttributes取得
     */
    public getSessionattrinute(): SessionAttributes
    {
        return SessionAttributes.order(this.handlerInput);
    }
    
    /**
     * PersistantAttributes取得
     */
    public getPersistantAttributes(): PersistantAttributes
    {
        return PersistantAttributes.order(this.handlerInput, this.getSessionattrinute().getUserId());
    }
    
    /**
     * ----- INTNET: 通常起動
     */
    public async intentLaunchRequestHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // バージョン
        const version = readCodeVersion();
        Log.debug(`version: ${version}`);
        
        // 起動回数
        const db = this.getPersistantAttributes();
        const wakeupCount = await db.getWakeupCount();
        await db.setWakeupCount(wakeupCount + 1);
        
        // 挨拶
        speechInfo.appendInfo(this.getLanguage().welcome);
        
        // if(config.isDebug())
        //     speechInfo.appendInfo( { text: `デバッグ バージョン ${version} / 言語ファイル ${lang.ver} です。` })
        blockAskAgreement(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    /**
     * ----- INTNET: 肯定
     */
    public async positiveHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
		const sessionAttributes = SessionAttributes.order(this.getHandlerInput());
        const phase = sessionAttributes.getPhase();
        Log.info(`positiveHandler: ${phase}`);
        switch(phase)
        {
            case QueryPhaseType.Agreement:
                this.positiveAgreementrHandler(speechInfo);
                break;          
                
            case QueryPhaseType.ExistsAnother:
                this.positiveAgainHandler(speechInfo);
                break;
            default:
                throw new Error('positivehandler phase error');
        }
    }
    private positiveAgreementrHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsBooleanPositive);
        this.handlerInput.deleteGDFContents(contentsBooleanNeegative);

        blockAskDetail(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    private positiveAgainHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsBooleanPositive);
        this.handlerInput.deleteGDFContents(contentsBooleanNeegative);

        blockAskDetail(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    /**
     * ----- INTNET: 否定
     */
    public async negativeHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
		const sessionAttributes = SessionAttributes.order(this.getHandlerInput());
        const phase = sessionAttributes.getPhase();
        Log.info(`negativeHandler: ${phase}`);
        switch(phase)
        {
            case QueryPhaseType.Agreement:
                this.negativeAgreementrHandler(speechInfo);
                break;               
            case QueryPhaseType.ExistsAnother:
                await this.negativeExistsAnotherHandler(speechInfo);
                break;
            case QueryPhaseType.FreeContents:
            case QueryPhaseType.FreeContentsMore:
                    await this.negativeMoreHandler(speechInfo);
                break;
            default:
                throw new Error(`negativeHandler phase error - ${phase}`);
        }
    }
    
    private negativeAgreementrHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsBooleanPositive);
        this.handlerInput.deleteGDFContents(contentsBooleanNeegative);
        
        // 旅行タイプを訊く
        speechInfo.appendInfo(this.getLanguage().block_disagreement);
    }
    
    private async negativeExistsAnotherHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // フリーテキストを保存
        await this.saveFreeText();
        
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsBooleanPositive);
        this.handlerInput.deleteGDFContents(contentsBooleanNeegative);
        
        // 旅行タイプを訊く
        blockAskTravelType(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    private async negativeMoreHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // フリーテキストを保存
        await this.saveFreeText();
        
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsFreeWord);
        this.handlerInput.deleteGDFContents(contentsBooleanNeegative);
        
        // 旅行タイプを訊く
        blockAskTravelType(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    // フリーテキストを保存
    private async saveFreeText()
    {
        const sessionAttribute = this.getSessionattrinute();
        const textArray = sessionAttribute.getAppendFreeText();
        
        if(textArray === null)
            return;
        
        Log.debug(JSON.stringify(textArray));
        const text = textArray.join('.\n');
        const db = this.getPersistantAttributes();
        await db.setOriginalText(this.handlerInput.getLocale(), text);
    }
    
    /**
     * ----- INTNET: ヘルプ
     */
    public async helpHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        speechInfo.appendInfo(this.getLanguage().help);
    }
    
    /**
     * ----- INTNET: 停止
     */
   public async stopHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        speechInfo.appendInfo(this.getLanguage().stop);
    }
        
    /**
     * ----- INTNET: フリーワード
     */
    public async freeTextHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
		const sessionAttributes = SessionAttributes.order(this.getHandlerInput());
        const phase = sessionAttributes.getPhase();
        switch(phase)
        {
            case QueryPhaseType.FreeContents:
                await this.freeTextFreeContentsHandler(speechInfo, false);
                break;
            case QueryPhaseType.FreeContentsMore:
                await this.freeTextFreeContentsHandler(speechInfo, true);
                break;
            case QueryPhaseType.Fellow:
                await this.freeTextFellowHandler(speechInfo);
                break;
            default:
                throw new Error('freeTextHandler phase error');
        }
    }
    
    private async freeTextFreeContentsHandler(speechInfo: VoiceIO.ISpeechInfo, isMoreMode: boolean)
    {
        // テキストをセッションに記録する
        const fullText = this.handlerInput.getFullConversationText();
        if(fullText !== null)
        {
            const sessionAttribute = this.getSessionattrinute();
            sessionAttribute.appendFreeText(fullText);
        }
        
        if(isMoreMode)
        {
            this.freeTextWithoutSpecifyWord(speechInfo);
        }
        else
        {
            // 指定文言がある？
            const found = this.searchSpecifyWord(speechInfo);
            if(found)
            {
                this.freeTextWithSpecifyWord(speechInfo);
            }
            else
            {
                this.freeTextWithoutSpecifyWord(speechInfo);
            }
        }
    }
    
    // 会話の内容に指定ワードが存在するかどうか
    private searchSpecifyWord(speechInfo: VoiceIO.ISpeechInfo): boolean
    {
        const handlerInput = this.getHandlerInput();
        
        const fullText = handlerInput.getFullConversationText();
        if(fullText === null)
        {
            speechInfo.appendInfo(this.getLanguage().error.general);
            throw new Error('searchSpecifyWord');
        }
        
        const found = this.getLanguage().specificWords.find(wordsGroup => 
        {
            const found_ = wordsGroup.keys.find(keyword =>
                {
                    if(fullText.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
                    {
                        Log.debug(`hit keyword ${keyword}`);
                        return true;
                    }
                    return false;
                });
            if(found_ !== undefined)
                return true;
            return false;
        });
        
        return found !== undefined;
    }
    
    private freeTextWithoutSpecifyWord(speechInfo: VoiceIO.ISpeechInfo)
    {
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsFreeWord);
        
        // 他にも何かあるか訊く
        blockAskExistsAnother(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    private freeTextWithSpecifyWord(speechInfo: VoiceIO.ISpeechInfo)
    {
        // もっと詳しく訊く
        blockAskMoreDetails(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    private async freeTextFellowHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        // fellow type記録
        const fullText = this.handlerInput.getFullConversationText();
        if(fullText !== null)
        {
            const db = this.getPersistantAttributes();
            await db.setFellowType(fullText);
        }
        
        // コンテンツ指定解除
        this.handlerInput.deleteGDFContents(contentsFreeWord);
        
        // お礼を言う
        blockThanks(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    /**
     * ----- INTNET: 旅行タイプ
     */
    public async travelTypeHandler(speechInfo: VoiceIO.ISpeechInfo)
    {
        const handlerInput = this.handlerInput;
        
        // コンテンツ指定削除
        handlerInput.deleteGDFContents(contentsTravelType);
        
        // 旅行タイプ
        const travelTypeSlot = handlerInput.getSlotResolutionValue('traveltype');
        if(travelTypeSlot === null)
        {
            speechInfo.appendInfo(this.getLanguage().repeat);
            return;
        }
        
        // 旅行タイプを記録
        const db = this.getPersistantAttributes();
        await db.setTravelType(travelTypeSlot.value);
        
        // 一緒に誰と来たか訊く
        blockAskFellowType(this.getHandlerInput(), this.getLanguage(), speechInfo);
    }
    
    /**
     * フォールバック
     */
    public async intentFallback(speechInfo: VoiceIO.ISpeechInfo)
    {
		// const sessionAttributes = SessionAttributes.order(this.getHandlerInput());
        // const phase = sessionAttributes.getPhase();
        // switch(phase)
        // {
        //     case QueryPhaseType.TravelType:
        //     case QueryPhaseType.Fellow:
        //         speechInfo.appendInfo(this.getLanguage().repeat);
        //         break;
        //     default:
        //         throw new Error('freeTextHandler phase error');
        // }
        
        const row = this.getHandlerInput().getFullConversationText();
        const text = row !== null? row: '---';
        Log.info(`--- [${this.getHandlerInput().getIntentName()}]: ${text}`);
        speechInfo.appendInfo(this.getLanguage().repeat);
    }
     
    /**
     * 継続モード
     */
    // public async ContinuousModeIntentExec(speechInfo: VoiceIO.ISpeechInfo): boolean
    // {
    //     // handler
    //     const handlerInput = this.handlerInput;
        
    //     const sessionAttribute = SessionAttributes.order(handlerInput);
    //     sessionAttribute.setContinuousMode(true);
        
    //     speechInfo.appendInfo(this.getLanguage().debugContinuousMode.start);
        
    //     return true;
    // }
    
    private generateUserId(): string
    {
        return `${generateRandomHexString(2)}-${generateRandomHexString(2)}-${generateRandomHexString(4)}-${generateRandomHexString(4)}`;
    }
    
    public getTextConvert(): VoiceIO.IReplaceText
    {
        return new Convert(this);
    }
}

/**
 * テキスト変換クラス
 */
class Convert implements VoiceIO.IReplaceText
{
    private lang: any;
    
    constructor(app: TravelVoiceApplication)
    {
        this.lang = app.getLanguage();
    }
    
    /**
     * トーク用テキストに変換
     * @param text 
     * @return 変換後のテキスト
     */
    convertSpeechFullText(text: string): string
    {
        return '<speak><prosody rate="' + this.lang.totalSpeedRate + '%">'
            + text.replace(/\[([^|]*)\|([^\]]*)\]/g, '$2')
            + '</prosody></speak>';
    }

    replaceText(text: string): string
    {
        let t: string = text;
        if(t.indexOf('{@greeting}') >= 0)
        {
            let greeting;
            const hour = dateTimeUtil.DateTime.current().hour();
            if (hour >= 4 && hour < 11)
                greeting = this.lang.greeting.morning;
            else
            if (hour >= 11 && hour < 18)
                greeting = this.lang.greeting.afternoon;
            else
                greeting = this.lang.greeting.evening;
            t = t.split('{@greeting}').join(greeting);
        }
        
        const ssmlSettings = this.lang.ssml_settings;
        if(ssmlSettings && ssmlSettings.replaceWords)
        {
            for(const replaceWord of ssmlSettings.replaceWords)
            {
                if(!replaceWord.word || !replaceWord.replace)
                    continue;
                
                if(replaceWord.word instanceof RegExp)
                    t = t.replace(new RegExp(replaceWord.word, 'g'), replaceWord.replace);
                else
                    t = t.split(replaceWord.word).join(replaceWord.replace);
            }
        }
        return t;
    }
}