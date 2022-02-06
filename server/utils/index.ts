import { DateTime } from 'luxon'

export const isProductionEnv = () => process.env.NODE_ENV === 'production'

/* Get a luxon DateTime instance */
export const dt = () => new DateTime()

/* The time now to an ISO String */
export const dtNowISO = () => dt().toISO()
