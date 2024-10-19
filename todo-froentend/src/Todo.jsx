import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);

  const [editTitle, setEditTitle] = useState("karthick");
  const [editDescription, setEditDescription] = useState("ronin");

  const API = "https://to-do-app-6-b6ct.onrender.com";

  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(API + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMessage("Item added Successsfully ");
            setTimeout(() => {
              setMessage("");
            }, 2000);
            setTitle("")
            setDescription("")
          } else {
            setError("Todo fetch failed ...");
          }
        })
        .catch(() => setError("Todo fetch failed ..."));
    }
  };

  const getItem = () => {
    fetch(API + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  const handleEdit = (items) => {
    setEditId(items._id);
    setEditDescription(items.description);
    setEditTitle(items.title);
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(API + "/todos/" + editId, {
        method: "PUt",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setMessage("Item updated Successsfully ");
            setTimeout(() => {
              setMessage("");
            }, 2000);
            setEditId(-1)
          } else {
            setError("Todo fetch failed ...");
          }
        })
        .catch(() => setError("Todo fetch failed ..."));
    }
  };

  const handleDelete = (id)=>{
        fetch(API+"/todos/"+id,{
          method:"DELETE"
        })
        .then(()=>{
          const updatedTodos = todos.filter((items)=>items._id !== id)
          setTodos(updatedTodos)
          setMessage("Item Deleted Successsfully ");
            setTimeout(() => {
              setMessage("");
            }, 2000);
        })
      
  }

  useEffect(() => {
    getItem();
  }, []);
  return (
    <>
      <div>
        <h1 className="text-3xl justify-center flex py-3 bg-green-600  text-white font-semibold">
          ToDo Project with MERN Stack
        </h1>
      </div>
      <div>
        <h3 className="flex font-bold mt-10 py-5 justify-center text-2xl">Add Item</h3>
       
      <div className="flex justify-center w-full">
          <input
            className="border border-stone-400 ms-5 w-full px-2 outline-none"
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
            placeholder="Title"
          />
          <input
            className="border outline-none w-full border-stone-400 px-2 mx-3"
            type="text"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            placeholder="Description"
          />
          <button
            onClick={handleSubmit}
            className="bg-stone-900 text-white px-4 py-2 mx-2 rounded-3xl"
          >
            Submit
          </button>
        </div>
        
      </div>
      <div>
        <h3 className="flex justify-center font-bold pt-5 text-2xl">Tasks</h3>
         {message && <p className="flex justify-center py-2 text-green-600">Message : {message}</p>}
        {error && <p className="flex justify-center py-2 text-red-600">Message : {error}</p>}
        <ul className="flex flex-col gap-2">
          {todos.map((items) => (
            <li key={items._id} className="flex hover:bg-slate-400 bg-slate-300 justify-between px-2 py-3 mx-2 border border-stone-400">
              <div className="flex w-1/2 flex-col">
                {editId == -1 || editId !== items._id ? (
                  <>
                    <span className="font-bold">{items.title}</span>
                    <span>{items.description}</span>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <input
                      className="border py-2 w-full border-stone-400 ps-2 outline-none"
                      type="text"
                      onChange={(e) => {
                        setEditTitle(e.target.value);
                      }}
                      value={editTitle}
                      placeholder="Title"
                    />
                    <input
                      className="border py-2 w-full outline-none border-stone-400 ps-2 mx-3"
                      type="text"
                      onChange={(e) => {
                        setEditDescription(e.target.value);
                      }}
                      value={editDescription}
                      placeholder="Description"
                    />
                  </div>
                )}
              </div>
              {editId == -1 || editId !== items._id ? (
                <div className="flex items-center">
                  <button
                    className="bg-green-700 text-white px-4 py-2 mx-2 "
                    onClick={() => {
                      handleEdit(items);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={()=>{handleDelete(items._id)}} className="bg-red-700 text-white px-4 py-2 mx-2">
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-700 text-white px-4 py-2 "
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-700 text-white px-4 py-2"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
