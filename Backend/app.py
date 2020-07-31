# Required Libraries
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Default Parts
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']

db = SQLAlchemy(app)
CORS(app)

# Creating Table Models
class Tasks(db.Model):
    __tablename__ = 'Tasks'
    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer)
    text = db.Column(db.String(255))
    completed = db.Column(db.Boolean)

    def __init__(self, list_id, text):
        self.list_id = list_id
        self.text = text
        self.completed = False


class TaskList(db.Model):
    __tablename__ = 'TaskList'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

    def __init__(self, name):
        self.name = name

# posting Data to Tasklist Or Creating A task list
@app.route("/")
def Hello():
    return 'hello world'

@app.route("/TaskLists", methods=['POST'])
def CreateList():
    data = request.get_json()
    name = data['name']
    ts = TaskList(name)
    db.session.add(ts)
    db.session.commit()
    return jsonify(message="Tasklist Created Successfully"), 201

# Getting TaskLists


@app.route("/TaskLists")
def GetList():
    task_list = TaskList.query.all()
    task_lists_list = []
    for tasklist in task_list:
        t = {}
        t["id"] = tasklist.id
        t["name"] = tasklist.name
        task_lists_list.append(t)
    return jsonify(TaskLists=task_lists_list)

# Creating A task


@app.route("/Tasks", methods=['POST'])
def Create_Task():
    data = request.get_json()
    list_id = data['list_id']
    text = data['text']
    ts = Tasks(list_id, text)
    db.session.add(ts)
    db.session.commit()
    return jsonify(message="Task is Created"), 201

# Getting The Task By ListID


@app.route("/Tasks")
def GetTask():
    listid = request.args.get('task_list')
    tasks = Tasks.query.filter_by(list_id=listid)
    tasks_list = []
    for task in tasks:
        t = {}
        t['id'] = task.id
        t['list_id'] = task.list_id
        t['text'] = task.text
        t['completed'] = task.completed
        tasks_list.append(t)
    return jsonify(Task=tasks_list)

# Changing The Data Of a Particular Task


@app.route("/Tasks", methods=['PUT'])
def Change_Task():
    data = request.get_json()
    id = request.args.get("tasks")
    tasks = Tasks.query.filter_by(id=id).first()
    if data is None:
        tasks.completed = not (tasks.completed)
    else:
        tasks.text = data["text"]
    db.session.add(tasks)
    db.session.commit()
    return jsonify(message="Task Updated", task_id=id, task_completed=tasks.completed, task_text=tasks.text), 201

# Delete The Task


@app.route("/Tasks/<id>", methods=['DELETE'])
def Delete_Task(id):
    tasks = Tasks.query.filter_by(id=id).first()
    db.session.delete(tasks)
    db.session.commit()
    return jsonify(message="Task Deleted")
# delete TaskList


@app.route("/TaskLists/<id>", methods=['DELETE'])
def Delete_TaskList(id):
    db.session.query(Tasks).filter(
        Tasks.list_id == id).delete(synchronize_session='fetch')
    tasklist = TaskList.query.filter_by(id=id).first()
    db.session.delete(tasklist)
    db.session.commit()
    return jsonify(message="Tasklist Deleted"), 201


# Running The Task
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
