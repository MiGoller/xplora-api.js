import CryptoJS from "crypto-js";
import { GraphQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/types";

//  GraphQL query definitions
const GQLQueries = {
    "MUTATION": {
        "tokenM": "mutation IssueToken($countryPhoneNumber: String!, $phoneNumber: String!, $password: String!, $userLang: String!, $timeZone: String!) {\n  issueToken(countryPhoneNumber: $countryPhoneNumber, phoneNumber: $phoneNumber, password: $password, userLang: $userLang, timeZone: $timeZone) {\n    __typename\n    id\n    token\n    issueDate\n    expireDate\n    user {\n      __typename\n      ...UserFragment\n    }\n    app {\n      __typename\n      ...AppFragment\n    }\n    valid\n    w360 {\n      __typename\n      token\n      secret\n      qid\n    }\n  }\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}\nfragment AppFragment on App {\n  __typename\n  id\n  name\n  packageName\n  apiKey\n  apiSecret\n  terminalType\n  description\n  status\n  versions {\n    __typename\n    ...VersionFragment\n  }\n  create\n  update\n}\nfragment VersionFragment on AppVersion {\n  __typename\n  id\n  version\n  requireUpdate\n  downloadUrl\n  description\n  create\n  update\n}",
    },
    "QUERY": {
        "alarmsQ": "query Alarms($uid: String!) {\n  alarms(uid: $uid) {\n    __typename\n    ...WatchAlarmFragment\n  }\n}\nfragment WatchAlarmFragment on WatchAlarm {\n  __typename\n  id\n  vendorName\n  vendorId\n  watch {\n    __typename\n    ...WatchFragment\n  }\n  user {\n    __typename\n    ...UserFragment\n  }\n  name\n  start\n  end\n  weekRepeat\n  occurMin\n  description\n  extra\n  start\n  create\n  update\n  status\n}\nfragment WatchFragment on Watch {\n  __typename\n  id\n  group {\n    __typename\n    ...WatchGroupFragment\n  }\n  vendor {\n    __typename\n    ...VendorFragment\n  }\n  user {\n    __typename\n    ...UserFragment\n  }\n  name\n  os\n  osName\n  osVersion\n  brand\n  phoneNumber\n  qrCode\n  countryPhoneCode\n  onlineStatus\n  status\n  extra\n  create\n  update\n}\nfragment WatchGroupFragment on WatchGroup {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment VendorFragment on Vendor {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        "cardGroupsQ": "query CardGroups($isCampaign : Boolean!) {\n  cardGroups(status: ENABLE, isCampaign: $isCampaign) {\n    __typename\n    id\n    name\n    type\n    kind\n    status\n    listOrder\n    extra\n    description\n    create\n    update\n  }\n}",
        "contactsQ": "query Contacts($uid: String) {\n  contacts(uid: $uid) {\n    __typename\n    ...ContactListFragment\n  }\n}\nfragment ContactListFragment on XPContactList {\n  __typename\n  contacts {\n    __typename\n    ...ContactFragment\n  }\n  followRequest {\n    __typename\n    ...FollowRequestFragment\n  }\n}\nfragment ContactFragment on XPContact {\n  __typename\n  id\n  ownUser {\n    __typename\n    ...SimpleUserFragment\n  }\n  name\n  countryPhoneNumber\n  phoneNumber\n  contactUser {\n    __typename\n    ...SimpleUserFragment\n  }\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  approval\n  guardianType\n  create\n  update\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}\nfragment FollowRequestFragment on XPFollowRequest {\n  __typename\n  id\n  qid\n  deviceId\n  name\n  iconUrl\n  phoneNumber\n  countryCode\n  requestTime\n}",
        "readMyInfoQ": "query ReadMyInfo {\n  readMyInfo {\n    __typename\n    ...UserFragment\n  }\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        "watchesQ": "query Watches($uid: String) {\n  watches(uid: $uid) {\n    __typename\n    ...WatchFragment\n  }\n}\nfragment WatchFragment on Watch {\n  __typename\n  id\n  group {\n    __typename\n    ...WatchGroupFragment\n  }\n  vendor {\n    __typename\n    ...VendorFragment\n  }\n  user {\n    __typename\n    ...UserFragment\n  }\n  name\n  os\n  osName\n  osVersion\n  brand\n  phoneNumber\n  qrCode\n  countryPhoneCode\n  onlineStatus\n  status\n  extra\n  create\n  update\n}\nfragment WatchGroupFragment on WatchGroup {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment VendorFragment on Vendor {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        "watchLastLocateQ": "query WatchLastLocate($uid: String!) {\n  watchLastLocate(uid: $uid) {\n    __typename\n    ...WatchLastLocateFragment\n  }\n}\nfragment WatchLastLocateFragment on Location {\n  __typename\n  tm\n  lat\n  lng\n  rad\n  country\n  countryAbbr\n  province\n  city\n  addr\n  poi\n  battery\n  isCharging\n  isAdjusted\n  locateType\n  step\n  distance\n  isInSafeZone\n  safeZoneLabel\n}",
    }
}

//  Xplora endpoints
const ENDPOINT = {
    "API": "https://api.myxplora.com/api"
}

//  API_KEY and API_SECRET taken from public GraphQL response
const API_KEY = "c4156290289711eaa9f139f52846ef94";
const API_SECRET = "025b4f60289811eaaa6fc5eb1eb94883";

/**
 * Get the local system locale information.
 * @param {*} env 
 * @returns 
 */
 function getEnvLocale(env?: NodeJS.ProcessEnv) {
    env = env || process.env;
    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || "en-US";
}

export class GQLHandler {
    private sessionId: string;
    private accessToken: string;
    private accessTokenExpire: number;
    private userId: string;
    private userLocale: string;
    private timeZone: string;
    private countryPhoneNumber: string;
    private phoneNumber: string;
    private passwordMD5: string;
    private API_KEY: string;
    private API_SECRET: string;
    private issueDate: number;
    private expireDate: number;

    constructor(countryPhoneNumber: string, phoneNumber: string, password: string, userLang: string, timeZone: string) {
        this.sessionId = "";
        this.accessToken = "";
        this.accessTokenExpire = Date.now();
        this.userId = "";
        this.userLocale = "";
        this.timeZone = "";
        this.countryPhoneNumber = "";
        this.phoneNumber = "";
        this.passwordMD5 = "";
        this.API_KEY = API_KEY;
        this.API_SECRET = API_SECRET;
        this.issueDate = 0;
        this.expireDate = 0;

        //  Parse arguments
        this.countryPhoneNumber = countryPhoneNumber;
        this.phoneNumber = phoneNumber;
        this.userLocale = userLang || getEnvLocale(process.env).split(".")[0];
        this.timeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

        //  Calculate MD5 hash for password.
        this.passwordMD5 = CryptoJS.MD5(password).toString();
    }

    private getRequestHeaders(url: string, acceptedContentType: string): HeadersInit {
    
        // if (!client) throw new Error("XploraO2O Client MUST NOT be empty!");
        if (!acceptedContentType) throw new Error("acceptedContentType MUST NOT be empty!");
        if (!this.API_KEY) throw new Error("XploraO2O API_KEY MUST NOT be empty!");
        if (!this.API_SECRET) throw new Error("XploraO2O API_SECRET MUST NOT be empty!");
    
        const requestHeaders: HeadersInit = {};
        let authorizationHeader = "";
    
        //  Accepted Content Type
        requestHeaders["Accept"] = acceptedContentType;
        requestHeaders["Content-Type"] = acceptedContentType;
    
        //  Authorization headers
        if (!this.accessToken) {
            //  OPEN authorization
            authorizationHeader = `Open ${this.API_KEY}:${this.API_SECRET}`;
            requestHeaders["H-BackDoor-Authorization"] = authorizationHeader;
        }
        else {
            //  BEARER authorization
            const rfc1123DateString = new Date().toUTCString();
    
            authorizationHeader = `Bearer ${this.accessToken}:${this.API_SECRET}`;
            requestHeaders["H-Date"] = rfc1123DateString;
        }
    
        requestHeaders["H-Authorization"] = authorizationHeader;
        requestHeaders["H-BackDoor-Authorization"] = authorizationHeader;
    
        //  H-Tid header
        requestHeaders["H-Tid"] = Math.floor(Date.now() / 1000).toString();
    
        // console.debug(JSON.stringify(requestHeaders));
    
        return requestHeaders;
    }

    async runGqlQuery<T>(query: string, variables?: Variables): Promise<T> {
        if (!query) throw new Error("GraphQL guery string MUST NOT be empty!");
    
        const gqlClient = new GraphQLClient(ENDPOINT.API);
    
        // Add Xplora API headers
        const requestHeaders = this.getRequestHeaders(ENDPOINT.API, "application/json; charset=UTF-8");
    
        // Overrides the clients headers with the passed values
        const data = await gqlClient.request(query, variables, requestHeaders);
    
        return data;
    }

    private async runAuthorizedGqlQuery<T>(query: string, variables?: Variables): Promise<T> {
        //  Check if logged in to the API
        if (!this.accessToken) throw new Error("You have to login to the Xplora API first.");
        
        //  Run GraphQL query and return its respond.
        return await this.runGqlQuery(query, variables);
    }

    async login<T>(): Promise<T> {
        //  Set GraphQL variables
        const variables = {
            "countryPhoneNumber": this.countryPhoneNumber,
            "phoneNumber": this.phoneNumber,
            "password": this.passwordMD5,
            "userLang": this.userLocale,
            "timeZone": this.timeZone
        };
    
        //  Run GraphQL query and take care of the variables
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.runGqlQuery(GQLQueries.MUTATION.tokenM, variables);
    
        if (data.issueToken) {
            //  Login succeeded
            this.sessionId = data.issueToken.id;
            this.userId = data.issueToken.user.id;
            this.accessToken = data.issueToken.token;
            this.issueDate = data.issueToken.issueDate;
            this.expireDate = data.issueToken.expireDate;
        }
        else {
            // Login failed.
            throw new Error("Login to Xplora API failed.");
        }
    
        if (data.issueToken.app) {
            //  Update API_KEY and API_SECRET?
            if (data.issueToken.app.apiKey) this.API_KEY = data.issueToken.app.apiKey;
            if (data.issueToken.app.apiSecret) this.API_SECRET = data.issueToken.app.apiSecret;
        }
        // console.log(JSON.stringify(data));
    
        return data.issueToken;
    }

    async getAlarms<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.alarmsQ,
            { 
                "uid": wardId
            });
    }

    async getCardGroups<T>(isCampaign?: boolean): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.cardGroupsQ,
            { 
                "isCampaign": isCampaign
            });
    }

    async getContacts<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.contactsQ,
            { 
                "uid": wardId
            });
    }

    async getMyInfo<T>(): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.readMyInfoQ,
            { });
    }

    async getWatchLastLocation<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.watchLastLocateQ,
            { 
                "uid": wardId
            });
    }

    async getWatches<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.watchesQ,
            { 
                "uid": wardId
            });
    }
}

export async function login<T>(
    countryPhoneNumber: string, 
    phoneNumber: string, 
    password: string, 
    userLang: string, 
    timeZone: string): Promise<T> {
    const gqlHandler = new GQLHandler(countryPhoneNumber, phoneNumber, password, userLang, timeZone);
    return await gqlHandler.login();
}
