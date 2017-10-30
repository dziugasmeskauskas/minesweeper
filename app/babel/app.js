class Cell {
  constructor(table, coords) {
    this.bomb = false;
    this.revealed = false;
    this.bombsAround = 0;
    this.x = coords[0];
    this.y = coords[1];

    this.div = document.createElement('div');
    this.div.className = 'cell';
    table.appendChild(this.div);

    this.div.oncontextmenu = (e) => {e.preventDefault()};
    this.div.addEventListener('click', this.check.bind(this));
    this.div.addEventListener('contextmenu', this.addFlag.bind(this));
  }


  addBombCount() {
    this.div.innerHTML = this.bombsAround
  }

  addFlag() {
    this.div.innerHTML = '🚩';
  }

  explode() {
    this.div.innerHTML = '💣';
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

class Board {
  constructor(options) {
    this.grid = options.grid;
    this.rows = options.rows;
    this.cols = options.cols;
    this.bombs = options.bombs;
  }

  makeTable() {
    this.grid = this.make2dArr(this.cols, this.rows);
    const table = document.getElementById('app');
    this.addCells(table);
    this.addBombs();
    this.countNeighbours();
  }

  addCells(table) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Cell(table, [i, j]);
      }
    }
  }

  addBombs() {
    for (let n = 0; n < this.bombs; n++) {
      let x = ~~(Math.random() * this.cols);
      let y = ~~(Math.random() * this.rows);

      if (!this.grid[x][y].bomb) {
        this.grid[x][y].bomb = true;
      }
    }
  }

  countNeighbours() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].count();
      }
    };
  }

  make2dArr(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }
}


const options = {
  grid: [],
  rows: 16,
  cols: 16,
  bombs: 25
}

const game = new Board(options);
game.makeTable();