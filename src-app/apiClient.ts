import { FullCurrentState, LogStates, Ranks } from "../lib/types";

type TInfo = {
  description: string;
};

class APIClient {
  constructor() {}

  async getInfo(): Promise<TInfo> {
    return fetch("/api/info").then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }

  async getVPNNames(): Promise<Array<string>> {
    return fetch("/api/log_names").then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }

  async getState(logName: string): Promise<FullCurrentState> {
    return fetch(`/api/states/${logName}`).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }
}

export const apiClient = new APIClient();
