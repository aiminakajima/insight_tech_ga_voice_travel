import * as express from 'express';
import * as functions from 'firebase-functions';
import { PersistantAttributes } from './persistant_attributes';
import { isNullOrUndefined } from './voice_io/utils';


const typeJson = 'json';
const typeCSV= 'csv';
const typeTSV= 'tsv';

export const collect = async (req: express.Request, res: express.Response) =>
{
    if(!secureCheck(req, res))
        return;
    
    const persistantAttributes = PersistantAttributes.order();
    const data = await persistantAttributes.getAllUsersData();
    
    let type = 'json';
    if(!isNullOrUndefined(req.query.type))
        type = req.query.type;
    
    switch(type)
    {
        case typeJson:
            convertJsonResponse(res, data);
            break;
        case typeCSV:
            convertCsvResponse(res, data);
            break;
        case typeTSV:
            convertTsvResponse(res, data);
            break;
        default:
            unknownTypeResponse(res);
            break;
    }
}

/**
 * API keyの確認
 * @param req 
 */
const validiateSecurityApiKey = (req: express.Request): boolean =>
{
	const functionConfig = functions.config();
	if(functionConfig.app === undefined
    || functionConfig.app.security === undefined
	|| functionConfig.app.security.api_key === undefined
	|| functionConfig.app.security.api_key !== req.header('Api-Key'))
		return false;
	return true;
}

/**
 * セキュリティチェック
 */
const secureCheck = (req: express.Request, res: express.Response): boolean =>
{
    if(!validiateSecurityApiKey(req))
	{
		res.status(500).send('Invalid API-Key');
		return false;
    }
    
    return true;
}

/**
 * JSON形式のレスポンス
 * @param res レスポンスオブジェクト
 * @param data データ
 */
const convertJsonResponse = (res: express.Response, data: any): void =>
{
    res.status(200)
        .contentType('text/json')
        .send({ result: data });
}

/**
 * CSV形式のレスポンス
 * @param res レスポンスオブジェクト
 * @param data データ
 */
const convertCsvResponse =(res: express.Response, data: any): void =>
{
    const split = ',';
    const csv = convertCsv(data, split)
    
    res.status(200)
        .contentType('text/csv')
        .send(csv);
}

/**
 * TSV形式のレスポンス
 * @param res レスポンスオブジェクト
 * @param data データ
 */
const convertTsvResponse = (res: express.Response, data: any): void =>
{
    const split = '\t';
    const csv = convertCsv(data, split)
    
    res.status(200)
        .contentType('text/tab-separated-values')
        .send(csv);
}

/**
 * 不明形式のレスポンス
 * @param res レスポンスオブジェクト
 */
const unknownTypeResponse = (res: express.Response): void =>
{
    res.status(501)
        .contentType('text/json')
        .send({ result: 'unknown type' });
}

/**
 * csv変換
 * @param data データ
 * @param split 分離文字
 */
const convertCsv = (data: any, split: string): string =>
{
    const cr = '\r\n';

    let csv = '';
    for(const id in data)
    {
        csv += id + split;
        
        const val:any = data[id];
        if(isNullOrUndefined(val['original_lang']) || isNullOrUndefined(val['timestamp']))
            continue;
        
        const original_lang = val['original_lang'];
        csv += original_lang + split;
        csv += val['timestamp'] + split;
        
        const text = !isNullOrUndefined(val[original_lang])? val[original_lang]: '';
        csv += `"${text}"${split}`;
        
        const ja_jp = !isNullOrUndefined(val['ja-JP'])? val['ja-JP']: '-';
        csv += `"${ja_jp}"${split}`;
        
        const travelType = !isNullOrUndefined(val['travel_type'])? val['travel_type']: '';
        csv += travelType + split;
        
        const fellowType = !isNullOrUndefined(val['fellow'])? val['fellow']: '';
        csv += fellowType + split;
        
        csv += cr;
    }
    
    return csv;
}
