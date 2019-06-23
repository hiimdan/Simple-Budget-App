import React from 'react';
// const DeleteTransactiion = ({toggle, submitDelete}) =>
class DeleteTransactiion extends React.Component {
    constructor(props) {
        super(props);
        this.focused = React.createRef();
    }

    componentDidMount() {
        this.focused.current.focus();
    }

    render() {
        const { toggle, submitDelete } = this.props;
        return (
            <div className="modal_div light_modal" onClick={toggle}>
                <div className="close_box" role="dialog" aria-labeledby="deleteDescription">
                    <span id="deleteDescription">Are you sure you want to delete this transaction?</span>
                    <div>
                        <button className="cancelDelete" onClick={toggle} ref={this.focused}>Cancel</button>
                        <button className="delete_button" onClick={submitDelete}>Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteTransactiion;