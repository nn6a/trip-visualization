import React, {Component} from 'react';
import CITIES from './data/points.json';

export default class PointControl extends Component {
    _renderButton = (city, index) => {
        return (
            <div key={`btn-${index}`} className="input">
                <input type="radio" name="city"
                       id={`city-${index}`}
                       defaultChecked={city.city === 'San Francisco'}
                       onClick={() => this.props.onViewportChange(city)}/>
                <label htmlFor={`city-${index}`}>{city.city}</label>
            </div>
        );
    };

    render () {
        return (
            <div style={layerControlStyle}>
                {CITIES.filter(city => city.state === 'California').map(this._renderButton)}
            </div>
        );
    }
}

const layerControlStyle = {
    borderRadius: 3,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    fontFamily: 'ff-clan-web-pro, "Helvetica Neue", Helvetica, sans-serif !important',
    fontSize: '12px',
    lineHeight: 1.833,
    width: 200,
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '20px',
    zIndex: 101,
    background: 'white'
};
