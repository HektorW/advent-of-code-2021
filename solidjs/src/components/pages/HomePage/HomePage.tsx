import { Link } from 'solid-app-router'
import { dayRoutes } from '../../../routes'
import Heading from '../../atoms/Heading'

export default function HomePage() {
  return (
    <div>
      <Heading tagName="h1" size="huge">
        advent of code 2021
      </Heading>

      <ul>
        {dayRoutes.map((dayRoute) => (
          <li>
            <Link href={dayRoute.path}>Day {dayRoute.day}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
