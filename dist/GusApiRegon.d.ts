import { Client } from 'soap';
import { GusApiRegonSearchInterface } from './GusApiRegonSearchInterface';
import { GusApiRegonItemInterface } from './GusApiRegonItemInterface';
export declare class GusApiRegon {
    protected apiKey: string;
    protected url: string;
    protected testUrl: string;
    protected client: Client;
    protected sessionId: string;
    protected sandbox: boolean;
    constructor(apiKey: string, sandbox?: boolean);
    login(): Promise<void>;
    logout(): Promise<void>;
    search<T = GusApiRegonItemInterface | GusApiRegonItemInterface[] | null>(params: GusApiRegonSearchInterface): Promise<T>;
    protected init(): Promise<void>;
}
//# sourceMappingURL=GusApiRegon.d.ts.map