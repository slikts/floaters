import Floaters from './src/Floaters'
import { fetchConfig } from './src/Config'

import './sass/main.scss'

const main = async () => {
  const config = await fetchConfig()
  setTimeout(() => window.location.reload(), config.reloadTimeout * 1000)
  const app = new Floaters(config)
  app.run().catch(console.error)
}
main()
