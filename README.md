# Mastermind 破譯密碼

純 HTML/CSS/JavaScript 的網頁版 Mastermind。支援簡單與難兩種提示規則、100 個關卡、計時、每關本機排行榜，以及滑鼠與鍵盤操作。

## 功能

- 100 關 deterministic 關卡，每個規則模式各自有答案。
- 簡單規則：每格下方顯示綠、白、黑線提示。
- 難規則：每列右側以圓點顯示提示數量。
- 7 步內破譯 4 格密碼。
- 計時與每關排行榜，資料儲存在瀏覽器 `localStorage`。
- 鍵盤操作：左右選格子，上下換顏色，Enter 或空白鍵判定。

## 本機測試

可以直接開啟 `index.html`，或用任一靜態檔案伺服器啟動專案目錄。

```powershell
python -m http.server 5173
```

然後開啟：

```text
http://localhost:5173
```

## APK 規劃

此專案目前是靜態 Web App，之後可以用 Capacitor 或 Android WebView 包裝。若使用 Capacitor，安裝 Node.js 後可新增 Capacitor 設定，將 web 目錄指向本專案根目錄或先搬到 `www/`。
