/*
 * ぶんちゃんの虎の巻 v2 — 内容（技術リファレンス）
 * 師匠(aizu-local.shop)の型：工程番号カード × 担当タグ × 開くプロンプト。
 * カード＝{ no?, role?, title, body?, point?(要点), code?, prompts?:[{label,text}], link?, img?(撮影依頼) }
 * 章＝{ key, group, name, lead, cards[] } ／ soon:true は準備中（第2段）。today:true は今日の学び(learnings読込)。
 * ※新規執筆は最小・HQ実録からの移植中心。第1段＝①②⑤⑥。③④⑦⑧は骨子のみ（第2段で充実）。
 */
(function () {
  'use strict';

  // 担当タグの色（識別用・機能的な色分け。基調は黒×白×赤を維持）
  var ROLES = {
    '社長': '#111111', '太郎': '#2d6cdf', 'マリオ': '#c0392b', 'ピーチ': '#d94f8a',
    'よしこ': '#d98a1e', 'ジロー': '#2a9d5c', 'まさお': '#7a5cc0', 'もも🍑': '#e05a9b',
    'テツオ': '#555555', 'せんせい': '#0f9d8f', 'カントク': '#a0562b', 'チャッピー': '#10a37f',
    '全員': '#c0392b',
  };

  var CHAPTERS = [
    // ===== ① 超入門 =====
    {
      key: 'intro', group: '基本', name: '① 超入門', lead: '前提ゼロの人向け。11名の役割・HQの構造・正本主義の3つだけ先に。',
      cards: [
        {
          no: '01', role: '全員', title: '登場人物は11名。まず「誰に振るか」を決める',
          body: '社長＝最終判断と顧客対応。太郎＝参謀（戦略整理・壁打ち）。マリオ＝現場監督（実装統括）。ピーチ＝差配。よしこ＝アプリ、ジロー＝HP、まさお＝経理、もも🍑＝見積、せんせい＝教材、カントク＝動画、テツオ＝セキュリティ監査。',
          point: 'これだけ先に：作業を受けたら「これは誰の担当か」を最初に確定する。監査は必ずテツオ（自分でOKを出さない）。',
        },
        {
          no: '02', role: 'マリオ', title: 'HQの構造 ―― 本部は C:\\HQ',
          body: 'CLAUDE.md＝憲法（最上位ルール）。MISSIONS.md＝全タスク台帳。HANDOVER.md＝セッション申し送り。skills/＝繰り返し業務の型。projects/＝各案件。daily-reports/＝日報。',
          point: 'ここで事故る：pwd が C:\\HQ でないまま書くと旧本部(HQ_OLD)を汚す。開幕で必ず pwd を実出力（付則14）。',
          code: 'pwd   # → /c/HQ でなければ作業しない',
        },
        {
          no: '03', role: '太郎', title: '正本主義 ―― 「言った」ではなく「書いてある」',
          body: 'チャットの会話は流れて消える。決定はファイル（HANDOVER / SPEC / MISSIONS）に書いた時点で正になる。SPECのように正本が2箇所（リポ＋HQミラー）ある場合は必ず両方更新する。',
          point: 'これだけ先に：重要な決定は、圧縮(compact)や交代で消える前に必ずファイルへ書き出す（[[session-kenko]]）。',
        },
      ],
    },

    // ===== ② 開幕・閉店の儀 =====
    {
      key: 'ritual', group: '基本', name: '② 開幕・閉店の儀',
      lead: '新しいターミナル(AI)を起動したとき／仕事を終えるときの、決まった手順。',
      cards: [
        {
          no: '開幕', role: 'マリオ', title: '起動チェックリスト（毎回）',
          body: '① pwd を実出力（C:\\HQ 配下か）② HANDOVER.md の未処理件数を社長に報告 ③ MISSIONS.md を読み上げ ④ /context で使用率を確認（session-kenko）⑤ 着手。',
          point: 'ここで事故る：現在地の確認を飛ばすと旧フォルダを触る。実出力なき「現在地OK」は無効（付則14・実ファイル確認主義）。',
          prompts: [{
            label: '開幕ブリーフ（コピーして新ターミナルへ）',
            text: 'あなたは現場監督マリオです。セッション開幕の手順を踏んでください。\n1) pwd を実行して現在地を実出力（C:\\HQ 配下でなければ作業を拒否して報告）\n2) HANDOVER.md を読み、未処理項目の件数を報告\n3) MISSIONS.md の進行中/未着手を読み上げ\n4) /context で使用率を確認（session-kenko の警告灯）\n5) その後、本日の指示を待つ。憲法(CLAUDE.md)と skills/INDEX.md を前提に動くこと。',
          }],
        },
        {
          no: '閉店', role: 'マリオ', title: '締めは push で終わる',
          body: '① 日報(nippo)を書く ② パス限定で commit ③ push ④ git ls-remote でリモートのSHA一致を実出力 ⑤ HANDOVER.md を更新。これで1セット。',
          point: 'これだけ先に：commit しただけは「やっていない」と同じ。push 忘れ＝未実行扱い（付則16）。未pushの成果はPC故障で消える。',
          code: 'git add <限定パス>\ngit commit -m "..."\ngit push origin main\ngit ls-remote origin -h refs/heads/main   # ← local と一致を目視',
          prompts: [{
            label: '閉店の型（コピー）',
            text: '本日の作業を締めます。次を順に実行し、各ステップの実出力を貼ってください。\n1) 変更点を要約し、日報(nippo)を daily-reports/ に作成\n2) 変更ファイルをパス限定で git add（-A で無関係ファイルを巻き込まない）\n3) commit → push\n4) git rev-parse HEAD と git ls-remote origin でSHA一致を実出力\n5) HANDOVER.md と MISSIONS.md を更新（完了項目に完了日）。実出力なき報告は未実行扱い。',
          }],
        },
      ],
    },

    // ===== ③ 実践工程（第2段で充実）=====
    {
      key: 'practice', group: '実践', name: '③ 実践工程', soon: true,
      lead: 'HP制作10工程（既存スキル移植）／ヒアリングシート構築（7/19-20実録）／外注発注の型。第2段で画像付きで充実。',
      cards: [],
    },

    // ===== ④ プロンプト集（第2段で充実）=====
    {
      key: 'prompts', group: '実践', name: '④ プロンプト集', soon: true,
      lead: '発注文・検収文・引き継ぎ文・修正指示の実録を型別に一覧化（コピーボタン付き）。第2段。',
      cards: [],
    },

    // ===== ⑤ 便利コマンド10 =====
    {
      key: 'commands', group: '道具', name: '⑤ 便利コマンド10',
      lead: '現場で頻出の10個。押すとコピーできる。',
      cards: [
        { no: '1', role: 'マリオ', title: 'push証明（SHA一致）', body: 'push したら必ずリモートのSHAが local と一致するか実出力で確認する。', code: 'git ls-remote origin -h refs/heads/main', point: 'これが一致＝本当に上がった証拠。' },
        { no: '2', role: 'マリオ', title: 'パス限定 commit', body: '無関係のファイルを巻き込まないよう、変更したパスだけを add する。', code: 'git add path/to/file.js   # ← -A は使わない', point: 'ここで事故る：git add -A は一時ファイルやゴミも巻き込む。' },
        { no: '3', role: '全員', title: '構文チェック（書き込み前）', body: 'JS を書いたら実行前に構文を通す。', code: 'node --check file.js', point: '構文OK≠動作OK。ロジックは別途実測。' },
        { no: '4', role: '全員', title: 'dry-run → --commit', body: '本番データに触る処理は、まず dry-run（既定）で結果を見てから --commit で書く。', code: 'node tool.mjs           # dry-run\nnode tool.mjs --commit  # 実書き込み', point: '取り返しのつく側から。' },
        { no: '5', role: '全員', title: '.bak を取る', body: '破壊的な上書き・削除の前に控えを取る。', code: 'cp target target.bak_$(date +%Y%m%d)', point: 'Windows/Git Bashなら日付付きで。' },
        { no: '6', role: '全員', title: 'grep で実測（証人）', body: '「置換した/消した」は件数で裏取りする。', code: 'grep -rc "探す文字列" .', point: '偽成功対策（[[jissoku-kensho]]）。' },
        { no: '7', role: '全員', title: '実在確認', body: 'ファイルが本当にあるか・行数はいくつかを数値で見る。', code: 'ls -la path && wc -l path', point: '「できた」の思い込みを数値でつぶす。' },
        { no: '8', role: 'マリオ', title: 'Pages が本当に公開されたか', body: 'gh の「有効化成功」だけでは公開ではない。status=built を見る。', code: 'gh api repos/OWNER/REPO/pages | grep status', point: '設定成功≠配信（→⑥しくじり帳）。' },
        { no: '9', role: 'テツオ', title: '秘密情報の全走査', body: '.gitignore を無視して鍵・トークン・顧客名を探す。', code: 'rg --no-ignore -n "GOCSPX|AIza|private_key|@gmail"', point: 'gitignore済は「スキャン済」ではない（付則15）。' },
        { no: '10', role: 'マリオ', title: 'ヒアリング直リンク', body: '種目別ヒアリングは URL パラメータで直行できる。店頭のQR/ブックマーク用。', code: 'https://…/groobeat-hearing/?s=gomuin', point: '?s=種目キー。準備中の種目は入口で「準備中」表示。' },
      ],
    },

    // ===== ⑥ しくじり帳 =====
    {
      key: 'fails', group: 'ふりかえり', name: '⑥ しくじり帳',
      lead: '事故 → 原因 → 再発防止。同じ穴を二度踏まないための帳面。',
      cards: [
        {
          no: 'No.1', role: '全員', title: 'cf022018 ―― 長いセッションが崩壊した',
          body: '事故：長時間セッションで tool_use の捏造・偽成功（書けていないのに成功表示）・出力混入が発生し暴走しかけた。原因：Context Rot（文脈が長いほどモデルが劣化する既知現象）＋失敗の打ち返しの蓄積。',
          point: '再発防止：session-kenko。区切りで /context を実測し、決定をファイルへ書き出してから手動 compact。偽成功を感じたら即 git で裏取り。',
        },
        {
          no: 'No.2', role: 'テツオ', title: 'OneDrveの「影と実」 ―― gitignore済でも漏れる',
          body: '事故：`sensei/import` の会話ログに秘密鍵・OAuthシークレット・APIキーが平文で混入。gitignore 済だったが OneDrive同期・zipバックアップ経由で圏外に露出しうる状態だった。',
          point: '再発防止：gitignore は git 混入を防ぐだけ。受領データは C:\\HQ に置く前にテツオが別セッションで secret-scan。生原本は金庫 C:\\keys へ（付則15）。',
        },
        {
          no: 'No.3', role: 'テツオ', title: 'API鍵の平文混入 ―― 消すより先に無効化',
          body: '事故：取り込んだデータに Admin SDK 鍵本体・OAuthシークレットが平文で入っていた。',
          point: '再発防止：混入に気づいたら「ファイルを消す」より先に鍵をローテーション（無効化）が最優先。履歴に残るとローテーションが唯一の防御。HQに認証情報を書かない（付則15・例外なし）。',
        },
        {
          no: 'No.4', role: 'マリオ', title: '「設定成功」≠「公開」 ―― built を見ずに完了報告した',
          body: '事故：GitHub Pages を gh で有効化し「成功」応答を得たので「公開完了」と報告したが、実際はビルドが完了せずサイトは404だった（この虎の巻自身で発生）。',
          point: '再発防止：`gh api .../pages` の status が built になるまで公開ではない。「設定した」と「配信された(built)」を分けて確認する。',
        },
      ],
    },

    // ===== ⑦ 詰まったら表（第2段）=====
    {
      key: 'trouble', group: 'ふりかえり', name: '⑦ 詰まったら表', soon: true,
      lead: '症状 → 対処の逆引き表。第2段で拡充。',
      cards: [],
    },

    // ===== ⑧ 制作事例（第2段）=====
    {
      key: 'cases', group: '事例', name: '⑧ 制作事例', soon: true,
      lead: 'J-DRY／ヒアリング12種／虎の巻自身（障害迂回含む）。第2段で画像付き。',
      cards: [],
    },

    // ===== ⑨ 今日の学び（末尾追記欄に格下げ）=====
    {
      key: 'today', group: '追記', name: '⑨ 今日の学び', today: true,
      lead: '日々の小さな気づきの追記欄（v1の主役から末尾へ格下げ）。learnings/NNN.md を追加すると先頭に出ます。',
    },
  ];

  window.TORA_CONTENT = { roles: ROLES, chapters: CHAPTERS };
})();
