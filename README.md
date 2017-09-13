# SeniorProject
Documentation for SeniorProject.

## Getting Setup with the API
1. Install PyCharm and Python 2.7
  * Tip: If you want to see where something is defined in PyCharm, press `Control+B`. E.g. you see `field_map`. Where is that defined? Put your cursor on it, press `Control+B`, and you will jump to it. There are a slew of other useful commands.
2. Clone this repo using `git`
3. Install Pip, this can be done on Linux by typing: `easy_install pip`. Pip is a
package manager for Python dependencies. You might have to research how to install it for your OS, it is very simple. Linux/OS X recommended.
4. `cd` into `SeniorProject/api` and run `pip install -r requirements.txt`. This installs all the dependencies. *(If you know how to use a virtualenv, you should activate it before this step.)*
5. The main entrypoint is `app.py`. Running this file will start the server. In PyCharm, run `app.py`, you should get some output that the server is running. Remember that database connections are being made from your computer, over the network, to the Postgres DB on the server...so DB queries suffer from high latency. Latency is much more tolerable if the DB and server are on the same computer.
6. Load `http://127.0.0.1:5000/users/1` in your browser. You should see some JSON output. Note this is a `GET` (Read) operation.


### API Architecture ###
The API follows the standard Flask architecture. We have an `api` folder with several subfolders:
* `common`: Any common functionality. Right now it hosts a function to validate emails.
* `database`: Anything related to the database. The most important is `model.py`. This holds the Python representations of our database which is used by the ORM, SQLAlchemy. Each class represents a table in the DB, and each class variable represents a field in the DB. **If the DB has schema changes, the models must be updated**.
* `resources`: This is where we have the code for the actual endpoints. Right now you see:
  * `base_resource.py`: This is a class that all other resources *must* inherit from. It contains some helper features from converting a SQLAlchemy object to a JSON response from the API.
  * `user_resource.py`: A sample resource. You will notice we define the methods `get`, `put`, and `post`. These are automatically called by Flask when a request comes over the network. One thing to note here is the `response_to_sql_map`. This is a dictionary matching JSON output to SQL field names. For example, we store a user's first name in the DB as `user_fname`, but, in the API, we want the field to be called `first_name`. **All resources must have this map!**

### What is parser / reqparse? ###
This is a neat library. We define what parameters we want from the API, their types, and whether the are required or not. We can do more validation like min/max, choosing from a list, etc. We can do custom validation by defining something like `type=email`. If the user forgets a required parameter, or, passes a parameter in not defined, Flask will automatically throw a useful error message. It handles much of the "grunt work" of user input validation. **Look at `user_resource.py` for an example.**

#### Why use an ORM? ####
Most of our operations are CRUD operations. If we hand-write every query for this (and I've done this before), we will hate our lives. An ORM maps SQL rows to Python objects. For example, I can do this:
```python
user = User.query.get(user_id=1)  # find user by ID
user.first_name = 'Ryan'  # change the first_name
user.email = 'ryan@perka.com'
db.session.commit() # write to the DB (run UPDATE Users SET ...)
```
This generates the UPDATE statement, without me having to write any SQL! If we did this by hand, we'd have to manually construct the query, probably by string concatenation (eww!)

### Testing the API ###
You can easily test `GET` operations by viewing them in your browser. Testing `PUT` (Update) and `POST` (Create) is more difficult. I like to use Python itself (you could try a REST API Client).
To test in Python, use the `requests` library. E.g.
```python
import requests
requests.get('http://127.0.0.1:5000/users/1').json() # test GET
requests.put('http://127.0.0.1:5000/users/1', data={'first_name':'Filius', 'email':'filius@hogwarts.com'}) # test PUT
# what happens if we PUT a parameter that isn't recognized by the API?
requests.put('http://127.0.0.1:5000/users/1', data={'first_name':'Filius', 'email':'filius@hogwarts.com', 'fake_name':'ddd'}) # test PUT, error!
# You can use requests.post(url, data) Remember POST has no /user_id, it is just http://XXX/users.
# Because POST is creating, you must supply all fields.
```
