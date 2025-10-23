# white_cats & dsand 設計思想ガイド
## Shinichi氏から学んだ本質的な知識

---

## 📚 目次

1. [核心的な設計思想](#核心的な設計思想)
2. [命名の由来と歴史](#命名の由来と歴史)
3. [dsandの三位一体](#dsandの三位一体)
4. [class()がトグルである理由](#classがトグルである理由)
5. [white_catsの本質](#white_catsの本質)
6. [「現実を否定しない」哲学](#現実を否定しない哲学)
7. [内在的な型システム](#内在的な型システム)
8. [TypeScript Reactのアンチパターン](#typescript-reactのアンチパターン)
9. [コード量の比較](#コード量の比較)
10. [実践的なパターン](#実践的なパターン)

---

## 核心的な設計思想

### **「見た目と振る舞いは一致する」**

これがwhite_catsとdsandの最も重要な原則。

#### 悪い例（不一致）
```javascript
// 見た目: 「非表示状態」を表現
div.class('game-over hidden')

// 振る舞い: 「非表示状態にする」
$.byId('gameOver').class('hidden')  // トグルされて表示される！
```

#### 良い例（一致）
```javascript
// 見た目: ボタンの基本スタイル
button.class('menuBtn')

// 振る舞い: ボタンの状態を「切り替える」
button.class('active')  // トグル = 状態の切り替え
```

### なぜこれが重要か

**class名 = 役割名 = イベントハンドラのキー**

```javascript
// 1. 見た目（DOM）
button.class('startBtn').on('click')

// 2. 振る舞い（処理）
_($.role).put({
  startBtn: {  // ← class名と自動で紐づく！
    click(e, data) { ... }
  }
});

// 3. 再描画
_($.pack).put({
  startBtn: {  // ← 同じ名前で自動紐付け
    click(e, result) { ... }
  }
});
```

**同じ名前で自動的に紐づく = 見た目と振る舞いが一致**

---

## 命名の由来と歴史

### white_catsの前身：losand

```javascript
// losand (Lo-sand) = _ で挟む
_([1,2,3]).map(v => v * 2)._
 ↑                        ↑
 挟む                    挟む
```

### dsand

```javascript
// dsand (D-sand) = $ で挟む
$(div).class('foo').$
 ↑               ↑
 挟む          挟む
```

### "sand" = 挟む

**ラップ → 変換 → アンラップ** という Monad的な構造を表現

- **losand** = データ処理の「挟む」
- **white_cats** = losandの進化版
- **dsand** = DOM版の「挟む」

### white_catsの起源

**ボードゲーム設計の実体験から生まれた**

> 「自分のボードゲームの設計があって、それをオブジェクト指向で実装しようとしたら破綻したのがきっかけでもあったんです。」
> — Shinichi

#### OOPでの破綻
```javascript
// オブジェクト指向だと...
class Board {
  pieces: Piece[];
  currentPlayer: Player;
  // 循環参照、状態管理の複雑化
}
```

#### 関数型アプローチ
```javascript
// 状態 = データ
const state = { board: [...], currentPlayer: 0 };

// ルール = 関数
const movePiece = (state, from, to) => newState;
```

**この経験が、$.data（状態）と$.role（振る舞い）の分離設計に結実**

---

## dsandの三位一体

### 🎭 舞台演劇のメタファー

```javascript
// 舞台俳優（DOM要素）
button.class('startBtn').on('click')

// 演技（$.role）= データ処理
_($.role).put({
  startBtn: {
    click(e, data) {
      // データの世界のみ
      // DOMは触らない！
      return processedData;
    }
  }
});

// 衣装直し（$.pack）= 再描画
_($.pack).put({
  startBtn: {
    click(e, data) {  // $.roleの返値を受け取る
      // 見た目の世界のみ
      // データは触らない！
      $(e).now(data.result);
    }
  }
});
```

### データフロー

```
イベント発生
  ↓
$.role（演技・データ処理）
  ↓ 返値
$.pack（衣装直し・再描画）
```

### $.dataの役割

**内在データを$.dataとして宣言することで、見た目と振る舞いの一致に対するデータの関係性の整理が行いやすい**

```javascript
_($.data).put({
  score: 0,
  isPaused: false,
  board: [...]
});

// $.roleからアクセス
_($.role).put({
  button: {
    click(e) {
      return { ...$.data, score: $.data.score + 100 };
    }
  }
});
```

---

## class()がトグルである理由

### 質問：「通常、classを直接設定するタイミングはいつでしょう？」

#### 答え：初期構築時と実行時は異なる

**初期構築時（DOM生成時）**
```javascript
div.class('game-over')  // 基本的なスタイルクラス
```
→ これは「この要素はこういうクラスを持つ」という**宣言**

**実行時（状態変化時）**
```javascript
element.class('hidden')  // トグル
```
→ これは「状態を切り替える」という**操作**

### トグルが正しい理由

UI開発では**状態A ⇄ 状態B**の切り替えが本質

```javascript
// メニューの開閉
menuBtn.class('open')  // 開く→閉じる、閉じる→開く

// タブのアクティブ状態
tab.class('active')    // アクティブ⇄非アクティブ
```

### 明示的に表示/非表示したい場合

```javascript
// トグルではなく、直接制御
$.byId('modal').css({display: 'none'});   // 非表示
$.byId('modal').css({display: 'block'});  // 表示
```

---

## white_catsの本質

### 1. loop vs pipe

```javascript
// loop = 副作用を実行、値は保持（ループバック）
_(3).loop(console.log)._ === 3
// 3を出力するが、3が返る

// pipe = 値を変換（パイプライン）
_(3).pipe(v => v * 2)._ === 6
// 変換された結果が返る
```

#### オブジェクトの場合

```javascript
// プリミティブ = 変更できない
_(3).loop(n => { n = 4 })._ === 3

// オブジェクト = 参照だから変更できる！
_({a: 3}).loop(o => { o.a = 4 })._.a === 4
```

**「現実を否定しない」= JavaScriptの参照の仕組みをそのまま使う**

### 2. Array.forEachの改善

```javascript
// 通常のJavaScript
const arr = [1, 2, 3];
arr.forEach(console.log);  // undefined が返る
// ここでチェーンが切れる...

// white_cats
_([1, 2, 3])
  .each(console.log)    // 副作用実行
  .map(v => v * 2)      // でもチェーン続く！
  ._                    // [2, 4, 6]
```

**副作用も許容しつつ、値は保持 = 関数型と手続き型の融合**

### 3. 実用的なデバッグ

```javascript
_(userData)
  .loop(data => console.log('受信:', data))     // ログ、値は保持
  .pipe(data => validateData(data))             // 検証
  .loop(data => console.log('検証済:', data))   // ログ、値は保持
  .pipe(data => saveToDatabase(data))           // 保存
  .loop(data => console.log('保存完了:', data)) // ログ、値は保持
  ._
```

**loopを削除しても動作は変わらない！**

---

## 「現実を否定しない」哲学

### 1. グローバル状態を許容

```javascript
// React = Context地獄
const value = useContext(MyContext);
const [state, dispatch] = useReducer(reducer, initialState);

// dsand = シンプル
_($.data).put({ score: 100 });
```

### 2. 普通のDOM操作

```javascript
// React = 仮想DOM、useRef
const ref = useRef(null);
useEffect(() => {
  ref.current.focus();
}, []);

// dsand = 直接触る
$.byId('input').it.focus();
```

### 3. 普通のタイマー

```javascript
// React = useEffect地獄
useEffect(() => {
  const timer = setInterval(() => {...}, 1000);
  return () => clearInterval(timer);
}, [dependencies]);

// dsand = 普通のJavaScript
setInterval(() => {
  _($.data).put(processGameStep($.data));
}, 1000 / $.data.level);
```

### 4. Shadow DOMも使える

```javascript
// Web Components統合
customElement
  .shadow()
  .$(
    style.$('...'),
    div.$('Encapsulated!')
  )

// 解除も可能
element.shadowOff()
```

**ブラウザの標準機能をフル活用**

---

## 内在的な型システム

### white_catsの型判定

```javascript
let _ = function (x, y, c) {
  return _.upto(
    x == null
    ? _.prototype
    : _['#'][
      x.constructor.name === 'Array' ? 'Array' :
      x.constructor.name === 'Object' ? 'Object' :
      x.constructor.name === 'Date' ? 'Date' : ...
    ]
  );
};
```

**constructor.nameで実行時に型を判定**

### 型ごとに異なるメソッド

```javascript
_['#'] = {
  Object: { /* Object用メソッド */ },
  Array: { /* Array用メソッド */ },
  String: { /* String用メソッド */ },
  Date: { /* Date用メソッド */ },
  Promise: { /* Promise用メソッド */ }
}

// 同じメソッド名、違う挙動
_([1, 2, 3]).map(v => v * 2)._     // [2, 4, 6]
_({a: 1, b: 2}).map(v => v * 2)._  // {a: 2, b: 4}
```

### dsandも同様

```javascript
$.['#'] = {
  Element: { /* 通常の要素 */ },
  INPUT: { /* input要素 */ },
  SELECT: { /* select要素 */ },
  TABLE: { /* table要素 */ }
}

// 自動判定
$(document.querySelector('input'))  // INPUT用メソッド
$(document.querySelector('table'))  // TABLE用メソッド
```

### TypeScriptとの違い

> 「別に型が素直なら、静的な型付けでパズルゲームする意味ってありますかね？」
> — Shinichi

```javascript
// JavaScriptは元々型がある
typeof x                // "string", "number", "object"
x.constructor.name      // "Array", "Date", "RegExp"
x instanceof Array      // true/false

// これで十分！
```

**型パズルに時間を使うより、機能を作る**

---

## TypeScript Reactのアンチパターン

### Reactの複雑さ

```typescript
// 型パズル
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P]
};

// useState地獄
const [data, setData] = useState<User[] | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<Error | null>(null);

// useEffect地獄
useEffect(() => {
  const timer = setInterval(() => {
    setBoard(prev => movePiece(prev));
  }, 1000);
  return () => clearInterval(timer);
}, [level]);  // 依存配列の管理
```

### dsandのシンプルさ

```javascript
// 型定義不要
// 普通のasync/await
_($.role).put({
  fetchBtn: {
    async click(e, data) {
      const users = await fetch('/api/users').then(r => r.json());
      return users;  // 解決後の値
    }
  }
});

// 普通のsetInterval
setInterval(() => {
  _($.data).put(processStep($.data));
}, 1000);
```

### $.roleと$.packは非同期を許容

```javascript
_($.role).put({
  button: {
    async click(e) {
      const data = await fetchData();
      return data;  // Promiseを返してもOK
    }
  }
});

_($.pack).put({
  button: {
    async click(e, data) {  // 解決後の値を受け取る
      $.byId('list').$(renderList(data));
    }
  }
});
```

> 「reactが嫌いだからdsandを書いたんです。」
> — Shinichi

---

## コード量の比較

### テトリスの実装で比較

| 項目 | React | Vue | dsand |
|------|-------|-----|-------|
| **コード行数** | 900-1200行 | 600-800行 | **500行** |
| **ライブラリ** | 260KB+ | 90KB+ | **30-40KB** |
| **node_modules** | 200MB+ | 150MB+ | **0MB** |
| **ビルド** | 必須 | 必須 | **不要** |
| **型定義** | 200-300行 | オプション | **不要** |
| **設定ファイル** | 100行以上 | 100行以上 | **不要** |

### React版の構成
```
実装コード:       600-800行
型定義:          200-300行
設定ファイル:     100行以上
──────────────────────────
合計:            900-1200行

+ package.json依存: 20-30パッケージ
+ ビルドツール: webpack/vite
```

### dsand版の構成
```
実装コード:       470行
HTML:            30行（ライブラリ読込のみ）
CSS:             共通ファイル
──────────────────────────
合計:            500行

+ 依存:           white_cats + dsand のみ
+ ビルド:         不要！
```

**10分の1以下のサイズで、同等以上の機能を実現**

---

## 実践的なパターン

### 1. イベント処理の基本

```javascript
// ❌ addEventListener は使わない
document.addEventListener('keydown', handler);

// ✅ dsand的に
$body.class('gameControl').on('keydown');

// $.roleで処理
_($.role).put({
  gameControl: {
    keydown(e) {
      // データ処理
      return newData;
    }
  }
});

// $.packで再描画
_($.pack).put({
  gameControl: {
    keydown(e, data) {
      drawBoard(data);
    }
  }
});
```

### 2. コンポーネント化

```javascript
// Web Componentsなんていらない
// dsandがあればコンポーネントは作れる

// コンポーネント = 関数
const UserCard = (user) => 
  div.class('user-card').$(
    img.src(user.avatar),
    h3.$(user.name),
    p.$(user.email)
  );

// 使用
$.byId('container').$(
  ...users.map(UserCard)
);
```

### 3. 非同期データフェッチ

```javascript
_($.role).put({
  loadBtn: {
    async click(e) {
      const data = await fetch('/api/data').then(r => r.json());
      return data;
    }
  }
});

_($.pack).put({
  loadBtn: {
    click(e, data) {
      $.byId('list').$(
        ...data.map(item => li.$(item.name))
      );
    }
  }
});
```

### 4. 状態管理

```javascript
// データの一元管理
_($.data).put({
  users: [],
  selectedId: null,
  isLoading: false
});

// 更新
_($.data).put({
  ...$.data,
  users: newUsers,
  isLoading: false
});

// white_catsで変換
_($.data)
  .pipe(d => ({ ...d, users: newUsers }))
  .pipe(d => ({ ...d, isLoading: false }))
  ._
```

### 5. pure関数の分離

```javascript
// ❌ 副作用混在
function updateScore() {
  score += 100;
  $.byId('score').now(score);
}

// ✅ 純粋関数 + 副作用分離
const calculateScore = (current, lines) => 
  current + (lines * 10) ** 2;

// $.roleでデータ処理
_($.role).put({
  clearLine: {
    click(e) {
      return {
        ...$.data,
        score: calculateScore($.data.score, $.data.lines)
      };
    }
  }
});

// $.packで描画
_($.pack).put({
  clearLine: {
    click(e, data) {
      $.byId('score').now(data.score);
    }
  }
});
```

---

## まとめ：white_cats & dsand の本質

### 設計原則

1. **見た目と振る舞いの一致**
   - class名 = 役割名 = ハンドラのキー

2. **三位一体の分離**
   - $.data = 状態
   - $.role = 演技（データ処理）
   - $.pack = 衣装直し（再描画）

3. **現実を否定しない**
   - ブラウザAPIを直接使う
   - グローバル状態OK
   - 副作用も許容

4. **内在的な型システム**
   - constructor.nameで実行時判定
   - 型パズル不要

5. **実用主義**
   - 複雑な抽象化をしない
   - コード量を最小化
   - ビルド不要

### アンチパターン

**TypeScript + React = 複雑さの極致**

白猫の哲学：
- シンプル
- 実用的
- 素直

> 「まぁ、流行らせるには何歩か遅かったんですけどねｗｗｗ」
> 
> 「さようなら、型。こんにちは、dsand」
> 
> — Shinichi

---

## 参考リンク

- [white_cats GitHub](https://github.com/johnny-shaman/white_cats)
- [dsand GitHub](https://github.com/johnny-shaman/dsand)
- [white_cats npm](https://www.npmjs.com/package/white_cats)
- [dsand npm](https://www.npmjs.com/package/dsand)

---

*このドキュメントは、作者Shinichi氏との直接の対話から得られた知見をまとめたものです。*