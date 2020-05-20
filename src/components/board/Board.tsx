import React from 'react';
import Cards from '../cards/Cards';
import './Board.scss';
import Panel from '../menu-panel-right/Panel';
import ModalWindowNickName from '../modal-nickname/ModalNickName';
import TableResult from '../table-results/TableResult';

interface ICard {
   index: number;
   cardName: string;
   flipped: boolean;
   disabled: boolean;
}

interface IMyBoardState {
   cards: Array<string>;
   stackPairsCards: ICard[];
   pickedCountCards: number;
   countGuessedCards: number;
   isGivingAccess: boolean;
   finishedTime: number;
   isModalDisabled: boolean;
   infoPlayer: {
      nickName: string;
      time: number;
   };
   showTableResults: boolean;
}

/**
 * @class
 * @author Basov M.A
 * Компонент панели с картами
 */

class Board extends React.Component<{}, IMyBoardState> {
   private currentIndexCard: number;
   private previousIndexCard: number;
   private isStopTimerPanel: boolean;
   private saveChange: boolean;
   constructor(props: any) { 
      super(props);
      this.state = {
         cards: ['castle', 'clown', 'coffin', 'devil', 'devilEye', 'dracula', 'draculaBro', 'frankenstein', 'ghost', 'kettle', 'necromancyBook', 'pentagram', 'poisonedPotion', 'pumpkin', 'skullWithBones', 'tomb', 'witchHat', 'zombie'],
         stackPairsCards: [],
         pickedCountCards: 0,
         countGuessedCards: 0,
         isGivingAccess: false,
         finishedTime: 0,
         isModalDisabled : true,
         infoPlayer: {
            nickName: '',
            time: 0
         },
         showTableResults: false
      };
      this.currentIndexCard = -1;
      this.previousIndexCard = -1;
      this.isStopTimerPanel = false;
      this.saveChange = false;
   }

   public componentDidMount() {
      this.shaffledCards(this.state.cards);
   }

   /**
    * Событие, которое срабатывает при клике по карте
    * @function
    * @private
    * @param indexOpened Индекс выбранной карты
    */
   private onCardClicked = (indexOpened: number) => {
      const context = this;
      const card = context.state.stackPairsCards[indexOpened];

      if (card.disabled || card.flipped || context.previousIndexCard >= 0) {
         return;
      }

      if (context.currentIndexCard < 0) {
         context.currentIndexCard = card.index;
      } else {
         context.previousIndexCard = card.index;
      }
      
      const pickedCountCards = context.state.pickedCountCards + 1;
      context.setState({pickedCountCards: pickedCountCards});
      context.setCardFlip(card.index, true);
      context.setTimer(pickedCountCards);
   }

   /**
    * Метод, отвечающий за навешивание таймера на карту
    * @function
    * @private
    * @param pickedCountCards Количество выбранных карт
    */
   private setTimer(pickedCountCards: number) {
      let delay: number = 0;
      if (pickedCountCards !== 2) {
         const timer = setInterval(() => {
            if (this.state.pickedCountCards === 1) {
               delay += 1;
               if (delay === 5) {
                  this.setCardFlip(this.currentIndexCard, false);
                  this.resetPickedCards();
                  this.setState({pickedCountCards: 0});
                  clearInterval(timer);
               }
            }
            else if (this.state.stackPairsCards[this.currentIndexCard].cardName === this.state.stackPairsCards[this.previousIndexCard].cardName) {
               this.setCardDisable(this.state.stackPairsCards[this.currentIndexCard].cardName);
               this.resetPickedCards()
               this.setState({pickedCountCards: 0});
               clearInterval(timer);
            } else {
               this.setCardFlip(this.currentIndexCard, false);
               this.setCardFlip(this.previousIndexCard, false);
               this.resetPickedCards();
               this.setState({pickedCountCards: 0});
               clearInterval(timer);
            }
         }, 1000);
      }
   }

   /**
    * Метод, отвечающий за перевернутость карты
    * @function
    * @private
    * @param indexOpened Индекс карты
    * @param flipped Сторона превернутой карты: 
    *        true - рубашкой вниз,
    *        false - рубашкой вверх
    */
   private setCardFlip(indexOpened: number, flipped: boolean): void {
      if (indexOpened < 0) return;
      const newStackPairsCards: ICard[] = this.state.stackPairsCards.map((card: ICard, index: number) => {
         if (indexOpened === index) {
            card.flipped = flipped;
         }
         return card;
      });
      this.setState({stackPairsCards: newStackPairsCards});
   }

   /**
    * Метод, отвечающий за угаданные карты
    * @function
    * @private
    * @param cardName Наименование карты
    */
   private setCardDisable(cardName: string): void {
      const newStackPairsCards: ICard[] = this.state.stackPairsCards.map((card: ICard, index: number) => {
         if (cardName === card.cardName) {
            card.disabled = true;
            this.setState({countGuessedCards: this.state.countGuessedCards + 1});
         }
         return card;
      });
      this.setState({stackPairsCards: newStackPairsCards});

      if (this.state.countGuessedCards === 36) {
         this.playerWon();
      }
   }

   /**
    * Метод, отвечающий за передачу сигнала таймеру о том, что нужно остановиться
    */
   private playerWon(): void {
      this.isStopTimerPanel = true;
      this.setState({countGuessedCards: 0});
      this.setState({isModalDisabled: false});
   }

   /**
    * Событие запуска игры
    */
   private startGame = () => {
      this.isStopTimerPanel = false;
      this.setState({isGivingAccess: true});
      this.shaffledCards(this.state.cards);
   }

   /**
    * Событие завершения игры
    */
   private finishedGame = (finishedTime: number) => {
      this.setState({isGivingAccess: false});
      this.setState({finishedTime: finishedTime});
   }

   /**
    * Метод, отвечающий за сброс индексов выбранных карт
    * @function
    * @private
    */
   private resetPickedCards(): void {
      this.currentIndexCard = -1;
      this.previousIndexCard = -1;
   }

   /**
    * Метод, который перемешивает колоду карт и возвращает уже готовый набор карт
    * @function
    * @private
    * @param stackCards Массив наименований карт
    */
   private shaffledCards(stackCards: Array<string>) {
      if (stackCards.length % 2 !== 0) {
         throw 'Количество карт на поле должно быть четным, для возможности деления их по парам';
      }
      // Создает пару для колоды
      const stackPairsCards: Array<string> = stackCards.concat(stackCards);
      for (let i = stackPairsCards.length - 1; i > 0; i--) {
         let j = Math.floor(Math.random() * (i + 1));
         [stackPairsCards[i], stackPairsCards[j]] = [stackPairsCards[j], stackPairsCards[i]];
      }
      const shuffledCards = stackPairsCards.map((icon, index) => ({
         index: index,
         cardName: icon,
         flipped: false,
         disabled: false
      }));
      this.setState({stackPairsCards: shuffledCards});
   }

   /**
    * Событие, которое всплывает из ModalWindowNickName, отвечающее за изменение информации об игроке
    * @param infoPlayer Информация об игроке
    */
   private resultInfo = (infoPlayer: IMyBoardState['infoPlayer']) => {
      this.setState({isModalDisabled: true});
      this.saveChange = true;
      this.setState({infoPlayer: {
         nickName: infoPlayer.nickName,
         time: infoPlayer.time
      }});
      this.setState({showTableResults: true});
   }

   /**
    * Событие, которое всплывает из TableResult, отвечающее за прекращение отслеживания и сохранения информации
    */
   private stopSaving = () => {
      this.saveChange = false;
      this.forceUpdate();
   }

   /**
    * Событие, которое всплывает из Panel, отвечающее за отображение таблицы результата
    */
   private showTable = () => {
      this.setState({showTableResults: true});
   }

   /**
    * Событие, которое всплывает из TableResult, отвечающее за закрытие таблицы результата
    */
   private closeTable = () => {
      this.setState({showTableResults: false});
   }

   /**
    * Обязательный метод, отвечающий за визуализацию компонента
    * @function
    * @public
    */
   public render() {
      return (
         <div className='wrapper'>
            <h1>Игра "Память"</h1>
            <div className={this.state.isModalDisabled ? 'wrapper__modal-window isDisabled' : 'wrapper__modal-window'}>
               <ModalWindowNickName sendResultInfo={this.resultInfo} finishedTime={this.state.finishedTime}></ModalWindowNickName>
            </div>
            <div className={this.state.showTableResults ? 'wrapper__showTableResults': 'board__hideTableResults'}>
               <TableResult closeTable={this.closeTable} stoppedSave={this.stopSaving} isSaveChange={this.saveChange} infoPlayer={({nickName: this.state.infoPlayer.nickName, time: this.state.infoPlayer.time})}></TableResult>
            </div>
            <Panel onShowResultTable={this.showTable} isStopTimer={this.isStopTimerPanel} onStartGame={this.startGame} onFinishedGame={this.finishedGame} />

            <div className='board'>
               <div className='board__cards-container'>
                  <div className={this.state.isGivingAccess ? 'isEnabled' : 'isDisabled'}></div>
                  {this.state.stackPairsCards.map((card, index) => (
                     <div className='card' key={index.toString()} > 
                        <Cards index={index} cardName={card.cardName} flipped={card.flipped} disabled={card.disabled} onClick={this.onCardClicked} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      
      );
   }
}
export default Board;
