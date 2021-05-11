import { GusApiRegon } from './GusApiRegon';
import { GusApiRegonItemInterface } from './GusApiRegonItemInterface';

describe('GusApiRegon', () => {
  let service: GusApiRegon;

  beforeEach(() => {
    service = new GusApiRegon('abcde12345abcde12345', true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return valid data', async () => {
    const response = await service.search<GusApiRegonItemInterface>({
      Nip: '6340131017',
    });

    await service.logout();

    expect(response.Nip).toEqual('6340131017');
  });
});
