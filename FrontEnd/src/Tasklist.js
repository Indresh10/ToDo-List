import React from "react";
import {
  Menu,
  Icon,
  Sidebar,
  Button,
  Modal,
  Input,
  Divider,
} from "semantic-ui-react";

export const Tasklist = (props) => {
  const [open, Setopen] = React.useState(false);
  const [open1, Setopen1] = React.useState(false);
  const close = () => {
    Setopen(false);
    Setopen1(false);
  };
  const lst = [];
  return (
    <div>
      <Sidebar
        animation="push"
        as={Menu}
        inverted
        vertical
        visible={props.visi}
        width="thin"
        color="red"
      >
        <Menu.Item header>
          <h3 style={{ display: "inline" }}>TaskLists{"  "}</h3>
          <Icon
            as="i"
            style={{ textAlign: "right" }}
            name="delete"
            fitted
            size="large"
            onClick={() => props.onchange(false)}
          />
        </Menu.Item>
        <Divider horizontal />
        {props.list.map(function (list, index) {
          return (
            <div>
              <Menu.Item
                as="a"
                onClick={() => {
                  props.getTask(list, true);
                  props.onchange(false);
                }}
                active={props.currentList.name === list.name}
              >
                <Icon name="list" />
                {list.name}
              </Menu.Item>
            </div>
          );
        })}
        <Divider horizontal />

        <Modal
          open={open}
          trigger={
            <center>
              <Button onClick={(e) => Setopen(true)} positive>
                Add a Tasklist
              </Button>
            </center>
          }
          size="tiny"
          onClose={close}
        >
          <Modal.Header>Add A TaskList</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              name="NewTaskList"
              onChange={(evt) => props.updateText(evt)}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              onClick={() => {
                close();
                props.createEntity("list", props.currentList);
              }}
            >
              Add
            </Button>
            <Button negative onClick={close}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
        <Divider horizontal />
        <Modal
          open={open1}
          trigger={
            <center>
              <Button onClick={(e) => Setopen1(true)} size="small">
                Delete a Tasklist
              </Button>
            </center>
          }
          size="tiny"
          onClose={close}
        >
          <Modal.Header>Add A TaskList1</Modal.Header>
          <Modal.Content>
            <select name="DelTaskList" onChange={(ev) => props.updateText(ev)}>
              <option hidden></option>
              {props.selectlist.map(function (list, index) {
                return <option value={list.value}>{list.text}</option>;
              })}
            </select>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              onClick={() => {
                close();
                props.deleteTaskList(props.currentList);
              }}
            >
              Delete
            </Button>
            <Button negative onClick={close}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    </div>
  );
};
