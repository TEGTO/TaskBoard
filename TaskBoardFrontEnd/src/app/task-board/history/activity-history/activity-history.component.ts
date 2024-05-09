import { Component, OnInit } from '@angular/core';
import { BoardActivity } from '../../../shared/models/board-activity.model';
import { ActivityService } from '../../services/acitvity-service/activity.service';

@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrl: './activity-history.component.scss'
})
export class ActivityHistoryComponent implements OnInit {
  page = 0;
  amountOnPage = 20;
  activitiesAmount: number = 0;
  activities: BoardActivity[] = [];

  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {
    this.showMore();
    this.getActivitiesAmount();
  }
  showMore() {
    this.page++;
    this.loadActivities();
  }
  private loadActivities() {
    this.activityService.getBoardActivitiesOnPage(this.page, this.amountOnPage).subscribe(activities => {
      this.activities = this.activities.concat(activities);
    })
  }
  private getActivitiesAmount() {
    this.activityService.getBoardActivityAmount().subscribe(amount => {
      this.activitiesAmount = amount;
    })
  }
}
