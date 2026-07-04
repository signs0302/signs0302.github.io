# signs0302.github.io メンテナンスガイド

中野萌士（Kizashi Nakano）の研究者個人サイト。GitHub Pages（リポジトリ直下がルート）。
Bootstrap 5.3.3（jsDelivr, jQuery不使用）。変更したら**コミット→pushまで**行う（pushでサイトに反映される）。

## サイト構成

| ファイル | 役割 |
|---|---|
| `index.html` | トップ（ヒーロー＋プロジェクトサムネ＋News） |
| `cv_JP.html` / `cv_ENG.html` | CV（日本語版／英語版）。**cv.htmlはcv_JP.htmlへのリダイレクトなので編集しない** |
| `projects.html` | プロジェクト一覧（カードグリッド） |
| `projects/*.html` | 個別プロジェクトページ（雛形: `projects/_template.html`） |
| `data/publications.json` | **論文データの一元管理**（論文誌・国際会議・国内会議・特許、構造化形式） |
| `data/cv.json` | **CVの他セクションの一元管理**（学会発表・受賞・科研費・委員会・その他、ja/enのHTMLチャンク形式） |
| `js/publications.js` | 上記2つのJSONを読み込んで各ページに描画するレンダラ |
| `js/theme.js` | ダークモード切替（ナビの月アイコン、localStorageに保存） |
| `sitemap.xml` / `robots.txt` / JSON-LD(index.html内) | SEO関連。ページを増やしたらsitemap.xmlにも追加 |
| `profile.html` | プロフィール |
| `fuji.html`, `link.html`, `old/`, `index_photo.html` | 旧アーカイブ。原則触らない（fuji.htmlはBootstrap 4のまま） |

## 業績を追加するときのワークフロー

新しい論文・受賞・採択などが発生したら、以下を順に行う：

### 1. publications.json にエントリ追加（論文の場合）

`data/publications.json` の該当セクションの**先頭付近（新しい順）**に追加。

- `section`: `journal` | `international` | `domestic` | `patent`
- 和文論文は `in_japanese: true` を付け、`ja`/`en` 両方の authors/title/venue を書く（英語CVで自動的に "(in Japanese)" が付く）
- 英語論文は `en` のみでよい
- 受賞は `award` フィールド、リンクは `links: [{label, href}]`（DOI・PDF・YouTube等）
- 件数はJSで自動カウントされるので見出しの数の更新は不要

### 2. プロジェクトページへの反映（該当する場合）

- 既存プロジェクトに関連する論文 → そのページの `<ol data-pubs-ids="...">` にIDを追記（**プロジェクト間で論文の重複掲載はOK**）
- 新しい研究テーマでプロジェクトページを作る場合：
  1. `projects/_template.html` をコピーしてスラッグ名にリネーム（雛形冒頭のコメント参照）
  2. `projects.html` にカードを追加（サムネは `https://img.youtube.com/vi/<動画ID>/hqdefault.jpg`）
  3. 必要なら `index.html` のサムネイル一覧にも追加

### 3. News の更新（index.html）

- 該当する年の `<h4>[YYYY]</h4>` の `<ul>` に新しい順で追加（年がなければ見出しごと新設）
- 形式: `<li>[YYYY-MM] ○○にて発表しました／○○を受賞しました<img src="img/new.gif" alt="new!"></li>`
- `new.gif` は**最新2〜3件のみ**に付け、古い項目からは外す
- 日付が不明な場合はWebで発表日を調べる（CrossRef APIでDOIから取得可能）。おおよその発表月でよい
- **主著でない論文は「〜が発表されました」の受動表現**にする（本人は登壇していないため「発表しました」と書かない）
- TVCG採録論文の発表先はIEEE VRかISMARのどちらかなので、特集号の巻号や受賞情報から確認する
- **進学・卒業は書かない**（着任などの職歴はOK）
- 対象：論文採録・学会発表・受賞・科研費等の採択・メディア掲載・展示

### 4. CVの他セクション（該当する場合）

学会発表(Presentations)・受賞(Awards)・科研費(Grants)・委員会・その他(Others)は
**data/cv.json** で一元管理。該当セクションの配列の先頭に `{"ja": "<li>...</li><br>", "en": "<li>...</li><br>"}`
形式（awards/othersは `<li>...</li>` ＋リンクボタン＋`<br>` のチャンク）で追加する。件数は自動カウント。

### 5. 最終更新日コメント

cv_JP.html / cv_ENG.html の2行目のコメントを更新：
`<!-- 最終更新日 (Last updated): YYYY-MM-DD -->`

### 6. コミット & プッシュ

内容が分かるメッセージでコミットしてpush。

## 英文のスタイル（AIっぽい英語を書かない）

サイトに載せる英語の説明文（プロジェクトのOverview等）は、AI生成にありがちな癖を避けて簡潔な研究者の英語で書く：

- ダッシュ（—）で挿入句を挟まない。カッコか別の文に分ける
- "This allows users to..." / "This project explores..." / "novel" / "cutting-edge" / "seamlessly" / "delve" などの常套句を使わない
- 3つ並べて整えるリズム（A, B, and C の連発）を避ける
- 1文を短く。事実を主語にして淡々と書く（"We built X and found Y" 調）
- 論文タイトルの英訳は直訳でよい（スタイル修正の対象外）

## 注意事項

- 論文リストはJSONをfetchで読むため、**file:// で開くと表示されない**。確認はVSCodeのLive PreviewかGitHub Pages上で行う
- 英訳時に共著者名のローマ字が不明な場合は推定でよいが、**本人に確認を促すこと**
- ナビメニューは全ページ共通（Profile / CV & Publication / Projects / Mail / Cyber Interface Lab. / UTokyo）。項目を変えるときは全ページ一括で
