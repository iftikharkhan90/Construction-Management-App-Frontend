import React from 'react'

export default function Popup() {
  return (

    

    <>
      {showModal && (
        <div className="modal fade show d-block popUp">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Material" : "Add New Material"}
                </h5>
                <button className="btn-close" onClick={handleCloseModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {Object.keys(newItem).map(
                  (key) =>
                    key !== "type" && (
                      <div key={key} className="form-floating mb-3">
                        <input
                          id={`floatingInput-${key}`}
                          type="text"
                          name={key}
                          value={newItem[key]}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder={key}
                        />
                        <label htmlFor={`floatingInput-${key}`}>{key}</label>
                      </div>
                    )
                )}
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
    </>
  );
}
