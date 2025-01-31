import Util from "./util.mjs";
import Cell from "./cell.mjs";

export default class Board{
  constructor(opts){
    opts = opts || {};
    this.$el = opts.$el;
    this.totalBombs = opts.totalBombs || 10;
    this.dim = {
      row: 9,
      col: 9
    };
    this.matrix = [];
    this.cellEvent = function(e){
      this.evaluateCellAction(e.detail.cell, e.detail.flagCell);
      this.update();
      if(this.isCorrectlyFlagged){
        this.endGame();
      }
    }.bind(this);
    this.$el.addEventListener('update', this.cellEvent);
    this.initBoard();
  }
  get numFlagged(){
    let count = 0;
    for(let row = 0; row < this.dim.row; row++){
      for(let col = 0; col < this.dim.col; col++){
        if(this.matrix[row][col].isFlagged){
          count++;
        }
      }
    }
    return count;
  }
  get isCorrectlyFlagged(){
    var isCorrect = true;
    for(let row = 0; row < this.dim.row && isCorrect; row++){
      for(let col = 0; col < this.dim.col && isCorrect; col++){
        let cell = this.matrix[row][col];
        if(!cell.isFlagged && cell.type === Cell.types.BOMB){
          isCorrect = false;
        }
      }
    }
    return isCorrect;
  }
  initBoard(){
    if(!this.$el){
      console.error('no board element');
      return;
    }
    
    // init cells
    for(let row = 0; row < this.dim.row; row++){
      for(let col = 0; col < this.dim.col; col++){
        if(!this.matrix[row]){
          this.matrix[row] = [];
        }
        this.matrix[row][col] = new Cell({
          coords: {
            col: col,
            row: row
          }
        });
      }
    }
    
    // init bombs
    let addedBombs = 0;    
    while(addedBombs < this.totalBombs){ 
      let randRow = Util.randomNumber(0, this.dim.row - 1);
      let randCol = Util.randomNumber(0, this.dim.col - 1);
      let cell = this.matrix[randRow][randCol];
      if(cell.type !== Cell.types.BOMB){
        this.matrix[randRow][randCol].type = Cell.types.BOMB;
        addedBombs++;
      } 
    }
    
    // init numbering 
    for(let row = 0; row < this.dim.row; row++){
      for(let col = 0; col < this.dim.col; col++){
        let cell = this.matrix[row][col];
        for(let adjRow = row-1; adjRow <= row+1; adjRow++){
          for(let adjCol = col-1; adjCol <= col+1; adjCol++){
            let testCell = this.matrix[adjRow]?.[adjCol];
            if(testCell && testCell !== cell && testCell.type === Cell.types.BOMB){
              cell.adjacentBombs++;
            }
          } 
        }
      }
    }
  }
  evaluateCellAction(cell, flagCell){
    if(cell.state === Cell.states.UNREVEALED){
      if(flagCell){
        cell.isFlagged = !cell.isFlagged;
      } else{
        if(cell.type === Cell.types.BOMB){
          cell.bombState = Cell.states.bomb.ERROR;
          this.endGame();
        } else {
          this.revealBlanks(cell); 
        }
      }
    }
  }
  update(){
    this.$el.innerHTML = '';
    this.matrix.forEach((row) => {
      row.forEach((col) => {
        this.$el.append(col.toElement());
      })
    })
  }
  revealBlanks(clickedCell){
    const recursiveBlankReveal = (cell) => {
      if(!cell || cell.type === Cell.types.BOMB || cell.state === Cell.states.REVEALED || cell.isFlagged){
        return;
      }
      cell.state = Cell.states.REVEALED; 
      if(cell.type === Cell.types.EMPTY && cell.adjacentBombs === 0){
        recursiveBlankReveal(this.matrix[cell.coords.row-1]?.[cell.coords.col])
        recursiveBlankReveal(this.matrix[cell.coords.row+1]?.[cell.coords.col])
        recursiveBlankReveal(this.matrix[cell.coords.row]?.[cell.coords.col-1])
        recursiveBlankReveal(this.matrix[cell.coords.row]?.[cell.coords.col+1])
      }
    };
    recursiveBlankReveal(clickedCell);
  }
  endGame(){
    for(let row = 0; row < this.dim.row; row++){
      for(let col = 0; col < this.dim.col; col++){
        let cell = this.matrix[row][col];
        cell.state = Cell.states.REVEALED;
      }
    }
  }
  destroy(){
    this.$el.removeEventListener('update', this.cellEvent);
  }
}