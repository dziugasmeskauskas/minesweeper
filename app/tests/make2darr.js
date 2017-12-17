const make2darr = (x, y) => {
  return Array(x).fill(0).map(element => Array(y).fill(0))
}

module.exports = make2darr