import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardActivity } from '../../../../shared';
import { ActivityPopupData, ActivityService } from '../../../index';

/**The component that renders all board activities. */
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

  constructor(@Inject(MAT_DIALOG_DATA) public popupData: ActivityPopupData, private activityService: ActivityService) { }

  ngOnInit(): void {
    this.showMore();
    this.getActivitiesAmount();
  }
  showMore() {
    this.page++;
    this.loadActivities();
  }
  private loadActivities() {
    this.activityService.getBoardActivitiesOnPageByBoardId(this.popupData.board.id, this.page, this.amountOnPage).subscribe(activities => {
      this.activities = this.activities.concat(activities);
    })
  }
  private getActivitiesAmount() {
    this.activityService.getBoardActivityAmountByBoardId(this.popupData.board.id).subscribe(amount => {
      this.activitiesAmount = amount;
    })
  }
}
