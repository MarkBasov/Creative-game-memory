import React, { SyntheticEvent } from 'react';
import './ModalNickName.scss';
import style from '../../res/styles/buttons.module.scss';

interface IStatePlayer {
   nickName: string;
}

interface IPropsTime {
   finishedTime: number;
   sendResultInfo: (infoPlayer: IInfoPlayer) => void;
}

interface IInfoPlayer {
   nickName: string;
   time: number;
}

/**
 * @class
 * @author Basov M.A
 * Компонент модального окна записи никнейма
 */

class ModalWindowNickName extends React.Component<IPropsTime, IStatePlayer> {
   private infoPlayer: IInfoPlayer;

   constructor(props: any) {
      super(props);
      this.state = {
         nickName: ''
      }
      
      this.infoPlayer = {
         nickName: '',
         time: 0
      };
   }

   /**
    * Событие отправки данных об игроке в таблицу результатов
    */
   private sendResult = (event: SyntheticEvent) => {
      this.infoPlayer = {
         nickName: this.state.nickName,
         time: this.props.finishedTime
      };
      this.props.sendResultInfo(this.infoPlayer);
   }

   /**
    * Событие изменения поля с никнеймом
    */
   private enterNickName = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({nickName: event.target.value});
   }

   /**
    * Обязательный метод, отвечающий за визуализацию компонента
    * @function
    * @public
    */
   public render() {
      return (
         <div className="confirm-wrapper">
            <div className="confirm-container">

               <div className="confirm-wrapper__confirm-header">
                  <slot name="header">
                     <span>Поздравляем, вы выиграли!!!</span>
                  </slot>
               </div>

               <div className="confirm-wrapper__confirm-body">
                  <slot name="body">
                     <span className='textBody'>Введите ваш никнейм:</span><br/>
                     <input className='confirm-body__textBoxNickName' type='text' value={this.state.nickName} onChange={this.enterNickName} placeholder='Никнейм'/>
                  </slot>
               </div>
               
               <div className="confirm-wrapper__confirm-footer">
                  <slot name="footer">
                     <button className={style.button} onClick={this.sendResult} >Применить</button>
                  </slot>
               </div>
            </div>
         </div>
      );
   }
}
export default ModalWindowNickName;
