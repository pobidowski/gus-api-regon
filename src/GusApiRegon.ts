import { createClientAsync, Client } from 'soap';
import path from 'path';
import XmlParser from 'fast-xml-parser';

import { GusApiRegonSearchInterface } from './GusApiRegonSearchInterface';
import { GusApiRegonItemInterface } from './GusApiRegonItemInterface';

export class GusApiRegon {
  protected apiKey: string;
  protected url: string =
    'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
  protected testUrl: string =
    'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
  protected client!: Client;
  protected sessionId!: string;
  protected sandbox: boolean;

  constructor(apiKey: string, sandbox: boolean = false) {
    this.apiKey = apiKey;
    this.sandbox = sandbox;
  }

  async login() {
    if (!this.client) {
      await this.init();
    }

    this.client.clearSoapHeaders();

    this.client.addSoapHeader(
      {
        'wsa:Action': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj',
        'wsa:To': this.url,
      },
      '',
      'wsa',
      'http://www.w3.org/2005/08/addressing',
    );

    const response = await this.client.ZalogujAsync({
      pKluczUzytkownika: this.apiKey,
    });

    this.sessionId = response[0].ZalogujResult;
  }

  async logout() {
    if (!this.client) {
      await this.init();
    }

    this.client.clearSoapHeaders();

    this.client.addSoapHeader(
      {
        'wsa:Action': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Wyloguj',
        'wsa:To': this.url,
      },
      '',
      'wsa',
      'http://www.w3.org/2005/08/addressing',
    );

    await this.client.WylogujAsync({
      pIdentyfikatorSesji: this.sessionId,
    });
  }

  async search<
    T = GusApiRegonItemInterface | GusApiRegonItemInterface[] | null,
  >(params: GusApiRegonSearchInterface): Promise<T> {
    if (!this.client) {
      await this.init();
    }

    if (!this.sessionId) {
      await this.login();
    }

    this.client.clearSoapHeaders();

    this.client.addSoapHeader(
      {
        'wsa:Action':
          'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty',
        'wsa:To': this.url,
      },
      '',
      'wsa',
      'http://www.w3.org/2005/08/addressing',
    );
    this.client.addHttpHeader('sid', this.sessionId);

    const response = await this.client.DaneSzukajPodmiotyAsync({
      pParametryWyszukiwania: params,
    });

    if (!response[0].DaneSzukajPodmiotyResult) {
      return null as unknown as T;
    }

    const xml = XmlParser.parse(response[0].DaneSzukajPodmiotyResult, {
      parseNodeValue: false,
    });

    if (xml.root.dane.ErrorCode) {
      throw new Error('No data found for the specified search criteria.');
    }

    return xml.root.dane;
  }

  protected async init() {
    this.client = await createClientAsync(
      path.resolve(
        __dirname,
        `./wsdl/UslugaBIRzewnPubl-ver11-${this.sandbox ? 'test' : 'prod'}.wsdl`,
      ),
      {
        endpoint: this.sandbox ? this.testUrl : this.url,
        forceSoap12Headers: true,
      },
    );
  }
}
