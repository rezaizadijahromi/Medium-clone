import React from "react";
import {
  // Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import createHighlightPlugin from "./plugins/highlightPlugin";
import "../App.css";

const highlightPlugin = createHighlightPlugin();

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.plugins = [highlightPlugin];
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command,
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"),
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"),
    );
  };

  onStrikeThroughClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "STRIKETHROUGH"),
    );
  };

  onHighlight = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "HIGHLIGHT"),
    );
  };

  // onLinkClick = () => {
  // 	this.onChange(RichUtils.toggleLink(this.state.editorState));
  // };

  render() {
    return (
      <div className="editorContainer">
        <button className="underline" onClick={this.onUnderlineClick}>
          U
        </button>
        <button className="bold" onClick={this.onBoldClick}>
          <b>B</b>
        </button>
        <button className="italic" onClick={this.onItalicClick}>
          <em>I</em>
        </button>
        <button className="strikethrough" onClick={this.onStrikeThroughClick}>
          abc
        </button>
        <button className="highlight" onClick={this.onHighlight}>
          <span style={{ background: "yellow", padding: "0.3em" }}>H</span>
        </button>
        <div className="editors">
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            plugins={this.plugins}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default PageContainer;
