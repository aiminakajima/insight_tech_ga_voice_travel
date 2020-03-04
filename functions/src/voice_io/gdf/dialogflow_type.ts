import { VoiceIO } from '../voice_io_interface';
import { isNullOrUndefined } from '../utils';
import { DialogflowConversation, Contexts } from 'actions-on-google';
import { computeDialogflowResponse, computeSimpleRepromptResponse } from './gdf_speechResponse';
import { SpeechInfo } from './gdf_speechInfo';
import { Log } from '../logs';
import { Config } from '../config';
import { GDFProcessEnv } from './gdf_process_env';

export type DialogflowConversationContext = DialogflowConversation<unknown, unknown, Contexts>;

export class GoogleHandlerInput implements VoiceIO.IHandlerInput
{
    private config: VoiceIO.IConfig
    private conv: DialogflowConversation;

    constructor(conv: DialogflowConversationContext)
    {
        this.conv = conv as DialogflowConversation;
        this.config = new Config(new GDFProcessEnv());
    }
    
    getConfig(): VoiceIO.IConfig
    {
        return this.config;
    }
    
    getIntentName(): string
    {
        return this.conv.intent;
    }
    
    getIntentInfo(): any
    {
        return this.conv.parameters;
    }
    
    getLocale(): string
    {
        return this.conv.user.locale;
    }
    
    getFullConversationText(): string | null
    {
        const row = !isNullOrUndefined(this.conv.input.raw)? this.conv.input.raw: null;;
        return row;
    }
    
    async debugSessionRequest(): Promise<void>
    {
        const conv = this.conv;
        
        const row = conv.input.raw? conv.input.raw: '---';
        Log.info(`--- [${this.getIntentName()}] (${row})`);
        Log.debug(`- parameters: ${JSON.stringify(conv.parameters)}`);
    }
    
    async computeResponse(speechInfo: VoiceIO.ISpeechInfo, convert: VoiceIO.IReplaceText): Promise<VoiceIO.IResponse>
    {
        const si = speechInfo as unknown as SpeechInfo;
        return await computeDialogflowResponse(this.conv, si, convert)
    }
    
    async computeRepromptRepeatResponse(appendText:string|null, convert: VoiceIO.IReplaceText)
    {
        return await computeSimpleRepromptResponse(this.conv, appendText? appendText: '', convert);
    }
    
    /**
     * セッション情報取得
     */
    getSessionAttribute(): any
    {
        if(!this.conv.data)
            this.conv.data = {};
        return this.conv.data;
    }
    
    setGDFContents(contentsName: string): void
    {
        this.conv.contexts.set(contentsName, 99);
    }
    
    deleteGDFContents(contentsName: string): void
    {
        this.conv.contexts.delete(contentsName);
    }
    
    getUserAccessToken(): string|null
    {
        const token = this.conv.user.access.token;
        return !isNullOrUndefined(token)? token: null;
    }
    
    private parseSlotResolutionValue = (parameters: any, slotName: string): VoiceIO.SlotResultValue[] | null=>
    {
        const list: VoiceIO.SlotResultValue[] = [];

        if(!isNullOrUndefined(parameters))
        {
            const slotValue = parameters[slotName];
            if(!isNullOrUndefined(slotValue))
            {
                let valid = true;
                if(typeof slotValue === 'string' && slotValue.length <= 0)
                    valid = false;
                
                list.push(
                    {
                        slotName: slotName,
                        value: slotValue,
                        id: valid? slotValue: null,
                    }
                );
            }
        }
        return list;
    }
    
    private getSessionSlotResolutionValue(slotName: string): VoiceIO.SlotResultValue[] | null
    {
        const attribute = this.getSessionAttribute();
        if(isNullOrUndefined(attribute.requestEnvelope) || isNullOrUndefined(attribute.requestEnvelope))
            return null;
        return this.parseSlotResolutionValue(attribute.requestEnvelope, slotName);
    }
    
    getSlotResolutionValue(slotName: string): VoiceIO.SlotResultValue | null
    {
        const slotsResult = this.parseSlotResolutionValue(this.conv.parameters, slotName);
        if(slotsResult !== null && slotsResult.length > 0)
            return slotsResult[0];
        const sessionSlotResult = this.getSessionSlotResolutionValue(slotName);
        if(sessionSlotResult !== null && sessionSlotResult.length > 0)
            return sessionSlotResult[0];
        else
            return null;
    }
    
    getAllSlotResolutionValue(slotName: string): VoiceIO.SlotResultValue[] | null
    {
        const result = this.parseSlotResolutionValue(this.conv.parameters, slotName);
        if(result !== null)
            return result;
        else
            return this.getSessionSlotResolutionValue(slotName);
    }
}

export class GDFResponse implements VoiceIO.IResponse
{
    
}
