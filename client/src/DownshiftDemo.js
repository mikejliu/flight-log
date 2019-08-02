import React, { Component } from "react";
import Downshift from 'downshift'
import {
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
} from './shared'

class DownshiftDemo extends Component {
  getItems = this.props.data === 'airports' ? getAirports : this.props.data === 'airlines' ? getAirlines : getPlanes;
  itemToString = this.props.data === 'airports' ? airportToString : this.props.data === 'airlines' ? airlineToString : planeToString;

  render() {
    return (
      <Downshift
        onChange={selection =>
          alert(
            selection
              ? `You selected ${this.itemToString(selection)}`
              : 'selection cleared',
          )
        }
        itemToString={this.itemToString}
      >
        {({
          getLabelProps,
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
            <div style={{ width: '100%', margin: 'auto' }}>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  {...getInputProps({
                    isOpen,
                    placeholder: 'Enter a name',
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
                    ? this.getItems(inputValue).map((item, index) => (
                      <Item
                        key={item.id}
                        {...getItemProps({
                          item,
                          index,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItem === item,
                        })}
                      >
                        {this.itemToString(item)}
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

export default DownshiftDemo
