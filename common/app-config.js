(function (global) {
  var SHARED_GAS_URL = "https://script.google.com/macros/s/AKfycbzFqNc9tAB_TDqyNIXe_rkbHB6gorUGFljSGtc8boyRsW6zcztZ8-2JgRVipe9WOnuA/exec";

  var PAGE_CONFIGS = {
    profile: {
      liffId: "2011489610-3P5OEF1C",
      gasUrl: SHARED_GAS_URL
    },
    bookroom: {
      liffId: "2008893549-vbVJOMEv",
      gasUrl: SHARED_GAS_URL
    },
    notice: {
      liffId: "2008893549-d75d72lX",
      gasUrl: SHARED_GAS_URL,
      registerFormUrl: "https://liff.line.me/2011489610-3P5OEF1C"
    },
    attendance: {
      liffId: "2008893549-jeCNKx4Y",
      gasUrl: SHARED_GAS_URL
    },
    safetycheck: {
      liffId: "2008893549-RZBPRM9X",
      gasUrl: SHARED_GAS_URL,
      gatewayUrl: ""
    }
  };

  function getPageConfig(pageKey) {
    var key = String(pageKey || "").trim();
    return PAGE_CONFIGS[key] || {};
  }

  global.AppConfig = {
    SHARED_GAS_URL: SHARED_GAS_URL,
    PAGE_CONFIGS: PAGE_CONFIGS,
    getPageConfig: getPageConfig
  };
})(typeof window !== "undefined" ? window : globalThis);
