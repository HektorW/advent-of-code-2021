import { useRoutes } from 'solid-app-router'

import Snow from './components/atoms/Snow'
import { allRoutes } from './routes'

export default function AdventOfCode2021() {
  const Routes = useRoutes(allRoutes)

  return (
    <>
      <Snow maxSnowflakes={200} />

      <Routes />
    </>
  )
}
