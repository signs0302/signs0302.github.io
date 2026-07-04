/*
 * publications.js
 * data/publications.json を読み込んで論文リストを描画する。
 *
 * 使い方:
 *   <ol reversed="reversed" data-pubs="journal" data-lang="ja"></ol>       … セクション一括表示
 *   <ol reversed="reversed" data-pubs-ids="id1,id2" data-lang="ja"></ol>   … idを指定して表示（プロジェクトページ用）
 *   <span data-pubs-count="journal"></span>                                … セクションの件数表示
 *
 * data-lang="ja": 和文論文は日本語表記、英語論文は英語表記（従来のcv_JP相当）
 * data-lang="en": すべて英語表記、和文論文には (in Japanese) が付く（cv_ENG相当）
 */
(function () {
  'use strict';

  var JSON_PATH = '/data/publications.json';

  function pick(field, lang) {
    if (!field) { return ''; }
    if (typeof field === 'string') { return field; }
    return field[lang] || field.en || field.ja || '';
  }

  function renderEntry(p, lang) {
    var authors = pick(p.authors, lang);
    var title = pick(p.title, lang);
    var venue = pick(p.venue, lang);
    var award = pick(p.award, lang);

    var titleLine = '"' + title + '"';
    if (lang === 'en' && p.in_japanese) {
      titleLine += ' (in Japanese)';
    }

    var html = '<li><b>' + authors + '</b><br> ' + titleLine + ',\n';
    html += '<br>' + venue + '<br>\n';
    if (award) {
      html += '<b>【' + award + '】</b><br>\n';
    }
    (p.links || []).forEach(function (l) {
      html += '<a class="btn btn-primary btn-sm" href="' + l.href + '">' + l.label + '</a>\n';
    });
    html += '</li><br>\n';
    return html;
  }

  function render(data) {
    var pubs = data.publications;
    var byId = {};
    pubs.forEach(function (p) { byId[p.id] = p; });

    // セクション一括表示
    document.querySelectorAll('[data-pubs]').forEach(function (el) {
      var section = el.getAttribute('data-pubs');
      var lang = el.getAttribute('data-lang') || 'ja';
      var html = '';
      pubs.forEach(function (p) {
        if (p.section === section) { html += renderEntry(p, lang); }
      });
      el.innerHTML = html;
    });

    // id指定表示（プロジェクトページ用）
    document.querySelectorAll('[data-pubs-ids]').forEach(function (el) {
      var ids = el.getAttribute('data-pubs-ids').split(',');
      var lang = el.getAttribute('data-lang') || 'ja';
      var html = '';
      ids.forEach(function (id) {
        var p = byId[id.trim()];
        if (p) {
          html += renderEntry(p, lang);
        } else if (window.console) {
          console.warn('publications.js: unknown id "' + id.trim() + '"');
        }
      });
      el.innerHTML = html;
    });

    // 件数表示
    document.querySelectorAll('[data-pubs-count]').forEach(function (el) {
      var section = el.getAttribute('data-pubs-count');
      el.textContent = pubs.filter(function (p) { return p.section === section; }).length;
    });
  }

  fetch(JSON_PATH)
    .then(function (res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(render)
    .catch(function (err) {
      if (window.console) {
        console.error('publications.js: failed to load ' + JSON_PATH + ' — ' + err +
          ' (file:// で開くと読み込めません。Live PreviewかHTTPサーバ経由で表示してください)');
      }
    });
})();
