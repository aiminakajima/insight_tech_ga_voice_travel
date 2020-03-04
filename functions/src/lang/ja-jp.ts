import { LanguageInfo } from './language_info';

export const ja_jp: LanguageInfo =
{
    // バージョン
    ver: '1',
     
    // ヘルプ
    help:
    {
        text:           'このアプリは、みなさんの旅行中に起こったトラブルや困りごとを収集して、旅行業界の改善に活用されます。'
    },
    
    // ストップ
    stop:
    {
        text:           'はい。終了します。'
    },
    
    welcome:
    {
        text:           '{@greeting}。'
    },
    
    // agreement
    block_agreement:
    {
        text:           'このアプリで収集した情報は全日空商事株式会社が適切に管理し、第三者には展開いたしません。'
                    +   'また、お客様の音声データは録音せず、テキスト化したうえで利用します。'
                    +   'この注意事項に同意し、利用を開始しますか？'
                    ,
        reprompt:       '注意事項に同意し、利用を開始しますか？'
                    ,
        suggestions: [ 'はい', 'いいえ' ]
    },
    block_disagreement:
    {
        text:           '承知しました。最後まで良い旅をお過ごしください！'
    },
    
    // 挨拶
    greeting:
    {
        morning:        'おはようございます',
        afternoon:      'こんにちわ',
        evening:        'こんばんわ',
    },
    
    ask_details:
    {
        text:           'ホテル、レンタカー、レストランなど、旅行中に何か困ったことあありましたか？',
        reprompt:       '旅行中に何か困ったことがありましたか？',
    },
    ask_exists_another:
    {
        text:           'ありがとうございます。他にもありますか？',
        reprompt:       '他にも困ったことはありましたか？',
        suggestions:    [ 'はい', 'いいえ' ]
    },
    ask_more_details:
    {
        text:           'そうなんですね。もう少し詳しく教えてください。',
        reprompt:       'もう少し詳しく教えてください。'
    },
    ask_travel_type:
    {
        text:           'ちなみに今回は団体旅行ですか？　個人旅行ですか？',
        reprompt:       '団体旅行ですか？　個人旅行ですか？',
        suggestions:    [ '団体旅行', '個人旅行' ]
    },
    ask_fellow_type:
    {
        text:           '誰と一緒ですか？',
        reprompt:       '誰と一緒ですか？'
    },
    thanks:
    {
        text:           'ご協力ありがとうございました。'
                    +   '最後までいい旅行をお過ごしください！'
                    ,
    },
    repeat:
    {
        text:           'すみません、もう一度お願いします。',
        reprompt:       'もう一度お願いします。'
    },
    
    // 指定ワード
    specificWords:
    [
        {
            name: 'hotel',
            keys:
            [
                'ホテル', '旅館', '宿屋', 'モーテル', 'リゾート'
            ]
        },
        {
            name: 'restaurant',
            keys:
            [
                'レストラン', 'カフェ', 'コーヒーショップ', 'ディナー', 'ダイニングルーム', '宿屋', '食事'
            ]
        },
        {
            name: 'car_rental',
            keys:
            [
                'レンタカー', 'ハイヤー', 'タイムズ',
            ]
        },
        {
            name: 'shopping',
            keys:
            [
                'ショッピング', '買い物', '免税店', 'クーポン',
            ]
        },
        {
            name: 'baggage',
            keys:
            [
                'スーツケース', '買い物', '免税店', 'クーポン',
            ]
        },
        {
            name: 'place',
            keys:
            [
                'イオンモール', 'パルコ', 'アクアリウム', '水族館',
            ]
        },
    ],
    
    error:
    {
        general: { text: 'エラーが発生しました。', }
    },
    
    // SSML設定
    ssml_settings:
    {
        totalSpeedRate: 100,
        replaceWords:
        [
            {
                word: '。',
                replace: '。<break time="0.3s" />'
            },
        ],
    },
    
    // 継続モード
    debugContinuousMode:
    {
        start:
        {
            text:       '継続モードになりました。',
        },
        reprompt:       '次のコマンドをどうぞ'
    },
};
