"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GusApiRegon = void 0;
const soap_1 = require("soap");
const path_1 = __importDefault(require("path"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
class GusApiRegon {
    constructor(apiKey, sandbox = false) {
        this.url = 'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
        this.testUrl = 'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
        this.apiKey = apiKey;
        this.sandbox = sandbox;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.init();
            }
            this.client.clearSoapHeaders();
            this.client.addSoapHeader({
                'wsa:Action': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj',
                'wsa:To': this.url,
            }, '', 'wsa', 'http://www.w3.org/2005/08/addressing');
            const response = yield this.client.ZalogujAsync({
                pKluczUzytkownika: this.apiKey,
            });
            this.sessionId = response[0].ZalogujResult;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.init();
            }
            this.client.clearSoapHeaders();
            this.client.addSoapHeader({
                'wsa:Action': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Wyloguj',
                'wsa:To': this.url,
            }, '', 'wsa', 'http://www.w3.org/2005/08/addressing');
            yield this.client.WylogujAsync({
                pIdentyfikatorSesji: this.sessionId,
            });
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.init();
            }
            if (!this.sessionId) {
                yield this.login();
            }
            this.client.clearSoapHeaders();
            this.client.addSoapHeader({
                'wsa:Action': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty',
                'wsa:To': this.url,
            }, '', 'wsa', 'http://www.w3.org/2005/08/addressing');
            this.client.addHttpHeader('sid', this.sessionId);
            const response = yield this.client.DaneSzukajPodmiotyAsync({
                pParametryWyszukiwania: params,
            });
            if (!response[0].DaneSzukajPodmiotyResult) {
                return null;
            }
            const xml = fast_xml_parser_1.default.parse(response[0].DaneSzukajPodmiotyResult, {
                parseNodeValue: false,
            });
            if (xml.root.dane.ErrorCode) {
                throw new Error('No data found for the specified search criteria.');
            }
            return xml.root.dane;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield soap_1.createClientAsync(path_1.default.resolve(__dirname, `./wsdl/UslugaBIRzewnPubl-ver11-${this.sandbox ? 'test' : 'prod'}.wsdl`), {
                endpoint: this.sandbox ? this.testUrl : this.url,
                forceSoap12Headers: true,
            });
        });
    }
}
exports.GusApiRegon = GusApiRegon;
//# sourceMappingURL=GusApiRegon.js.map