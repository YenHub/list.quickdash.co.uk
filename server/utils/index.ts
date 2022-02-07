import { DateTime } from 'luxon'

export const isProductionEnv = () => process.env.NODE_ENV === 'production'

/* The time now to an ISO String */
export const dtNowISO = () => DateTime.now().toISO()
