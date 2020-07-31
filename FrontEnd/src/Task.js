import React from "react";
import "./App.css";
import {
  Container,
  Modal,
  Button,
  Input,
  Icon,
  Message,
  Loader,
  Dimmer,
  Segment,
} from "semantic-ui-react";
export const Task = (props) => {
  const [open, Setopen] = React.useState(false);
  const close = () => {
    Setopen(false);
  };
  return (
    <div className="Task">
      <Container>
        {props.currentList.name === "" && (
          <div>
            <Message info>
              <Message.Header>You haven't selected any list</Message.Header>
              <p>
                please select it by clicking "{" "}
                <Icon name="list" fitted size="small" /> " icon
              </p>
            </Message>
          </div>
        )}
        {props.currentList.name !== "" && (
          <div>
            <h1 style={{ marginTop: "10px" }}>
              Task Under {props.currentList.name}
            </h1>
            <hr style={{ border: "3px solid black", borderRadius: "100%" }} />
            <br />
            <Segment basic>
              <Dimmer active={props.load} style={{ zIndex: "1" }} inverted>
                <Loader inline="centered">Loading</Loader>
              </Dimmer>
              {props.tasks.map(function (list, index) {
                return (
                  <div>
                    <div className="clearfix">
                      <label className="round">
                        {list.text}
                        <input
                          type="checkbox"
                          checked={list.completed}
                          onClick={() =>
                            props.updateTask(props.currentList, list.id)
                          }
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="right">
                        <Button
                          primary
                          size="mini"
                          style={{ marginRight: "10px" }}
                          onClick={() =>
                            props.editText(
                              props.currentList,
                              list.id,
                              list.text
                            )
                          }
                        >
                          <Icon name="edit" fitted size="large" />
                        </Button>
                        <Button
                          negative
                          size="mini"
                          onClick={() =>
                            props.deleteTask(props.currentList, list.id)
                          }
                        >
                          <Icon name="trash" fitted size="large" />
                        </Button>
                      </span>
                    </div>
                    <hr style={{ marginBottom: "20px" }} />
                  </div>
                );
              })}
            </Segment>
            <Modal
              open={open}
              trigger={
                <Button color="red" onClick={(e) => Setopen(true)} size="large">
                  Add a Task
                </Button>
              }
              size="tiny"
              onClose={close}
            >
              <Modal.Header>Add A Task</Modal.Header>
              <Modal.Content>
                <Input
                  fluid
                  name="NewTask"
                  onChange={(evt) => props.updateText(evt)}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button
                  positive
                  onClick={() => {
                    close();
                    props.createEntity("task", props.currentList);
                  }}
                >
                  Add
                </Button>
                <Button negative onClick={close}>
                  Cancel
                </Button>
              </Modal.Actions>
            </Modal>
          </div>
        )}
      </Container>
    </div>
  );
};
