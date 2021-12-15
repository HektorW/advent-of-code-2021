import { render } from 'solid-js/web'
import { Router } from 'solid-app-router'

import './index.css'
import './index.custom-properties.css'

import AdventOfCode2021 from './AdventOfCode2021'

render(
  () => (
    <Router>
      <AdventOfCode2021 />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
)
