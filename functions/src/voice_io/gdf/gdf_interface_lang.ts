export interface SpeechLanguageButton
{
	title: string;
	url: string
}
export interface SpeechLanguageImage
{
	url: string
	alt: string;
}

export interface SpeechLanguageDataTable
{
	dividers?: boolean;
	title: string;
	image?: SpeechLanguageImage;
	subtitle?: string;
	columns: Array<string>;
	rows: Array<Array<string>>;
	button?: SpeechLanguageButton;
}

export interface SpeechLanguageDataBasicCard
{
	title?: string;
	subtitle?: string;
	text?: string;
	image?: SpeechLanguageImage;
	images?: Array<SpeechLanguageImage>;
	button?: SpeechLanguageButton;
	display?: string;
}

export interface SpeechLanguageData 
{
    text?: string;
	reprompt?: string;
	suggestions?: Array<string>;
	basic_card?: SpeechLanguageDataBasicCard
	table?: SpeechLanguageDataTable;
	notification?: string;
}

export interface SpeechLanguageReplaceType
{
	is_regex: boolean,
	word?: string | RegExp,
	regex?: RegExp,
	replace: string,
}

export interface SpeechLanguageStandardCard
{
    title: string,
    message: string,
    smallImage?: string,
    largeImage?: string,
}