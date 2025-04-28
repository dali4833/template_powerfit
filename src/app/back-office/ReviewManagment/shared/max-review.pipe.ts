import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxReviewValue'
})
export class MaxReviewPipe implements PipeTransform {
  transform(sessions: any[]): number {
    if (!sessions || sessions.length === 0) return 1;
    const maxValue = Math.max(...sessions.map(session => session.totalReviews));
    return maxValue > 0 ? maxValue : 1;
  }
}
