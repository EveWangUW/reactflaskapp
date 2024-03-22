from flask import Flask, jsonify, request  # Importing Flask framework and related modules
from flask_cors import CORS  # Importing CORS extension for handling cross-origin requests

app = Flask(__name__)  # Creating a Flask application instance
CORS(app)  # Enabling CORS for the Flask app

tasks = []  # Initializing an empty list to store tasks

@app.route('/tasks', methods=['GET'])  # Defining a route to handle GET requests for tasks
def get_tasks():
    return jsonify({'tasks': tasks})  # Returning tasks in JSON format

@app.route('/tasks', methods=['POST'])  # Defining a route to handle POST requests for adding tasks
def add_task():
    data = request.json  # Extracting JSON data from the request body
    task = {'id': len(tasks) + 1, 'title': data['title'], 'completed': False}  # Creating a new task object
    tasks.append(task)  # Adding the new task to the tasks list
    return jsonify({'task': task}), 201  # Returning the newly added task in JSON format with status code 201 (created)

@app.route('/tasks/<int:task_id>', methods=['PUT'])  # Defining a route to handle PUT requests for updating tasks
def update_task(task_id):
    task = next((task for task in tasks if task['id'] == task_id), None)  # Finding the task to update by its ID
    if task is None:
        return jsonify({'error': 'Task not found'}), 404  # Returning an error response if task not found
    data = request.json  # Extracting JSON data from the request body
    task['title'] = data.get('title', task['title'])  # Updating task title if provided in the request
    task['completed'] = data.get('completed', task['completed'])  # Updating task completion status if provided
    return jsonify({'task': task})  # Returning the updated task in JSON format

@app.route('/tasks/<int:task_id>', methods=['DELETE'])  # Defining a route to handle DELETE requests for deleting tasks
def delete_task(task_id):
    global tasks  # Accessing the tasks list defined outside the function scope
    tasks = [task for task in tasks if task['id'] != task_id]  # Removing the task with the given ID
    return jsonify({'message': 'Task deleted'})  # Returning a success message in JSON format

if __name__ == '__main__':
    app.run(debug=True)  # Running the Flask app in debug mode if executed directly
