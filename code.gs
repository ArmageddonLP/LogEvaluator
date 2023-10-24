//=======================================================================================================================================================================
function evaluateLog(logUrl) {
  if (logUrl == null) {
    return JSON.stringify({"valid":false});
  }
  if (logUrl.includes("gw2wingman.nevermindcreations")) {
    const emboldened = wingman_Log_Emboldened(logUrl);
    const duration = wingman_Log_Duration(logUrl);
    const success = wingman_Log_Success(logUrl);
    const name = wingman_Log_Name(logUrl);
    const cm = wingman_Log_CM(logUrl);
    return JSON.stringify({"valid":!emboldened&&success,"emboldened":emboldened,"duration":duration,"success":success,"name":name,"cm":cm});
  }
  if (logUrl.includes("dps.report")) {
    const emboldened = dpsReport_Log_Emboldened(logUrl);
    const duration = dpsReport_Log_Duration(logUrl);
    const success = dpsReport_Log_Success(logUrl);
    const name = dpsReport_Log_Name(logUrl);
    const cm = dpsReport_Log_CM(logUrl);
    return JSON.stringify({"valid":!emboldened&&success,"emboldened":emboldened,"duration":duration,"success":success,"name":name,"cm":cm});
  }
  return JSON.stringify({"valid":false});
}
//=======================================================================================================================================================================
function dpsReport_Log_Emboldened(logUrl) {
    try {
    const json = UrlFetchApp.fetch(logUrl).getContentText()
    if (json?.match(/"error":"content not found"/g)?.length>0) {
      throw new Error();
    }
    return json?.match(/"name":"Emboldened"/g)?.length>0;
  } catch (error) {
    return "-";
  }
}
function dpsReport_Log_Duration(logUrl) {
  try {
    return seconds_To_Duration(JSON.parse(UrlFetchApp.fetch("https://dps.report/getUploadMetadata?permalink="+logUrl).getContentText())?.encounter?.duration);
  } catch (error) {
    return "-"
  }
}
function dpsReport_Log_Success(logUrl) {
  try {
    const success = JSON.parse(UrlFetchApp.fetch("https://dps.report/getUploadMetadata?permalink="+logUrl).getContentText())?.encounter?.success;
    if (success == undefined) {
      throw new Error();
    }
    return success;
  } catch (error) {
    return "-";
  }
}
function dpsReport_Log_Name(logUrl) {
  try {
    const response = JSON.parse(UrlFetchApp.fetch("https://dps.report/getUploadMetadata?permalink="+logUrl).getContentText());
    const boss = response?.encounter?.boss;
    if (boss == undefined) {
      throw new Error();
    }
    const isCm = response?.encounter?.isCm;
    if (isCm == undefined) {
      throw new Error();
    }
    return boss + (isCm?" CM":"");
  } catch (error) {
    return "-";
  }
}
function dpsReport_Log_CM(logUrl) {
  try {
    const cm = JSON.parse(UrlFetchApp.fetch("https://dps.report/getUploadMetadata?permalink="+logUrl).getContentText())?.encounter?.isCm;
    if (cm == undefined) {
      throw new Error();
    }
    return cm;
  } catch (error) {
    return "-";
  }
}
//=======================================================================================================================================================================
function wingman_Log_Emboldened(logUrl) {
  try {
    const json = UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getJson/"+logUrl.split("/").slice(-1)).getContentText()
    if (json?.match(/"error":"404/g)?.length>0) {
      throw new Error();
    }
    return json?.match(/"name":"Emboldened"/g)?.length>0;
  } catch (error) {
    return "-";
  }
}
function wingman_Log_Duration(logUrl) {
  try {
    return seconds_To_Duration(JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getMetadata/"+logUrl.split("/").slice(-1)).getContentText())?.durationMS/1000);
  } catch (error) {
    return "-"
  }
}
function wingman_Log_Success(logUrl) {
  try {
    const success = JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getMetadata/"+logUrl.split("/").slice(-1)).getContentText())?.success;
    if (success == undefined) {
      throw new Error();
    }
    return success;
  } catch (error) {
    return "-";
  }
}
function wingman_Log_Name(logUrl) {
  try {
    const name = JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getJson/"+logUrl.split("/").slice(-1)).getContentText())?.fightName;
    if (name == undefined) {
      throw new Error();
    }
    return name;
  } catch (error) {
    return "-";
  }
}
function wingman_Log_CM(logUrl) {
  try {
    const cm = JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/getMetadata/"+logUrl.split("/").slice(-1)).getContentText())?.isCM;
    if (cm == undefined) {
      throw new Error();
    }
    return cm;
  } catch (error) {
    return "-";
  }
}
//=======================================================================================================================================================================
function wingman_Boss_Name(bossId) {
  try {
    var cm = "";
    if (bossId < 0) {
      bossId = -1 * bossId;
      cm = " CM";
    }
    const name = JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/bosses").getContentText())?.[bossId]?.name;
    if (name == undefined) {
      throw new Error();
    }
    return name + cm;
  } catch (error) {
    return "-";
  }
}
function wingman_Boss_Record(bossId) {
  try {
    return seconds_To_Duration(JSON.parse(UrlFetchApp.fetch("https://gw2wingman.nevermindcreations.de/api/boss?bossID="+bossId+"&era=this").getContentText())?.duration_top/1000);
  } catch (error) {
    return "-"
  }
}
//=======================================================================================================================================================================
function seconds_To_Duration(secs) {
  if (isNaN(secs)) {
    throw new Error();
  }
  secs = Math.floor(secs);
  const hours = Math.floor(secs/3600);
  const minutes = Math.floor(secs % 3600 / 60);
  const seconds = secs % 60;
  return hours.toString().padStart(2,"0")+":"+minutes.toString().padStart(2,"0")+":"+seconds.toString().padStart(2,"0");
}
//=======================================================================================================================================================================
console.log("evaluateLog: "+evaluateLog("https://dps.report/foobar"));
console.log("evaluateLog: "+evaluateLog("https://dps.report/bgWc-20231021-231734_ca"));
console.log("evaluateLog: "+evaluateLog("https://dps.report/ktdW-20231023-203403_sh"));
console.log("evaluateLog: "+evaluateLog("https://gw2wingman.nevermindcreations.de/log/foobar"));
console.log("evaluateLog: "+evaluateLog("https://gw2wingman.nevermindcreations.de/log/68675-20231024-192629_adina_kill"));
console.log("evaluateLog: "+evaluateLog("https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill"));
//=======================================================================================================================================================================
//console.log("dpsReport_Log_Emboldened: "+dpsReport_Log_Emboldened("https://dps.report/foobar"));
//console.log("dpsReport_Log_Emboldened: "+dpsReport_Log_Emboldened("https://dps.report/bgWc-20231021-231734_ca"));
//console.log("dpsReport_Log_Emboldened: "+dpsReport_Log_Emboldened("https://dps.report/ktdW-20231023-203403_sh"));
//console.log("dpsReport_Log_Duration: "+dpsReport_Log_Duration("https://dps.report/foobar"));
//console.log("dpsReport_Log_Duration: "+dpsReport_Log_Duration("https://dps.report/bgWc-20231021-231734_ca"));
//console.log("dpsReport_Log_Duration: "+dpsReport_Log_Duration("https://dps.report/ktdW-20231023-203403_sh"));
//console.log("dpsReport_Log_Success: "+dpsReport_Log_Success("https://dps.report/foobar"));
//console.log("dpsReport_Log_Success: "+dpsReport_Log_Success("https://dps.report/bgWc-20231021-231734_ca"));
//console.log("dpsReport_Log_Success: "+dpsReport_Log_Success("https://dps.report/ktdW-20231023-203403_sh"));
//console.log("dpsReport_Log_Name: "+dpsReport_Log_Name("https://dps.report/foobar"));
//console.log("dpsReport_Log_Name: "+dpsReport_Log_Name("https://dps.report/bgWc-20231021-231734_ca"));
//console.log("dpsReport_Log_Name: "+dpsReport_Log_Name("https://dps.report/ktdW-20231023-203403_sh"));
//console.log("dpsReport_Log_CM: "+dpsReport_Log_CM("https://dps.report/foobar"));
//console.log("dpsReport_Log_CM: "+dpsReport_Log_CM("https://dps.report/bgWc-20231021-231734_ca"));
//console.log("dpsReport_Log_CM: "+dpsReport_Log_CM("https://dps.report/ktdW-20231023-203403_sh"));
//=======================================================================================================================================================================
//console.log("wingman_Log_Emboldened: "+wingman_Log_Emboldened("https://gw2wingman.nevermindcreations.de/log/foobar"));
//console.log("wingman_Log_Emboldened: "+wingman_Log_Emboldened("https://gw2wingman.nevermindcreations.de/log/68675-20231024-192629_adina_kill"));
//console.log("wingman_Log_Emboldened: "+wingman_Log_Emboldened("https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill"));
//console.log("wingman_Log_Duration: "+wingman_Log_Duration("https://gw2wingman.nevermindcreations.de/log/foobar"));
//console.log("wingman_Log_Duration: "+wingman_Log_Duration("https://gw2wingman.nevermindcreations.de/log/68675-20231024-192629_adina_kill"));
//console.log("wingman_Log_Duration: "+wingman_Log_Duration("https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill"));
//console.log("wingman_Log_Success: "+wingman_Log_Success("https://gw2wingman.nevermindcreations.de/log/foobar"));
//console.log("wingman_Log_Success: "+wingman_Log_Success("https://gw2wingman.nevermindcreations.de/log/68675-20231024-192629_adina_kill"));
//console.log("wingman_Log_Success: "+wingman_Log_Success("https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill"));
//console.log("wingman_Log_Name: "+wingman_Log_Name("https://gw2wingman.nevermindcreations.de/log/foobar"));
//console.log("wingman_Log_Name: "+wingman_Log_Name("https://gw2wingman.nevermindcreations.de/log/68675-20231024-192629_adina_kill"));
//console.log("wingman_Log_Name: "+wingman_Log_Name("https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill"));
//console.log("wingman_Log_CM: "+wingman_Log_CM("https://gw2wingman.nevermindcreations.de/log/foobar"));
//console.log("wingman_Log_CM: "+wingman_Log_CM("https://gw2wingman.nevermindcreations.de/log/68675-20231024-192629_adina_kill"));
//console.log("wingman_Log_CM: "+wingman_Log_CM("https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill"));
//=======================================================================================================================================================================
//console.log("wingman_Boss_Name: "+wingman_Boss_Name(69));
//console.log("wingman_Boss_Name: "+wingman_Boss_Name(17194));
//console.log("wingman_Boss_Name: "+wingman_Boss_Name(-17194));
//console.log("wingman_Boss_Record: "+wingman_Boss_Record(69));
//console.log("wingman_Boss_Record: "+wingman_Boss_Record(17194));
//console.log("wingman_Boss_Record: "+wingman_Boss_Record(-17194));
//=======================================================================================================================================================================