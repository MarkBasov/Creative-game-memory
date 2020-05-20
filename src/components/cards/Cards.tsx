import React from 'react';
import './Cards.scss';
import Images from '../../res/Images';

interface IFromBoard {
   index: number;
   cardName: string;
   flipped: boolean;
   disabled: boolean;
   onClick: (index: number) => void;
}

/**
 * @class
 * @author Basov M.A
 * Компонент карты
 */

class Cards extends React.Component<IFromBoard> {
   /**
    * Обязательный метод, отвечающий за визуализацию компонента
    * @function
    * @public
    */
   public render() {
      const icon = this.props.cardName;
      const flipped = this.props.flipped;
      const disabled = this.props.disabled;
      const index = this.props.index;
      let whatISee = <img src={Images['back']}></img>;

      if (flipped || disabled) {
         whatISee = <img src={Images[icon]}></img>;
      }
      
      return (
         <div className='front-card' onClick={() => this.props.onClick(index)}>
            { whatISee }
         </div>
      );
   }
}
export default Cards;
