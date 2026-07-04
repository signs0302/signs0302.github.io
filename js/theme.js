/*
 * theme.js — ダークモード自動追従
 * OSの設定（prefers-color-scheme）に合わせてライト／ダークを自動で切り替える。
 * OS側の設定変更にもリアルタイムで追従する。手動トグルはなし。
 */
(function () {
  'use strict';
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function apply() {
    document.documentElement.setAttribute('data-bs-theme', mq.matches ? 'dark' : 'light');
  }
  apply();
  if (mq.addEventListener) {
    mq.addEventListener('change', apply);
  } else if (mq.addListener) {
    mq.addListener(apply); // 古いブラウザ用
  }
})();
