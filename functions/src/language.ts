import { DialogflowConversation } from 'actions-on-google';
import { LanguageInfo } from './lang/language_info';

import { ja_jp } from './lang/ja-jp';
import { en_us } from './lang/en_us';

// convから言語情報を取得
export const get = (conv: DialogflowConversation): LanguageInfo  =>
{
    return getWithLocale(conv.user.locale);
}

// localeから言語情報を取得
export const getWithLocale = (locale: string): LanguageInfo  =>
{
    if(locale === 'ja-JP')
        return ja_jp;
    if(locale === 'en-US')
        return en_us;
    if(locale === 'zh-TW')
        return en_us;
    
    return en_us;
}
