import React from 'react'
import styled from '@emotion/styled'
import matchSorter from 'match-sorter'
import airports from './airports.json'
import airlines from './airlines.json'
import planes from './planes.json'

const Item = styled('li')(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({ isActive, isSelected }) => {
    const styles = []
    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      })
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      })
    }
    return styles
  },
)

const BaseMenu = styled('ul')(
  {
    padding: 0,
    marginTop: 0,
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    maxHeight: '20rem',
    overflowY: 'auto',
    overflowX: 'hidden',
    outline: '0',
    transition: 'opacity .1s ease',
    borderRadius: '0 0 .28571429rem .28571429rem',
    boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    borderColor: '#96c8da',
    borderTopWidth: '0',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  ({ isOpen }) => ({
    border: isOpen ? null : 'none',
  }),
)

const Menu = React.forwardRef((props, ref) => (
  <BaseMenu innerRef={ref} {...props} />
))

const ControllerButton = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  cursor: 'pointer',
  width: 47,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})

function ArrowIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  )
}

function getAirports(filter) {
  return filter
    ? matchSorter(airports, filter, {
      keys: ['iata', 'name'],
    })
    : airports
}

function getAirlines(filter) {
  return filter
    ? matchSorter(airlines, filter, {
      keys: ['iata', 'name'],
    })
    : airlines
}

function getPlanes(filter) {
  return filter
    ? matchSorter(planes, filter, {
      keys: ['icao', 'name'],
    })
    : planes
}

const airportToString = i => (i ? i.iata !== "" ? i.name.toString().concat(' (', i.iata, ')') : i.name.toString() : '')

const airlineToString = i => (i ? i.iata !== "" ? i.name.toString().concat(' (', i.iata, ')') : i.name.toString() : '')

const planeToString = i => (i ? i.icao !== "" ? i.name.toString().concat(' (', i.icao, ')') : i.name.toString() : '')

export {
  Item,
  Menu,
  ControllerButton,
  ArrowIcon,
  XIcon,
  getAirports,
  getAirlines,
  getPlanes,
  airportToString,
  airlineToString,
  planeToString
}
