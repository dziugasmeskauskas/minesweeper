const game = {
  grid: [],
  rows: 16,
  cols: 16,
  bombs: 25
}

const make2dArr = (cols, rows) => {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

class Cell {
  
    constructor(table, id) {
      this.bomb = false;
      this.revealed = false;
      this.bombsAround = 0;
      this.x = id[0];
      this.y = id[1];
      this.div = document.createElement('div');
  
      this.div.className = 'cell';
      this.div.id = id.toString();
      table.appendChild(this.div);
      this.div.oncontextmenu = (e) => {e.preventDefault()}

      this.div.addEventListener('click', this.check.bind(this));
      this.div.addEventListener('contextmenu', this.addFlag.bind(this));
    }
  

    addBombCount() {
      this.div.innerHTML = this.bombsAround
    }
   
    addFlag() {
      this.div.innerHTML = '🚩';
    }

    reveal() {
      this.revealed = true;
      this.bombsAround == 0 && this.seedFill();
      this.bombsAround && this.addBombCount();
      this.div.style.background = '#D3D3D3'
    }
  
    check() {
      this.bomb ? this.explode() : this.reveal(); 
    }

    explode() {
      this.div.innerHTML = '💣';
    }
  
    count() {
      if (this.bomb) {
        this.neighborCount = -1;
        return;
      }
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        let i = this.x + xOffset;
        if (i < 0 || i >= game.cols) continue;
  
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          let o = this.y + yOffset;
          if (o < 0 || o >= game.rows) continue;
  
          let neighbor = game.grid[i][o];
          neighbor.bomb && this.bombsAround++;
        }
      }
  
    }
  
    seedFill() {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        let i = this.x + xOffset;
        if (i < 0 || i >= game.cols) continue;
  
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          let o = this.y + yOffset;
          if (o < 0 || o >= game.rows) continue;
  
          let neighbor = game.grid[i][o];
          if (!neighbor.revealed) {
            neighbor.reveal();
          }
        }
      }
    }

  }


const makeTable = () => {
  game.grid = make2dArr(game.cols, game.rows);
  const table = document.getElementById('app');

  for (let i = 0; i < game.cols; i++) {
    for (let j = 0; j < game.rows; j++) {
      game.grid[i][j] = new Cell(table, [i, j]);
    }
  }

  for (let n = 0; n < game.bombs; n++) {
    let x = ~~(Math.random() * game.cols);
    let y = ~~(Math.random() * game.rows);

    if (!game.grid[x][y].bomb) {
      game.grid[x][y].bomb = true;
    }
  }

  for (let i = 0; i < game.cols; i++) {
    for (let j = 0; j < game.rows; j++) {
      game.grid[i][j].count();
    }
  };
}


makeTable();



