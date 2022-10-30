import {render,screen,cleanup} from '@testing-library/react'
import Nav from './../Nav'

afterEach(()=>{
    cleanup()
})


test('should render non-toxic nav component',()=>{
    const item = {
          id:1,
          name:'item1',
          isToxic:false
}
    render(<Nav key={item.id} item={item}/>)
    const navElement = screen.getByTestId('nav-1')
expect(navElement).toBeInTheDocument()
expect(navElement).toHaveTextContent('item1')
expect(navElement).not.toContainHTML('<strike>')

})

test('should render toxic nav component',()=>{
    const item = {
          id:2,
          name:'item2',
          isToxic:true
}
    render(<Nav key={item.id} item={item}/>)
    const navElement = screen.getByTestId('nav-2')
expect(navElement).toBeInTheDocument()
expect(navElement).toHaveTextContent('item2')
//expect(navElement).toContainHTML('<strike>')
})