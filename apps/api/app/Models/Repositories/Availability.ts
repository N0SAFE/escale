import Availability from '../Availability'
import AppBaseRepository from './AppBaseRepository'

export default class AvailabilityRepository extends AppBaseRepository {
  protected model = Availability
  /**
   * this function return the closest availability taht is strictly before the date
   * and that is not next to this one or the one that are next to this one
   * @param date
   * @returns
   */
  public async getClosestAvailabilityBefore(date: string, spa: number) {
    return this.model
      .query()
      .where('end_at', '<', date)
      .orderBy('end_at', 'desc')
      .where('spa_id', spa)
      .limit(1)
      .first()
  }

  /**
   * this function return the closest availability taht is strictly after the date
   * and that is not next to this one or the one that are next to this one
   * @param date
   * @returns
   */
  public async getClosestAvailabilityAfter(date: string, spa: number) {
    return this.model
      .query()
      .where('start_at', '>', date)
      .orderBy('start_at', 'asc')
      .where('spa_id', spa)
      .limit(1)
      .first()
  }
}
