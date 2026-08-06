import { useEffect, useState } from "react";

function ProductForm({
  form,
  handleChange,
  handleSubmit,
  isEditing,
}) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (form.image instanceof File) {
      const objectUrl = URL.createObjectURL(form.image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof form.image === "string" && form.image !== "") {
      if (form.image.startsWith("http")) {
        setPreview(form.image);
      } else {
        setPreview(`http://localhost:8000/uploads/${form.image}`);
      }
    } else {
      setPreview(null);
    }
  }, [form.image]);

  const handlePaste = (e) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        e.preventDefault(); // Prevent default paste behavior (e.g. if focused on text input)
        
        // Update the actual file input so HTML5 validation passes
        const fileInput = document.querySelector('input[name="image"]');
        if (fileInput) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        }
        
        // Update React state
        handleChange({
          target: {
            name: "image",
            files: [file]
          }
        });
      }
    }
  };

  return (
    <div className="admin-card">

      <h2>
        {isEditing ? "Update Product" : "Add Product"}
      </h2>

      <form
        className="product-form"
        onSubmit={handleSubmit}
        onPaste={handlePaste}
      >

        <div className="form-grid">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            <option value="Paints">
              Paints
            </option>

            <option value="Cosmetics">
              Cosmetics
            </option>

            <option value="Stationery">
              Stationery
            </option>

            <option value="Grocery">
              Grocery
            </option>

            <option value="Household">
              Household
            </option>

            <option value="Gift Items">
              Gift Items
            </option>

          </select>

          <input
  type="number"
  name="mrp"
  placeholder="MRP"
  value={form.mrp}
  onChange={handleChange}
  required
/>

<input
  type="number"
  name="price"
  placeholder="Our Price"
  value={form.price}
  onChange={handleChange}
  required
/>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

        </div>

        <textarea
          name="description"
          rows="5"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="file-input-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required={!isEditing}
          />
          <small style={{color: '#666'}}>💡 Tip: You can also paste an image directly anywhere in this form (Ctrl+V / Cmd+V)</small>
        </div>

<label>Gallery Images (Max 5)</label>

<input
  type="file"
  name="images"
  accept="image/*"
  multiple
  onChange={handleChange}
/>

        {preview && (
          <div className="preview-box">

            <img
              src={preview}
              alt="Preview"
            />

          </div>
        )}

        <button
          className="save-btn"
          type="submit"
        >
          {isEditing
            ? "Update Product"
            : "Add Product"}

{isEditing &&
 typeof form.image === "string" && (
    <img
        src={form.image}
        alt=""
        width="120"
    />
)}
        </button>

      </form>

    </div>
  );
}

export default ProductForm;