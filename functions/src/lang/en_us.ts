import { LanguageInfo } from './language_info';

export const en_us: LanguageInfo =
{
    // バージョン
    ver: '1',
     
    // ヘルプ
    help:
    {
        text:           'This app collects the troubles and troubles that occurred during your travel and is used to improve the travel industry.'
    },
    
    // ストップ
    stop:
    {
        text:           'Yes. It\'s finished.'
    },
    
    welcome:
    {
        text:           '{@greeting}。'
    },
    
    // agreement
    block_agreement:
    {
        text:           'Information collected by this app is properly managed by ANA, and will not be deployed to third parties.'
                    +   'Also, your voice data will not be recorded, but will be converted to text before use.'
                    +   'Do you agree with these notes and start using?'
                    ,
        reprompt:       'Do you agree with these notes and start using?'
                    ,
        suggestions:    [ 'Yes', 'No' ]
    },
    block_disagreement:
    {
        text:           'Understand. Enjoy rest of your journey!'
    },
    
    // 挨拶
    greeting:
    {
        morning:        'Good monrning',
        afternoon:      'Good afternoon',
        evening:        'Good evening',
    },
    
    ask_details:
    {
        text:           '{@greeting}.Did you have any trouble during this trip, such as accomodation, car rental, restaurants?',
        reprompt:       'Did you have any problems while traveling?',
    },
    ask_exists_another:
    {
        text:           'Thank you very much. Anything else?',
        reprompt:       'Anything else?',
        suggestions:    [ 'Yes', 'No' ]
    },
    ask_more_details:
    {
        text:           'I see. Could you tell me a bit more?',
        reprompt:       'Could you tell me a bit more?'
    },
    ask_travel_type:
    {
        text:           'Is this trip booked by travel agency? or on your own?',
        reprompt:       'travel agency? or on your own?',
        suggestions:    [ 'Travel Agency', 'My Own' ]
    },
    ask_fellow_type:
    {
        text:           'Who are traveling with you?',
        reprompt:       'Who are traveling with you?'
    },
    thanks:
    {
        text:           'Thank you for your cooperation.'
                    +   'Enjoy rest of your journey!'
                    ,
    },
    repeat:
    {
        text:           'Sorry. Say that again?',
        reprompt:       'Say that again?'
    },
    
    // 指定ワード
    specificWords:
    [
        {
            name: 'hotel',
            keys:
            [
                'hotel', 'house', 'inn', 'lodging', 'motel', 'resort', 'tavern', 
            ]
        },
        {
            name: 'restaurant',
            keys:
            [
                'cafeteria', 'coffee shop', 'bar', 'diner', 'dining room', 'inn', 'order', 'eat', 
            ]
        },
        {
            name: 'car_rental',
            keys:
            [
                'rent a car', 'hire a car', 'a car rental agency', 'nippon rentacar', 'navigation', 'insurance', 'times', 'hertz', 'traffic jam', 
            ]
        },
        {
            name: 'shopping',
            keys:
            [
                'shop', 'buying', 'purchasing', 'tax free shop', 'coupon', 'souvenir', 
            ]
        },
        {
            name: 'baggage',
            keys:
            [
                'suitcase', 'luggage', 'bag', 
            ]
        },
        {
            name: 'place',
            keys:
            [
                'aeon mall', 'parco city', 'duty free shop', 'don quixote', 'sapporo drug store', 'bic camera', 'aquarium', 'naha kokusai street', 'public market', 
            ]
        },
    ],
    
    error:
    {
        general: { text: 'An error has occurred.', }
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
            text:       'Continuous Mode is enable'
        },
        reprompt:       'Please next command'
    },
};
