import
{
	// dialogflow,
	BasicCard,
	// BrowseCarousel,
	// BrowseCarouselItem,
	Button,
	// Carousel,
	Image,
	// LinkOutSuggestion,
	// List,
	// MediaObject,
	Table,
	NewSurface,
	Suggestions,
	SimpleResponse,
	DialogflowConversation,
	SurfaceCapability,
	SignIn,
}
from 'actions-on-google';

import { SpeechInfo } from './gdf_speechInfo';
import { GDFResponse } from './dialogflow_type';
import { SpeechLanguageImage } from './gdf_interface_lang';
import { Log } from '../logs';
import { VoiceIO } from '../voice_io_interface';


// スピーチテキスト用オブジェクト
export const createSpeechInfo = (speechText: string|null=null, repromptText: string|null=null): SpeechInfo => 
{
	return new SpeechInfo(speechText, repromptText);
}

// simpleレスポンス作成
export const computeDialogflowResponse = async (conv: DialogflowConversation, speechInfo: SpeechInfo, convert: VoiceIO.IReplaceText) =>
{
	const data: any = conv.data;

	// repromptを保存
	const repromptText = speechInfo.getRepromptText();
	if(repromptText !== null && repromptText.length > 0)
	{
		data.reprompt = convert.replaceText(repromptText);
		data.suggestions = speechInfo.suggestions;
	}
	data.fallbackCount = 0;
	
	// speech 1
	const text = convert.replaceText(speechInfo.getSpeechText());
	const res = new SimpleResponse
    (
        {
            speech: await convert.convertSpeechFullText(text),
            text: SpeechInfo.getDisplayText(text),
        }
	);
	if(speechInfo.reprompt !== null && speechInfo.reprompt.length > 0)
		conv.ask(res);
	else
		conv.close(res);

	// // speech 2
	// const optText = speechInfo.getOptionalText();
	// if(optText !== null && optText.length > 0)
	// {
	// 	const optRes = new SimpleResponse
	// 	(
	// 		{
	// 			speech: await convert.convertSpeechFullText(optText),
	// 			text: SpeechInfo.getDisplayText(optText),
	// 		}
	// 	);
	// 	if(speechInfo.reprompt !== null && speechInfo.reprompt.length > 0)
	// 		conv.ask(optRes);
	// 	else
	// 		conv.close(optRes);
	// }

	// suggestions
	if(speechInfo.suggestions)
		conv.ask(new Suggestions(speechInfo.suggestions));

	// table
	if(speechInfo.table)
	{
		const table = speechInfo.table;
        const tableData: any =
        {
			dividers: table.dividers !== undefined? table.dividers: false,
			title: table.title,
			columns: table.columns !== undefined? table.columns: [],
			rows: table.rows,
        };
        
		if(table.button)
		{
			tableData.buttons =
				new Button(
				{
					title: table.button.title,
					url: table.button.url,
				});
		}
		
		if(speechInfo.reprompt !== null && speechInfo.reprompt.length > 0)
            conv.ask(new Table(tableData));
        else
            conv.close(new Table(tableData));
	}

	// basic card
	if(speechInfo.basic_card)
	{
		const basicCard = speechInfo.basic_card;
		const card: any = {}

		if(basicCard.text)
			card.text = basicCard.text;
		if(basicCard.title)
			card.title = basicCard.title;		
		if(basicCard.subtitle)
			card.subtitle = basicCard.subtitle;
		if(basicCard.button)
		{
			card.buttons =
				new Button(
					{
						title: basicCard.button.title,
						url: basicCard.button.url,
					});
		}
		
		let image: SpeechLanguageImage|null = null;
		if(basicCard.images && Array.isArray(basicCard.images))
		{
			const idx = Math.floor(Math.random() * Math.floor(basicCard.images.length));
			image = basicCard.images[idx];
		}
		else
		if(basicCard.image)
			image = basicCard.image;

		if(image)
		{
			card.image =
				new Image(
					{
						url: image.url,
						alt: image.alt,
					});
		}

		if(basicCard.display)
			card.display = basicCard.display;

		if(speechInfo.reprompt !== null && speechInfo.reprompt.length > 0)
            conv.ask(new BasicCard(card));
        else
            conv.close(new BasicCard(card));
	}
	return new GDFResponse();
}

/**
 * スクリーンを持っているデバイスを持っているかどうか
 */
export const hasScreenAvailableDevice= (conv: DialogflowConversation): boolean =>
{
	return conv.available.surfaces.capabilities.has
	(
		'actions.capability.SCREEN_OUTPUT'
	);
}

/**
 * このデバイスがスクリーンをもっているかどうか
 */
export const hasScreenThisDevice= (conv: DialogflowConversation): boolean =>
{
	return conv.surface.capabilities.has
	(
		'actions.capability.SCREEN_OUTPUT'
	);
}

export const computeSmartphoneNotify = async (conv: DialogflowConversation, speechInfo: SpeechInfo, convert: VoiceIO.IReplaceText): Promise<boolean> =>
{
	// チェック
	if(!speechInfo.speech || !speechInfo.notification)
		return false;

	// スマートフォンに送信
	if(!hasScreenAvailableDevice(conv))
		return false;

	const context = SpeechInfo.getDisplayText(await convert.replaceText(speechInfo.speech));					// 遷移前の画面で表示する内容
	const notification = SpeechInfo.getDisplayText(await convert.replaceText(speechInfo.notification));		// スマホへのプッシュ通知の内容
	const capabilities = ['actions.capability.SCREEN_OUTPUT'] as [SurfaceCapability]// 転送先デバイスの選択

	conv.ask(new NewSurface({ context, notification, capabilities }));
	return true;
}

export const signIn = (conv: DialogflowConversation, message?: string) =>
{
	conv.ask(new SignIn(message));
}


// repormptデータを利用して再度質問する
export const computeSimpleRepromptResponse = async (conv: DialogflowConversation, appendMessage:string='', convert: VoiceIO.IReplaceText): Promise<boolean> =>
{
	const data: any = conv.data;

	if(!data.reprompt)
		return false;
	
	if(++data.fallbackCount <= 5)
	{
		const text = (await convert.replaceText(appendMessage)) + data.reprompt;
		const res = new SimpleResponse
		(
			{
				speech: await convert.convertSpeechFullText(text),
				text: SpeechInfo.getDisplayText(text),
			}
		);
		
		conv.ask(res);
		
		if(data.suggestions)
			conv.ask(new Suggestions(data.suggestions));
	}
	else
	{
		const text = await convert.replaceText('');
		const res = new SimpleResponse
		(
			{
				speech: await convert.convertSpeechFullText(text),
				text: SpeechInfo.getDisplayText(text),
			}
		);
		conv.close(res);		
		Log.debug(JSON.stringify(res));
	}

	return true;
}

// サンプル - BasicCard送信
export const computeSampleBasicCardResponse = (conv: DialogflowConversation) =>
{
	conv.ask('This is a basic card example.');

	conv.ask(new BasicCard({
		text: `This is a basic card.  Text in a basic card can include "quotes" and
		most other unicode characters including emoji 📱.  Basic cards also support
		some markdown formatting like *emphasis* or _italics_, **strong** or
		__bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
		things like line  \nbreaks`, // Note the two spaces before '\n' required for
																 // a line break to be rendered in the card.
		subtitle: 'This is a subtitle',
		title: 'Title: this is a title',
		buttons: new Button({
			title: 'This is a button',
			url: 'http://kalkan.jp/products/kitten/',
		}),
		image: new Image({
			url: 'https://www.isao.co.jp/img/top_goalous_key.png',
			alt: 'Image alternate text',
		}),
		display: 'CROPPED',
	}));
}

// サンプル - Tableレスポンス
export const computeSampleTableResponse = (conv: DialogflowConversation) =>
{
    conv.ask('This is a table with all the possible fields.')
    conv.close
    (
        new Table(
        {
            title: 'Table Title',
            subtitle: 'Table Subtitle',
            columns: [
                {
                header: 'header 1',
                align: 'CENTER',
                },
                {
                header: 'header 2',
                align: 'LEADING',
                },
                {
                header: 'header 3',
                align: 'TRAILING',
                },
            ],
            rows: [
                {
                cells: ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
                dividerAfter: false,
                },
                {
                cells: ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
                dividerAfter: true,
                },
                {
                cells: ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
                },
            ],
            buttons: new Button(
                {
                title: 'Button Text',
                    url: 'http://kalkan.jp/products/kitten/',
                }),
        }
        )
    )
}

// サンプル - NewSurface
export const computeSampleNewSurfaceResponse = (conv: DialogflowConversation) =>
{
	const optRes = new SimpleResponse
	(
		{
			speech: 'ははは',
			text: 'ほほほ',
		}
	);
	conv.ask(optRes);
	const context = 'Sure, I have some sample images for you.';
	const notification = 'Sample Images';
	const capabilities = ['actions.capability.SCREEN_OUTPUT'] as [SurfaceCapability];
	conv.ask(new NewSurface({context, notification, capabilities }));
}
