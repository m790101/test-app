import { Routes, Route } from 'react-router-dom';
import Test from './pages/Test'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import '../src/main.scss'
const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/test" element={<Test/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    </div>
  );
}

export default App;
