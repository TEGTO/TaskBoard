import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BoardActivity, URLDefiner, User, UserApiService } from '../../../index';
import { ActivityApiService } from './activity-api.service';

describe('ActivityApiService', () => {
  const userMockData: User = { id: "1" };
  var mockUserApiService: jasmine.SpyObj<UserApiService>;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>
  var httpTestingController: HttpTestingController;
  var service: ActivityApiService;

  beforeEach(() => {
    mockUserApiService = jasmine.createSpyObj<UserApiService>('UserApiService', ['getUser']);
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUserApiService.getUser.and.returnValue(of(userMockData));
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: URLDefiner, useValue: mockUrlDefiner },
      ]
    });

    service = TestBed.inject(ActivityApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return empty array when user is not available', () => {
    mockUserApiService.getUser.and.returnValue(of(null));

    service.getBoardActivitiesOnPage(1, 10).subscribe(boardActivities => {
      expect(boardActivities).toEqual([]);
    });
  });
  it('should send GET to get activities on specific page when user is available', () => {
    const mockActivities: BoardActivity[] = [{ id: '1', userId: userMockData.id, activityTime: new Date() },
    { id: '2', userId: userMockData.id, activityTime: new Date() }];
    var page = 1;
    var amountOnPage = 10;
    const expectedReq = `/BoardActivity/userActivitiesOnPage/${userMockData.id}?page=${page}&amountOnPage=${amountOnPage}`;

    service.getBoardActivitiesOnPage(1, 10).subscribe(activities => {
      expect(activities).toEqual(mockActivities);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockActivities);
  });
  it('should send POST to create new activity', () => {
    const mockActivity: BoardActivity = { id: '1', userId: userMockData.id, activityTime: new Date() };
    const expectedReq = `/BoardActivity`;

    service.createActivity(mockActivity).subscribe(result => {
      expect(result).toEqual(mockActivity);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockActivity);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockActivity);
  });
  it('should return 0 when user is not available', () => {
    mockUserApiService.getUser.and.returnValue(of(null));

    service.getBoardActivitiesAmount().subscribe(amount => {
      expect(amount).toEqual(0);
    });
  });
  it('should return board activities amount when user is available', () => {
    const mockAmount = 10;
    const expectedReq = `/BoardActivity/userActivitiesOnPage/${userMockData.id}/amount`;

    service.getBoardActivitiesAmount().subscribe(amount => {
      expect(amount).toEqual(mockAmount);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockAmount);
  });
});
