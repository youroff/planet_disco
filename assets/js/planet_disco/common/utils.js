export const toRad = (x) => x * Math.PI / 180
 
export const updateQuery = (key) => (base, {fetchMoreResult}) => {
  if (!fetchMoreResult) return base;
  return Object.assign({}, base, {
    [key]: Object.assign({}, base[key], {
      entries: [...base[key].entries, ...fetchMoreResult[key].entries],
      cursor: fetchMoreResult[key].cursor
    })
  })
}

export const processScroll = (variables, trigger, relation, query) => (e) => {
  const leftover = e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
  if (leftover < trigger && !query.loading && query.data[relation].cursor) {
    query.fetchMore({
      variables: {...variables, cursor: query.data[relation].cursor},
      updateQuery: updateQuery(relation)
    })
  }
}
