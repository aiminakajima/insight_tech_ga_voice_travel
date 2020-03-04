import { isNullOrUndefined } from './utils';
import { VoiceIO } from './voice_io_interface';
import { GDFProcessEnv } from './gdf/gdf_process_env';

// ローカルデバッグ
const _isDebug = true;
let _isEnvDebug = false;

const isDialogflowDebug = true;

// ダミーAPI
const isDummyResoinse = false;

/**
 * コンフィグクラス
 */
export class Config implements VoiceIO.IConfig
{
    private processEnv: VoiceIO.ProcessEnv;
    
    // コンストラクタ
    constructor(processEnv: VoiceIO.ProcessEnv)
    {
        this.processEnv = processEnv;
    }
    
    // 環境変数のDEBUGフラグを取得しキャッシュする
    public updateEnvDebug()
    {
        const app = this.processEnv.get<any>('app');
        if(!isNullOrUndefined(app) && !isNullOrUndefined(app.debug))
            _isEnvDebug = app.debug.toLowerCase() === 'true'? true: false;
    }
    
    // デバッグ関連フラグ
    public isDebug(): boolean
    {
        return _isDebug && _isEnvDebug;
        return true;
    }
    
    // ダイアログフローのデバッグ
    public isDialogflowDebug()
    {
        return this.isDebug() && isDialogflowDebug;
    }
    
    // ダミーレスポンス
    public isDummyResponse()
    {
        return this.isDebug() && isDummyResoinse;
    }
    
    // DBの後ろにつける識別子
    public postAppId(): string
    {
        return '';
    }
    
    // サーバータイプ
    public isProductionServerType(): boolean
    {
        const tlsc = this.processEnv.get<any>('tlsc');
        if(!isNullOrUndefined(tlsc) && !isNullOrUndefined(tlsc.api_server_type))
            return tlsc.api_server_type.toLowerCase() === 'production'? true: false;
        return false;
    }
}


export const config = new Config(new GDFProcessEnv());
