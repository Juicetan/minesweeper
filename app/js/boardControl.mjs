import Util from "./util.mjs";
import Board from "./board.mjs";

export default class BoardControl{
  constructor(opts){
    opts = opts || {};
    this.$el = opts.$el;
    this.board = opts.board;
    this.monitorBoard();
    this.$timer = this.$el.querySelector('.timer .val-wrap');
    this.$minesLeft = this.$el.querySelector('.mines-left .val-wrap');
    this.$newGame = this.$el.querySelector('.start .val-wrap');
    this.elapsedTime = 0;
    this.minesLeft = 10;
    this.timer = null;
    this.$newGame.addEventListener('click', (e) => {
      this.createNew();  
    })
  }
  resetTimer(){
    this.elapsedTime = 0;
    clearInterval(this.timer);
    this.timer = null;
  }
  startTimer(){
    this.timer = setInterval(() => {
      if(this.elapsedTime < 999){
        this.elapsedTime++;        
      }
      this.update();
    }, 1000);
  }
  createNew(){
    this.resetTimer();
    this.minesLeft = 10;
    this.cleanupBoardMonitor();
    this.board.destroy();
    this.board = new Board({
      $el: document.querySelector('.board')
    });
    this.board.update();
    this.monitorBoard();
    this.update();
  }
  monitorBoard(){
    if(!this.board){
      return;
    }
    this.boardUpdate = function(e){
      this.minesLeft = 10 - this.board.numFlagged;
      if(!this.timer){
        this.startTimer();
      } else if(this.board.numFlagged === 10){
        this.resetTimer();
      }
      this.update();
    }.bind(this);
    this.board.$el.addEventListener('update', this.boardUpdate);
  }
  cleanupBoardMonitor(){
    this.board.$el.removeEventListener('update', this.boardUpdate);
  }
  update(){
    this.$minesLeft.innerHTML = Util.zeroPad(this.minesLeft, 2);
    this.$timer.innerHTML = Util.zeroPad(this.elapsedTime, 3);
  }
}