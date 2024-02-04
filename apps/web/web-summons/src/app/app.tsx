import { Component } from 'react';
import './app.scss';
import AppRouters from './app-routers';

class App extends Component {
  render() {
    return (
      <div>
        <AppRouters />
      </div>
    );
  }
}

export default App;
/*
export function App() {
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const response = (await axios.get('/api')).data;
    console.log(response);
  }
  return (

  );
}
*/
