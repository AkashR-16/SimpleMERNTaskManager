import './App.css';
import React, {Component} from 'react';
import axios from 'axios'
import { HotTable, HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

// CHANGE TO YOUR BACKEND URL
const backendUrl = "http://127.0.0.1:8080/api/"

// BASE URL (backend)
const api = axios.create({
  baseURL: backendUrl
})

class App extends Component{
  state = {
    tasks: [],
    selectedTask: {}
  }

  constructor(){
    super();
    this.getTasks();
  }
  
  getTasks = async () => {
    let data = await api.get('/tasks').then(({data}) => data);
    this.setState({tasks: data})
  }
  
  updateTask = async (_id, title, text) => {
    const data = {
      _id: _id,
      title: title,
      text: text
    }
      
    console.log(data)
    try {
      await api.put("/task", data)
      await this.getTasks();
      // make axios put request
    } catch(error) {
      console.log(error)
    }
  }

  setTask = async (title, text) => {
    const data = {
      title: title,
      text: text
    }
    console.log(data)
    try {
      await api.post("/task", data, { "Content-Type": "multipart/form-data" })
      await this.getTasks();
      // make axios post request
    } catch(error) {
      console.log(error)
    }
  }
  deleteTask = async (id) => {
    console.log('delete id='+id);
    try {
      await api.delete("/task/"+id);
      await this.getTasks();
    } catch(error) {
      console.log(error)
    }
  }
  handleAfterChange = function handleAfterChange(changes, source,state) {
    changes?.forEach(([row, prop, oldValue, newValue]) => {
        console.log('handleAfterChange '+ row + ' '+prop+ ' '+oldValue+' '+ newValue+ ' '+ row );
        var task = this.state.selectedTask;
        task[prop]= newValue;
        this.setState({selectedTask: task})
        //this.state.selectedTask[prop] = newValue;
        
    });
  };
  handleAfterOnCellMouseUp = function handleAfterOnCellMouseUp(event,coords,element,state) {
        console.log('handleAfterOnCellMouseUp '+ +event+ ' '+coords.row+' '+ element);
        console.log(state);
        if(coords.row>-1) {
          this.state.selectedTask._id= this.state.tasks[coords.row]._id;
          this.state.selectedTask.text= this.state.tasks[coords.row].text;
          this.state.selectedTask.title= this.state.tasks[coords.row].title;
          console.log('Selected Task= '+ this.state.selectedTask);
        }
  };
  
  handleDelete = (event,param) => {
    this.deleteTask(this.state.selectedTask._id);
  }
  handleUpdate = (event) => {
    const task = this.state.selectedTask;
    this.updateTask(task._id,task.title,task.text);
  }
  handleSubmit = (event) => {
    event.preventDefault()

    const title = event.target.elements.taskTitle.value
    const text = event.target.elements.taskText.value

    // Call setTask for saving to backend
    this.setTask(title, text)
  
  }
  getDisplayColumns() {
    return this.state.tasks.map(row => ({
      _id:row._id,
      title: row.title,
      text: row.text
    }));
  }
  fetchSongDetails = (e) => {
    ///const song = e.target.getAttribute('data');
    console.log('We need to get the details for ');
  }
  render(){
    return (
      <div className="App">
        <h1 className='headerText'>Add new task</h1>
        
        <div>
            <form className='addTaskForm' onSubmit={this.handleSubmit}>
              <label>Task title</label>
              <input type="text" id="title" name="taskTitle" placeholder="Task title..."/>

              <label>Task text</label>
              <input type="text" id="text" name="taskText" placeholder="Task text..."/>
              <input type="submit" value="Add New Task"/>
            </form>
          </div>
        
        <div className='tasks'>
          <h1 className='headerText'>Akash's tasks</h1>
            <HotTable
              data={this.getDisplayColumns()}
              height="auto"
              width="auto"
              rowHeaders={true}
              colWidths={[200, 100, 200]}
              dropdownMenu={false}
              hiddenColumns={{
                indicators: true
              }}
              contextMenu={false}
              multiColumnSorting={true}
              filters={true}
              afterChange ={ (change,source,element)  => this.handleAfterChange(change,source,this.state)} 
              afterOnCellMouseUp={ (event,coords,element)  => this.handleAfterOnCellMouseUp(event, coords,element,this.state)}             
              licenseKey="non-commercial-and-evaluation">
              <HotColumn title="Id" readOnly data={"_id"}></HotColumn>
              <HotColumn title="Title" data={"title"}></HotColumn>
              <HotColumn title="Text" data={"text"}></HotColumn>
            </HotTable>

            <button  onClick={this.handleUpdate} value="Update Focused Task"> Update Focused Task</button> 
            <button onClick={event => this.handleDelete(event, this.state)} value="Delete Focused Task"> Delete Focused Task</button>
        </div>
      </div>
    );
  }
}

export default App;
