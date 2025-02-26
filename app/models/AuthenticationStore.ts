import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { load, remove, save } from "@/utils/storage"
import Config from "@/config"
import { CC } from "./LoginResponseMode"

/**
 * Model description here for TypeScript hints.
 */

const data: CC|null= load(Config.USER_INFO)

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({id:data?data.id:-1,type:data?data.type:"",name:data?data.name:"",})
  .actions(withSetPropAction)
  .views((store) => ({
    get isLoggedIn(){
      return store.id;
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((store) => ({
    
    saveUserInfo(userInfo: CC){
      save(Config.USER_INFO,userInfo)
      store.id=userInfo.id;
      store.type=userInfo.type;
      store.name=userInfo.name
    },
    logout(){
      remove(Config.USER_INFO)
      store.id=-1;
      store.type=""
      store.name=""
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshotOut extends SnapshotOut<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshotIn extends SnapshotIn<typeof AuthenticationStoreModel> {}
export const createAuthenticationStoreDefaultModel = () => types.optional(AuthenticationStoreModel, {})

