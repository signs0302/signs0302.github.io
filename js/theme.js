/*
 * theme.js — ダークモード切替
 * localStorageに保存し、次回訪問時も維持する。
 * ナビの月アイコンボタン（onclick="toggleTheme()"）から呼ばれる。
 */
(function () {
  'use strict';
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-bs-theme', saved);
  }
  window.toggleTheme = function () {
    var cur = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', cur);
    try { localStorage.setItem('theme', cur); } catch (e) {}
    return false;
  };
})();
