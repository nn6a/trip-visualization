import React, {Component} from 'react';
import styled from 'styled-components';

export default class MobilePointControl extends Component {
    _renderMenu = (point, index) => {
        return (
            <div key={`item-${index}`}>
                <input type="radio" name="point"
                       id={`point-${index}`}
                       checked={point.name === this.props.selectedPoint.name}
                       onClick={() => this._handleClick(point)}/>
                <label htmlFor={`point-${index}`}>{point.name}</label>
            </div>
        );
    };

    _toggleMenu = () => {
        this.props.toggleMenu()
    };

    _handleClick = (point) => {
        this._toggleMenu();
        this.props.onViewportChange(point)
    };

    render () {
        return (
            <Wrapper>
                <Menu onClick={this._toggleMenu}>{this.props.isControlShown ? 'CLOSE' : 'MENU'}</Menu>
                {this.props.isControlShown &&
                <LayerControl>
                    {this.props.pointData.map(this._renderMenu)}
                </LayerControl>
                }
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 101;
`;

const Menu = styled.div`
    width: fit-content;
    background-color: rgba(0, 0, 0, 0.54);
    color: white;
    margin-left: auto;
    padding: 4px 8px;
    margin-bottom: 4px;
    border-radius: 4px;
`;

const LayerControl = styled.div`
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 12px;
    line-height: 1.833;
    width: 200px;
    padding: 20px;
    background: white;
    max-height: 70vh;
    overflow: scroll;
`;
