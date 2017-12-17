

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
    this.div.addEventListener('contextmenu', this.showFlag.bind(this))
    this.div.addEventListener('click', this.reveal.bind(this))
  }

  showBombCount() {
    this.div.innerHTML = this.bombsAround
  }

  showFlag() {
    this.div.innerHTML = '🚩'
  }

  reveal() {
    this.revealed = true
    this.bombsAround === 0 ? this.floodFill() : this.showBombCount()
    this.div.style.background = '#D3D3D3'
  }

  countNeighbours() {
    if (this.bomb) {return}
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



class BombCell extends Cell {
  constructor(table, coords) {
    super(table, coords)
    this.bomb = true
    this.gameLost = true
  }

  reveal() {
    this.div.innerHTML = '💣'
    this.endGame()
  }

  endGame() {
    const state = new gameState(this.gameLost)
  }
}


class gameState {
  constructor (state) {
    this.lost = state
    this.info = document.querySelector('.info__cont')
    this.status = document.querySelector('.info__status')
  
    this.showState()
  }

  showState () {
    this.info.classList.remove('hide')
    if(this.lost) {
      this.status.innerHTML = 'Game lost'
    }
  }
}

class Board {
  constructor(options, table, grid) {
    this.grid = grid
    this.rows = options.rows
    this.cols = options.cols
    this.bombs = options.bombs
    this.table = table
  }

  makeTable() {
    this.grid = Array(this.cols).fill(0).map(x => Array(this.rows))
    this.addCells()
    this.getNeighboursCount()
  }

  addCells() {
    const bombLocs = this.getBombLocs()
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        bombLocs.some((loc, i) => {
          if (this.compareArrays(loc, [x, y])) {
            this.grid[x][y] = new BombCell(this.table, [x, y], game)
            return true
          } else if (i == (bombLocs.length - 1)) {
            this.grid[x][y] = new Cell(this.table, [x, y], game)
          }
        })
      }
    }
  }

  getBombLocs() {
    const arr = []
    while (this.bombs > 0) {
      let x = this.getRandomCoord(this.cols)
      let y = this.getRandomCoord(this.rows)
      if (true) {
        arr.push([x, y])
        this.bombs--
      }
    }
    return arr
  }

  compareArrays(a1, a2) {
    let i = a1.length
    if (i != a2.length) return false
    while (i--) {
      if (a1[i] !== a2[i]) return false
    }
    return true
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

const table = document.getElementById('app')
const grid = []
let game = ''

const options = {
  "rows": 16,
  "cols": 16,
  "bombs": 25
}


game = new Board(options, table, grid)
game.makeTable()









 







