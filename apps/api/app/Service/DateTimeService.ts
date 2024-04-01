import { DateTime } from 'luxon'
import AppBaseService from './AppBaseService'

export default class DateTimeService implements AppBaseService {
  public getNumberOfDaysBetweenDates (startAt: DateTime, endAt: DateTime): number {
    return endAt.diff(startAt, 'days').days + 1
  }

  public getIntersectionBetweenDates (
    startAt: DateTime,
    endAt: DateTime,
    startAt2: DateTime,
    endAt2: DateTime
  ): number {
    const intersectionDuration = Math.min(
      endAt.diff(startAt2, 'days').days + 1,
      endAt2.diff(startAt, 'days').days + 1
    )

    return intersectionDuration
  }
}
