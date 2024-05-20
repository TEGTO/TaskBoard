import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService, LocalStorageService, URLDefiner, USER_CONFIG, User, UserConfig } from '../../../index';
import { DevModeService } from '../../dev-mode/dev-mode.service';
import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  const userIdKey = 'SOME_KEY';
  const userMockData: User = { id: "1" };
  var httpTestingController: HttpTestingController;
  var service: UserApiService;
  var mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>
  var mockUserConfig: UserConfig = { userIdKey: userIdKey }
  var mockDevModeService: jasmine.SpyObj<DevModeService>

  beforeEach(() => {
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockDevModeService = jasmine.createSpyObj<DevModeService>('DevModeService', ['isDevMode']);

    // Reset the implementation of the spies before each test
    mockLocalStorageService.getItem.and.callFake((key: string) => {
      if (key === userIdKey) {
        return userMockData.id;
      } else {
        return null;
      }
    });
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);
    mockDevModeService.isDevMode.and.returnValue(false);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: USER_CONFIG, useValue: mockUserConfig },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: URLDefiner, useValue: mockUrlDefiner },
        { provide: DevModeService, useValue: mockDevModeService }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserApiService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should call getItem of local storage service with userId key', () => {
    service.getUser();

    expect(mockDevModeService.isDevMode).toHaveBeenCalled();
    expect(mockLocalStorageService.getItem).toHaveBeenCalledWith(userIdKey);
    expect(mockLocalStorageService.getItem).toHaveBeenCalledTimes(1);
  });
  it('should send GET to get user from api and call setItem of local storage service', () => {
    const newKey = "NEW_KEY";
    const mockUserConfig: UserConfig = { userIdKey: newKey }
    const expectedReq = '/User';
    service = new UserApiService(mockUserConfig, TestBed.inject(ErrorHandlerService), TestBed.inject(HttpClient), mockLocalStorageService,
      mockDevModeService, mockUrlDefiner);

    service.getUser().subscribe();

    expect(mockLocalStorageService.getItem).toHaveBeenCalledWith(newKey);
    expect(mockLocalStorageService.getItem).toHaveBeenCalledTimes(1);
    const mockReq = httpTestingController.expectOne(expectedReq);
    mockReq.flush(userMockData);
    expect(mockReq.request.method).toEqual("POST");
    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(newKey, userMockData.id);
    expect(mockLocalStorageService.setItem).toHaveBeenCalledTimes(1);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
  });
  it('should send GET to return correct user that was previously created', () => {
    const expectedReq = `/User/${userMockData.id}`;

    service.getUser().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res?.id).toEqual(userMockData.id);
    });

    const mockPostReq = httpTestingController.expectOne(expectedReq);
    expect(mockPostReq.request.method).toEqual("GET");
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    mockPostReq.flush(userMockData);
  });
});