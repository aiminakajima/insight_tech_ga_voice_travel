import { VoiceIO } from '../voice_io/voice_io_interface';
import { SpeechLanguageData } from '../voice_io/gdf/gdf_interface_lang';

export interface LanguageInfo
{
    // バージョン
    ver: string;
    
    // ヘルプ
    help: SpeechLanguageData;
    
    // ストップ
    stop: SpeechLanguageData;
    
    // 最初の挨拶
    welcome: SpeechLanguageData;
    
    // agreement
    block_agreement: SpeechLanguageData;
    block_disagreement: SpeechLanguageData;
    
     // 挨拶
    greeting:
    {
        morning: string,
        afternoon: string,
        evening: string,
    }
    
    ask_details: SpeechLanguageData,
    ask_exists_another: SpeechLanguageData,
    ask_more_details: SpeechLanguageData,
    ask_travel_type: SpeechLanguageData,
    ask_fellow_type: SpeechLanguageData,
    thanks: SpeechLanguageData,
    repeat: SpeechLanguageData,
    
    // 指定ワード
    specificWords:
    {
        name: string,
        keys: string[]
    }[],
    
    error:
    {
        general: SpeechLanguageData,
    },
    
    // SSML設定
    ssml_settings: VoiceIO.SSMLSettings,
    
    // 継続モード
    debugContinuousMode:
    {
        start: SpeechLanguageData
        reprompt: string,
    }
}
