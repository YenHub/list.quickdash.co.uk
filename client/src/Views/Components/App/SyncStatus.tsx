import { FC } from 'react'
import CloudOffIcon from '@mui/icons-material/CloudOff' // Make it secondary colour == FOOKED
import FilterDramaIcon from '@mui/icons-material/FilterDrama' // Make it primary colour == CONNECTED

import { useAppSelector } from '../../../Services/Store'

export const SyncStatus: FC = () => {
  const { version, connected, darkMode } = useAppSelector(({ settings }) => settings)
  // IGDev: Don't forget to remove this dev flag
  if (!version) return null

  return (
    <sup>
      {' '}
      {connected ? (
        <FilterDramaIcon fontSize="medium" />
      ) : (
        <CloudOffIcon
          style={{ color: darkMode ? 'lightgrey' : 'grey' }}
          fontSize="medium"
        />
      )}
    </sup>
  )
}
