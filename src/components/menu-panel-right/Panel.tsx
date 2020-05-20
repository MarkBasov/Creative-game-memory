import React, { SyntheticEvent } from 'react';
import './Panel.scss';
import btn from '../../res/styles/buttons.module.scss';

interface IStateStateTimer {
   time: number;
   start: number;
   isActive: boolean;
}

interface IPropsStart {
   onStartGame: () => void;
   isStopTimer: boolean;
   onFinishedGame: (finishedTime: number) => void;
   onShowResultTable: () => void;
}

/**
 * @class
 * @author Basov M.A
 * Компонент панели, отвечающий за старт игры и вызова таблицы результатов
 */

class Panel extends React.Component<IPropsStart, IStateStateTimer> {
   constructor(props: any) {
      super(props);
      this.state = {
         time: 0,
         start: 0,
         isActive: true
      };
      this.timer = null;
      this.currentTime = 0;
   }

   private currentTime: number;

   private timer: any;

   /**
    * Событие запуска таймера
    */
   private startTimer = (event: SyntheticEvent) => {
      this.setState({
         time: this.state.time,
         start: Date.now() - this.state.time,
      });
      this.timer = setInterval(() => {
         this.setState({
            time: Date.now() - this.state.start
         });

         if (this.props.isStopTimer) {
            this.stopTimer();
         }

      }, 1);
      this.setState({isActive: false});
      this.props.onStartGame();
   }

   /**
    * Метод, отвечающий за остановку таймера
    */
   private stopTimer(): void {
      clearInterval(this.timer);
      this.currentTime = this.state.time;
      this.setState({
         isActive: true,
         time: 0
      });
      this.props.onFinishedGame(this.currentTime);
   }

   private showTableResult = () => {
      this.props.onShowResultTable();
   }

   /**
    * Метод, который конвертирует время в формат hh:mm:ss
    * @param timeNeedToConvert Время, необходимое для конвертирования
    */
   private convertTohhmmss(timeNeedToConvert: number): string {
      return new Date(timeNeedToConvert).toISOString().substr(11, 8);
   }

   public render() {
      return (
         <div className='panel-wrapper'>
            <div className='panel-wrapper__panel'>
               <div className='panel__start-button'>
                  <button disabled={!this.state.isActive} className={btn.button + ' button'} onClick={this.startTimer} >Начать игру</button>
               </div>
               <div className='panel__timer'>
                  Ваше время: {this.convertTohhmmss(this.state.time)}
               </div>
               <div className='panel__footer table-result'>
                  <button className={btn.button}  onClick={this.showTableResult} >Таблица результатов</button>
               </div>
            </div>
         </div>
      );
   }
}
export default Panel;
