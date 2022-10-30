import { Routes,BrowserRouter, Route } from 'react-router-dom';
import Test from './pages/Test'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import '../src/main.scss'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/test" element={<Test/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
