import { DefaultApi, ApiClient } from "ci-agents/ci-gen/javascript/src";

class Client extends DefaultApi {
  innerClient = null;
  state = null;

  constructor() {
    var apiClient = new ApiClient();
    apiClient.basePath = "/uisvc";
    apiClient.withCredentials = true;
    super(apiClient);
  }
}

export default Client;
