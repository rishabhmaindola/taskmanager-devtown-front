"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Page = (props) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    user:"",
    title: "",
    description: "",
    dueDate: "",
  });
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks?userId=${props.userId}`);
        if (response.status === 200) {
          setTasks(response.data);
        } else if (response.status === 400) {
          console.log("No user Found by this id");
        }
      } catch (error) {
        console.log("Error fetching tasks", error.message);
      }
    };
    fetchTasks();
  }, [props.userId, tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const addTask = async () => {
    if (newTask.title && newTask.description && newTask.dueDate) {
      try {
        // setTasks((prevTasks) => [...prevTasks, { id: Date.now(), ...newTask }]);
        await setNewTask({
          user:"",
          title: "",
          description: "",
          dueDate: "",
        });
        const response = await axios.post("http://localhost:5000/task", {
          user:props.userId,
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
        });
        if(response.status === 201){
          toast.success("Task Added Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });}
      } catch (error) {
        console.log("Error sending tasks", error.message);
      }
    } else {
      toast.warn('Please fill all the fields!', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
    }
  };

  const editTaskHandler = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);
    setEditTask(taskToEdit);
  };

  const updateTask = async () => {
    if (
      editTask &&
      editTask.title &&
      editTask.description &&
      editTask.dueDate
    ) {
      try {
        await axios.put(
          `http://localhost:5000/update/${editTask._id}`,
          editTask
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editTask._id ? { ...editTask } : task
          )
        );
        setEditTask(null);
      } catch (error) {
        console.log("Error updating task", error.message);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      await axios.delete(`http://localhost:5000/delete/${taskId}`);
      console.log("task deleted successfully", taskId);
       toast.error('Task deleted successfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    } catch (error) {
      console.error("Error deleting task", error.message);
      setTasks((prevTasks) => [...prevTasks]);
    }
  };

  const logout = () => {
    props.handleLogOut("");
  };

  return (
    <div className="bg-gray-300 h-screen w-screen">
      <div className="flex flex-col items-center w-full max-h-full">
        <div className=" flex h-full w-full items-center bg-slate-500 justify-between px-10 py-3  ">
          <h1 className="font-extrabold text-white text-3xl font-salsa">
            Task Manager
          </h1>
          <button
            onClick={logout}
            className=" bg-blue-500 hover:bg-blue-600 self-end text-white self-strecth rounded-lg px-5 py-2.5"
          >
            Log Out
          </button>
        </div>
        <div className="flex w-screen h-screen ">
          <div className="flex flex-col p-3 h-full bg-slate-400 items-center">
            <h2 className="text-white text-3xl font-bold p-4 font-salsa">
              Add Task
            </h2>
            <div className="flex flex-col h-1/2 p-4 gap-3">
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="  Title"
                className="rounded-lg text-md w-full h-1/3 px-2 shadow-lg"
              />
              <textarea
                type="text"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="  Description"
                className="rounded-lg text-md w-full h-full self-stretch p-1 shadow-lg "
              />
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="rounded-lg text-md w-full h-1/3 px-2 shadow-lg"
              />
            </div>
            <button
              className="bg-red-500 text-white rounded-md p-2.5 px-5 hover:bg-red-600"
              onClick={addTask}
            >
              Add Task
            </button>
          </div>
          <div className="flex w-full h-full items-center justify-center">
            <div className="w-full h-full ">
              <div className=" flex flex-col h-full justify-center  items-center">
                {tasks.length === 0 ? (
                  <p className="font-salsa text-3xl hover:transform hover:translate-x-5 transition-transform duration-300 text-l">
                    No tasks present
                  </p>
                ) : (
                  <div className="flex flex-col h-full w-full items-center">
                    {/* <h1 className="text-white font-bold text-3xl font-salsa">Task List</h1> */}
                    <ul className="flex flex-wrap w-full h-full p-3 gap-3 overflow-y-scroll">
                      {tasks.map((task) => (
                        <div className="flex w-1/4 h-1/2 justify-center rounded-md">
                          <li
                            className="bg-slate-600 flex w-full rounded-md p-1 shadow-xl"
                            key={task._id}
                          >
                            <div className="flex h-full w-full flex-col ">
                              <div className="flex w-full justify-center ">
                                <strong className="text-xl text-white flex font-salsa">
                                  {task.title}
                                </strong>
                              </div>
                              <span className=" h-full w-full p-2 bg-white rounded-lg text-wrap overflow-y-scroll ">
                                {task.description}
                              </span>
                              <div className="flex justify-between">
                                <p className="font-semibold text-white px-3 flex self-center ">
                                  {task.dueDate}
                                </p>
                                <div className="flex gap-2 p-1 w-1/2 items-center justify-center">
                                  <button
                                    className="bg-green-500 text-white flex-1 font-salsa rounded-md p-1 hover:bg-green-600"
                                    onClick={() => editTaskHandler(task._id)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="bg-red-500 text-white flex-1 font-salsa rounded-md p-1 hover:bg-red-600"
                                    onClick={() => deleteTask(task._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="h-full bg-slate-400">
              {editTask && (
                <div className="px-3 h-full">
                  <div className="flex flex-col py-3 h-full bg-slate-400 items-center">
                    <h2 className="text-white text-3xl font-bold p-4 font-salsa">
                      Edit Task
                    </h2>
                    <div className="flex flex-col h-1/2 p-4 gap-3">
                      <input
                        type="text"
                        name="title"
                        placeholder="  Edit your task"
                        value={editTask.title}
                        onChange={(e) =>
                          setEditTask({ ...editTask, title: e.target.value })
                        }
                        className="rounded-lg text-md w-full h-1/3 px-2 shadow-lg"
                      />
                      <textarea
                        name="description"
                        value={editTask.description}
                        placeholder="  Edit your description"
                        onChange={(e) =>
                          setEditTask({
                            ...editTask,
                            description: e.target.value,
                          })
                        }
                        className="rounded-lg text-md w-full h-full self-stretch p-1 shadow-lg "
                      />
                      <input
                        type="date"
                        name="dueDate"
                        value={editTask.dueDate}
                        onChange={(e) =>
                          setEditTask({ ...editTask, dueDate: e.target.value })
                        }
                        className="rounded-lg text-md w-full h-1/3 px-2 shadow-lg"
                      />
                    </div>
                    <button
                      className="bg-green-500 text-white rounded-md p-2.5 px-5 hover:bg-green-600"
                      onClick={updateTask}
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
    </div>
  );
};

export default Page;