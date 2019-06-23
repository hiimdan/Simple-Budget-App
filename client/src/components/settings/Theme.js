import React, { Component } from 'react';

const ThemeBox = ({name, selected, upper, lower, setTheme}) => {
    const selectBorder = name === selected ? '1px solid #48c8da' : '1px solid #0000008c';
    const selectShadow = name === selected ? '1px 1px 1px rgba(0, 0, 0, 0.1)' : 'none';
    const themeSelect = name === selected ? 'theme_select box_outline' : 'box_outline';
    const sliceStyle = {
        borderLeft: `30px solid ${upper}`,
        borderBottom: `30px solid ${lower}`
    }

    return (
        <div className={themeSelect} onClick={() => setTheme(name)}>
            <div className="color_slice" style={sliceStyle}></div>
        </div>
    )
}

class Theme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            error: false
        }
    }

    themeSaved = err => {
        if (err) {
            this.setState({error: true, success: false});
        } else {
            this.setState({success: true, error: false});
        }
    }

    render() {
        const { theme, setTheme, saveTheme } = this.props;

        return (
            <div className="theme_container settings_section">
                <h3 className="settings_heading">Choose Your Theme</h3>
                <div className="settings_content">
                    <div>
                        <div className="theme_choices">
                            <ThemeBox name="default" selected={theme.name} upper="#43bdff" lower="white" setTheme={setTheme} />
                            <ThemeBox name="green" selected={theme.name} upper="#4CAF50" lower="white" setTheme={setTheme} />
                            <ThemeBox name="purple" selected={theme.name} upper="#3F51B5" lower="white" setTheme={setTheme}/>
                            <ThemeBox name="dark" selected={theme.name} upper="#29282b" lower="#3f3f40" setTheme={setTheme} />
                        </div>
                        <div className="save_settings">
                            <button onClick={() => saveTheme(this.themeSaved)}>Save</button>
                            
                        </div>  
                    </div>
                    <div className="message_handling">
                        {this.state.success &&
                            <div className="success" style={{fontSize: '13px'}} role="alert">Your changes have been saved</div>
                        }
                        {this.state.error &&
                            <div className="popup_error" style={{fontSize: '13px'}} role="alert">An unknown error occurred</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Theme;