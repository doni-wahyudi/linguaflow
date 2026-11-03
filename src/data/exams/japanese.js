/**
 * @file japanese.js
 * @description Official JLPT (Japanese-Language Proficiency Test) Mock Examinations for N5, N4, and N3.
 * Modeled closely after the official test formats designed by JEES and Japan Foundation.
 */

export const japaneseExams = [
  {
    id: 'jlpt-n5',
    languageId: 'ja',
    level: 'N5',
    framework: 'JLPT',
    title: 'JLPT N5 Official Mock Examination',
    subtitle: '日本語能力試験 N5 総合模擬試験',
    certifyingBody: 'Japan Educational Exchanges and Services (JEES)',
    description: 'Measures basic Japanese ability to understand some basic Japanese including Hiragana, Katakana, and everyday N5 Kanji.',
    durationMinutes: 20,
    passingScore: 60, // 60%
    badge: 'JLPT N5 Certified',
    xpReward: 150,
    sections: [
      {
        id: 'vocab',
        name: '文字・語彙 (Kanji & Vocabulary)',
        weight: 30,
        questions: [
          {
            id: 'n5-v1',
            type: 'kanji-reading',
            prompt: '下線の言葉はどう読みますか？ (How is the underlined word read?)',
            sentence: '毎朝、つめたい【水】を飲みます。',
            target: '水',
            options: ['みず', 'おちゃ', 'さけ', 'ゆ'],
            correctIndex: 0,
            explanation: '「水」の訓読みは「みず」(water) です。「おちゃ」は「お茶」、「さけ」は「酒」、「ゆ」は「湯」です。',
          },
          {
            id: 'n5-v2',
            type: 'kanji-reading',
            prompt: '下線の言葉はどう読みますか？',
            sentence: '日曜日に図書館へ【行きます】。',
            target: '行きます',
            options: ['きます', 'いきます', 'かえります', 'でます'],
            correctIndex: 1,
            explanation: '「行きます」の読み方は「いきます」(to go) です。「来ます」は「きます」、「帰ります」は「かえります」です。',
          },
          {
            id: 'n5-v3',
            type: 'kanji-writing',
            prompt: '下線の言葉は漢字でどう書きますか？ (Which kanji represents the underlined word?)',
            sentence: 'あの【ひと】は日本語の先生です。',
            target: 'ひと',
            options: ['大', '入', '人', '八'],
            correctIndex: 2,
            explanation: '「ひと」(person) の漢字は「人」です。「大」はおおきい、「入」ははいるです。',
          },
          {
            id: 'n5-v4',
            type: 'context',
            prompt: '（　）に何を入れますか？一番いいものを一つ選んでください。',
            sentence: '朝起きて、顔を（　）。',
            options: ['あらいます', 'のみます', 'あけます', 'よみます'],
            correctIndex: 0,
            explanation: '「顔を洗います（あらいます）」で「wash one\'s face」という意味になります。',
          },
        ],
      },
      {
        id: 'grammar',
        name: '文法 (Grammar & Sentence Composition)',
        weight: 30,
        questions: [
          {
            id: 'n5-g1',
            type: 'particle',
            prompt: '（　）に入れるのに一番いいものを一つ選んでください。',
            sentence: '私は毎朝パン（　）食べます。',
            options: ['は', 'を', 'に', 'で'],
            correctIndex: 1,
            explanation: '直接目的語（食べる対象）を示す格助詞は「を」です。「パンを食べます」。',
          },
          {
            id: 'n5-g2',
            type: 'conjugation',
            prompt: '（　）に入れるのに一番いいものを一つ選んでください。',
            sentence: 'すみません、写真を（　）ください。',
            options: ['とって', 'とる', 'とらない', 'とり'],
            correctIndex: 0,
            explanation: '依頼表現「〜てください (Please do...)」には動詞のテ形が接続します。「撮る（とる）」のテ形は促音便の「撮って（とって）」です。',
          },
          {
            id: 'n5-g3',
            type: 'star-reorder',
            prompt: '★に入るものはどれですか？正しい順番に並べてください。\n私のうちは、駅【　】 【　】 【 ★ 】 【　】 遠いです。',
            parts: ['から', 'あまり', 'は', '歩いて'],
            correctOrder: ['から', '歩いて', 'は', 'あまり'], // 駅 [から] [歩いて] [★ は] [あまり] 遠いです
            starIndex: 2,
            options: ['から', '歩いて', 'は', 'あまり'],
            correctIndex: 2,
            explanation: '自然な文は「駅から歩いて【は】あまり遠いです（＝駅から歩いてはあまり遠くありません/あまり遠くない）」。★に入るのは「は」です。',
          },
        ],
      },
      {
        id: 'reading',
        name: '読解 (Reading Comprehension)',
        weight: 20,
        passage: {
          title: '田中さんのメモ (Tanaka-san\'s Memo)',
          text: `山田さんへ

お疲れ様です。田中です。
明日の昼ご飯ですが、12時に駅の北口のパン屋の前で会いましょう。
駅の近くに新しいラーメン屋ができました。とてもおいしいそうです。
もし雨が降ったら、駅の中の喫茶店にしてください。
よろしくお願いします。

田中より`,
        },
        questions: [
          {
            id: 'n5-r1',
            prompt: '二人は明日、雨が降らないとき、どこで会いますか？ (Where will they meet tomorrow if it does not rain?)',
            options: [
              '駅の中の喫茶店',
              '駅の北口のパン屋の前',
              '新しいラーメン屋の中',
              '田中さんの家',
            ],
            correctIndex: 1,
            explanation: '本文に「12時に駅の北口のパン屋の前で会いましょう。もし雨が降ったら、駅の中の喫茶店にしてください」とあるので、雨が降らないときは「駅の北口のパン屋の前」です。',
          },
          {
            id: 'n5-r2',
            prompt: '明日の昼ご飯に二人は何を食べに行く予定ですか？',
            options: ['パン', 'ラーメン', 'コーヒー', 'カレー'],
            correctIndex: 1,
            explanation: '本文に「駅の近くに新しいラーメン屋ができました。とてもおいしいそうです」と書かれています。',
          },
        ],
      },
      {
        id: 'listening',
        name: '聴解 (Listening Comprehension)',
        weight: 20,
        questions: [
          {
            id: 'n5-l1',
            prompt: '音声を聞いて、質問に答えてください。男の人は何時に来ますか？ (What time will the man arrive?)',
            audioScript: '女：山田さん、明日の会議は何時からですか？ 男：ええと、会議は3時半からです。でも、準備があるから3時15分に来てください。 女：わかりました。3時15分ですね。',
            options: ['3時00分', '3時15分', '3時30分', '4時00分'],
            correctIndex: 1,
            explanation: '男性は「準備があるから3時15分に来てください」と言っており、女性も「3時15分ですね」と確認しています。正解は「3時15分」です。',
          },
          {
            id: 'n5-l2',
            prompt: '女の人は何を飲みますか？ (What will the woman drink?)',
            audioScript: '男：いらっしゃいませ。何にしますか？ 女：コーヒーをお願いします。あ、冷たいお茶はありますか？ 男：はい、ありますよ。 女：じゃあ、冷たいお茶を一つください。',
            options: ['熱いコーヒー', '冷たい水', '冷たいお茶', 'オレンジジュース'],
            correctIndex: 2,
            explanation: '最初はコーヒーと言いましたが、「じゃあ、冷たいお茶を一つください」と最終的に冷たいお茶を注文しています。',
          },
        ],
      },
    ],
  },
  {
    id: 'jlpt-n4',
    languageId: 'ja',
    level: 'N4',
    framework: 'JLPT',
    title: 'JLPT N4 Official Mock Examination',
    subtitle: '日本語能力試験 N4 総合模擬試験',
    certifyingBody: 'Japan Educational Exchanges and Services (JEES)',
    description: 'Demonstrates understanding of basic Japanese in everyday situations spoken slowly and written with elementary Kanji.',
    durationMinutes: 25,
    passingScore: 60,
    badge: 'JLPT N4 Certified',
    xpReward: 200,
    sections: [
      {
        id: 'vocab',
        name: '文字・語彙 (Vocabulary & Kanji)',
        weight: 30,
        questions: [
          {
            id: 'n4-v1',
            type: 'kanji-reading',
            prompt: '下線の言葉はどう読みますか？',
            sentence: '駅の前に【交番】があります。',
            target: '交番',
            options: ['こうばん', 'こばん', 'きょうばん', 'ごうばん'],
            correctIndex: 0,
            explanation: '「交番」の読みは「こうばん」(police box) です。',
          },
          {
            id: 'n4-v2',
            type: 'context',
            prompt: '（　）に入れるのに一番いいものを一つ選んでください。',
            sentence: '約束の時間に（　）ように急いで走った。',
            options: ['まにあう', 'おくれる', 'とどく', 'すむ'],
            correctIndex: 0,
            explanation: '「時間に間に合う（まにあう）ように」で「so as to be on time」という意味になります。',
          },
          {
            id: 'n4-v3',
            type: 'kanji-writing',
            prompt: '下線の言葉は漢字でどう書きますか？',
            sentence: '私の部屋はとても【べんり】です。',
            target: 'べんり',
            options: ['便利', '便理', '勉利', '弁利'],
            correctIndex: 0,
            explanation: '「べんり」(convenient) の漢字は「便利」です。',
          },
        ],
      },
      {
        id: 'grammar',
        name: '文法 (Grammar & Sentence Structure)',
        weight: 30,
        questions: [
          {
            id: 'n4-g1',
            type: 'grammar',
            prompt: '（　）に入れるのに一番いいものを一つ選んでください。',
            sentence: '日本へ行ったら、富士山に（　）たいです。',
            options: ['のぼり', 'のぼる', 'のぼって', 'のぼった'],
            correctIndex: 0,
            explanation: '希望の助動詞「〜たい」の前には動詞のマス形語幹が接続します。「登り（のぼり）たい」。',
          },
          {
            id: 'n4-g2',
            type: 'grammar',
            prompt: '（　）に入れるのに一番いいものを一つ選んでください。',
            sentence: 'このケーキは母が作って（　）ました。',
            options: ['くれ', 'あげ', 'もらい', 'やり'],
            correctIndex: 0,
            explanation: '身内（母）が自分に対して恩恵を与える動作をしてくれたときは「〜てくれる（くれました）」を用います。',
          },
          {
            id: 'n4-g3',
            type: 'star-reorder',
            prompt: '★に入るものはどれですか？\n雨が【　】 【 ★ 】 【　】 【　】 家にいましょう。',
            parts: ['降ったら', 'どこにも', '出かけないで', '強く'],
            correctOrder: ['強く', '降ったら', 'どこにも', '出かけないで'], // 雨が [強く] [★ 降ったら] [どこにも] [出かけないで]
            starIndex: 1,
            options: ['降ったら', 'どこにも', '出かけないで', '強く'],
            correctIndex: 0,
            explanation: '「雨が強く【降ったら】どこにも出かけないで家にいましょう」。★に入るのは「降ったら」です。',
          },
        ],
      },
      {
        id: 'reading',
        name: '読解 (Reading Comprehension)',
        weight: 20,
        passage: {
          title: '図書館のお知らせ (Library Notice)',
          text: `【緑町図書館からのお知らせ】
来週の月曜日（10月14日）は祝日のため、開館時間は午前10時から午後5時までとなります。
また、火曜日（10月15日）は図書の整理のため、終日休館いたします。
本の返却は、休館中も図書館の入口横にある「返却ポスト」をご利用いただけます。
ただし、CDやDVDは壊れやすいため、ポストには入れず、水曜日以降にカウンターまでお持ちください。`,
        },
        questions: [
          {
            id: 'n4-r1',
            prompt: '火曜日にCDを返したい人は、どうしなければなりませんか？',
            options: [
              '返却ポストに入れる。',
              '午前10時から午後5時の間にカウンターに持って行く。',
              '火曜日には返せず、水曜日以降にカウンターへ持って行く。',
              '緑町駅のポストに入れる。',
            ],
            correctIndex: 2,
            explanation: '本文に「火曜日は休館」「CDやDVDはポストには入れず、水曜日以降にカウンターまでお持ちください」と明記されています。',
          },
        ],
      },
      {
        id: 'listening',
        name: '聴解 (Listening Comprehension)',
        weight: 20,
        questions: [
          {
            id: 'n4-l1',
            prompt: '音声を聞いてください。男の人はこれから何をしますか？ (What will the man do next?)',
            audioScript: '女：田中さん、会議室の机の準備は終わりましたか？ 男：はい、終わりました。あ、資料のコピーはもうできましたか？ 女：まだです。50枚コピーしなければなりません。手伝ってくれますか？ 男：わかりました。すぐやりますね。',
            options: ['机を並べる', '資料をコピーする', '会議を始める', '休憩する'],
            correctIndex: 1,
            explanation: '女性から「資料のコピーを手伝ってくれますか？」と頼まれ、男性が「すぐやりますね」と答えています。',
          },
        ],
      },
    ],
  },
  {
    id: 'jlpt-n3',
    languageId: 'ja',
    level: 'N3',
    framework: 'JLPT',
    title: 'JLPT N3 Official Mock Examination',
    subtitle: '日本語能力試験 N3 総合模擬試験',
    certifyingBody: 'Japan Educational Exchanges and Services (JEES)',
    description: 'Demonstrates ability to understand Japanese used in everyday situations to a certain degree and grasp summary information in news.',
    durationMinutes: 30,
    passingScore: 60,
    badge: 'JLPT N3 Certified',
    xpReward: 300,
    sections: [
      {
        id: 'vocab',
        name: '言語知識 (Kanji & Vocabulary)',
        weight: 30,
        questions: [
          {
            id: 'n3-v1',
            type: 'kanji-reading',
            prompt: '下線の言葉はどう読みますか？',
            sentence: '環境問題に【関心】を持っています。',
            target: '関心',
            options: ['かんしん', 'かんじん', 'がんしん', 'こうしん'],
            correctIndex: 0,
            explanation: '「関心」の読み方は「かんしん」(interest / concern) です。',
          },
          {
            id: 'n3-v2',
            type: 'context',
            prompt: '文に最もよく合うものを一つ選んでください。',
            sentence: '大切な試験の前なので、体調管理に（　）を払っている。',
            options: ['注意', '観察', '心配', '興味'],
            correctIndex: 0,
            explanation: '慣用句「注意を払う（ちゅういをはらう）」で「to pay careful attention to」となります。',
          },
        ],
      },
      {
        id: 'grammar',
        name: '文法 (Grammar)',
        weight: 30,
        questions: [
          {
            id: 'n3-g1',
            type: 'grammar',
            prompt: '（　）に入れるのに一番いいものを一つ選んでください。',
            sentence: 'この仕事はどんなに大変でも、最後までやり遂げない（　）。',
            options: ['わけにはいかない', 'はずがない', 'に違いない', 'わけではない'],
            correctIndex: 0,
            explanation: '「〜ないわけにはいかない」は社会的責任や道義的理由から「〜しないわけにはいかない（必ずしなければならない）」という意味を表します。',
          },
          {
            id: 'n3-g2',
            type: 'grammar',
            prompt: '部長への敬語として最も適切なものを一つ選んでください。',
            sentence: '部長、先ほどお電話をくださった田中様が（　）。',
            options: ['まいりました', 'いらっしゃいました', 'うかがいました', '拝見しました'],
            correctIndex: 1,
            explanation: '相手（お客様）の来訪を高める尊敬語は「いらっしゃいました」です。「まいりました」は謙譲語です。',
          },
        ],
      },
      {
        id: 'reading',
        name: '読解 (Reading Comprehension)',
        weight: 20,
        passage: {
          title: '社会とコミュニケーション (Society & Modern Communication)',
          text: `現代社会において、SNSや電子メールの普及により、離れた場所にいる人と瞬時にやり取りができるようになった。しかしその一方で、文字だけのコミュニケーションでは相手の表情や声のトーンが伝わりにくく、誤解を生んでしまうことも少なくない。
直接顔を合わせて対話することは、時間や労力がかかるように思えるかもしれない。だが、言葉以外の非言語情報（身振りや視線など）を共有できるため、より深い信頼関係を築く上では依然として不可欠な方法なのである。`,
        },
        questions: [
          {
            id: 'n3-r1',
            prompt: '筆者が最も伝えたいことは何ですか？',
            options: [
              'SNSやメールは誤解を生むので使用をやめるべきだ。',
              '直接対面する対話は、深い信頼関係を築くために依然として極めて重要である。',
              '文字のコミュニケーションのほうが効率的で優れている。',
              'これからは身振りの練習だけを重視するべきである。',
            ],
            correctIndex: 1,
            explanation: '本文末尾に「直接顔を合わせて対話することは…より深い信頼関係を築く上では依然として不可欠な方法なのである」と結論付けられています。',
          },
        ],
      },
      {
        id: 'listening',
        name: '聴解 (Listening Comprehension)',
        weight: 20,
        questions: [
          {
            id: 'n3-l1',
            prompt: '音声を聞いてください。会社の会議で、二人はポスターのデザインをどうすることに決めましたか？',
            audioScript: '男：新しい商品のポスターですが、背景を青にするか緑にするかで迷っています。 女：青は清潔感がありますが、今回のオーガニック商品なら緑のほうが自然なイメージが伝わりやすいのではないでしょうか。 男：なるほど、確かに商品のコンセプトに合っていますね。では緑色に修正しましょう。',
            options: ['青色にする', '緑色にする', '白色にする', '写真をなくす'],
            correctIndex: 1,
            explanation: 'オーガニック商品のコンセプトに合わせるため、「緑色に修正しましょう」と決定しています。',
          },
        ],
      },
    ],
  },
];

