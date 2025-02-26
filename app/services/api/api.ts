/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig } from "./api.types"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { EventListResponseModel } from "@/models/EventListResponseModel"
import { EvetnDetailResponseModel } from "@/models/EventDetailResponseModel"
import { LoginRequestModel } from "@/models/LoginRequestModel"
import { LogoinResponseModel } from "@/models/LoginResponseMode"
import { RegisterResponseModel } from "@/models/RegisterResponseModel"
import { ChangePasswordLinkRequstModel } from "@/models/ChangePasswordLinkRequestModel"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.apisauce.addMonitor(this.monitor)
  }

  monitor = (response: any) => {
    console.log("Request URL:", response.config.url)
    console.log("Request Headers:", response.config.headers)
    console.log("Request Body:", response.config.data)
    console.log("Response:", response.data)
  }

  getEvents= async(monthId:string): Promise<{kind:"ok",data:EventListResponseModel}|GeneralApiProblem>=>{
    const response: ApiResponse<EventListResponseModel> = await this.apisauce.get(
      "www.chilango.com/json/events-by-month/"+monthId+".json",
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data: EventListResponseModel = response.data!
      return { kind: "ok", data: data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(
          `Bad data: ${(e as Error).message}\n${response.data}`,
          (e as Error).stack,
        )
      }
      return { kind: "bad-data" }
    }
  }

  getEventDetail= async(id:string): Promise<{kind:"ok",data:EvetnDetailResponseModel}|GeneralApiProblem>=>{
    const response: ApiResponse<EvetnDetailResponseModel> = await this.apisauce.get(
      "json/events/"+id+".json",
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data: EvetnDetailResponseModel = response.data!
      return { kind: "ok", data: data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(
          `Bad data: ${(e as Error).message}\n${response.data}`,
          (e as Error).stack,
        )
      }
      return { kind: "bad-data" }
    }
  }

  login= async(body: LoginRequestModel): Promise<{kind:"ok",data:LogoinResponseModel}|GeneralApiProblem>=>{
    const response: ApiResponse<LogoinResponseModel> = await this.apisauce.post(
      "app/login",
      body,
      {baseURL: "https://login.chilango.com/"}
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data: LogoinResponseModel = response.data!
      return { kind: "ok", data: data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(
          `Bad data: ${(e as Error).message}\n${response.data}`,
          (e as Error).stack,
        )
      }
      return { kind: "bad-data" }
    }
  }

  register= async(body: LoginRequestModel): Promise<{kind:"ok",data:RegisterResponseModel}|GeneralApiProblem>=>{
    const response: ApiResponse<RegisterResponseModel> = await this.apisauce.post(
      "app/register",
      body,
      {baseURL: "https://login.chilango.com/"}
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data: RegisterResponseModel = response.data!
      return { kind: "ok", data: data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(
          `Bad data: ${(e as Error).message}\n${response.data}`,
          (e as Error).stack,
        )
      }
      return { kind: "bad-data" }
    }
  }

  sendPasswordResetLink= async(body: ChangePasswordLinkRequstModel): Promise<{kind:"ok",data:RegisterResponseModel}|GeneralApiProblem>=>{
    const response: ApiResponse<RegisterResponseModel> = await this.apisauce.post(
      "app/forgot-password",
      body,
      {baseURL: "https://login.chilango.com/"}
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      const data: RegisterResponseModel = response.data!
      return { kind: "ok", data: data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(
          `Bad data: ${(e as Error).message}\n${response.data}`,
          (e as Error).stack,
        )
      }
      return { kind: "bad-data" }
    }
  }

}






// Singleton instance of the API for convenience
export const api = new Api()
