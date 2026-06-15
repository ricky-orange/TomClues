# Tom Clues

Tom Clues 是一個小遊戲集合網站 / App 原型。目前已完成第一個遊戲：Mastermind 破譯密碼。

## 已完成

- 首頁小遊戲集合入口。
- 明亮、粗框、卡片式的休閒遊戲視覺風格。
- 懸垂偵探剪影與微浮動動畫。
- Mastermind 遊戲頁，支援簡單與難兩種提示規則。
- 100 關、7 步限制、計時與每關本機排行榜。
- 滑鼠與鍵盤操作：左右選格，上下換色，Enter 或空白鍵判定。

## 本機測試

可以直接開啟 `index.html`，或用任一靜態檔案伺服器啟動專案目錄。

```powershell
python -m http.server 5173
```

然後開啟：

```text
http://localhost:5173
```

## 後續 APK 規劃

建議先補 PWA 離線快取，再用 Capacitor 包成 Android APK。這樣可以保留同一份 Web 版程式，同時支援手機安裝與瀏覽器遊玩。
