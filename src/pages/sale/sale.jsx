import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sale = ({ totalAmounts }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    itemName: "",
    totalAmount: "",
    type: "Sale",
    date: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://construction-management-app-backend-qqvu.vercel.app/api/getmaterials",
        { params: { type: "Sale" } }
      );
      if (Array.isArray(response.data.DATA)) {
        setData(response.data.DATA);
      } else {
        setData([]);
      }
      if (totalAmounts && response.data) {
        totalAmounts({
          totalAmount: response.data.totalAmount || 0,
          payAmount: response.data.payAmount || 0,
          remainingAmount: response.data.remainingAmount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setData([]);
    }
  };

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type) => {
    toast(message, { type, position: "top-center", autoClose: 2000 });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setNewItem({
      itemName: "",
      totalAmount: "",
      date: "",
      type: "Sale",
      //   linked: false,
    });
    setShowModal(true);
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleCheckBox = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]:
        name === "itemName"
          ? capitalizeFirstLetter(value)
          : name === "date"
          ? value
          : value,
    }));
  };
 function formatDate(isoString) {
   const date = new Date(isoString);
   return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
     date.getDate()
   ).padStart(2, "0")}/${date.getFullYear()}`;
 }
  const handleEditClick = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setNewItem({
      itemName: item.itemName,
      totalAmount: item.totalAmount,
      date: item.date,
      type: item.type,
      //   linked: item.linked || false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleAddItem = async () => {
    if (!newItem.itemName || !newItem.totalAmount || !newItem.date) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    const day = new Date(newItem.date).getDate().toString().padStart(2, "0");
    const month = (new Date(newItem.date).getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const year = new Date(newItem.date).getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const payload = {
      itemName: newItem.itemName,
      totalAmount: parseFloat(newItem.totalAmount),
      type: "Sale",
      date: formattedDate,
    };

    try {
      const response = await axios.post(
        "https://construction-management-app-backend-qqvu.vercel.app/api/sale",
        payload
      );

      if (response.data && response.data.Data) {
        setData((prev) => [...prev, response.data.Data]);
        showToast("Item added successfully!", "success");
        fetchData();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Add Item Error:", error.response?.data || error.message);
      showToast(error.response.data?.message, "error");
    }
  };

  const handleEditItem = async () => {
    const { itemName, totalAmount, date, type } = newItem;
    if (!itemName || !totalAmount || !date) {
      showToast("Please fill all fields!", "warning");
      return;
    }
    try {
      const formattedDate = new Date(date).toISOString();

      const payload = {
        itemName,
        totalAmount,
        date: formattedDate,
        type,
      };

      await axios.put(
        `https://construction-management-app-backend-qqvu.vercel.app/api/update/${selectedItem._id}`,
        payload
      );

      setData((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? { ...item, ...payload } : item
        )
      );
      showToast("Item updated successfully!", "success");
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Edit Item Error:", error.response?.data || error.message);
      showToast("Error updating item", "error");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `https://construction-management-app-backend-qqvu.vercel.app/api/del/${id}`
      );
      setData((prev) => prev.filter((item) => item._id !== id));
      showToast("Item deleted successfully!", "success");
      fetchData();
    } catch (error) {
      showToast("Error deleting item", "error");
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

        <div className="panel-body table-responsive mt-3">
          <table className="table table-bordered text-white">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>{item.totalAmount}</td>
                    <td>{formatDate(item.date)}</td>
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
                  <td colSpan="5" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block popUp">
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
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="linked"
                    checked={newItem.linked}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        linked: e.target.checked,
                      }))
                    }
                    id="checkbox-linked"
                  />
                  <label className="form-check-label" htmlFor="checkbox-linked">
                    Linked Item
                  </label>
                </div>

                {Object.keys(newItem).map((key) => {
                  if (key === "type" || key === "linked") return null;
                  return (
                    <div key={key} className="form-floating mb-3">
                      <input
                        id={`floatingInput-${key}`}
                        type={
                          key === "itemName"
                            ? "text"
                            : key === "date"
                            ? "date"
                            : "number"
                        }
                        name={key}
                        value={newItem[key]}
                        onChange={handleCheckBox}
                        className="form-control"
                        placeholder={formatLabel(key)}
                      />
                      <label htmlFor={`floatingInput-${key}`}>
                        {formatLabel(key)}
                      </label>
                    </div>
                  );
                })}
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

export default Sale;
