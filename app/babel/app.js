

class Cell {
  constructor(table, coords) {
    this.bomb = false
    this.revealed = false
    this.bombsAround = 0
    this.x = coords[0]
    this.y = coords[1]
    this.div = document.createElement('div')
    this.div.className = 'cell'
    table.appendChild(this.div)

    this.div.oncontextmenu = (e) => {e.preventDefault()}
    this.div.addEventListener('click', this.checkIfHasBomb.bind(this))
    this.div.addEventListener('contextmenu', this.showFlag.bind(this))
  }


  showBombCount() {
    this.div.innerHTML = this.bombsAround
  }

  showFlag() {
    this.div.innerHTML = '🚩'
  }

  showExplosion() {
    this.div.innerHTML = '💣'
  }

  reveal() {
    this.revealed = true
    this.bombsAround == 0 && this.floodFill()
    this.bombsAround && this.showBombCount()
    this.div.style.background = '#D3D3D3'
  }

  checkIfHasBomb() {
    this.bomb ? this.showExplosion() : this.reveal()
  }

  countNeighbours() {
    if (this.bomb) {
      this.neighborCount = -1
      return
    } 
    this.getNeighbors().forEach(neighbor => neighbor.bomb && this.bombsAround++)  
  }
  
  floodFill() {
    this.getNeighbors().forEach(neighbor => !neighbor.revealed && neighbor.reveal())
  }

  getNeighbors() {
    const neighbors = []
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      let i = this.x + xOffset
      if (i < 0 || i >= game.cols) continue

      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        let o = this.y + yOffset
        if (o < 0 || o >= game.rows) continue
        const neighbor = game.grid[i][o]
        neighbors.push(neighbor)
        
      }
    }
    return neighbors
  }

}

class Board {
  constructor(options) {
    this.grid = options.grid
    this.rows = options.rows
    this.cols = options.cols
    this.bombs = options.bombs
  }

  makeTable() {
    this.grid = Array(this.cols).fill(0).map(x => Array(this.rows))
    const table = document.getElementById('app')
    this.addCells(table)
    this.addBombs(this.bombs)
    this.getNeighboursCount()
  }

  addCells(table) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Cell(table, [i, j], game)
      }
    }
  }

  addBombs(bombCount) {
    if(bombCount > 0) {
      let x = this.getRandomCoord(this.cols)
      let y = this.getRandomCoord(this.rows)
      if (!this.grid[x][y].bomb) {
        this.grid[x][y].bomb = true
      }
      this.addBombs(--bombCount)
    }
  }

  getRandomCoord(limit) {
    return ~~(Math.random() * limit)
  }

  getNeighboursCount() {
    this.getGridItems().forEach(item => item.countNeighbours())
  }

  getGridItems() {
    const gridItems = []
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        gridItems.push(this.grid[i][j])
      }
    }
    return gridItems
  }

}


const options = {
  grid: [],
  rows: 16,
  cols: 16,
  bombs: 25
}

const game = new Board(options)
game.makeTable()