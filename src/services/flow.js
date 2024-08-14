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
}