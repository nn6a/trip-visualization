import React, {Component} from 'react';
import {injectGlobal} from 'styled-components'
import MapGL from 'react-map-gl';
import taxiData from './data/taxi';
import DeckGLOverlay from './DeckGLOverlay';
import {LayerControls, SCATTERPLOT_CONTROLS} from './LayerControls';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line
const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';

injectGlobal`
  body {
    margin: 0;
    padding: 0;
  }
`;

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                longitude: -74,
                latitude: 40.7,
                zoom: 11,
                maxZoom: 16
            },
            points: [],
            status: 'LOADING',
            settings: Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
                ...accu,
                [key]: SCATTERPLOT_CONTROLS[key].value
            }), {}),
            x: 0,
            y: 0,
            hoveredObject: null,
        };
    }

    componentDidMount () {
        this._processData();
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this._resize);
    }

    _processData = () => {
        if (taxiData) {
            this.setState({status: 'LOADED'});
            const points = taxiData.reduce((accu, curr) => {
                accu.push({
                    position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
                    pickup: true
                });
                accu.push({
                    position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
                    pickup: false
                });
                return accu;
            }, []);
            this.setState({
                points,
                status: 'READY'
            });
        }
    };

    _resize = () => {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    _onViewportChange = (viewport) => {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    };

    _updateLayerSettings = (settings) => {
        this.setState({settings});
    };

    _onHover = ({x, y, object}) => {
        this.setState({x, y, hoveredObject: object});
    };

    render () {
        return (
            <div>
                {this.state.hoveredObject &&
                <div style={{
                    ...tooltipStyle,
                    transform: `translate(${this.state.x}px, ${this.state.y}px)`
                }}>
                    <div>x: {this.state.hoveredObject.position[0]}</div>
                    <div>y: {this.state.hoveredObject.position[1]}</div>
                </div>}

                <LayerControls
                    settings={this.state.settings}
                    propTypes={SCATTERPLOT_CONTROLS}
                    onChange={settings => this._updateLayerSettings(settings)}/>

                <MapGL
                    {...this.state.viewport}
                    onViewportChange={viewport => this._onViewportChange(viewport)}
                    mapStyle={MAPBOX_STYLE}
                    mapboxApiAccessToken={MAPBOX_TOKEN}>
                    <DeckGLOverlay
                        viewport={this.state.viewport}
                        data={this.state.points}
                        settings={this.state.settings}
                        onHover={hover => this._onHover(hover)}
                    />
                </MapGL>
            </div>
        );
    }
}

const tooltipStyle = {
    position: 'absolute',
    padding: '4px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    maxWidth: '300px',
    fontSize: '10px',
    zIndex: 9,
    pointerEvents: 'none'
};

export default App;
