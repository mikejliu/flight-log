import React, { Component } from "react";
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import {
  Item,
  Menu,
  ControllerButton,
  ArrowIcon,
  XIcon
} from './DownshiftShare';
import airports from '../data/airports.json';
import airlines from '../data/airlines.json';
import planes from '../data/planes.json';

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

const airportToLat = i => (i ? i.lat ? i.lat.toString() : '' : '')

const airportToLong = i => (i ? i.long ? i.long.toString() : '' : '')


class FormDownshift extends Component {
  render() {
    var { handleDownshiftChange, name } = this.props;
    var getItems = (name === 'input_from' || name === 'input_to') ? getAirports : name === 'input_airline' ? getAirlines : getPlanes;
    var itemToString = (name === 'input_from' || name === 'input_to') ? airportToString : name === 'input_airline' ? airlineToString : planeToString;
    var placeholder = name === 'input_from' ? 'From Airport' : name === 'input_to' ? 'To Airport' : name === 'input_airline' ? 'Airline' : 'Aircraft Type';
    return (
      <Downshift
        onChange={selection =>
          (name === 'input_from' || name === 'input_to') ?
          handleDownshiftChange(name, itemToString(selection), airportToLat(selection), airportToLong(selection))
          : handleDownshiftChange(name, itemToString(selection))
        }
        itemToString={itemToString}
      >
        {({
          getInputProps,
          getToggleButtonProps,
          getMenuProps,
          getItemProps,
          isOpen,
          clearSelection,
          selectedItem,
          inputValue,
          highlightedIndex,
        }) => (
            <div>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  {...getInputProps({
                    isOpen,
                    placeholder: placeholder,
                  })}
                />
                {selectedItem ? (
                  <ControllerButton
                    onClick={clearSelection}
                    aria-label="clear selection"
                  >
                    <XIcon />
                  </ControllerButton>
                ) : (
                    <ControllerButton {...getToggleButtonProps()}>
                      <ArrowIcon isOpen={isOpen} />
                    </ControllerButton>
                  )}
              </div>
              <div style={{ position: 'relative', zIndex: '10' }}>
                <Menu {...getMenuProps({ isOpen })}>
                  {isOpen
                    ? getItems(inputValue).map((item, index) => (
                      <Item
                        key={item.id}
                        {...getItemProps({
                          item,
                          index,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItem === item,
                        })}
                      >
                        {itemToString(item)}
                      </Item>
                    ))
                    : null}
                </Menu>
              </div>
            </div>
          )}
      </Downshift>
    )
  }
}

export default FormDownshift
