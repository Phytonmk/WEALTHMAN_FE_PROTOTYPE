/*
  
  Usage
   only cards propery required, all other are optional, event title & subtitle
   
   <Cards 
     whiteBg={true}
     cards={[{
       title: 'Advisory',
       subtitle: 'Style',
       state: 'good' 
     },{
       title: '8 day to expire',
       subtitle: 'Days'
       state: 'bad'
     },{
       title: '10.02.2018',
       subtitle: 'Start date'
     },{
       title: '30.08.2018',
       subtitle: 'Finish date'
     },]}
   />
*/
import React, { Component } from 'react';

export default class Cards extends Component {
  render() {
    return <div className="cards-box">
      <div className="cards-container" style={{background: this.props.whiteBg ? 'white' : 'rgba(0, 0, 0, 0'}}>
        {this.props.cards.map((card, i) => <div key={i} className="cards-block">
            <h3 style={{color: card.state === 'good' ? '#47bf6f' : (card.state === 'bad' ? '#f7080a' : '#071e40')}}>{card.title}</h3>
            <p>{card.subtitle}</p>
          </div>)}
      </div>
    </div>
  }
}
