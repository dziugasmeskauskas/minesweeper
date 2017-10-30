const make2dArr = (cols, rows) => {
  let arr = new Array(cols);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}


class Cell {

  constructor (table,id) {
    this.bomb = false;
    this.revealed = false;
    this.flag = false;
    this.countBomb = 0;
    this.x = id[0];
    this.y = id[1];
    this.div = document.createElement('div');
  
    

    this.div.className = 'cell';
    this.div.id = id.toString();
    table.appendChild(this.div);
  
    this.div.addEventListener('click', this.check);

    this.div.addEventListener('contextmenu', function(e){
      e.preventDefault();
      this.style.background = 'yellow'
    });
  }

  show() {
    if(this.countBomb) {
      this.div.innerHTML = this.countBomb;
    }
    this.div.style.background = '#D3D3D3'
  }
 
  count() {
    if (this.bomb) {
      this.neighborCount = -1;
      return;
    }
    for(let xOffset = -1; xOffset <= 1; xOffset++){
      let i = this.x + xOffset;
      if (i < 0 || i >= cols) continue;

      for(let yOffset = -1; yOffset <= 1; yOffset++) {
        let o = this.y + yOffset;
        if (o < 0 || o >= rows) continue;

        let neighbor = grid[i][o];
        neighbor.bomb && this.countBomb++;
      }
    }
    // this.show();
  }

  revealed
   check() {
    let count;
    let element = getElement(this.id);
    if(element.bomb) {
      this.style.background = 'red' 
    } else {
      element.show();

    }
  }


}



let grid = [];
const rows = 16;
const cols = 16;
const bombs = 10;

const getElement = (id) => {
  let i = id.split(',')[0];
  let o = id.split(',')[1];
  return grid[i][o];
}


const makeTable = () => {

  grid = make2dArr(cols, rows);
  const table = document.getElementById('app');

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(table, [i,j]);
    }
  }

  for (let n = 0; n < bombs; n++) {
    let x = ~~(Math.random() * cols);
    let y = ~~(Math.random() * rows);

    if(!grid[x][y].bomb) {
      grid[x][y].bomb = true;
    } 
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].count();
    }
  }

return grid;

}


const init = () => {
  
  const grid = makeTable();

  // var cell = document.querySelectorAll('.cell');

  // cell.forEach(function(element) {
  //   element.addEventListener('click', );

  // });

}

init();