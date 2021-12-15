import { RouteDefinition } from 'solid-app-router'
import { lazy } from 'solid-js'

export const dayDefinitions = [
  { day: 1, component: lazy(() => import('./days/day-1/day-1')) },
  { day: 2, component: lazy(() => import('./days/day-2/day-2')) },
  { day: 3, component: lazy(() => import('./days/day-3/day-3')) },
  { day: 4, component: lazy(() => import('./days/day-4/day-4')) },
  { day: 5, component: lazy(() => import('./days/day-5/day-5')) },
]

export const dayRoutes = dayDefinitions.map<RouteDefinition & { day: number }>(
  (dayDefinition) => ({
    ...dayDefinition,
    path: `/day/${dayDefinition.day}`,
  })
)

export const allRoutes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./components/pages/HomePage')),
  },

  ...dayRoutes,
]
