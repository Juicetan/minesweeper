export default class Cell{
  static states = {
    UNREVEALED: 0,
    REVEALED: 1,
    bomb: {
      INCORRECT: 2,
      CORRECT: 3,
      ERROR: 4
    },
  }
  static types = {
    BOMB: 0,
    EMPTY: 1
  }
  constructor(opts){
    opts = opts || {};
    this.coords = {
      row: opts?.coords?.row || 0,
      col: opts?.coords?.col || 0
    }
    this.state = Cell.states.UNREVEALED;
    this.adjacentBombs = 0;
    this.bombState = null;
    this.type = opts.type || Cell.types.EMPTY;
    this.isFlagged = false;
    this.$el = document.createElement('div');
    this.$el.innerHTML = `
      <img class="icon flag" src="https://justinlam.ca/minesweeper/res/flag.png"/>
      <img class="icon bomb-result-error" src="https://justinlam.ca/minesweeper/res/bomb-result-error.png"/>
      <img class="icon bomb-result-incorrect" src="https://justinlam.ca/minesweeper/res/bomb-result-incorrect.png"/>
      <img class="icon bomb-result-location" src="https://justinlam.ca/minesweeper/res/bomb-result-location.png"/>
      <img class="icon square-1" src="https://justinlam.ca/minesweeper/res/square-1.png"/>
      <img class="icon square-2" src="https://justinlam.ca/minesweeper/res/square-2.png"/>
      <img class="icon square-3" src="https://justinlam.ca/minesweeper/res/square-3.png"/>
      <img class="icon square-4" src="https://justinlam.ca/minesweeper/res/square-4.png"/>
      <img class="icon square-5" src="https://justinlam.ca/minesweeper/res/square-5.png"/>
      <img class="icon square-6" src="https://justinlam.ca/minesweeper/res/square-6.png"/>
      <img class="icon square-7" src="https://justinlam.ca/minesweeper/res/square-7.png"/>
      <img class="icon square-8" src="https://justinlam.ca/minesweeper/res/square-8.png"/>
    `;
    this.$el.addEventListener('click', (e) => {
      e.preventDefault();
      if(this.isFlagged){
        return;
      }
      this.emitUpdate();
    });
    this.$el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.emitUpdate(true);
    });
  }
  emitUpdate(isRightClick){
    this.$el.dispatchEvent(new CustomEvent('update', {
      detail: {
        cell: this,
        flagCell: isRightClick
      },
      bubbles: true,
      composed: true
    }))
  }
  toElement(){
    this.$el.setAttribute('class','');
    this.$el.classList.add('square');
    if(this.state === Cell.states.UNREVEALED){
      this.$el.classList.add('empty');
      if(this.isFlagged){
        this.$el.classList.add('flagged');
      }
    } else if(this.state === Cell.states.REVEALED){
      if(this.type === Cell.types.BOMB){
        if(this.bombState === Cell.states.bomb.ERROR){
          this.$el.classList.add('bomb-lose');
        } else{
          this.$el.classList.add('bomb');          
        }
      } else if(this.isFlagged){
        this.$el.classList.add('bomb-wrong');
      } else if(this.adjacentBombs > 0){
        this.$el.classList.add(`clue-${this.adjacentBombs}`);
      }
    }
    
    return this.$el;
  }
}