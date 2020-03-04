import * as fs from 'fs';
import * as crypto from 'crypto';


/**
 * バージョン番号取得
 */
export const readCodeVersion = (): number =>
{
    try
    {
        const versionFileName = './version.txt';

        const ver = fs.readFileSync(versionFileName, {encoding: 'utf-8'});
        return parseInt(ver);
    }
    catch(err)
    {
        return 0;
    }
}


const __toString = Object.prototype.toString;

/**
 * オブジェクトタイプ取得
 * @param obj 対象オブジェクト
 */
export const objectTypeOf = (obj: any): string =>
{
	return __toString.call(obj).slice(8, -1).toLowerCase();
}

/**
 * オブジェクトクローン
 * @param obj オブジェクト
 */
export const objectClone = <T>(obj: T): T =>
{
    return JSON.parse(JSON.stringify(obj));
}

/**
 * null/undefined判定
 */
export const isNullOrUndefined = (obj: any): obj is null | undefined =>
{
    if(obj === undefined || obj === null)
        return true;
    return false;    
}

/**
 * UTF8のBOMがあれば削除する
 */
export const removeUTF8BOM = (buff: Buffer): Buffer =>
{
    if(buff[0] === 0xEF && buff[1] === 0xBB && buff[2] === 0xBF)
        return buff.slice(3);
    return buff;
}

/**
 * スリープ
 * @param milliseconds ミリ秒
 */
export const sleep = async (milliseconds: number): Promise<NodeJS.Timeout> =>
{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * ランダムな16進数文字列を生成
 * @param length 長さ
 */
export const generateRandomHexString = (length: number): string =>
{
    return crypto.randomBytes(length).toString('hex');
}

/**
 * md5ベースの特殊ハッシュ
 * @param message 
 */
export const getOriginalHash = (message: string) => 
{
    let hashMessage = message;

    const hashsum1 = crypto.createHash('sha256');
    hashsum1.update(hashMessage);
    const hash1 = hashsum1.digest('hex')

    const hashsum2 = crypto.createHash('sha512');
    hashsum2.update(hashMessage);
    const hash2 = hashsum2.digest('hex')

    const message_ = hash1 + ':' +  hash2 + ':' + message;
    
    const hashsum3 = crypto.createHash('sha1');
    hashsum3.update(message_);
    hashMessage = hashsum3.digest('hex');
    return hashMessage;
}

/**
 * 文字列の中のXMLを削除する
 */
export const removeXmlTag = (xml: string) =>
{
    return xml.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
}