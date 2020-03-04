import * as Translate from '@google-cloud/translate';
import { isNullOrUndefined } from './voice_io/utils';

/**
 * 翻訳API
 */
export class TranslateApi
{
    private client: Translate.v3.TranslationServiceClient;
    
    constructor()
    {
        this.client = new Translate.v3.TranslationServiceClient();
    }   
    
    public async translate(fromLang: string, toLang: string, text: string): Promise<string[]|null>
    {
        const request = {
            parent: this.client.locationPath('travel-voice', 'global'),
            contents: [text],
            mimeType: 'text/plain', // mime types: text/plain, text/html
            sourceLanguageCode: fromLang,
            targetLanguageCode: toLang,
          };
          
        const [response] = await this.client.translateText(request);
        if(!isNullOrUndefined(response) && !isNullOrUndefined(response.translations))
        {
            const result = new Array();
            for (const translation of response.translations)
            {
                if(!isNullOrUndefined(translation.translatedText))
                    result.push(translation.translatedText);
            }
            return result;
        }
        return null;
    }
}

