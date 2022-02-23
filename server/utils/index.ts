import { DateTime } from 'luxon'

export const isProductionEnv = () => process.env.NODE_ENV === 'production'

/* The time now to an ISO String */
export const dtNowISO = () => DateTime.now().toISO()

/**
 * A uniform method to return delete options for an item
 * The pre-defined date range is designed to be a little more efficient
 * and the query will cover items over a 5 days period greater than 90 days in age
 * These columns have been indexed to improve the performance
 */
export const getCleanupQueryObject = () => {
  const now = DateTime.now()
  const startDate = now.minus({ days: 95 }).toISO()
  const endDate = now.minus({ days: 90 }).toISO()

  return {
    deleted: true,
    updatedAt: {
      $between: [startDate, endDate],
    },
  }
}
