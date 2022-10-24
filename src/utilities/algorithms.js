// this.data looks like:
//
// [
//   [0, 193],
//   [1, 356],
//   [2, 32],
//   [3, 221],
//   ...
// ]

class AbstractLinearFitAlgorithm {
  constructor(data) {
    this.data = []
    if (!Array.isArray(data)) {
      // console.error(data)
      // throw new TypeError('data must be in an array')
      return
    }

    for (let i = 0; i < data.length; i++) {
      const datum = data[i]
      if (typeof datum != 'number') {
        throw new TypeError('all data must be numbers')
      }

      this.data.push([i, datum])
    }
  }

  predict() {
    throw new Error('implement an algorithm in a concrete class')
  }
}

export class LinearFitError extends Error {
  constructor() {
    super('No linear fit possible.')
    this.name = 'LinearFitError'
  }
}

export class AverageFit extends AbstractLinearFitAlgorithm {
  // Basic, vulnerable to outliers

  predict() {
    if (this.data.length === 0) {
      throw new LinearFitError()
    }

    const sum = this.data.reduce((prev, curr) => prev + curr[1], 0)
    const averageDays = sum / this.data.length

    return averageDays
  }
}

export class L1NormalFit extends AbstractLinearFitAlgorithm {
  // Less sensitive to outliers

  predict() {
    // const sum = this.data.reduce((prev, curr) => prev + curr[1], 0)
    // let averageDays = 0
    // if (sum > 0 && this.data.length > 0) {
    //     averageDays = Math.round(sum / this.data.length)
    // }
  }
}

export class L2NormalFit extends AbstractLinearFitAlgorithm {
  // Assuming normally distributed errors, the most likely outcome

  predict() {
    if (this.data.length === 0) {
      throw new LinearFitError()
    }

    const averageX = (this.data.length - 1) / 2
    const averageY =
      this.data.reduce((prev, curr) => prev + curr[1], 0) / this.data.length

    let sampleVariance = 0
    let sampleCovariance = 0
    for (const datum of this.data) {
      const x = datum[0]
      const y = datum[1]

      sampleVariance += (x - averageX) * (x - averageX)
      sampleCovariance += (x - averageX) * (y - averageY)
    }

    const slope = sampleCovariance / sampleVariance
    const intercept = averageY - slope * averageX

    return this.data.length * slope + intercept
  }
}
