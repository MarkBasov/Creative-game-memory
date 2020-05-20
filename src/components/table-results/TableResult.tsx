import React from 'react';
import './TableResult.scss';
import btn from '../../res/styles/buttons.module.scss';

interface IPlayer {
   infoPlayer: {
      nickName: string;
      time: number;
   }
   isSaveChange: boolean;
   stoppedSave: () => void;
   closeTable: () => void;
}

/**
 * @class
 * @author Basov M.A
 * Компонент таблицы результата
 */

class TableResult extends React.Component<IPlayer> {
   constructor(props: any) {
      super(props);

      this.infoPlayers = [];
   }

   private infoPlayers: Array<{
      nickName: string,
      time: number
   }>;

   public componentDidMount() {
      if (localStorage.getItem('infoPlayers')) {
         try {
           this.infoPlayers = JSON.parse(localStorage.getItem('infoPlayers') || '{}');
         } catch (e) {
           localStorage.removeItem('infoPlayers');
         }
      }
   }

   public componentDidUpdate(): void {
      if (this.props.isSaveChange) {
         this.setToJson();
      }
   }

   /**
    * Метод, отвечающий за сохранение данных в таблицу (localstorage браузера)
    */
   private setToJson = () => {
      this.infoPlayers.push(this.props.infoPlayer);
      if (this.infoPlayers.length >= 2) {
         this.infoPlayers.sort((player1, player2) => {
            return +player2.time - +player1.time;
         });
      }
      const parsed = JSON.stringify(this.infoPlayers);
      localStorage.setItem('infoPlayers', parsed);
      this.props.stoppedSave();
   }
   
   /**
    * Метод, который конвертирует время в формат hh:mm:ss
    * @param timeNeedToConvert Время, необходимое для конвертирования
    */
   private convertTohhmmss(timeNeedToConvert: number): string {
      return new Date(timeNeedToConvert).toISOString().substr(11, 8);
   }

   /**
    * Событие закрытия окна таблицы
    */
   private onClose = () => {
      this.props.closeTable();
   }

   public render() {
      return (
         <div className='table'>
            <div className='table__header'>
               <div>Никнейм</div>
               <div>Время</div>
            </div>
            {this.infoPlayers.map((player, index) => (
               <div key={index.toString()} className='table__result'>
                  <div className='nickName'>{player.nickName}</div>
                  <div className='time'>{this.convertTohhmmss(player.time)}</div>
               </div>
            ))}
            <div className='table__footer'>
               <button className={btn.button + ' buttonClose'} onClick={this.onClose}>Закрыть</button>
            </div>
         </div>
      );
   }
}
export default TableResult;
