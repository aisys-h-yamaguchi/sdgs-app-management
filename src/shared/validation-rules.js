/**
 * バリデーションルール
 *
 *
 */
const rules = {
  required: (v) => !!v || "必ず入力してください", // 入力必須の制約
  // 文字数の制約
  lessThan50Chars: (v) => !v || v.length <= 50 || "50文字以内で入力してください",
  lessThan12Chars: (v) => !v || v.length <= 12 || "12文字以内で入力してください",
  lessThan250Chars: (v) => !v || v.length <= 250 || "250文字以内で入力してください",
  // 電話番号(全体では10か11桁、先頭は0。フリーダイヤル以外はハイフン区切りの前2つで6桁、3つ目で4桁。フリーダイヤルは1つ目で4桁、それ以降で6桁、3つ目はない可能性もある。)
  phoneNumber: (v) => !v || v.length <= 11 || "11文字以内で入力してください",
  // 郵便番号(現在は3桁-4桁しか存在しない)
  postalCode: (v) => /^[0-9]{3}-[0-9]{4}$/.test(v),
  integer: (v) => !v || v.match(/^[0-9]+$/) != null || "半角数字で入力してください",

  url_rule: (v) => !v || v.match(/^http(|s):\/\/.+/) != null || "URL形式で入力してください", // URL形式の制約

  email: (v) =>
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(v) || v === "",
};

export default rules;
