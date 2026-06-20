import { useState } from 'react'
import TopBar from './components/TopBar'
import Setup from './screens/Setup'
import Sim from './screens/Sim'
import Results from './screens/Results'

const DEFAULT_CONFIG = {
  decision: 'We want to offer at-risk users a 30% discount on annual plans to prevent churn before renewal.',
  variants: [
    '"We\'d hate to see you go — here\'s 30% off your annual plan"',
    '"Your workflow, locked in for less — switch to annual & save"',
    '"Power tools deserve a power plan: 25% off 12 months"',
  ],
  discount: 30,
  target: 'atrisk',
  runs: 1000,
}

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  const go = (s) => {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <>
      <TopBar screen={screen} />
      {screen === 'setup'   && <Setup   config={config} setConfig={setConfig} onRun={() => go('sim')} />}
      {screen === 'sim'     && <Sim     config={config} onDone={() => go('results')} />}
      {screen === 'results' && <Results config={config} onRestart={() => go('setup')} />}
    </>
  )
}
