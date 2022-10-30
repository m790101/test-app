import React from 'react'


function Details(props){
    let time = new Date().getHours()
    let day = new Date().getDay()
    return (
        <div>
            <div>
                <p>{props.data.name}</p>
                <p>營業中</p>
            </div>
            <div>
                <p>50/ 0.5H</p>
                <span>總車位 44</span><span>空位數 23</span>
            </div>
            <div></div>
                <ul>
                    <li>營業時間:{props.data.serviceTime}</li>
                    <li>費率:{props.data.payex}</li>
                    <li>地址:{props.data.address}</li>
                    <li>電話:{props.data.tel}</li>
                    <li>備註:{day}</li>
                </ul>
        </div>
    )
}

export default Details