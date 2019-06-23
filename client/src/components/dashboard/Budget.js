import React from 'react';

const Budget = ({_id, category, budget, total, toggleEdit, theme}) => {
    let barColor = total >= budget ? 'red' : theme.name === 'dark' ? '#0fc5d2' : '#15c315';
    let totalPercent = Math.round(total / budget * 1000) / 10;
    let barWidth = total >= budget ? 100 : totalPercent;
    let descColor = barWidth === 100 ? 'red' : barWidth > 0 ? theme.mainFont : theme.name === 'dark' ? '#0a790a' : 'green'; 
    let iconColor = barWidth === 100 ? 'black' : theme.name === 'purple' ? '#0a0a0a' : theme.name === 'dark' ? '#3b7bce' : 'black';
    let background = theme.name === 'dark' && barWidth === 100 ? 'rgb(97, 41, 41)' : theme.name === 'dark' && barWidth === 0 ? 'rgb(162, 162, 162)' : theme.budgetBackground;

    return (
        <div className="budget_component" style={{background}}>
            <div style={{background: total >= budget ? '#F44336' : theme.main, color: theme.headerFont}} className="budget_label" tabIndex="0">
                {category}
                {/* <i className="fas fa-edit b_edit_icon" onClick={() => toggleEdit({_id, category, budget})} style={{color: iconColor}}></i> */}
                <button onClick={() => toggleEdit({_id, category, budget})} aria-label="edit budget">
                    <i className="fas fa-edit b_edit_icon"  style={{color: iconColor}}></i>
                </button>
            </div>
            <div className="bar_container">
                <div className="dollar_amount">$0</div>
                <div className="bar">
                    <div className="bar_ind" style={{width: barWidth + '%', background: barColor}}></div>
                </div>
                <div className="dollar_amount">{`$${budget.toLocaleString()}`}</div>
            </div>
            <div className="description" style={{color: descColor, textAlign: 'center'}}>{`$${total.toLocaleString()} out of $${budget.toLocaleString()} (${totalPercent}%)`}</div>
        </div>
    )
}

export default Budget;