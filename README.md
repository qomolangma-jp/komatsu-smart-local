# 小松 Smart自治PJ (KSL - Komatsu Smart Local Project)

> **紙の回覧板から、持続可能な地域の未来へ。**  
> サーバー費完全0円で実現する、LINE × Google 連携によるオープンソース町内会DXパッケージ。

---

## 📌 プロジェクト概要

「小松 Smart自治PJ（KSL）」は、何十年も続いてきた**班長による紙の配布物・回覧板の手渡し負担を解消し、持続可能な地域運営を実現すること**を目的に開発されたオープンソースの自治会DXプラットフォームです。

一般的に町内会デジタル化で課題となる「高額な月額サーバー費・初期導入費」や「専門知識の必要性」を排除し、**GitHub Pages（フロントエンド）**、**Google Apps Script (GAS)（バックエンド）**、**Google スプレッドシート（データベース）**、および **LINE公式アカウント / LIFF** という、すべて無料で使える既存インフラを組み合わせることで**「運用コスト完全0円」**および**「ノーコードでの容易な運用」**を実現しています。最大300〜500世帯規模の自治会・町内会に最適化されています。

---

## 🎨 ブランドシンボル (ロゴコンセプト)

本プロジェクトのシンボルロゴは、白山連峰・松・流れる川といった小松市の美しい豊かな自然環境と、地域住民の笑顔・スマホ・未来へ飛翔する飛行機を融合させたデザインとなっています。テクノロジーと自然・地域コミュニティが調和した「持続可能なスマート自治」のビジョンを象徴しています。

---

## 🛠️ システムアーキテクチャ & 技術スタック

### 全体構成図

```text
【住民 / ユーザー】
       │
   LINE公式アカウント (LIFF)
       │
       ▼
【フロントエンド】 (GitHub Pages)
   ├─ index.html (UI画面・各種機能フォーム)
   ├─ app-config.js / liff-app.js (共通処理・LIFF初期化)
   ├─ member-check.js / ui-helpers.js / ui-patterns.js
   └─ app-shell.css (共通レスポンシブデザイン)
       │
       ▼ (REST / JSONP API 通信)
【バックエンド API】 (Google Apps Script - Web App)
   ├─ main.gs / router.gs (doGet / doPost エントリーポイント)
   ├─ member.gs (住民名簿認証・登録)
   ├─ notice.gs (回覧板・配布物取得・ログ記録)
   ├─ bookroom.gs (施設予約処理・排他確認)
   ├─ attendance.gs (イベント出欠回答)
   ├─ safety_check.gs (災害時安否確認)
   ├─ chat.gs (Webhook・チャット記録)
   └─ line-push.gs (LINEプッシュ一斉配信)
       │
       ▼
【データベース】 (Google スプレッドシート群)
   ├─ SS_MEMBER_ID (住民名簿シート)
   ├─ SS_NOTICE_ID (monthly_items, access_log_raw 等)
   ├─ SS_BOOKROOM_ID (booklist シート)
   ├─ SS_ATTENDANCE_ID (questions, answers シート)
   ├─ SS_SAFETY_CHECK_ID (survey_settings シート)
   └─ SS_CHAT_ID (chat シート)
```

### 技術スタック
- **フロントエンド**: HTML5, JavaScript (ES6+), CSS3 (app-shell.css), LIFF SDK v2
- **ホスティング**: GitHub Pages (完全無料)
- **バックエンド API**: Google Apps Script (GAS) Web App
- **データベース**: Google スプレッドシート (完全無料)
- **ユーザー認証・インターフェース**: LINE公式アカウント, LIFF (LINE Front-end Framework)

---

## ✨ 主な機能仕様

### 1. 住民名簿登録 & 認証機能 (`member.gs`)
- **ログイン必須の認可構造**: いたずら防止および個人情報保護のため、全機能はスプレッドシート上の「住民名簿」データとLINE IDの照合により承認されたユーザー（`app` 状態）のみアクセス可能。
- **デジタル受取意思表示フラグ (`is_digital`)**: 住民が「デジタルで情報を受け取り、紙の配布を不要とする」意思表示を明示する項目。このフラグにより、班長による紙の配布停止を判断します。
- **保存項目**: `created_at`, `line_id`, `line_name`, `name_1st`, `name_2nd`, `kana_1st`, `kana_2nd`, `group` (班番号), `address`, `is_digital`, `role`, `other`, `status`, `updated_at`

### 2. 電子回覧板 & デジタル配布物 (`notice.gs`)
- **スマホ特化 1ページ統合UI**: 回覧板と配布物（市の広報誌、保健所チラシ、町内ニュース等）を同一ページ内でセクション分けしてまとめて表示。
- **ノーコード管理**: 管理者は `monthly_items` シート（`ymd`, `type`, `label`, `url`, `memo`）に記入するだけで、日付・発行月で動的に表示が切り替わります。
- **アクセスログ & バックナンバー**: 何月何日に誰がアクセスしたかのログ（`access_log_raw`）を自動保存。過去12か月分のバックナンバー閲覧にも対応。

### 3. 公民館・会議室予約機能 (`bookroom.gs`)
- **2タッチ申請**: ログイン認証済みのLine ID情報を引き継ぐため、名前入力が不要。「日付」と「部屋（小会議室/大広間等）」、「時間帯（午前/午後/夜間/終日）」を選ぶだけで申請完了。
- **LINE承認フロー**: 予約申請が行われると、管理者のLINEへ承認依頼メッセージが届き、LINE上の「承認」「却下」ボタン（Postback）からワンタップで送信者へ結果を通知。

### 4. 行事の出欠確認機能 (`attendance.gs`)
- URLのクエリパラメータ（`?q=q_1`）で指定された質問に対して、スマホからラジオボタン形式でサクッと回答。
- `questions` シートおよび `answers` シートで管理され、同一ユーザーの再回答は上書き更新。

### 5. 災害時安否確認機能 (`safety_check.gs`)
- 有事の際に個別識別ID付きの安否確認URL（`sc_YYYYMMDD_HHMMSS_xxxxxx`）を発行・一斉送信。
- 住民は「無事」「連絡が必要」「不明」等を送信でき、未登録者の簡易登録フローも併設。

### 6. LINE一斉配信 & チャット連携 (`line-push.gs`, `chat.gs`)
- 名簿の `is_digital` フラグや役職で絞り込み、500件単位で分割プッシュ配信（DRY RUNテストモード対応）。
- 住民からのLINE問い合わせメッセージを `chat` シートに保存・記録。

---

## 📊 データベース (スプレッドシート) 設計

環境変数（GAS Script Properties）にて各スプレッドシートIDを設定します。

| プロパティ名 | 設定シート | 主な役割・保持データ |
|---|---|---|
| `SS_MEMBER_ID` | 住民名簿 | LINE ID、氏名、班番号、デジタル受取希望フラグ、ステータス |
| `SS_NOTICE_ID` | 回覧板・配布物 | 月別コンテンツリスト（`monthly_items`）、閲覧ログ（`access_log_raw`） |
| `SS_BOOKROOM_ID` | 施設予約 | 予約一覧（`booklist`：日時、部屋、予約ステータス、batch_id） |
| `SS_ATTENDANCE_ID` | 出欠確認 | 質問マスター（`questions`）、住民回答結果（`answers`） |
| `SS_SAFETY_CHECK_ID` | 安否確認 | 発行設定（`survey_settings`）、安否回答データ |
| `SS_CHAT_ID` | チャットログ | LINEメッセージ受信履歴、Webhookログ |

---

## 🚀 導入手順 (Setup Guide)

### 1. リポジトリのクローン & ホスティング
1. 本リポジトリを Fork または Clone します。
2. GitHub の Repository Settings > Pages より、`main` ブランチを公開元に設定します。

### 2. Google スプレッドシートの準備
1. 配布用のテンプレート・スプレッドシート（名簿・回覧板・予約用など）を自身のGoogleドライブにコピーします。
2. それぞれのスプレッドシートID（URL内の `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit` の部分）をメモします。

### 3. Google Apps Script (GAS) のデプロイ
1. GASプロジェクトを新規作成し、本リポジトリ内の `.gs` ファイル群を配置します。
2. GASの「プロジェクトの設定」>「スクリプト プロパティ」に以下を設定します：
   - `SS_MEMBER_ID`, `SS_NOTICE_ID`, `SS_BOOKROOM_ID`, `SS_ATTENDANCE_ID`, `SS_SAFETY_CHECK_ID`, `SS_CHAT_ID`
   - `LINE_CHANNEL_ACCESS_TOKEN`
3. GASを「ウェブアプリ」としてデプロイ（アクセスできるユーザー: 全員）し、発行された Web App URL を取得します。

### 4. LINE Developers & LIFF の設定
1. LINE Developers にてプロバイダーおよび LINE公式アカウント (Messaging API) を作成します。
2. LIFF アプリを各画面（名簿登録、回覧板、予約等）の分だけ作成し、エンドポイントURLに GitHub Pages の URL を設定します。
3. フロントエンドの `app-config.js` 内に、取得した LIFF ID と GAS Web App URL を記述します。

---

## ⚠️ 現在の課題と今後のロードマップ

- **フロントエンドの初期読み込み速度の改善**: アクセス時の通信処理やスプレッドシートデータ取得の最適化。
- **認証セキュリティの強化**: GASエンドポイントに対するLIFFトークン署名検証の厳格化。
- **管理者専用Webダッシュボードの構築**: 現在スプレッドシート直接編集およびLINE上で行っている予約管理や回答集計をブラウザで一元管理できるUIの提供。
- **予約の同時申請における排他制御（ロック機構）の追加**。

---

## 🤝 貢献 & オープンソースライセンス

本プロジェクトは、地域社会の課題をシビックテックの力で解決するための**オープンソースソフトウェア**です。自由な Fork、カスタマイズ、バグ報告、プルリクエストを歓迎します。

- **ライセンス**: MIT License
- **運営**: 小松 Smart自治PJ (Komatsu Smart Local Project / KSL)
- **ウェブサイト / LP**: [小松 Smart自治PJ 公式LP](https://qomolangma-jp.github.io/komatsu-smart-local/lp/)
