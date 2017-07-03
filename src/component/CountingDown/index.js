/**
 * Copyright(c) Richard
 * Created by Richard on 17/7/4.
 * @author: Richard<xiaowei.hsueh@gmail.com>(https://www.gistop.com)
 * @description:
 */


import React from 'react';
import PropTypes from 'prop-types';
import fecha from 'fecha';

const DEFAULT_COLOR = '#dddddd';
const HIGHLIGHT_COLOR = '#ffff00';
const TEXT_COLOR = '#ffffff';

const getTimeSpan = (v) => {
    let d = new Date(v);
    d.setHours(d.getUTCHours());
    return fecha.format(d, 'HH:mm:ss');
};

export default class CountingDown extends React.Component {

    static propTypes = {
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        let total = this.props.endTime - this.props.startTime;
        let now = (new Date()).getTime();
        let value = this.props.endTime - now;
        value = value > 0 ? value : 0;
        this.state = {
            total,
            value
        };
    }

    componentDidMount() {
        this.timer = window.setInterval(this.draw.bind(this), 100);
    }

    componentWillUnmount() {
        console.log('Unmount');
        this.clearTimer();
    }

    calculator() {
        let now = (new Date()).getTime();
        let value = this.props.endTime - now;
        if (value >= 0) {
            this.setState({
                value
            });
        }
    }

    draw () {
        if (this.state.value > 0) {
            this.calculator();
        }

        let context = this.canvas.getContext('2d');
        let rect = this.canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            let h = this.canvas.height = rect.height;
            let w = this.canvas.width = rect.width;

            context.clearRect(0, 0, w, h);

            let lineWidth = 12;
            let radius = (w - lineWidth) / 2;
            let x = w / 2;
            let y = h / 2;
            // draw background donut
            context.lineCap = 'butt';
            context.strokeStyle = DEFAULT_COLOR;
            context.lineWidth = lineWidth;
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.stroke();

            // draw front donut
            context.beginPath();
            context.strokeStyle = HIGHLIGHT_COLOR;
            context.beginPath();
            context.arc(x, y, radius, -0.5 * Math.PI, (2 * this.state.value / this.state.total - 0.5) * Math.PI);
            context.stroke();

            // draw text
            let text = getTimeSpan(this.state.value);
            context.font = '20px Arial';
            context.fillStyle = TEXT_COLOR;
            context.textAlign = 'center';
            context.textBaseline= 'middle';
            context.fillText(text, x, y);
        }
    }

    clearTimer () {
        if (this.timer) {
            window.clearInterval(this.timer);
        }
    }

    render() {
        let { startTime, endTime, ...others } = this.props;
        return <div { ...others }>
            <canvas style= {{position: 'relative', width:'100%', height: '100%'}} ref = { (canvas) => {
                this.canvas = canvas;
            } } />
        </div>;
    }
}