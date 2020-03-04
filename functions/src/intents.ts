import { dialogflow } from 'actions-on-google';
import { DialogflowConversationContext, GoogleHandlerInput } from './voice_io/gdf/dialogflow_type';
// import { config } from './voice_io/config';
import { Log } from './voice_io/logs';
import { SpeechInfo } from './voice_io/gdf/gdf_speechInfo';
import { VoiceIO } from './voice_io/voice_io_interface';
import { TravelVoiceApplication } from './application';
import { isNullOrUndefined } from './voice_io/utils';
import { SessionAttributes } from './session_attributes';
import { QueryPhaseType } from './enums';

export const LAUNCH_INTENT = 'Default Welcome Intent';
// export const DEFAULT_FALLBACK_INTENT = 'Default Fallback Intent';
export const POSITIVE_INTENT = 'PositiveIntent';
export const NEGATIVE_INTENT = 'NegativeIntent';
export const FREE_TEXT_INTENT = 'FreeTextIntent';
export const TRAVEL_TYPE_INTENT = 'TravelTypeIntent';
export const REPEAT_INTENT = 'RepeatIntent';
export const HELP_INTENT = 'HelpIntent';
export const STOP_INTENT = 'StopIntent';


// dialogflow
const dialogflowApp = dialogflow({ debug: true/*config.isDialogflowDebug()*/ });

/**
 * 例外発生時
 * @param inputHandler 
 * @param speechInfo 
 * @param error 
 */
const errorHandler = async (handlerInput: GoogleHandlerInput, speechInfo: SpeechInfo, error: Error): Promise<void> =>
{
    Log.error('[ErrorHandler] ' + error);
	
	// app
	const app = new TravelVoiceApplication(handlerInput);

    // まだトークテキストが何も入っていない？
    const s = speechInfo.getSpeechText();
    if(s.length <= 0)
    {
        // インテント不明エラーを話す
        speechInfo.appendInfo(app.getLanguage().error.general);
        // speechInfo.setRepromptText(await speechInfo.getSpeechText());
        Log.info(`e: Unknown intent`);
        await handlerInput.computeRepromptRepeatResponse(speechInfo.getSpeechText(), app.getTextConvert());
    }
    else
    {
        await handlerInput.computeResponse(speechInfo, app.getTextConvert());
    }
}


type IntentCheckFunctionType = (app: TravelVoiceApplication, speechInfo: SpeechInfo) => boolean;
type IntentExecFunctionType = (app: TravelVoiceApplication, speechInfo: SpeechInfo) => void | Promise<void>;
type IntentResponseFunctionType = (app: TravelVoiceApplication, handlerInput: GoogleHandlerInput, speechInfo: SpeechInfo) => Promise<VoiceIO.IResponse>;

const addIntentToDialogflowApp = (
	intentName: string,
	check: IntentCheckFunctionType | null,
	exec: IntentExecFunctionType,
	response: IntentResponseFunctionType | null): void =>
{
	_addIntentToDialogflowApp(intentName, true, check, exec, response);
}

/**
 * dialogflowにインテントを設定する
 * @param intentName 
 * @param check 
 * @param exec 
 * @param response 
 */
const _addIntentToDialogflowApp = (
	intentName: string,
	needValidiation: boolean,
	check: IntentCheckFunctionType | null,
	exec: IntentExecFunctionType,
	response: IntentResponseFunctionType | null): void =>
{
	dialogflowApp.intent(intentName, async (conv: DialogflowConversationContext) =>
	{
		const handlerInput = new GoogleHandlerInput(conv);
		const app = new TravelVoiceApplication(handlerInput);
		const speechInfo = new SpeechInfo();
		
		try
		{
			await app.intentPrologue();
			if(needValidiation)
				app.commonValidiation(speechInfo);

			if(check !== null && !check(app, speechInfo))
				return;
			
			await exec(app, speechInfo);
			
			if(SessionAttributes.order(handlerInput).getContinuousMode() && isNullOrUndefined(speechInfo.reprompt))
				speechInfo.reprompt = app.getLanguage().debugContinuousMode.reprompt;
			
			if(isNullOrUndefined(response))
				return await handlerInput.computeResponse(speechInfo, app.getTextConvert());
			else
				return await response(app, handlerInput, speechInfo);
		}
		catch(e)
		{
			return errorHandler(handlerInput, speechInfo, e);
		}
		finally
		{
			app.intentEpilogue();
		}
	});
}

/**
 * Welcome Intent
 */
addIntentToDialogflowApp
(
	LAUNCH_INTENT,
	null,
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.intentLaunchRequestHandler(speechInfo);
	},
	null,
);

/**
 * Yes/Positive Intent
 */
addIntentToDialogflowApp
(
	POSITIVE_INTENT,
	(app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		const sessionAttributes = SessionAttributes.order(app.getHandlerInput());
		const phase = sessionAttributes.getPhase();
		if(phase === QueryPhaseType.Agreement
		|| phase === QueryPhaseType.ExistsAnother)
			return true;
		return false;
	},
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.positiveHandler(speechInfo);
	},
	null
);

/**
 * No/Negative Intent
 */
addIntentToDialogflowApp
(
	NEGATIVE_INTENT,
	(app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		const sessionAttributes = SessionAttributes.order(app.getHandlerInput());
		const phase = sessionAttributes.getPhase();
		if(phase === QueryPhaseType.Agreement
		|| phase === QueryPhaseType.FreeContents
		|| phase === QueryPhaseType.ExistsAnother
		|| phase === QueryPhaseType.TellmeDetails)
			return true;
		return false;
	},
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.negativeHandler(speechInfo);
	},
	null
);

/**
 * Stop Intent
 */

addIntentToDialogflowApp
(
	STOP_INTENT,
	null,
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.stopHandler(speechInfo);
	},
	null
);

/**
 * Help Intent
 */
addIntentToDialogflowApp
(
	HELP_INTENT,
	null,
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.helpHandler(speechInfo);
	},
	async (app: TravelVoiceApplication, handlerInput: GoogleHandlerInput, speechInfo: SpeechInfo) =>
	{
        return await handlerInput.computeRepromptRepeatResponse(speechInfo.getSpeechText(), app.getTextConvert());
	}
);

/**
 * Repeat Intent
 */
addIntentToDialogflowApp
(
	REPEAT_INTENT,
	null,
	(app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		// nothing
	},
	async (app: TravelVoiceApplication, handlerInput: GoogleHandlerInput, speechInfo: SpeechInfo) =>
	{
        return await handlerInput.computeRepromptRepeatResponse(speechInfo.getSpeechText(), app.getTextConvert());
	}
);

/**
 * Fall back
 */
dialogflowApp.fallback(async (conv: DialogflowConversationContext) =>
{
	const handlerInput = new GoogleHandlerInput(conv);
	const app = new TravelVoiceApplication(handlerInput);
	const speechInfo = new SpeechInfo();
	
	await app.intentFallback(speechInfo);
	await handlerInput.computeRepromptRepeatResponse(speechInfo.getSpeechText(), app.getTextConvert());
});

addIntentToDialogflowApp
(
	FREE_TEXT_INTENT,
	null,
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.freeTextHandler(speechInfo);
	},
	null,
);

addIntentToDialogflowApp
(
	TRAVEL_TYPE_INTENT,
	null,
	async (app: TravelVoiceApplication, speechInfo: SpeechInfo) =>
	{
		await app.travelTypeHandler(speechInfo);
	},
	null,
);



// dialogflow
export const getDialogflowApp = (): any =>
{
    return dialogflowApp;
}