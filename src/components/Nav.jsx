export default function Nav({item}){
    const {id, name,isToxic} = item
    const h1 = <h1>{name}</h1>
    const text = isToxic? <strike>{h1}</strike>:h1
    return ( 
            <div data-testid={'nav-'+id}>
                {text}
            </div>
    )
}