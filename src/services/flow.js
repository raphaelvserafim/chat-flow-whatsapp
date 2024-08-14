import environment from "@theflow/configs/environment";
import httpService from "@theflow/services/api";

export class FlowService {

  static async fetchGetFlow(code) {
    try {
      const response = await httpService.get(environment.API.FLOW.INFO + "/" + code);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  static async saveNodes(code, data) {
    try {
      const response = await httpService.post(environment.API.FLOW.INFO + "/" + code + "/nodes", data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  static async updateNodes(code, code_nodes, data) {
    try {
      const response = await httpService.put(environment.API.FLOW.INFO + "/" + code + "/nodes/" + code_nodes, data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteNodes(code, code_nodes) {
    try {
      const response = await httpService.delete(environment.API.FLOW.INFO + "/" + code + "/nodes/" + code_nodes);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

}

