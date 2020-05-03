import React, { useState, useRef, useEffect } from 'react'
import { TextField, CircularProgress } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const CITIES = gql`query CitiesAutocomplete($term: String) {
  cities(q: $term, limit: 10) {
    entries {
      id
      city
      humanCountry
      coord
    }
  }
}`

export default ({onChange}) => {
  const [options, setOptions] = useState([])
  const {loading, data, refetch} = useQuery(CITIES)

  useEffect(() => {
    data && setOptions(data.cities.entries)
  }, [data])

  return <Autocomplete
    filterOptions={(_, input) => {
      refetch({term: input.inputValue})
      return options
    }}
    autoComplete={false}
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
            <>
              {loading && <CircularProgress color="inherit" size={20} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />
}