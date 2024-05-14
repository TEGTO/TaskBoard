import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService, USER_CONFIG, User, UserConfig } from '../../../index';
import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  const userIdKey = 'SOME_KEY';
  const mockUserConfig: UserConfig = { userIdKey: userIdKey };
  const userMockData: User = { id: "1" };
  var mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  var httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    mockLocalStorageService.getItem.and.callFake((key: string) => {
      if (key === userIdKey) {
        return "SOME_USER_ID";
      } else {
        return null;
      }
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: USER_CONFIG, useValue: mockUserConfig },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should call getItem of local storage service with userId key', () => {
    var service = TestBed.inject(UserApiService);
    expect(mockLocalStorageService.getItem).toHaveBeenCalledWith(userIdKey);
    expect(mockLocalStorageService.getItem).toHaveBeenCalledTimes(1);
  });
  it('should send GET to get user from api and call setItem of local storage service', () => {
    const newKey = "NEW_KEY";
    mockUserConfig.userIdKey = newKey;
    var service = TestBed.inject(UserApiService);
    expect(mockLocalStorageService.getItem).toHaveBeenCalledWith(newKey);
    expect(mockLocalStorageService.getItem).toHaveBeenCalledTimes(1);
    const mockReq = httpTestingController.expectOne('/api/User');
    mockReq.flush(userMockData);
    expect(mockReq.request.method).toEqual("POST");
    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(newKey, userMockData.id);
    expect(mockLocalStorageService.setItem).toHaveBeenCalledTimes(1);
  });
  it('should send GET to return correct user that was previously created', () => {
    var service = TestBed.inject(UserApiService);
    // POST request
    const mockPostReq = httpTestingController.expectOne('/api/User');
    mockPostReq.flush(userMockData);
    // getUser
    service.getUser().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res?.id).toEqual(userMockData.id);
    });
    // GET request
    const mockGetReq = httpTestingController.expectOne(`/api/User/${userMockData.id}`);
    expect(mockGetReq.request.method).toEqual("GET");
    mockGetReq.flush(userMockData);
  });
});
