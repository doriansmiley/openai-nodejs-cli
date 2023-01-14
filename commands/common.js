const fs = require("fs");
const path = require("path");

module.exports = async function f(initDao = true) {
  //TODO add support for passing a profile flag
  const profiles = JSON.parse(
    fs.readFileSync(path.resolve(".") + "/config/profiles.json").toString()
  );
  // init the sdk
  const config = new SpiSdk.Config();
  config.daoCode = profiles.default.daoCode;
  config.mongoUrl = profiles.default.mongoUrl;
  config.assetStorageRoot = profiles.default.assetStorageRoot;
  config.assetStorageType = profiles.default.assetStorageType;
  config.baseUrl = profiles.default.baseUrl;
  config.webRoot = profiles.default.webRoot;
  config.tokenExpiryOffset = profiles.default.tokenExpiryOffset;
  config.parserCode = profiles.default.parserCode;
  config.httpServiceCode = profiles.default.httpServiceCode;
  config.eventDispatcherCode = profiles.default.eventDispatcherCode;
  config.templateApiUrl = profiles.default.templateApiUrl;
  config.webAssetMangerApiURL = profiles.default.webAssetMangerApiURL;
  SpiSdk.init(config, null, atob, btoa);
  if (!initDao) {
    return {
      config: config,
      SpiSdk: SpiSdk,
    };
  }
  const dao = Dao.DaoFactory.getInstance().getService(config);
  await dao.connect();
  return {
    dao: dao,
    config: config,
    SpiSdk: SpiSdk,
  };
};
