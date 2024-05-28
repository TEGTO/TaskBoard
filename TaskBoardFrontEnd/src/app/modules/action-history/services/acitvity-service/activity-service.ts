import { Observable } from 'rxjs';
import { ActivityType, BoardActivity, BoardTaskActivity } from '../../../shared';
import { TaskActivityData, TaskListActivityData } from '../../index';

export abstract class ActivityService {
  abstract getTaskActivitiesByTaskId(taskId: string): Observable<BoardTaskActivity[]>;
  abstract getBoardActivitiesOnPageByBoardId(id: string, page: number, amountOnPage: number): Observable<BoardActivity[]>;
  abstract getBoardActivityAmountByBoardId(id: string): Observable<number>;
  abstract createTaskActivity(activityType: ActivityType, taskActivityData: TaskActivityData): Promise<void>;
  abstract createTaskListActivity(activityType: ActivityType, listActivityData: TaskListActivityData): void;
}
