import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LabourersWages = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    totalAmount: "",
    payAmount: "",
    type: "",
  });

  // ✅ Fetch Data from API
  const fetchData = async () => {
    
    try {
      const response = await axios.get("http://localhost:3002/api/getcons");
      if (Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Show Toast Messages
  const showToast = (message, type) => {
    toast(message, { type, position: "top-center", autoClose: 2000 });
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setIsEditMode(false);
    setNewItem({
      name: "",
      totalAmount: "",
      payAmount: "",
      // remainingAmount: "",
      type: "",
    });
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      totalAmount: item.totalAmount,
      payAmount: item.payAmount,
      // remainingAmount: item.remainingAmount,
      type: item.type,
    });
    setShowModal(true);
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // ✅ Add New Item (POST)
  const handleAddItem = async () => {
    if (
      !newItem.name ||
      !newItem.totalAmount ||
      !newItem.payAmount ||
      // !newItem.remainingAmount ||
      !newItem.type
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/api/cons",
        newItem
      );
      console.log("Response" , response.data.Data);
      
      if (response.data && response.data.Data) {
        console.log("hiiiii");
        
        setData((prev) => [...prev, response.data.Data]);
        showToast("Item added successfully!", "success");
        fetchData(); // ✅ Refresh data immediately
        handleCloseModal();
      }
    } catch (error) {
      showToast("Error adding item", "error");
      console.error(error.message);
    }
  };

  // ✅ Update Existing Item (PUT)
  const handleEditItem = async () => {
    if (
      !newItem.name ||
      !newItem.totalAmount ||
      !newItem.payAmount ||
      // !newItem.remainingAmount ||
      !newItem.type
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3002/api/updatecons/${selectedItem._id}`,
        newItem
      );
      setData((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? { ...item, ...newItem } : item
        )
      );
      showToast("Item updated successfully!", "success");
      fetchData(); // ✅ Refresh data immediately
      handleCloseModal();
    } catch (error) {
      showToast("Error updating item", "error");
      console.error(error.message);
    }
  };

  // ✅ Delete Item (DELETE)
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/delcons/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      showToast("Item deleted successfully!", "success");
      fetchData(); // ✅ Refresh data immediately
    } catch (error) {
      showToast("Error deleting item", "error");
      console.error(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="panel p-4 rounded shadow-lg"
        style={{ background: "#2c3e50", borderRadius: "15px" }}
      >
        <div className="panel-heading d-flex justify-content-between align-items-center">
          <h4 className="text-white">Materials List</h4>
          <button className="btn btn-success px-4" onClick={handleAddClick}>
            Add Items <i className="fa-solid fa-plus ps-2"></i>
          </button>
        </div>

        {/* ✅ Table to Show Data */}
        <div className="panel-body table-responsive mt-3">
          <table className="table table-bordered text-white">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Name</th>
                <th>Total Amount</th>
                <th>Pay Amount</th>
                <th>Remaining Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <th>{item.type}</th>
                    <td>{item.name}</td>
                    <td>{item.totalAmount}</td>
                    <td>{item.payAmount}</td>
                    <td>{item.remainingAmount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Material" : "Add New Material"}
                </h5>
                <button
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {Object.keys(newItem).map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={newItem[key]}
                    onChange={handleInputChange}
                    className="form-control mb-2"
                    placeholder={key}
                  />
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={isEditMode ? handleEditItem : handleAddItem}
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LabourersWages;
