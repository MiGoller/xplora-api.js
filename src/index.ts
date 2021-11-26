/*
 * xplora-api.js
 *
 * Author: MiGoller
 * 
 * Copyright (c) 2021 MiGoller
 */

import CryptoJS from "crypto-js";
import { GraphQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/types";

/**
 * GraphQL query definitions (com/xplora/xplorao2o/queries)
 */
const GQLQueries = {
    "MUTATION": {
        "tokenM": "mutation IssueToken($countryPhoneNumber: String!, $phoneNumber: String!, $password: String!, $userLang: String!, $timeZone: String!) {\n  issueToken(countryPhoneNumber: $countryPhoneNumber, phoneNumber: $phoneNumber, password: $password, userLang: $userLang, timeZone: $timeZone) {\n    __typename\n    id\n    token\n    issueDate\n    expireDate\n    user {\n      __typename\n      ...UserFragment\n    }\n    app {\n      __typename\n      ...AppFragment\n    }\n    valid\n    w360 {\n      __typename\n      token\n      secret\n      qid\n    }\n  }\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}\nfragment AppFragment on App {\n  __typename\n  id\n  name\n  packageName\n  apiKey\n  apiSecret\n  terminalType\n  description\n  status\n  versions {\n    __typename\n    ...VersionFragment\n  }\n  create\n  update\n}\nfragment VersionFragment on AppVersion {\n  __typename\n  id\n  version\n  requireUpdate\n  downloadUrl\n  description\n  create\n  update\n}",
        "CHAT": {
            "sendChatTextM": "mutation SendChatText($uid : String!, $text : String!) {\n  sendChatText(uid: $uid, text: $text)\n}",
        }
    },
    "QUERY": {
        "alarmsQ": "query Alarms($uid: String!) {\n  alarms(uid: $uid) {\n    __typename\n    ...WatchAlarmFragment\n  }\n}\nfragment WatchAlarmFragment on WatchAlarm {\n  __typename\n  id\n  vendorName\n  vendorId\n  watch {\n    __typename\n    ...WatchFragment\n  }\n  user {\n    __typename\n    ...UserFragment\n  }\n  name\n  start\n  end\n  weekRepeat\n  occurMin\n  description\n  extra\n  start\n  create\n  update\n  status\n}\nfragment WatchFragment on Watch {\n  __typename\n  id\n  group {\n    __typename\n    ...WatchGroupFragment\n  }\n  vendor {\n    __typename\n    ...VendorFragment\n  }\n  user {\n    __typename\n    ...UserFragment\n  }\n  name\n  os\n  osName\n  osVersion\n  brand\n  phoneNumber\n  qrCode\n  countryPhoneCode\n  onlineStatus\n  status\n  extra\n  create\n  update\n}\nfragment WatchGroupFragment on WatchGroup {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment VendorFragment on Vendor {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        "cardGroupsQ": "query CardGroups($isCampaign : Boolean!) {\n  cardGroups(status: ENABLE, isCampaign: $isCampaign) {\n    __typename\n    id\n    name\n    type\n    kind\n    status\n    listOrder\n    extra\n    description\n    create\n    update\n  }\n}",
        "contactsQ": "query Contacts($uid: String) {\n  contacts(uid: $uid) {\n    __typename\n    ...ContactListFragment\n  }\n}\nfragment ContactListFragment on XPContactList {\n  __typename\n  contacts {\n    __typename\n    ...ContactFragment\n  }\n  followRequest {\n    __typename\n    ...FollowRequestFragment\n  }\n}\nfragment ContactFragment on XPContact {\n  __typename\n  id\n  ownUser {\n    __typename\n    ...SimpleUserFragment\n  }\n  name\n  countryPhoneNumber\n  phoneNumber\n  contactUser {\n    __typename\n    ...SimpleUserFragment\n  }\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  approval\n  guardianType\n  create\n  update\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}\nfragment FollowRequestFragment on XPFollowRequest {\n  __typename\n  id\n  qid\n  deviceId\n  name\n  iconUrl\n  phoneNumber\n  countryCode\n  requestTime\n}",
        "readMyInfoQ": "query ReadMyInfo {\n  readMyInfo {\n    __typename\n    ...UserFragment\n  }\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        "watchesQ": "query Watches($uid: String) {\n  watches(uid: $uid) {\n    __typename\n    ...WatchFragment\n  }\n}\nfragment WatchFragment on Watch {\n  __typename\n  id\n  group {\n    __typename\n    ...WatchGroupFragment\n  }\n  vendor {\n    __typename\n    ...VendorFragment\n  }\n  user {\n    __typename\n    ...UserFragment\n  }\n  name\n  os\n  osName\n  osVersion\n  brand\n  phoneNumber\n  qrCode\n  countryPhoneCode\n  onlineStatus\n  status\n  extra\n  create\n  update\n}\nfragment WatchGroupFragment on WatchGroup {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment VendorFragment on Vendor {\n  __typename\n  id\n  name\n  status\n  extra\n  description\n  create\n  update\n}\nfragment UserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  birth\n  birthStr\n  weight\n  height\n  countryCode\n  emailAddress\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  emailConfirm\n  status\n  file {\n    __typename\n    ...FileFragment\n  }\n  extra\n  xcoin\n  currentStep\n  totalStep\n  create\n  update\n  children {\n    __typename\n    id\n    guardian {\n      __typename\n      ...SimpleUserFragment\n    }\n    ward {\n      __typename\n      ...SimpleUserFragment\n    }\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        "watchLastLocateQ": "query WatchLastLocate($uid: String!) {\n  watchLastLocate(uid: $uid) {\n    __typename\n    ...WatchLastLocateFragment\n  }\n}\nfragment WatchLastLocateFragment on Location {\n  __typename\n  tm\n  lat\n  lng\n  rad\n  country\n  countryAbbr\n  province\n  city\n  addr\n  poi\n  battery\n  isCharging\n  isAdjusted\n  locateType\n  step\n  distance\n  isInSafeZone\n  safeZoneLabel\n}",
        "askWatchLocateQ": "query AskWatchLocate($uid: String!) {\n  askWatchLocate(uid: $uid)\n}",
        "trackWatchQ": "query TrackWatch($uid: String!) {\n  trackWatch(uid: $uid)\n}",
        "CHAT": {
            "chatsQ": "query Chats($uid : String!, $offset: Int, $limit: Int, $msgId: String) {\n  chats(uid: $uid, offset: $offset, limit: $limit, msgId: $msgId) {\n    __typename\n    offset\n    limit\n    list {\n      __typename\n      ...SimpleChatFragment\n    }\n  }\n}\nfragment SimpleChatFragment on SimpleChat {\n  __typename\n  id\n  msgId\n  type\n  sender {\n    __typename\n    ...SimpleUserFragment\n  }\n  receiver {\n    __typename\n    ...SimpleUserFragment\n  }\n  data\n  create\n}\nfragment SimpleUserFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  gender\n  countryCode\n  countryPhoneCode\n  phoneNumber\n  mobilePhoneNumber\n  file {\n    __typename\n    ...FileFragment\n  }\n  xcoin\n  currentStep\n  totalStep\n  contacts {\n    __typename\n    ...ContactsFragment\n  }\n}\nfragment FileFragment on File {\n  __typename\n  id\n  name\n}\nfragment ContactsFragment on Contact {\n  __typename\n  id\n  me {\n    __typename\n    ...ContactorFragment\n  }\n  contacter {\n    __typename\n    ...ContactorFragment\n  }\n  phoneNumber\n  extra\n  listOrder\n  file {\n    __typename\n    ...FileFragment\n  }\n  create\n  update\n}\nfragment ContactorFragment on User {\n  __typename\n  id\n  userId\n  name\n  nickname\n  countryCode\n  countryPhoneCode\n  mobilePhoneNumber\n  phoneNumber\n}",
        }
    }
}

/**
 * Xplora endpoints
 */
const ENDPOINT = {
    "API": "https://api.myxplora.com/api"
}

/**
 * Xplora API key
 * 
 * @remarks API_KEY taken from public GraphQL response
 */
const API_KEY = "c4156290289711eaa9f139f52846ef94";

/**
 * Xplora API secret
 * 
 * @remarks API_SECRET taken from public GraphQL response
 */
const API_SECRET = "025b4f60289811eaaa6fc5eb1eb94883";

/**
 * Get the local system locale information.
 * @param {*} env A process environment object
 * @returns Locale
 */
 function getEnvLocale(env?: NodeJS.ProcessEnv) {
    env = env || process.env;
    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || "en-US";
}

/**
 * Parses a GQL-query response
 * @param res The GQL-query response
 * @param resultObjName The name of the property to return the data
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseResponse(res: Record<string, unknown>, resultObjName: string): any {

    //  Check if response is set.
    if (!res) throw new Error("Query response must not be empty.");

    //  Check if response has "errors" object.
    // eslint-disable-next-line no-prototype-builtins
    if (res.hasOwnProperty("errors")) throw new Error(JSON.stringify(res["errors"]));

    //  Return the wanted result from the response
    // eslint-disable-next-line no-prototype-builtins
    if (res.hasOwnProperty(resultObjName)) {
        return res[resultObjName];
    }
    else {
        return {};
    }
}

//  =============================================================================================================
/**
 * Credential Helper class
 */
class CredentialHelper {
    _countryPhoneNumber: string;
    _phoneNumber: string;
    _password: string;
    _userLang: string;
    _timeZone: string;

    constructor(countryPhoneNumber: string, phoneNumber: string, password: string, userLocale: string, timeZone: string) {
        this._countryPhoneNumber = countryPhoneNumber;
        this._phoneNumber = phoneNumber;
        this._password = CryptoJS.MD5(password).toString();
        this._userLang = userLocale  || getEnvLocale(process.env).split(".")[0];
        this._timeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    getXploraAuthVariable() {
        return {
            "countryPhoneNumber": this._countryPhoneNumber,
            "phoneNumber": this._phoneNumber,
            "password": this._password,
            "userLang": this._userLang,
            "timeZone": this._timeZone
        };
    }
}

/**
 * Xplora Session
 */
class Xplora_Session {
    sessionId: unknown;
    userId: unknown;
    accessToken: unknown;
    issueDate: Date;
    expireDate: Date;
    apiKey: unknown;
    apiSecret: unknown;
    endpoint: string = ENDPOINT.API;

    constructor(issueToken: { id: unknown; user: { id: unknown; }; token: unknown; issueDate: number; expireDate: number;  app: { apiKey: unknown; apiSecret: unknown; }}) {
        // Object.assign(this, issueToken);

        this.sessionId = issueToken.id;
        this.userId = issueToken.user.id;
        this.accessToken = issueToken.token;
        this.issueDate = new Date(issueToken.issueDate * 1000);
        this.expireDate = new Date(issueToken.expireDate * 1000);

        //  Update API_KEY and API_SECRET?
        if (issueToken.app) {
            if (issueToken.app.apiKey) this.apiKey = issueToken.app.apiKey;
            if (issueToken.app.apiSecret) this.apiSecret = issueToken.app.apiSecret;
        }
        else {
            //  Set to defaults
            this.apiKey = API_KEY;
            this.apiSecret = API_SECRET;
        }
    }
}

/**
 * Internal helper class for communication with the Xplora API.
 */
class Xplora_helper {
    api: Xplora;

    request: <T>(query: string, variables?: Variables | undefined) => Promise<T>;

    /**
     * Creates a helper object for communication with the Xplora API.
     * @param {Xplora} api 
     */
    constructor(api:Xplora) {
        //  Check if api is instance of the Xplora class.
        if (api === undefined || !(api instanceof Xplora)) {
            throw new Error("The first argument MUST be an instance of the Xplora class!");
        }

        //  Assign parent Xplora API for this instance
        this.api = api;
        this.request = api.request.bind(this.api);
    }

    async refresh() {
        throw new Error("Not implemented!");
    }
}

class Xplora_List_helper extends Array {
    api: Xplora;
    request: <T>(query: string, variables?: Variables | undefined) => Promise<T>;

    /**
     * Creates a helper object for communication with the Xplora API.
     * @param {Xplora} api
     */
    constructor(api:Xplora) {
        super();
        //  Check if api is instance of the Xplora class.
        if (api === undefined || !(api instanceof Xplora)) {
            throw new Error("The first argument MUST be an instance of the Xplora class!");
        }

        //  Assign parent Xplora API for this instance
        this.api = api;
        this.request = api.request.bind(this.api);
    }

    async refresh() {
        throw new Error("Not implemented!");
    }
}

/**
 * Xplora Location class
 */
class Xplora_Location {
    timeStamp!: Date;
    lat!: number;
    lng!: number;
    radius!: number;
    country = "";
    countryAbbr = "";
    province = "";
    city = "";
    addr = "";
    poi = "";
    battery = 0;
    isCharging = false;
    isAdjusted = false;
    locateType = "";
    step!: number;
    distance!: number;
    isInSafeZone = false;
    safeZoneLabel = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: any) {
        if (data.__typename == "Location") {
            if (data.tm === null) {
                //  No location data available!
            }
            else {
                //  Timestamp
                this.timeStamp = new Date(data.tm * 1000);

                //  GPS
                this.lat = parseFloat(data.lat);
                this.lng = parseFloat(data.lng);
                this.radius = parseFloat(data.rad);

                //  Address
                this.country = data.country;
                this.countryAbbr = data.countryAbbr;
                this.province = data.province;
                this.city = data.city;
                this.addr = data.addr;
                this.poi = data.poi;

                //  Telemetrie data
                this.battery = parseInt(data.battery);
                this.isCharging = data.isCharging;
                this.isAdjusted = data.isAdjusted;
                this.locateType = data.locateType;
                this.step = data.step;
                this.distance = data.distance;

                //  Sage zone
                this.isInSafeZone = data.isInSafeZone;
                this.safeZoneLabel = data.safeZoneLabel;
            }
        }
        else {
            throw new Error("Location data expected!");
        }
    }
}

/**
 * Xplora contact class
 */
class Xplora_Contact {
    /**
     * The contact's unique identifier.
     */
    id: string;

    /**
     * The contact's  displayname.
     */
    name: string;

    /**
     * The contact's countrycode.
     */
    countryPhoneNumber: string;

    /**
     * The contact's phonenumber.
     */
    phoneNumber: string;

    /**
     * The contact's listorder in the phonebook.
     */
    listOrder: number;

    /**
     * State of approval.
     * 
     * @description Meaning unknown.
     */
    approval: string;

    /**
     * Guardian role.
     * 
     * @description Roles `FIRST` and `SECOND` indicate this contact is a guardian. 
     *              `NONE` shows a regular phonebook contact.
     */
    guardianType: string;

    /**
     * Timestamp of creation of the contact item.
     */
    createdAt: Date;

    /**
     * Timestamp of last modification of the contact item.
     */
    updatedAt: Date;

    /**
     * The contact's E123 formatted international phonenumber.
     */
    phoneNumberE123: string;

    /**
     * The contact is a guardian?
     */
    isGuardian = false;

    /**
     * The contact has been approved?
     * 
     * Meaning unknown.
     */
    isApproved = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(xpContact: any) {
        this.id = xpContact.id;
        this.name = xpContact.name;
        this.countryPhoneNumber = xpContact.countryPhoneNumber;
        this.phoneNumber = xpContact.phoneNumber;
        this.listOrder = xpContact.listOrder;
        this.approval = xpContact.approval;
        this.guardianType = xpContact.guardianType;
        this.createdAt = new Date(xpContact.create * 1000);
        this.updatedAt = new Date(xpContact.update * 1000);

        //  Full-Qualified-Telephone-Number (FQTN)
        this.phoneNumberE123 = `+${this.countryPhoneNumber}${this.phoneNumber}`;

        //  Is this a guardian?
        if (!xpContact.guardianType === undefined) this.isGuardian = !(this.guardianType.toUpperCase() === "NONE");

        //  Is approved?
        if (!xpContact.approval === undefined) this.isApproved = (this.approval.toUpperCase() === "COMPLETE");
    }
}

/**
 * 
 */
class Xplora_ContactList extends Xplora_List_helper {
    private _parentUserId!: string;
    
    async _populate() {
        if (this.length > 0) this.splice(0, this.length);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(
            GQLQueries.QUERY.contactsQ,
            { 
                "uid": this._parentUserId 
            });

        if (data.contacts && data.contacts.contacts) {
            for (let index = 0; index < data.contacts.contacts.length; index++) {
                const rawContact = data.contacts.contacts[index];
                const contact = new Xplora_Contact(rawContact);
                this.push(contact);
            }
        }
    }

    async populate(userId: string) {
        this._parentUserId = userId;
        
        await this._populate();
    }

    async refresh() {
        await this._populate();
    }
}

class Xplora_ChildrenList extends Xplora_List_helper {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async populate(children: string | any[]) {
        if (this.length > 0) this.splice(0, this.length);

        if (children) {
            for (let index = 0; index < children.length; index++) {
                const rawChild = children[index];
                const xpChild = new Xplora_User(this.api);
                await xpChild.populate(rawChild.ward);
                this.push(xpChild);
            }
        }
    }
}

class Xplora_Chat_Contact {
    id = "";
    name = "";
    nickname = "";
    countryPhoneNumber = "";
    phoneNumber = "";
    phoneNumberE123 = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.nickname = data.nickname;
        this.countryPhoneNumber = data.countryPhoneCode;
        this.phoneNumber = data.phoneNumber;

        //  Full-Qualified-Telephone-Number (FQTN)
        this.phoneNumberE123 = `+${this.countryPhoneNumber}${this.phoneNumber}`;
    }
}

class Xplora_Chat {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sender!: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    receiver!: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data!: any;
    timeStamp!: Date;
    msgId = "";
    msgType = "";
    message: string | undefined = undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: any) {
        
        this.timeStamp = new Date(data.create * 1000);
        this.msgId = data.msgId;
        this.msgType = data.type;

        //  Populate sender
        this.sender = new Xplora_Chat_Contact(data.sender);

        //  Populate receiver
        this.receiver = new Xplora_Chat_Contact(data.receiver);

        //  Populate data
        if (this.msgType === "TEXT") this.message = data.data.text;
        this.data = data.data;
    }
}

class Xplora_ChatList extends Array {
    offset = 0;
    limit = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: any) {
        super();
        if (this.length > 0) this.splice(0, this.length);

        if (data) {
            this.offset = data.offset;
            this.limit = data.limit;

            for (let index = 0; index < data.list.length; index++) {
                const rawData = data.list[index];
                const xpObj = new Xplora_Chat(rawData);
                this.push(xpObj); 
            }
        }
    }
}

class Xplora_User extends Xplora_helper {
    id = "";
    userId = "";
    name = "";
    nickname = "";
    gender = "";
    countryCode = "";
    countryPhoneCode = "";
    phoneNumber = "";
    mobilePhoneNumber = "";
    xcoin = 0;
    currentStep = 0;
    totalStep = 0;
    contacts: Xplora_ContactList | undefined = undefined;
    phoneNumberE123 = "";
    location: Xplora_Location | undefined = undefined;
    todayStep = 0;
    todayDistance = 0;
    _fetchContacts = true;

    async _populateContacts() {
        
        if (this.contacts === undefined) {
            this.contacts = new Xplora_ContactList(this.api);
        }

        if (this._fetchContacts) {
            await this.contacts.populate(this.id);
        }

        return this.contacts;
    }

    async getLastLocation() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(
            GQLQueries.QUERY.watchLastLocateQ,
            {
                "uid": this.id
            }
        )

        const newLocation = new Xplora_Location(data.watchLastLocate);

        if (!this.location) {
            this.location = newLocation;
        }
        else {
            Object.assign(this.location, newLocation);
        }

        
        if (this.location) {
            //  Valid location information?
            if (!this.location.timeStamp) {
                this.location = undefined;
            }
            else {
                //  Update steps and distance from location data.
                this.todayStep = this.location.step;
                this.todayDistance = this.location.distance;
            }
        }

        return this.location;
    }

    async _populate() {
        //  Populate contacts
        await this._populateContacts();

        //  Update location
        await this.getLastLocation();
    }

    async populate(
        data: { id: string; user: string; name: string; nickname: string; gender: string; countryCode: string; countryPhoneCode: string; phoneNumber: string; mobilePhoneNumber: string; xcoin: number; currentStep: number; totalStep: number; },
        fetchContacts?: boolean) {
        this.id = data.id || "";
        this.userId = data.user || "";
        this.name = data.name || "";
        this.nickname = data.nickname || "";
        this.gender = data.gender || "";
        this.countryCode = data.countryCode || "en";
        this.countryPhoneCode = data.countryPhoneCode || "";
        this.phoneNumber = data.phoneNumber || "";
        this.mobilePhoneNumber = data.mobilePhoneNumber || "";
        this.xcoin = data.xcoin || 0;
        this.currentStep = data.currentStep || 0;
        this.totalStep = data.totalStep || 0;

        this.phoneNumberE123 = `+${this.countryPhoneCode}${this.phoneNumber}`;

        if (!(fetchContacts === undefined)) this._fetchContacts = fetchContacts;

        //  Populate data
        await this._populate();
    }

    async refresh() {
        await this._populate();
    }

    /**
     * Locate the child.
     * @returns true, if the location request has queued for the watch.
     * 
     * This method asks the child's watch to report its current location.
     */
    async locate() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(
            GQLQueries.QUERY.askWatchLocateQ,
            {
                "uid": this.id
            }
        );

        return data.askWatchLocate;
    }

    /**
     * Actively track a child.
     * @returns The amount of time in seconds the child will be tracked.
     */
    async track() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(
            GQLQueries.QUERY.trackWatchQ,
            {
                "uid": this.id
            }
        );

        return data.trackWatch;
    }

    /**
     * Send a text message to a child's watch.
     * @param message The text message.
     * @returns chatId ???
     */
    async sendChatText(message: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(
            GQLQueries.MUTATION.CHAT.sendChatTextM,
            {
                "uid": this.id,
                "text": message
            }
        );

        return data.sendChatText;
    }

    /**
     * Get chat messages.
     * @param offset Time-offset in seconds.
     * @param limit Max. number of returned chat entries.
     * @param msgId Meaning unknown.
     * @returns List of chats
     */
    async getChats(offset: number, limit:number, msgId?: string) {
        const variables = {
            "uid": this.id,
            "offset": offset,
            "limit": limit,
        };

        if (!(msgId === undefined)) {
            Object.assign(variables, { "msgId": msgId });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(GQLQueries.QUERY.CHAT.chatsQ, variables);

        const myChats = new Xplora_ChatList(data.chats);

        return myChats;
    }
}

class Xplora_MyInfo extends Xplora_User {
    lang = "";
    timeZone = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async populate(myInfoData: any) {
        super.populate(myInfoData);

        // this.rawData = {};
        // Object.assign(this.rawData, myInfoData);
        
        this.lang = myInfoData.extra.lang || "";
        this.timeZone = myInfoData.extra.timeZone || "";
    }
}

/**
 * Xplora API client
 */
class Xplora {
    static _instance: Xplora;

    session: Xplora_Session | undefined = undefined;
    me: Xplora_MyInfo | undefined = undefined;
    children: Xplora_ChildrenList | undefined = undefined;
    api_credentials!: CredentialHelper;
    maxRetries = 5;

    // eslint-disable-next-line no-shadow-restricted-names
    static login(countryPhoneNumber: string, phoneNumber: string, password: string, userLocale: string, timeZone: string) {
        if (this._instance === undefined) this._instance = new Xplora();
        return this._instance.login(countryPhoneNumber, phoneNumber, password, userLocale, timeZone);
    }

    _getRequestHeaders(url: string, acceptedContentType: string): HeadersInit {
    
        if (!acceptedContentType) throw new Error("acceptedContentType MUST NOT be empty!");
    
        const requestHeaders: HeadersInit = {};
        let authorizationHeader = "";
    
        //  Accepted Content Type
        requestHeaders["Accept"] = acceptedContentType;
        requestHeaders["Content-Type"] = acceptedContentType;
    
        //  Authorization headers
        if (!this.session) {
            //  OPEN authorization
            authorizationHeader = `Open ${API_KEY}:${API_SECRET}`;
            requestHeaders["H-BackDoor-Authorization"] = authorizationHeader;
        }
        else {
            //  BEARER authorization
            const rfc1123DateString = new Date().toUTCString();
    
            authorizationHeader = `Bearer ${this.session.accessToken}:${this.session.apiSecret}`;
            requestHeaders["H-Date"] = rfc1123DateString;
        }
    
        requestHeaders["H-Authorization"] = authorizationHeader;
        requestHeaders["H-BackDoor-Authorization"] = authorizationHeader;
    
        //  H-Tid header
        requestHeaders["H-Tid"] = Math.floor(Date.now() / 1000).toString();
    
        return requestHeaders;
    }

    /**
     * Gets or refreshes an authorization token for the Xplora API.
     * @returns Xplora API issueToken
     * 
     * This private method uses the credentials stored within the
     * instance using the CredentialHelper class.
     */
    async _getXploraToken() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any | undefined = undefined;

        //  Ensure we are logged out (reset session)
        this.logout();

        //  Try to login with the stored credentials (credentialhelper)

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data = await this.request(
                GQLQueries.MUTATION.tokenM, 
                this.api_credentials.getXploraAuthVariable()
            );
        } catch (error) {
            //  Parse and forward the GraphQL error
            const dmy = {
                response: {
                    errors: []
                }
            };

            Object.assign(dmy, error);

            data = {
                "errors": dmy.response.errors
            };
        }

        if (data) {
            if (data.errors) {
                //  GQLQuery succeeded but returns an error in the result.
                if (data.errors.length > 0) {
                    throw new Error(`${data.errors[0].code}: ${data.errors[0].message}`);
                }
                else {
                    throw new Error(JSON.stringify(data.errors));
                }
            }

            if (!data.issueToken) {
                //  No error but issueToken is missing.
                throw new Error("Login incomplete: issueToken is missing.");
            }

            //  Store session information
            this.session = new Xplora_Session(data.issueToken);

            //  Return issueToken
            return data.issueToken;
        }
        else {
            throw new Error("Unknown error!");
        }
    }

    /**
     * Runs a GraphQL query against the Xplora API.
     * @param query The GraphQL query
     * @param variables Variables to pass to the GraphQL query
     * @returns GraphQL query response
     */
    async request<T>(query: string, variables?: Variables):Promise<T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any | undefined = undefined;
        let retryCounter = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lastError: any | undefined = undefined;
    
        while ((data === undefined) && (retryCounter < this.maxRetries)) {

            //  Increase retry-counter
            retryCounter++;

            try {
                const apiEndpoint = (this.session ? this.session.endpoint : ENDPOINT.API);

                //  Create a new GraphQL client
                const gqlClient = new GraphQLClient(apiEndpoint);
        
                // Add Xplora API headers
                const requestHeaders = this._getRequestHeaders(apiEndpoint, "application/json; charset=UTF-8");

                //  Run the GraphQL query
                data = await gqlClient.request(query, variables, requestHeaders);
            } catch (error) {
                //  Parse and forward the GraphQL error
                const dmy = {
                    response: {
                        errors: []
                    }
                };
    
                Object.assign(dmy, error);
    
                data = {
                    "errors": dmy.response.errors
                };
            }
    
            //  Check for errors
            if (data && data.errors) {
                //  GQLQuery succeeded but returns an error in the result.
                if (data.errors.length > 0) {
                    lastError = data.errors[0];
    
                    //  Parse error code
                    switch (lastError.code) {
                        case "E000004":
                            //  E000004: Invalid credentials, please login again
                            console.error(`Try #${retryCounter} --> ${lastError.code}: ${lastError.message}`);
                            
                            //  Try to login again (refresh the token)
                            await this._getXploraToken();
    
                            //  Reset data object
                            data = undefined;
                            break;

                        default:
                            //  Throw an error if we cannot deal with logging in again.
                            throw new Error(`${lastError.code}: ${lastError.message}`);
                            break;
                    }
                }
                else {
                    throw new Error(JSON.stringify(data.errors));
                }
            }
        }

        if (data === undefined) {
            if (lastError === undefined) {
                throw new Error(`Xplora query returned no data: ${query}`);
            }
            else {
                throw new Error(`Xplora query finally failed (${lastError.code}: ${lastError.message}): ${query}`);
            }
        }

        return data;
    }

    async login(countryPhoneNumber: string, phoneNumber: string, password: string, userLocale: string, timeZone: string) {
        //  Store Credentials (no password!)
        this.api_credentials = new CredentialHelper(
            countryPhoneNumber,
            phoneNumber,
            password,
            userLocale,
            timeZone
        );
    
        const issueToken = await this._getXploraToken();

        if (issueToken) {
            //  Populate data
            await this._populate();
        }
        else {
            // Login failed.
            throw new Error("Login to Xplora API failed.");
        }
    
        return this;
    }

    logout() {
        if (this.session) {
            this.session = undefined;
        }

        return true;
    }

    async _populateMyInfo() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await this.request(GQLQueries.QUERY.readMyInfoQ, {});
        const newMyInfo = new Xplora_MyInfo(this);
        await newMyInfo.populate(data.readMyInfo);

        if (this.me === undefined) {
            //  Initialize user information
            this.me = newMyInfo;
        }
        else {
            //  Update user information
            Object.assign(this.me, newMyInfo);
        }

        await this.me.populate(data.readMyInfo);

        return data.readMyInfo;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _populateChildren(xpChildren: any) {

        if (this.children === undefined) {
            this.children = new Xplora_ChildrenList(this);
        }

        await this.children.populate(xpChildren);
    }

    async _populate() {
        //  Populate user information ("me")
        const myInfo = await this._populateMyInfo();

        await this._populateChildren(myInfo.children);
    }

    //  Refresh data
    async refresh() {
        await this._populate();

        return this;
    }
}

/**
 * The GQLHandler hooks into the Xplora GraphQL API
 * @deprecated
 */
class GQLHandler {
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

    /**
     * Creates a new Xplora GraphQL API Handler
     * @param countryPhoneNumber The countrycode your phonenumber to log into the mobile app
     * @param phoneNumber Your phonenumber w/o the countrycode to log into the mobile app
     * @param password Password to log into the mobile app
     * @param userLang The user's locale information (e.g. de-DE)
     * @param timeZone The user's timezone (e.g. Europe/Berlin)
     */
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

    /**
     * Get a Xplora API request header for an url
     * @param url The request's target url
     * @param acceptedContentType Accepted contenttype (e.g. application/json; charset=UTF-8)
     * @returns Headers
     */
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
    
        return requestHeaders;
    }

    /**
     * Run a GraphQL query
     * @param query The query to run
     * @param variables Variables to interpolate
     * @returns GraphQL query response
     */
    async runGqlQuery<T>(query: string, variables?: Variables): Promise<T> {
        if (!query) throw new Error("GraphQL guery string MUST NOT be empty!");
    
        const gqlClient = new GraphQLClient(ENDPOINT.API);
    
        // Add Xplora API headers
        const requestHeaders = this.getRequestHeaders(ENDPOINT.API, "application/json; charset=UTF-8");
    
        // Overrides the clients headers with the passed values
        const data = await gqlClient.request(query, variables, requestHeaders);
    
        return data;
    }
    
    /**
     * Run a GraphQL query for an authorized user.
     * @param query The query to run
     * @param variables Variables to interpolate
     * @returns GraphQL query response
     */
    private async runAuthorizedGqlQuery<T>(query: string, variables?: Variables): Promise<T> {
        //  Check if logged in to the API
        if (!this.accessToken) throw new Error("You have to login to the Xplora API first.");
        
        //  Run GraphQL query and return its respond.
        return await this.runGqlQuery(query, variables);
    }

    /**
     * Login to the Xplora API
     * @returns Auth-token
     */
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
    
        return data.issueToken;
    }

    /**
     * Get a list of alarms for a watch
     * @param wardId The id of a child (ward)
     * @returns Alarms
     */
    async getAlarms<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.alarmsQ,
            { 
                "uid": wardId
            });
    }

    /**
     * Get the card groups
     * @param isCampaign 
     * @returns Card groups
     */
    async getCardGroups<T>(isCampaign?: boolean): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.cardGroupsQ,
            { 
                "isCampaign": isCampaign
            });
    }

    /**
     * Get a list of contacts for a watch
     * @param wardId The id of a child (ward)
     * @returns Contacts
     */
    async getContacts<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.contactsQ,
            { 
                "uid": wardId
            });
    }

    /**
     * Get "MyInfo" for the authorized user
     * @returns 
     */
    async getMyInfo<T>(): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.readMyInfoQ,
            { });
    }

    /**
     * Get the last known location for watch w/o pinging the watch
     * @param wardId The id of a child (ward)
     * @returns Location information
     */
    async getWatchLastLocation<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.watchLastLocateQ,
            { 
                "uid": wardId
            });
    }

    /**
     * Get all watches
     * @param wardId The id of a child (ward)
     * @returns Watches
     */
    async getWatches<T>(wardId: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.watchesQ,
            { 
                "uid": wardId
            });
    }

    /**
     * Locate a watch
     * @param id The id of a watch
     * @returns 
     */
    async askWatchLocate<T>(id: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.askWatchLocateQ,
            { 
                "uid": id
            });
    }

    /**
     * Track a watch actively
     * @param id The id of a watch
     * @returns 
     */
    async trackWatch<T>(id: string): Promise<T> {
        return await this.runAuthorizedGqlQuery(
            GQLQueries.QUERY.trackWatchQ,
            { 
                "uid": id
            });
    }
}

module.exports = {
    GQLHandler,
    Xplora
};
