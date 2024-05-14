import { Observable } from 'rxjs';
import { ActivityType, BoardActivity, BoardTaskActivity } from '../../../shared';
import { TaskActivityData, TaskListActivityData } from '../../index';

export abstract class ActivityService {
  abstract getTaskActivitiesByTaskId(taskId: string): Observable<BoardTaskActivity[]>;
  abstract getBoardActivitiesOnPage(page: number, amountOnPage: number): Observable<BoardActivity[]>;
  abstract getBoardActivityAmount(): Observable<number>;
  abstract createTaskActivity(activityType: ActivityType, taskActivityData: TaskActivityData): Promise<void>;
  abstract createTaskListActivity(activityType: ActivityType, listActivityData: TaskListActivityData): void;
}
