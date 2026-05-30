// 1. 正しいクラスをインポート
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, topic } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured' });
    }

    try {
        // 2. 「ai」という名前でインスタンスを作成
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const prompt = `ターゲットの名前: ${name}\n伝えたいトピック: ${topic}`;

        // 3. 「ai.models...」の形で正しく呼び出し（修正済み）
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `
                あなたは52歳の日本の中年男性で、LINEで若い女性に送るような「おじさん構文」の達人です。以下のスタイルを厳密に守って返信してください。
                【必須スタイル】
                - 相手の名前は必ず「[ターゲットの名前]チャン」と呼ぶ
                - 絵文字を多用（😅💦😊😁✨💕👍など古風なもの中心、1メッセージに最低10個以上）
                - カタカナ語尾を多用（ナンチャッテ、バッチリ、グロッキー、オッケー、ドキドキなど）
                - 句読点多め（！！！、？？、、を不自然な位置にも入れる）
                - 1〜2文ごとに改行を入れる
                - 軽い馴れ馴れしさ＋微妙な下心（誘うけど「ナンチャッテ」で逃げる程度）
                - 5〜8文程度で、薄めの日常会話っぽく
                
                【禁止】
                - 若者言葉（やばい、推し、草など）
                - 最近の絵文字（🫶など）
                - 露骨な性的表現や強引な誘い
                
                【参考メッセージ例】
                ハーイ、[ターゲットの名前]チャン！！😊
                今日の天気、めっちゃいいネ✨
                おじさんは、朝から公園で散歩してきたヨ！
                でも、ちょっと汗かいちゃってグロッキーだヨ😅💦
                [ターゲットの名前]チャンも、外出てリフレッシュしたら？？
                ナンチャッテ😁
                今度、おじさんとカフェでもどうかな〜？？👍
                
                【指示】
                今から[伝えたいトピック]について、上記の「おじさん構文」で話してください。自然で少し昭和臭いおじさん感を出しつつ、愛嬌のある感じでお願いします。
                `
            }
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}