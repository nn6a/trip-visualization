import React, {Component} from 'react';

export default class PointControl extends Component {
    _renderButton = (point, index) => {
        return (
            <div key={`btn-${index}`} className="input">
                <input type="radio" name="point"
                       id={`point-${index}`}
                       checked={point.name === this.props.selectedPoint.name}
                       onClick={() => this.props.onViewportChange(point)}/>
                <label htmlFor={`point-${index}`}>{point.name}</label>
            </div>
        );
    };

    render () {
        return (
            <div style={layerControlStyle}>
                {this.props.pointData.map(this._renderButton)}
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
