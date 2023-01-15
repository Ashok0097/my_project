var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";
var connToken = "90932429|-31949269863376596|90955730";

$("#rlno").focus();

function saveRecNo2LS(jsonObj) {
  var LvData = JSON.parse(jsonObj.data);
  LocalStorage.setItem("recno", LvData.rec_no);
}

function getRlNoAsJsonObj() {
  var rlno = $("#rlno").val();
  var jsonStr = {
    id: rlno
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var data = JSON.parse(jsonObj.data).record;
  $("#sfname").val(data.fname);
  $("#sclass").val(data.clas);
  $("#sbdate").val(data.bdate);
  $("#saddress").val(data.adres);
  $("#sedate").val(data.edate);
}

function resetForm() {
  $("#rlno").val("");
  $("#sfname").val("");
  $("#sclass").val("");
  $("#sbdate").val("");
  $("#saddress").val("");
  $("#sedate").val("");
  $("#rlno").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#rlno").focus();
}

function validateData() {
  var rlno, sfname, sclass, sbdate, saddress, sedate;
  rlno = $("#rlno").val();
  sfname = $("#sfname").val();
  sclass = $("#sclass").val();
  sbdate = $("#sbdate").val();
  saddress = $("#saddress").val();
  sedate = $("#sedate").val();

  if (rlno === "") {
    alert("Roll-Num is missing");
    $("#rlno").focus();
    return "";
  }

  if (sfname === "") {
    alert("Student Full-Name is missing");
    $("#sfname").focus();
    return "";
  }

  if (sclass === "") {
    alert("Student Class is missing");
    $("#sclass").focus();
    return "";
  }

  if (sbdate === "") {
    alert("Student Date of Birth is missing");
    $("#sbdate").focus();
    return "";
  }

  if (saddress === "") {
    alert("Student is Address is missing");
    $("#saddress").focus();
    return "";
  }

  if (sedate === "") {
    alert("Student Enrollment Date is missing");
    $("#sedate").focus();
    return "";
  }

  var jsonStrObj = {
    id: rlno,
    fname: sfname,
    clas: sclass,
    bdate: sbdate,
    adres: saddress,
    edate: sedate
  };
  return JSON.stringify(jsonObj);
}

function getRlno() {
  var rlnoJsonObj = getRlNoAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, rlnoJsonObj);
  jQuery.ajaxSetup({async: false});
  var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({async: true});
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#sfname").focus();
  } else if (resJsonObj.status === 200) {
    $("#rlno").prop("disabled", true);
    fillData(resJsonObj);

    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#sfname").focus();
  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
  jQuery.ajaxSetup({async: false});
  var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({async: true});
  resetForm();
  $("#rlno").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, LocalStorage.getItem("recno"));
  jQuery.ajaxSetup({async: false});
  var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({async: true});
  console.log(resJsonObj);
  resetForm();
  $("#rlno").focus();
}
