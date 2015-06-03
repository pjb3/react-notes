var NoteEditor = React.createClass({
  getInitialState: function() {
    return {
      content: this.props.note.content
    }
  },

  handleChange: function(event) {
    this.setState({ content: event.target.value });
  },

  render: function() {
    return (
      <div className="panel panel-default col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div className="panel-body edit-note">
          <textarea className="form-control" rows="5" value={this.state.content} onChange={this.handleChange} />
          <br />
          <button
            className="btn btn-success"
            onClick={this.props.onSave.bind(null, this.props.note.id, this.state.content)}>Save</button>
          {' '}
          <button className="btn btn-danger" onClick={this.props.onRemove.bind(null, this.props.note.id)}>Remove</button>
        </div>
      </div>
    );
  }
});

var NoteViewer = React.createClass({

  render: function() {
    var rawMarkup = marked(this.props.note.content.toString(), {sanitize: true});
    return (
      <div className="panel panel-default col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div
          className="panel-body show-note"
          onClick={this.props.onEdit.bind(null, this.props.note.id)}
          dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var NoteList = React.createClass({
  getInitialState: function() {
    return {
      editingNoteId: null
    };
  },

  addNote: function() {
    var id = (notes[notes.length-1] || { id: 0 }).id + 1;
    notes.push({
      id: id,
      content: ''
    });
    localStorage.notes = JSON.stringify(notes);
    this.setState({ editingNoteId: id });
  },

  editNote: function(id) {
    this.setState({ editingNoteId: id });
  },

  saveNote: function(id, content) {
    var note = notes.filter(function(note) {
      return note.id == id;
    })[0];
    note.content = content;
    localStorage.notes = JSON.stringify(notes);
    this.setState({ editingNoteId: null });
  },

  removeNote: function(id) {
    notes = notes.filter(function(note){
      return note.id != id;
    });
    localStorage.notes = JSON.stringify(notes);
    this.setState({ editingNoteId: null });
  },

  render: function() {
    var noteList = notes.map(function(note) {
      if(this.state.editingNoteId == note.id) {
        return <NoteEditor
          note={note}
          key={note.id}
          onSave={this.saveNote}
          onRemove={this.removeNote} />
      } else {
        return <NoteViewer
          note={note}
          key={note.id}
          onEdit={this.editNote} />
      }
    }.bind(this));

    return (
      <div className="row notes">
        {noteList}
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
          <button className="btn btn-primary" onClick={this.addNote}>Add Note</button>
        </div>
      </div>
    );
  }
});

var notes = JSON.parse(localStorage.notes || '[]');

React.render(
  <NoteList notes={notes} />,
  document.getElementById('notes')
);
