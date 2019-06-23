import React from 'react';

const HistoryItem = ({_id, date, category, amount, editData, deleteData, theme}) => {
    let dateString = date.substring(5, 7) + '/' + date.substring(8, 10) + '/' + date.substring(0, 4);
    

    return (
        <div className="history_item" tabIndex="0">
            <div className="tDescription">
                <div className="tDate">{dateString}</div>
                <div className="tAmount">{'$' + amount.toLocaleString()}</div>
                <div className="tCategory">{category}</div>
            </div>
            <div className="tEdit">
                <div>
                    <button onClick={() => editData({_id, date: date.substring(0, 10), category, amount})} aria-label="edit transaction"><i class="fas fa-edit"></i></button>
                </div>
                <div>
                    <button onClick={() => deleteData({_id, date})} aria-label="delete transaction"><i class="fa fa-window-close" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    )
}

export default HistoryItem;