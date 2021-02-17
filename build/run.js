"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const http_1 = require("./http");
const cloud_lookup_service_1 = require("./p2p/cloud-lookup.service");
const p2p_1 = require("./p2p");
const push_1 = require("./push");
// Read from env
dotenv.config();
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DSK_KEY = process.env.DSK_KEY;
const P2P_DID = process.env.P2P_DID;
const ACTOR_ID = process.env.ACTOR_ID;
const mainP2pCloud = () => __awaiter(void 0, void 0, void 0, function* () {
    const lookupService = new cloud_lookup_service_1.CloudLookupService();
    try {
        const addresses = yield lookupService.lookup(P2P_DID, DSK_KEY);
        console.log('Found addresses', addresses);
    }
    catch (err) {
        console.error('Not found any address...', err);
    }
});
const mainPush = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting...');
    let credentials = null;
    // Check if credentials are existing
    if (fs.existsSync('credentials.json')) {
        console.log('Credentials found -> reusing them...');
        credentials = JSON.parse(fs.readFileSync('credentials.json').toString());
    }
    else {
        // Register push credentials
        console.log('No credentials found -> register new...');
        const pushService = new push_1.PushRegisterService();
        credentials = yield pushService.createPushCredentials();
        // Store credentials
        fs.writeFileSync('credentials.json', JSON.stringify(credentials));
        // We have to wait shortly to give google some time to process the registration
        console.log('Wait a short time (5sec)...');
        yield push_1.sleep(5 * 1000);
    }
    // Start push client
    const pushClient = yield push_1.PushClient.init({
        androidId: credentials.checkinResponse.androidId,
        securityToken: credentials.checkinResponse.securityToken,
    });
    pushClient.connect((msg) => {
        console.log('Got push message:', msg);
    });
    // Register at eufy
    const fcmToken = credentials.gcmResponse.token;
    const httpService = new http_1.HttpService(USERNAME, PASSWORD);
    yield httpService.registerPushToken(fcmToken);
    console.log('Registered at eufy with:', fcmToken);
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        yield httpService.pushTokenCheck();
    }), 30 * 1000);
});
const mainReadMultiPackages = () => __awaiter(void 0, void 0, void 0, function* () {
    const lookupService = new p2p_1.LocalLookupService();
    const address = yield lookupService.lookup('192.168.68.101');
    console.log('Found address', address);
    const devClientService = new p2p_1.DeviceClientService(address, P2P_DID, ACTOR_ID);
    yield devClientService.connect();
    devClientService.sendCommandWithInt(p2p_1.CommandType.CMD_CAMERA_INFO, 255);
});
const mainStartVideoDownload = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO NOT YET WORKING!
    const lookupService = new p2p_1.LocalLookupService();
    const address = yield lookupService.lookup('192.168.68.101');
    console.log('Found address', address);
    const devClientService = new p2p_1.DeviceClientService(address, P2P_DID, ACTOR_ID);
    yield devClientService.connect();
    const fileName = '/media/mmcblk0p1/Camera00/h265_20201005114502.dat';
    devClientService.sendCommandWithString(p2p_1.CommandType.CMD_DOWNLOAD_VIDEO, fileName);
});
// mainP2pLocal();
// mainP2pCloud();
// mainPush();
// mainReadMultiPackages();
// mainStartVideoDownload();
