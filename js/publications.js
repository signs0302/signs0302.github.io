/*
 * publications.js
 * data/publications.json（論文）と data/cv.json（発表・受賞・科研費・委員会・その他）を
 * 読み込んで各ページに描画する。
 *
 * 論文（publications.json）:
 *   <ol reversed="reversed" data-pubs="journal" data-lang="ja"></ol>       … セクション一括表示
 *   <ol reversed="reversed" data-pubs-ids="id1,id2" data-lang="ja"></ol>   … idを指定して表示（プロジェクトページ用）
 *   <span data-pubs-count="journal"></span>                                … セクションの件数表示
 *
 * CVセクション（cv.json）: 各エントリは {ja: "<li>...</li>...", en: "..."} のHTMLチャンク
 *   <ol reversed="reversed" data-cv="awards" data-lang="ja"></ol>
 *   <span data-cv-count="awards"></span>
 *
 * data-lang="ja": 和文は日本語表記（cv_JP相当） / data-lang="en": 英語表記（cv_ENG相当）
 */
(function () {
  'use strict';

  var PUBS_PATH = '/data/publications.json';
  var CV_PATH = '/data/cv.json';

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

  function renderPubs(data) {
    var pubs = data.publications;
    var byId = {};
    pubs.forEach(function (p) { byId[p.id] = p; });

    document.querySelectorAll('[data-pubs]').forEach(function (el) {
      var section = el.getAttribute('data-pubs');
      var lang = el.getAttribute('data-lang') || 'ja';
      var html = '';
      pubs.forEach(function (p) {
        if (p.section === section) { html += renderEntry(p, lang); }
      });
      el.innerHTML = html;
    });

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

    document.querySelectorAll('[data-pubs-count]').forEach(function (el) {
      var section = el.getAttribute('data-pubs-count');
      el.textContent = pubs.filter(function (p) { return p.section === section; }).length;
    });
  }

  function renderCv(data) {
    var sections = data.sections || {};
    document.querySelectorAll('[data-cv]').forEach(function (el) {
      var key = el.getAttribute('data-cv');
      var lang = el.getAttribute('data-lang') || 'ja';
      var entries = sections[key] || [];
      el.innerHTML = entries.map(function (e) { return pick(e, lang); }).join('\n');
    });
    document.querySelectorAll('[data-cv-count]').forEach(function (el) {
      var key = el.getAttribute('data-cv-count');
      el.textContent = (sections[key] || []).length;
    });
  }

  function load(path, need, render) {
    if (!need) { return; }
    fetch(path)
      .then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.json();
      })
      .then(render)
      .catch(function (err) {
        if (window.console) {
          console.error('publications.js: failed to load ' + path + ' — ' + err +
            ' (file:// で開くと読み込めません。Live PreviewかHTTPサーバ経由で表示してください)');
        }
      });
  }

  load(PUBS_PATH, document.querySelector('[data-pubs],[data-pubs-ids],[data-pubs-count]'), renderPubs);
  load(CV_PATH, document.querySelector('[data-cv],[data-cv-count]'), renderCv);
})();
