/* eslint-disable */

import * as React from 'react';
import * as Showdown from 'showdown';
import ReactMde, { ReactMdeCommands } from 'react-mde';


import 'react-mde/lib/styles/css/react-mde-all.css';


class Editor extends React.Component<{}, EditorState> {
  converter: Showdown.Converter;

constructor(props) {
    super(props);
    
    this.state = {
        reactMdeValue: {
            text: '', 
            selection: null},
        HTML: ""
    };

    this.converter = new Showdown.Converter();
}


handleValueChange(value) {
   

    let newHTML = this.converter.makeHtml(value.text) || '<p>&nbsp</p>';

    this.setState({
        reactMdeValue: value,
        HTML: newHTML
    });


}


render() {


    return (
        <div className="container">
            <ReactMde
                textAreaProps={{                  
                    id: 'ta1',
                    name: 'ta1',
                }}
                value={this.state.reactMdeValue}
                onChange={this.handleValueChange}
                commands={ReactMdeCommands}
            />
        </div>
    );
}}

export default Editor;