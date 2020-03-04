// 追加できるデータタイプ
import { SpeechLanguageData, SpeechLanguageDataTable, SpeechLanguageDataBasicCard } from './gdf_interface_lang';
import { VoiceIO } from '../voice_io_interface';
import { isNullOrUndefined } from '../utils';


// テキスト変換
const _getText = (data: any): string =>
{
	if(Array.isArray(data))
	{
		const idx = Math.floor(Math.random() * Math.floor(data.length));
		return data[idx];
	}
	else
	// if(utils.objectTypeOf(data) === 'string')
	{
		return data;
	}
}

/**
 * スピーチ情報クラス
 */
export class SpeechInfo implements VoiceIO.ISpeechInfo
{
    /**
     * コンストラクタ
     * @param speechText トークテキスト
     * @param repromptText reporompt用テキスト
     */
	public constructor(speechText: string|null = null, repromptText: string|null = null)
	{
		const st = _getText(speechText);
		const rt = _getText(repromptText);

		this.speech = (st? st: '');
		this.speech_opt = null;
		this.reprompt = (rt? rt: null);
		this.suggestions = null;
	}

    /**
	 * ランゲージ情報を元にスピーチテキストを設定・追加
	 * @param data 
	 * @param isSecond 
	 */
	public appendInfo(data: SpeechLanguageData, isSecond?: boolean): void
	{
		// テーブルが存在する？
		if(data.table)
			this.table = JSON.parse(JSON.stringify(data.table));
		
		// Basic Cardが存在する？
		if(data.basic_card)
			this.basic_card = JSON.parse(JSON.stringify(data.basic_card));
		
		// テキストデータ
		if(data.text)
		{
			const st = _getText(data.text);
			
			if(!isSecond)
			{
				if(!this.speech)	this.speech = '';
				this.speech += st;
			}
			else
			{
				if(!this.speech_opt)	this.speech_opt = '';
				this.speech_opt += st;
			}
		}

		if(data.reprompt)
			this.reprompt = data.reprompt;
		
		if(data.suggestions)
			this.suggestions = data.suggestions;
		
		if(data.notification)
			this.notification = data.notification;
	}

	public setRepromptText(text: string): void
	{
		this.reprompt = text;
	}
	
	/**
	 * 改行を追加
	 * @param isSecond 
	 */
	public appendCR(isSecond?: boolean): void
	{
		if(!isSecond)
			this.speech += '\n';
		else
			this.speech_opt += '\n';
	}
	
	public appendSuggestion(text: string): void
	{
		if(isNullOrUndefined(this.suggestions))
			this.suggestions = [];
		this.suggestions.push(text);
	}
	
    public replace(searchValue: string, relaceValue: string): void
    {
        if(this.speech)
			this.speech = this.speech.replace(searchValue, relaceValue);
		if(this.speech_opt)
            this.speech_opt = this.speech_opt.replace(searchValue, relaceValue);
        if(this.reprompt)
            this.reprompt = this.reprompt.replace(searchValue, relaceValue);
	}
	
	speech: string;
	speech_opt: string|null;
	reprompt: string|null;
	suggestions: Array<string>|null;
	table?: SpeechLanguageDataTable;
	basic_card?: SpeechLanguageDataBasicCard;
	notification?: string;

	/**
	 * 表示テキストを変換する
	 * @param conv 
	 */
	public getSpeechText(): string
	{
		return this.speech;
	}

	public getRepromptText(): string|null
	{
		return this.reprompt;
	}
	
	/**
	 * 表示用テキストに変換
	 * @param text 
	 * @return 変換後のテキスト
	 */
	static getDisplayText(text: string): string
	{
		return text.replace(/\[([^|]*)\|([^\]]*)\]/g, '$1')
					.replace(/<[^>]+\/>/g, '')	// <xxxx />
					.replace(/<[^>]+>/g, '');	// <xxxx> or </xxxx>
	}
}
