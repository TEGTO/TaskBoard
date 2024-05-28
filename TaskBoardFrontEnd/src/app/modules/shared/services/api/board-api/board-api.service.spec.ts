import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Board, URLDefiner, User, UserApiService } from '../../../index';
import { BoardApiService } from './board-api.service';


describe('BoardApiService', () => {
  const userMockData: User = { id: "1" };
  var httpTestingController: HttpTestingController;
  var service: BoardApiService;
  var mockUserApiService: jasmine.SpyObj<UserApiService>;
  var mockUrlDefiner: jasmine.SpyObj<URLDefiner>

  beforeEach(() => {
    mockUserApiService = jasmine.createSpyObj<UserApiService>('UserApiService', ['getUser']);
    mockUrlDefiner = jasmine.createSpyObj<URLDefiner>('URLDefiner', ['combineWithApiUrl']);
    mockUserApiService.getUser.and.returnValue(of(userMockData));
    mockUrlDefiner.combineWithApiUrl.and.callFake((subpath: string) => subpath);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: URLDefiner, useValue: mockUrlDefiner }
      ]
    });
    service = TestBed.inject(BoardApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send GET to get boards', () => {
    const mockBoards: Board[] = [{ id: '1', userId: userMockData.id, creationTime: new Date(), name: 'Board 1' },
    { id: '2', userId: userMockData.id, creationTime: new Date(), name: 'Board 2' }];
    const expectedReq = `/Board/user/${userMockData.id}`;

    service.getBoardsByUserId().subscribe(taskLists => {
      expect(taskLists).toEqual(mockBoards);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockBoards);
  });
  it('should send GET to get board by id', () => {
    const mockBoards: Board[] = [{ id: '1', userId: userMockData.id, creationTime: new Date(), name: 'Board 1' },
    { id: '2', userId: userMockData.id, creationTime: new Date(), name: 'Board 2' }];
    const boardId = '1';
    const expectedReq = `/Board/${boardId}`;

    service.getBoardById(boardId).subscribe(taskList => {
      expect(taskList).toEqual(mockBoards[0]);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockBoards.filter(x => x.id == boardId)[0]);
  });
  it('should send GET to get task lists amount by board id', () => {
    const boardId = '1';
    const expectedReq = `/Board/amount/tasklists/${boardId}`;

    service.getTaskListsAmountByBoardId(boardId).subscribe(amount => {
      expect(amount).toEqual(1);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(1);
  });
  it('should send GET to get tasks amount by board id', () => {
    const boardId = '1';
    const expectedReq = `/Board/amount/tasks/${boardId}`;

    service.getTasksAmountByBoardId(boardId).subscribe(amount => {
      expect(amount).toEqual(1);
    });

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('GET');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(1);
  });
  it('should send POST to create new board when user is available', () => {
    const mockBoard: Board = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New Board' };
    const expectedReq = `/Board`;

    service.createBoard(mockBoard).subscribe(result => {
      expect(result.id).toEqual(mockBoard.id);
      expect(result.userId).toEqual(mockBoard.userId);
      expect(result.name).toEqual(mockBoard.name);
    });

    expect(mockUserApiService.getUser).toHaveBeenCalledTimes(1);
    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBoard);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush(mockBoard);
  });
  it('should not send POST to create new board when user is not available', () => {
    const mockBoard: Board = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New Board' };

    mockUserApiService.getUser.and.returnValue(of(null));

    service.createBoard(mockBoard).subscribe(result => {
      expect(result).toBeUndefined();
    });

    httpTestingController.expectNone(`/Board`);
  });
  it('should send PUT request to update board', () => {
    const mockBoard: Board = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New Board' };
    const expectedReq = `/Board`;

    service.updateBoard(mockBoard).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(mockBoard);
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush({});
  });
  it('should send DELETE request to delete board', () => {
    const mockBoard: Board = { id: '1', userId: userMockData.id, creationTime: new Date(), name: 'New Board' };
    const expectedReq = `/Board/${mockBoard.id}`;

    service.deleteBoard(mockBoard.id).subscribe();

    const req = httpTestingController.expectOne(expectedReq);
    expect(req.request.method).toEqual('DELETE');
    expect(mockUrlDefiner.combineWithApiUrl).toHaveBeenCalledWith(expectedReq);
    req.flush({});
  });
});
