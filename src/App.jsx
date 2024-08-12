import config from '../gitprofile.config.js';
import GitProfile from './components/GitProfile';

function App() {
  return <GitProfile config={config} />;
}

export default App;
