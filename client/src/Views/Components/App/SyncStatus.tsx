import CloudOffIcon from '@mui/icons-material/CloudOff' // Make it secondary colour == FOOKED
import FilterDramaIcon from '@mui/icons-material/FilterDrama' // Make it primary colour == CONNECTED
import { FC } from 'react'

import { useAppStore } from '../../../Services/Store'
import { showGatedFeatures } from '../../../Services/Utils/ReactUtils'

export const SyncStatus: FC = () => {
  const { connected, darkMode, version } = useAppStore(state => ({
    connected: state.settings.connected,
    darkMode: state.settings.darkMode,
    version: state.settings.version,
  }))

  // IGDev: Don't forget to remove this dev flag
  if (!version || !showGatedFeatures) return null

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
