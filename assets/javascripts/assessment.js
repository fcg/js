/* ==========================================================
   移民资格在线评估（简化参考版）
   仅作方向性参考，不构成任何官方评估结论；
   最终以官方政策及飞出国顾问评估为准。
   评估结果一键生成邮件发送至 flbd02@flyabroad.com.cn
   ========================================================== */
(function () {
  "use strict";

  var EMAIL_TO = "flbd02@flyabroad.com.cn";

  var AGE_TXT = { "18": "18-24 岁", "29": "25-29 岁", "34": "30-34 岁", "39": "35-39 岁", "44": "40-44 岁", "45": "45 岁及以上" };
  var EDU_TXT = { high: "高中及以下", college: "大专", bach: "本科", master: "硕士", phd: "博士" };
  var LANG_TXT = { l6: "雅思 6.0 及以下", l65: "雅思 6.5（约 CLB8）", l7: "雅思 7.0（约 CLB9）", l8: "雅思 8.0 及以上" };
  var EXP_TXT = { n: "少于 1 年", s3: "1-3 年", s5: "3-5 年", s8: "5-8 年", o8: "8 年以上" };
  var PREF_TXT = { any: "不限（全部评估）", ca: "加拿大", au: "澳洲", nz: "新西兰", us: "美国" };

  function $(id) { return document.getElementById(id); }
  function val(id) { return $(id).value; }

  var lastSummary = [];

  function levelTag(level, text) {
    return '<span class="fa-level fa-level-' + level + '">' + text + "</span>";
  }

  function card(program, level, levelText, scoreHtml, note, link, linkText) {
    return (
      '<div class="fa-card">' +
        '<div class="fa-card-head"><h3>' + program + "</h3>" + levelTag(level, levelText) + "</div>" +
        scoreHtml +
        '<p class="fa-note">' + note + "</p>" +
        '<a class="fa-card-link" href="' + link + '">' + linkText + " →</a>" +
      "</div>"
    );
  }

  function scoreLine(html) {
    return '<p class="fa-score">' + html + "</p>";
  }

  function run() {
    var a = {
      age: val("fa-age"),
      edu: val("fa-edu"),
      lang: val("fa-lang"),
      exp: val("fa-exp"),
      pref: val("fa-pref")
    };

    var summary = [];
    var results = [];

    /* ---------- 澳洲 189/190（EOI 打分简化版） ---------- */
    var auAge = { "18": 15, "29": 30, "34": 30, "39": 25, "44": 15, "45": 0 }[a.age];
    var auLang = { l6: 0, l65: 0, l7: 10, l8: 20 }[a.lang];
    var auEdu = { high: 10, college: 10, bach: 15, master: 15, phd: 20 }[a.edu];
    var auExp = { n: 0, s3: 0, s5: 5, s8: 10, o8: 15 }[a.exp];
    var auBonus = a.pref === "au" ? 5 : 0;
    var auTotal = auAge + auLang + auEdu + auExp + auBonus;
    var auLevel, auLevelText, auNote;
    if (auTotal >= 65) { auLevel = "high"; auLevelText = "基本达标"; }
    else if (auTotal >= 60) { auLevel = "mid"; auLevelText = "接近门槛"; }
    else { auLevel = "low"; auLevelText = "暂未达标"; }
    auNote = "年龄 " + auAge + " + 语言 " + auLang + " + 学历 " + auEdu + " + 经验 " + auExp +
      (auBonus ? " + 州担保 5" : "") + " = <b>" + auTotal + "</b> 分（EOI 达标线参考 65 分）。" +
      (a.pref === "au" ? " 已按 190 州担保示意加分。" : " 如需加分可关注州担保 190。") +
      " 是否达标还取决于职业是否在清单及邀请情况。";

    results.push(card(
      "澳洲 189/190 技术移民", auLevel, auLevelText,
      scoreLine("EOI 参考分 <b>" + auTotal + "</b> <small>/ 65 达标线</small>"),
      auNote,
      "../au/189/", "查看 189 详情"
    ));
    summary.push("澳洲 189/190（" + auLevelText + "）：EOI 参考分 " + auTotal + "/65");

    /* ---------- 加拿大 EE（CRS 简化版） ---------- */
    var caAge = { "18": 90, "29": 100, "34": 95, "39": 80, "44": 50, "45": 0 }[a.age];
    var caLang = { l6: 64, l65: 88, l7: 118, l8: 136 }[a.lang];
    var caEdu = { high: 30, college: 60, bach: 120, master: 135, phd: 150 }[a.edu];
    var caExp = { n: 0, s3: 13, s5: 25, s8: 50, o8: 50 }[a.exp];
    var caTotal = caAge + caLang + caEdu + caExp;
    var caLevel, caLevelText, caNote;
    if (caTotal >= 500) { caLevel = "high"; caLevelText = "较有竞争力"; }
    else if (caTotal >= 460) { caLevel = "mid"; caLevelText = "可争取"; }
    else { caLevel = "low"; caLevelText = "需提升"; }
    caNote = "简化 CRS 参考 " + caTotal + " 分（年龄 " + caAge + " + 语言 " + caLang + " + 学历 " + caEdu +
      " + 经验 " + caExp + "）。完整 CRS 还含交叉分、配偶因素等；近年邀请分随每轮变化，" +
      (caTotal >= 500 ? "当前属于竞争较强分段。" : "建议同步提升语言或学历。");

    results.push(card(
      "加拿大联邦 EE 快速通道", caLevel, caLevelText,
      scoreLine("CRS 参考分 <b>" + caTotal + "</b> <small>/ 满分 1200</small>"),
      caNote,
      "../ca/ee/", "查看 EE 详情"
    ));
    summary.push("加拿大 EE（" + caLevelText + "）：CRS 参考分 " + caTotal + "/1200");

    /* ---------- 新西兰 SMC（6 分制简化） ---------- */
    var nzEdu = { high: 1, college: 2, bach: 3, master: 5, phd: 6 }[a.edu];
    var nzLevel, nzLevelText, nzNote;
    if (nzEdu >= 6) { nzLevel = "high"; nzLevelText = "基本达标"; }
    else if (nzEdu >= 5) { nzLevel = "mid"; nzLevelText = "需工作加分"; }
    else { nzLevel = "low"; nzLevelText = "需规划"; }
    nzNote = "学历折算 " + nzEdu + " 分（新西兰 6 分制简化：本科 3 / 硕士 5 / 博士 6）。" +
      (nzEdu >= 6 ? "博士学位可直接视为满足 6 分要求。" :
       nzEdu >= 5 ? "需新西兰技能工作或高收入等额外加分达到 6 分。" :
       "建议先提升学历，或通过新西兰技能工作年限累计加分。") +
      (a.age === "45" ? " 另需确认年龄资格（技术移民年龄上限参考 55 岁）。" : "");

    results.push(card(
      "新西兰技术移民 SMC", nzLevel, nzLevelText,
      scoreLine("6 分制参考 <b>" + nzEdu + "</b> <small>/ 6 分</small>"),
      nzNote,
      "../nz/smc/", "查看 SMC 详情"
    ));
    summary.push("新西兰 SMC（" + nzLevelText + "）：6 分制参考 " + nzEdu + "/6");

    /* ---------- 美国 EB-1A / NIW（条件参考） ---------- */
    var usLevel, usLevelText, usNote;
    var phd = a.edu === "phd", master = a.edu === "master", exp8 = a.exp === "o8", exp5 = a.exp === "s8" || a.exp === "o8";
    if (phd && exp8) { usLevel = "mid"; usLevelText = "具考察基础"; }
    else if (phd || (master && exp8)) { usLevel = "mid"; usLevelText = "可探索"; }
    else if (master || exp5) { usLevel = "low"; usLevelText = "需评估"; }
    else { usLevel = "low"; usLevelText = "暂不建议"; }
    usNote = "美国 EB-1A 需满足 10 项标准中至少 3 项，NIW 需高等学位或杰出能力。基于您的学历与经验" +
      (phd ? "（博士）" : master ? "（硕士）" : "（本科及以下）") +
      (exp8 ? "（8 年以上经验）" : exp5 ? "（5 年以上经验）" : "（经验较短）") +
      "，属于" + usLevelText + "方向，具体需结合论文、奖项、评审等材料综合判断。";

    results.push(card(
      "美国 EB-1A / NIW", usLevel, usLevelText,
      scoreLine("条件评估 <small>标准型审核</small>"),
      usNote,
      "../am/eb1a/", "查看 EB-1A 详情"
    ));
    summary.push("美国 EB-1A/NIW（" + usLevelText + "）：条件评估");

    /* ---------- 按偏好排序 ---------- */
    var order = { ca: 0, au: 1, nz: 2, us: 3 };
    if (a.pref !== "any" && order[a.pref] !== undefined) {
      var idx = order[a.pref];
      var moved = results.splice(idx, 1)[0];
      results.unshift(moved);
    }

    $("fa-cards").innerHTML = results.join("");
    lastSummary = summary;
    $("fa-result").removeAttribute("hidden");
    var submitBox = $("fa-submit-box");
    if (submitBox) { submitBox.removeAttribute("hidden"); }
    $("fa-result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function collectPayload() {
    var occ = val("fa-occ").trim() || "未填写";
    var contact = val("fa-contact").trim() || "未填写";
    return {
      "年龄": AGE_TXT[val("fa-age")],
      "最高学历": EDU_TXT[val("fa-edu")],
      "职业": occ,
      "工作经验": EXP_TXT[val("fa-exp")],
      "语言成绩": LANG_TXT[val("fa-lang")],
      "目标国家": PREF_TXT[val("fa-pref")],
      "联系方式": contact,
      "评估结果": lastSummary.length ? lastSummary.join("\n") : "（请先点击“开始评估”生成结果）"
    };
  }

  function buildMailto(payload) {
    var subject = "移民评估咨询（网站提交）";
    var body = "飞出国官网移民评估（自动生成，请查收并回复）\n\n【基本信息】\n";
    ["年龄", "最高学历", "职业", "工作经验", "语言成绩", "目标国家"].forEach(function (k) {
      body += k + "：" + payload[k] + "\n";
    });
    body += "\n【自动评估结果（简化参考）】\n" + payload["评估结果"] + "\n\n【联系方式】\n" + payload["联系方式"] + "\n";
    return "mailto:" + EMAIL_TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function fallbackMailto(payload) {
    window.location.href = buildMailto(payload);
  }

  function showSuccess() {
    var box = $("fa-submit-box");
    if (box) {
      box.innerHTML =
        '<div class="fa-submit-ok">' +
          '<h3>提交成功</h3>' +
          '<p>您的评估信息已直接发送至顾问邮箱（flbd02@flyabroad.com.cn），顾问将尽快与您联系。</p>' +
        "</div>";
    }
  }

  function handleSubmit() {
    var btn = $("fa-mailto");
    if (!btn) { return; }
    var payload = collectPayload();
    var formData = {
      _subject: "移民评估咨询（网站提交）",
      _template: "table",
      _captcha: "false",
      _honey: ""
    };
    Object.keys(payload).forEach(function (k) { formData[k] = payload[k]; });

    btn.disabled = true;
    btn.textContent = "提交中…";
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 15000);
    fetch("https://formsubmit.co/ajax/" + EMAIL_TO, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(formData),
      signal: ctrl.signal
    }).then(function (res) { return res.json(); })
      .then(function (data) {
        clearTimeout(timer);
        if (data && data.success === "true") { showSuccess(); }
        else { fallbackMailto(payload); }
      })
      .catch(function () {
        clearTimeout(timer);
        fallbackMailto(payload);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = $("fa-run");
    if (btn) { btn.addEventListener("click", run); }
    var submitBtn = $("fa-mailto");
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        handleSubmit();
      });
    }
  });
})();
