import React, {Component} from 'react';

export const HEXAGON_CONTROLS = {
    radius: {
        displayName: 'Hexagon Radius',
        type: 'range',
        value: 250,
        step: 50,
        min: 50,
        max: 1000
    },
    coverage: {
        displayName: 'Hexagon Coverage',
        type: 'range',
        value: 0.7,
        step: 0.1,
        min: 0,
        max: 1
    },
    upperPercentile: {
        displayName: 'Hexagon Upper Percentile',
        type: 'range',
        value: 100,
        step: 0.1,
        min: 80,
        max: 100
    },
    radiusScale: {
        displayName: 'Scatterplot Radius',
        type: 'range',
        value: 30,
        step: 10,
        min: 10,
        max: 200
    }
};

export const SCATTERPLOT_CONTROLS = {
    radiusScale: {
        displayName: 'Scatterplot Radius',
        type: 'range',
        value: 30,
        step: 10,
        min: 10,
        max: 200
    },
    showHexagon: {
        displayName: 'Show Hexagon',
        type: 'boolean',
        value: true
    }
};

export class LayerControls extends Component {

    _onValueChange = (settingName, newValue) => {
        const {settings} = this.props;
        // Only update if we have a confirmed change
        if (settings[settingName] !== newValue) {
            // Create a new object so that shallow-equal detects a change
            const newSettings = {
                ...this.props.settings,
                [settingName]: newValue
            };

            this.props.onChange(newSettings);
        }
    };

    render () {
        const {title, settings, propTypes = {}} = this.props;

        return (
            <div style={layerControl}>
                {title && <h4>{title}</h4>}
                {Object.keys(settings).map(key =>
                    <div key={key}>
                        <label>{propTypes[key].displayName}</label>
                        <div style={{display: 'inline-block', float: 'right'}}>
                            {settings[key]}</div>
                        <Setting
                            settingName={key}
                            value={settings[key]}
                            propType={propTypes[key]}
                            onChange={this._onValueChange}/>
                    </div>)}
            </div>
        );
    }
}

const Setting = props => {
    const {propType} = props;
    if (propType && propType.type) {
        switch (propType.type) {
            case 'range':
                return <Slider {...props} />;

            case 'boolean':
                return <Checkbox {...props}/>;
            default:
                return <input {...props}/>;
        }
    }
};

const Checkbox = ({settingName, value, onChange}) => {
    return (
        <div key={settingName}>
            <div className="input-group">
                <input
                    type="checkbox"
                    id={settingName}
                    checked={value}
                    onChange={e => onChange(settingName, e.target.checked)}/>
            </div>
        </div>
    );
};

const Slider = ({settingName, value, propType, onChange}) => {

    const {max = 100} = propType;

    return (
        <div key={settingName}>
            <div className="input-group">
                <div>
                    <input
                        type="range"
                        id={settingName}
                        min={0} max={max} step={max / 100}
                        value={value}
                        onChange={e => onChange(settingName, Number(e.target.value))}/>
                </div>
            </div>
        </div>
    );
};

const layerControl = {
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
    zIndex: 100,
    background: 'white'
};
