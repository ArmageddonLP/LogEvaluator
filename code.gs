/**
 * Returns an evaluation of a given log by url.
 * 1. logUrl: CellReference - ex.: https://dps.report/FWfO-20231021-210842_vg or https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill
 *    Accepted domains are *dps.report* and *gw2wingman.nevermindcreations*
 * 2. order: CellRange - ex.: [NAME,CM,EMBOLDENED,SUCCESS,DURATION]
 *    The properties in order will be directly replaced with the corresponding data.
 *    The example includes all possible values you can use.
 *    You are free to use less values and in different order.
 */
function evaluateLog(logUrl, order) {
  if (logUrl?.includes("gw2wingman.nevermindcreations")) {
    order = fillOrderWithWingmanData(logUrl, order);
  }
  if (logUrl?.includes("dps.report")) {
    order = fillOrderWithDpsReportData(logUrl, order);
  }
  return order;
}
/**
 * Internal Function: Avoid using this directly unless you know what you're doing.
 */
function fillOrderWithWingmanData(logUrl, order) {
  const json = UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getJson/"+logUrl.split("/").slice(-1)).getContentText();
  const meta = JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getMetadata/"+logUrl.split("/").slice(-1)).getContentText());
  const emboldened = json?.match(/"name":"Emboldened"/g)?.length>0;
  const duration = secondsToDuration(meta?.durationMS/1000);
  const success = meta?.success;
  const name = meta?.fightName;
  const cm = meta?.isCM;
  return fillOrder(order,emboldened,duration,success,name,cm);
}
/**
 * Internal Function: Avoid using this directly unless you know what you're doing.
 */
function fillOrderWithDpsReportData(logUrl, order) {
  const json = UrlFetchApp.fetch(logUrl).getContentText();
  const meta = JSON.parse(UrlFetchApp.fetch("https://dps.report/getUploadMetadata?permalink="+logUrl).getContentText());
  const emboldened = json?.match(/"name":"Emboldened"/g)?.length>0;
  const duration = secondsToDuration(meta?.encounter?.duration);
  const success = meta?.encounter?.success;
  const name = meta?.encounter?.boss + (meta?.encounter?.isCm?" CM":"");
  const cm = meta?.encounter?.isCm;
  return fillOrder(order,emboldened,duration,success,name,cm);
}
/**
 * Internal Function: Avoid using this directly unless you know what you're doing.
 */
function fillOrder(order,emboldened,duration,success,name,cm) {
  for (let i = 0; i < order?.length; i++) {
    if (Array.isArray(order[i])) {
      for (let j = 0; j < order[i]?.length; j++) {
        if (String(order[i][j])?.toUpperCase() == "EMBOLDENED") {
          order[i][j] = emboldened;
        }
        if (String(order[i][j])?.toUpperCase() == "DURATION") {
          order[i][j] = duration;
        }
        if (String(order[i][j])?.toUpperCase() == "SUCCESS") {
          order[i][j] = success;
        }
        if (String(order[i][j])?.toUpperCase() == "NAME") {
          order[i][j] = name;
        }
        if (String(order[i][j])?.toUpperCase() == "CM") {
          order[i][j] = cm;
      }
      }
    } else {
      if (String(order[i])?.toUpperCase() == "EMBOLDENED") {
        order[i] = emboldened;
      }
      if (String(order[i])?.toUpperCase() == "DURATION") {
        order[i] = duration;
      }
      if (String(order[i])?.toUpperCase() == "SUCCESS") {
        order[i] = success;
      }
      if (String(order[i])?.toUpperCase() == "NAME") {
        order[i] = name;
      }
      if (String(order[i])?.toUpperCase() == "CM") {
        order[i] = cm;
      }
    }
  }
  return order;
}
/**
 * Internal Function: Avoid using this directly unless you know what you're doing.
 */
function secondsToDuration(secs) {
  if (isNaN(secs)) {
    return "00:00:00";
  }
  secs = Math.floor(secs);
  const hours = Math.floor(secs/3600);
  const minutes = Math.floor(secs % 3600 / 60);
  const seconds = secs % 60;
  return hours.toString().padStart(2,"0")+":"+minutes.toString().padStart(2,"0")+":"+seconds.toString().padStart(2,"0");
}

/**
 * Returns the name of a boss on wingman by bossId.
 * 1. bossId: CellReference - ex.: 19691
 *    Id of the boss on wingman
 */
function wingman_Boss_Name(bossId) {
  var cm = "";
  if (bossId < 0) {
    bossId = -1 * bossId;
    cm = " CM";
  }
  return JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/bosses").getContentText())?.[bossId]?.name + cm;
}

/**
 * Returns the current patch record of a boss on wingman by bossId.
 * 1. bossId: CellReference - ex.: 19691
 *    Id of the boss on wingman
 */
function wingman_Boss_Record(bossId) {
  return secondsToDuration(JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/boss?bossID="+bossId+"&era=this").getContentText())?.duration_top/1000);
}
