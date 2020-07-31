import React, { Component } from "react";
import "./App.css";
import { Task } from "./Task.js";
import { Tasklist } from "./Tasklist";
import Axios from "axios";
import { Segment, Icon, Grid, Dimmer, Flag } from "semantic-ui-react";

class App extends Component {
  state = {
    list: [],
    visi: false,
    currentList: { id: "", name: "" },
    tasks: [],
    dim: false,
    tasklist: [],
  };

  //getting tasklist on load
  componentDidMount() {
    const getRequestUrl = "http://todolist-2000.herokuapp.com/TaskLists";
    Axios.get(getRequestUrl)
      .then((res) => {
        this.setState({ list: res.data.TaskLists });
      })
      .catch((err) => {
        alert(err);
      });
  }

  getTaskList = () => {
    var lst = [],
      i = 0;
    for (i; i <= this.state.list.length - 1; i++) {
      var obj = { value: this.state.list[i].id, text: this.state.list[i].name };
      lst.push(obj);
    }
    return lst;
  };
  //funtion for animation
  change = (a) => {
    this.setState({ visi: a, dim: a });
    this.setState({ tasklist: this.getTaskList() });
  };

  stops = () => {
    this.setState({ load: false });
  };

  //function for data opr
  getTask = (list, a) => {
    this.setState({ currentList: list, load: true });
    setTimeout(() => this.stops(), 300);
    const getTaskURL =
      "http://todolist-2000.herokuapp.com/Tasks?task_list=" + list.id;
    Axios.get(getTaskURL)
      .then((res) => {
        this.setState({
          tasks: res.data.Task.sort(function (a, b) {
            return b.id - a.id;
          }),
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  updateText = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.value);
  };

  createEntity = (type, list) => {
    const PostListURL = "http://todolist-2000.herokuapp.com/TaskLists";
    const PostTaskURL = "http://todolist-2000.herokuapp.com/Tasks";
    if (type === "list") {
      if (
        this.state.NewTaskList !== "" &&
        this.state.NewTaskList !== undefined
      ) {
        console.log("valuepassed");
        Axios.post(PostListURL, { name: this.state.NewTaskList })
          .then((res) => {
            Axios.get(PostListURL)
              .then((res) => {
                this.setState({ list: res.data.TaskLists });
                this.setState({ tasklist: this.getTaskList() });
              })
              .catch((err) => {
                alert(err);
              });
          })
          .catch((err) => alert(err));
      } else {
        console.log("valuemissing");
        alert("Name of Tasklist Shouldn't be blank");
      }
    } else if (type === "task") {
      if (this.state.NewTask !== "" && this.state.NewTask !== undefined) {
        console.log("valuepassed");
        Axios.post(PostTaskURL, {
          text: this.state.NewTask,
          list_id: list.id,
        })
          .then((res) => {
            this.getTask(list, true);
          })
          .catch((err) => alert(err));
      } else {
        console.log("valuemissing");
        alert("Task Shouldn't be blank");
      }
    }
  };

  updateTask = (list, id) => {
    const PutTaskURL = "http://todolist-2000.herokuapp.com/Tasks?tasks=" + id;
    Axios.put(PutTaskURL)
      .then((res) => {
        this.getTask(list, false);
      })
      .catch((err) => alert(err));
  };

  editText = (list, id, text) => {
    var edit = window.prompt("Enter Task", text);
    if (edit !== text && edit !== null) {
      const PutTaskURL = "http://todolist-2000.herokuapp.com/Tasks?tasks=" + id;
      Axios.put(PutTaskURL, { text: edit })
        .then((res) => {
          this.getTask(list, false);
        })
        .catch((err) => alert(err));
    }
  };

  //delete Task
  deleteTask = (list, id) => {
    var del = window.confirm("Delete the Task");
    if (del === true) {
      const DelTaskURL = "http://todolist-2000.herokuapp.com/Tasks/" + id;
      Axios.delete(DelTaskURL)
        .then((res) => {
          this.getTask(list, false);
        })
        .catch((err) => alert(err));
    }
  };

  //delete Tasklist
  deleteTaskList = (list) => {
    const DelTaskListURL =
      "http://todolist-2000.herokuapp.com/TaskLists/" + this.state.DelTaskList;
    Axios.delete(DelTaskListURL)
      .then((res) => {
        const getRequestUrl = "http://todolist-2000.herokuapp.com/TaskLists";
        Axios.get(getRequestUrl)
          .then((res) => {
            this.setState({ list: res.data.TaskLists });
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => alert(err));
  };

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div className="Nav">
          <p>
            <button className="btn" onClick={() => this.change(true)}>
              <Icon name="list" fitted size="small" />
            </button>
            ToDo List
          </p>
        </div>
        <Tasklist
          list={this.state.list}
          visi={this.state.visi}
          onchange={this.change}
          currentList={this.state.currentList}
          getTask={this.getTask}
          updateText={this.updateText}
          createEntity={this.createEntity}
          selectlist={this.state.tasklist}
          deleteTaskList={this.deleteTaskList}
        />
        <Segment
          basic
          onClick={() => this.change(false)}
          style={{ height: "86%" }}
        >
          <Dimmer
            active={this.state.dim}
            onClick={() => {
              this.change(false);
              this.setState({ dim: false });
            }}
            inverted
            style={{ zIndex: "1", marginTop: "-10px" }}
          />
          <Task
            currentList={this.state.currentList}
            tasks={this.state.tasks}
            load={this.state.load}
            updateText={this.updateText}
            createEntity={this.createEntity}
            updateTask={this.updateTask}
            deleteTask={this.deleteTask}
            editText={this.editText}
          />
        </Segment>
        <footer>
          <Grid verticalAlign="middle" stackable>
            <Grid.Row>
              <Grid.Column className="AppName" width={5}>
                ToDo List
              </Grid.Column>
              <Grid.Column width={5}>
                <center>
                  Made with <span style={{ fontSize: "30px" }}>&hearts;</span>{" "}
                  in INDIA <Flag name="india" />
                </center>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </footer>
      </div>
    );
  }
}

export default App;
