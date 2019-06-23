import React, { Component } from 'react';
import * as d3 from 'd3-shape';

const w = 200;
const h = 200;

const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow', 'mediumturquoise', 'violet', '#4f82ca', 'dimgray'];

const PieSegment = ({arc, data, index, onHover, onLeave, theme}) => {
    const pieClass = theme.name === 'dark' ? 'pieDark' : '';
    return (
        <g fill={colors[index]} transform={`translate(${w / 2}, ${w / 2})`} onMouseMove={onHover(data)} onMouseLeave={onLeave} className={pieClass}>
            <path d={arc}></path>
        </g>
    )
}

const PieLabels = ({data, theme}) => {
    return (
        <div className="pie_labels" style={{color: theme.mainFont}}>
            {data.map((b, i) => {
                return (
                    <div key={b._id}>
                        <div className="label_color" style={{background: colors[i]}}></div>
                        {b.category}
                    </div>
                )
            })}
        </div>
    )
}

class Pie extends Component {
    constructor(props) {
        super(props);
    }

    mouseOver = data => {
        let totalSpent = this.props.totalSpent;
        return function(e) {
            let div = document.querySelector('.hover_div');
            let x = e.pageX;
            let y = e.pageY;
            div.style.display = 'inline-block';
            if (window.innerWidth > 360) {
                div.style.left = (x + 20) + 'px';
                div.style.top = (y - 70) + 'px';
            } else {
                div.style.left = (x - 50) + 'px';
                div.style.top = (y - 110) + 'px';
            }
            document.getElementById('pie_category').innerText = data.category;
            document.getElementById('pie_amount').innerText = '$' + data.total.toLocaleString();
            document.getElementById('pie_percent').innerText = (Math.round(data.total / totalSpent * 1000) / 10) + '%';
        }
    }

    mouseLeave = () => {
        let div = document.querySelector('.hover_div');
        div.style.display = 'none';
    }

    render() {
        let { totalSpent, budgets, theme } = this.props;

        let arc, arcs;
        
        if (totalSpent) {
            budgets = budgets.filter(b => b.total).sort((a, b) => b.amount - a.amount);

            if (budgets.length > 9) {
                let lastID = budgets[9]._id;
                let otherCategory = budgets.splice(10).reduce((b, acc) => {
                    acc.total+= b.amount;
                    return acc;
                }, {_id: lastID, category: 'Everything Else', total: 0});
                budgets.push(otherCategory);
            }

            arc = d3.arc()
                .innerRadius(0)
                .outerRadius(w / 2)

            arcs = d3.pie()
                .value(d => d.total)(budgets);
            
        }      

        return (
            <div className="pie_container">
                {totalSpent &&
                    <div>
                        <div className="hover_div" ref={this.hoverDiv} style={{display: 'none'}}>
                            <p><span style={{fontWeight: 'bold'}}>Category: </span><span id="pie_category"></span></p>
                            <p><span style={{fontWeight: 'bold'}}>Spent: </span><span id="pie_amount"></span></p>
                            <hr/>
                            <p><span id="pie_percent"></span> of total spending</p>
                        </div>
                        <svg width={w} height={h}>
                            {arcs.map((d, i) => {
                                let path = arc(d);
                                return <PieSegment key={d.data._id} arc={path} data={d.data} index={i} onHover={this.mouseOver} onLeave={this.mouseLeave} theme={theme} />
                            })}
                        </svg>
                        <PieLabels data={budgets} theme={theme} />
                    </div>
                }
                {!totalSpent &&
                    <svg width={w} height={h}>
                        <circle cx={w / 2} cy={w / 2} r={w / 2} fill="gray"></circle>
                    </svg>
                }
            </div>
        )
    }
}

export default Pie;