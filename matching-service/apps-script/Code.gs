const SHEET_NAME = "プロフィール";
const PROP_KEY = "MATCHING_DB_ID";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("つながりラウンジ｜β版")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(PROP_KEY);
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create("つながりラウンジ_プロフィール管理");
    props.setProperty(PROP_KEY, ss.getId());
  }
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "登録日時", "ニックネーム", "参加区分", "年代", "目的", "自己紹介", "公開状態", "削除キー_HASH"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 初回に実行すると、管理用スプレッドシートを作成します。
function setup() {
  const sheet = getSheet_();
  return sheet.getParent().getUrl();
}

function getPublicProfiles() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1)
    .filter(r => String(r[7]) === "公開")
    .map(r => ({
      id: String(r[0]),
      nickname: String(r[2]),
      group: String(r[3]),
      age: String(r[4]),
      goals: String(r[5]),
      intro: String(r[6])
    }))
    .reverse();
}

function registerProfile(data) {
  if (!data || data.consent !== true) throw new Error("利用上の注意への同意が必要です。");
  const nickname = clean_(data.nickname, 20);
  const group = String(data.group || "");
  const age = String(data.age || "");
  const goals = Array.isArray(data.goals) ? data.goals.map(String).filter(x => ["恋人探し", "友達づくり", "どちらも"].includes(x)) : [];
  const intro = clean_(data.intro, 180);

  const validAge = {
    "男性40歳以上": ["40〜49歳", "50〜59歳", "60歳以上"],
    "女性20〜29歳": ["20〜24歳", "25〜29歳"]
  };
  if (!nickname) throw new Error("ニックネームを入力してください。");
  if (!validAge[group] || !validAge[group].includes(age)) throw new Error("対象区分と年代の組み合わせを確認してください。");
  if (goals.length === 0) throw new Error("目的を1つ以上選んでください。");
  if (!intro) throw new Error("自己紹介を入力してください。");

  const id = Utilities.getUuid();
  const deleteKey = Utilities.getUuid().replace(/-/g, "").slice(0, 12);
  const hash = digest_(deleteKey);
  getSheet_().appendRow([id, new Date(), nickname, group, age, goals.join("・"), intro, "審査中", hash]);
  return { id: id, deleteKey: deleteKey, status: "審査中" };
}

function requestProfileDeletion(id, deleteKey) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id) && String(values[i][8]) === digest_(String(deleteKey || ""))) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  throw new Error("登録IDまたは削除キーが一致しません。");
}

function clean_(value, max) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, max);
}

function digest_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, "0")).join("");
}
