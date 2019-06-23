import React, { Component } from 'react';
import HistoryItem from './HistoryItem';


class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: props.label === 'Current Month' ? true : false,
            height: 'auto'
        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.data.length !== this.props.data.length) {
            this.setState({height: 'auto'});
        }
    }

    expand = e => {
        let height = e.currentTarget.nextElementSibling.scrollHeight;
        this.setState({
            expanded: !this.state.expanded,
            height
        })
    }

    render() {

        const { label, data, editData, deleteData, theme } = this.props;
        let expandIcon = {transform: this.state.expanded ? 'rotate(0)' : 'rotate(-180deg)'};
        let height = this.state.expanded ? this.state.height : 0;

        return (
            <div className="historyGroup">
                <div className="historyDisplay" onClick={this.expand} style={{background: theme.transactionsHeader, color: theme.headerFont}}>
                    {label}
                    <div className="expandIcon" style={expandIcon}><i class="fas fa-angle-down"></i></div>
                </div>
                <div className="list_transactions" style={{height, background: theme.listTransactions, color: theme.mainFont}}>
                    {data.length > 0 &&
                        data.map(tx => {
                            return <HistoryItem key={tx._id} {...tx} editData={editData} deleteData={deleteData} theme={theme} />
                        })
                    }
                    {!data.length && <div style={{borderBottom: '1px solid black', textAlign: 'center', paddingBottom: '3px'}}>Nothing to display here!</div>}
                </div>
            </div>
        )
    }
}

export default History;