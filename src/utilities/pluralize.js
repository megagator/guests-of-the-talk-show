const pluralize = (noun, number, pluralEnding = 's') => {
  if (number === 1) {
    return noun
  }

  return noun + pluralEnding
}

export default pluralize
