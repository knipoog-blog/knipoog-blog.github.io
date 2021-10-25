import { TestBed } from '@angular/core/testing';

import { ReadJsonInterceptor } from './read-json.interceptor';

describe('ReadJsonInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ReadJsonInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ReadJsonInterceptor = TestBed.inject(ReadJsonInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
