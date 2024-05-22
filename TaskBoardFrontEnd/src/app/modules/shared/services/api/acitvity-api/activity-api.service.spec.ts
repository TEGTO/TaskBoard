import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Board, BoardActivity, URLDefiner } from '../../../index';
import { ActivityApiService } from './activity-api.service';

describe('ActivityApiService', () => {
  const mockBoardData: Board = { id: "1", userId: "1", creationTime: new Date() };
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>
  var httpTestingController: HttpTestingController;
  var service: ActivityApiService;

  beforeEach(() => {
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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
  it('should send GET to get activities on specific page', () => {
    const mockActivities: BoardActivity[] = [{ id: '1', boardId: mockBoardData.id, activityTime: new Date() },
    { id: '2', boardId: mockBoardData.id, activityTime: new Date() }];
    var page = 1;
    var amountOnPage = 10;
    const expectedReq = `/BoardActivity/board/${mockBoardData.id}/onpage?page=${page}&amountOnPage=${amountOnPage}`;

    service.getBoardActivitiesOnPageByBoardId(mockBoardData.id, 1, 10).subscribe(activities => {
      expect(activities).toEqual(mockActivities);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    req.flush(mockActivities);
  });
  it('should send POST to create new activity', () => {
    const mockActivity: BoardActivity = { id: '1', boardId: mockBoardData.id, activityTime: new Date() };
    const expectedReq = `/BoardActivity`;

    service.createActivity(mockActivity).subscribe(result => {
      expect(result).toEqual(mockActivity);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockActivity);
    req.flush(mockActivity);
  });
  it('should return board activities amount', () => {
    const mockAmount = 10;
    const expectedReq = `/BoardActivity/board/${mockBoardData.id}/amount`;

    service.getBoardActivitiesAmountByBoardId(mockBoardData.id).subscribe(amount => {
      expect(amount).toEqual(mockAmount);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    req.flush(mockAmount);
  });
});
