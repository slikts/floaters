import Floaters from './src/Floaters'
import { fetchConfig } from './src/Config'

import './sass/main.scss'

const main = async () => {
  const config = await fetchConfig()
  const app = new Floaters(config)
  app.run().catch(console.error)
}
main()
