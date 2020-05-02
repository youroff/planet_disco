import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const CITIES = gql`query CitiesAutocomplete($term: String!) {
  cities(q: $term, limit: 10) {
    entries {
      id
      city
      humanCountry
    }
  }
}`

export default ({onChange}) => {
  const [term, setTerm] = useState("")
  const [options, setOptions] = React.useState([])
  const variables = {term}
  const { loading, data, refetch } = useQuery(CITIES, {variables})

  useEffect(() => {
    data && setOptions(data.cities.entries)
  }, [data])

  return <Autocomplete
    filterOptions={(_, input) => {
      refetch({term: input.inputValue})
      return options
    }}
    getOptionSelected={(option, value) => option.id === value.id}
    getOptionLabel={(option) => `${option.city}, ${option.humanCountry}`}
    onChange={(_e, city) => onChange && onChange(city)}
    options={options}
    loading={loading}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Pick a city"
        variant="outlined"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading && <CircularProgress color="inherit" size={20} />}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    )}
  />
}