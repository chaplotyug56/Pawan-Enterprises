import { useEffect, useState } from "react";

function ProductForm({
  form,
  handleChange,
  handleSubmit,
  isEditing,
  setForm,
}) {
  const [previews, setPreviews] = useState([]);
  const [discountPercent, setDiscountPercent] = useState("");

  const handleDiscountChange = (e) => {
    const discount = e.target.value;
    setDiscountPercent(discount);

    if (form.mrp && discount) {
      const calculatedPrice = form.mrp - (form.mrp * (discount / 100));
      handleChange({
        target: {
          name: "price",
          value: Math.round(calculatedPrice),
        }
      });
    }
  };

  useEffect(() => {
    const newPreviews = [];
    if (form.images && form.images.length > 0) {
      form.images.forEach((img) => {
        if (img instanceof File) {
          newPreviews.push(URL.createObjectURL(img));
        } else if (typeof img === "string" && img !== "") {
          if (img.startsWith("http") || img.startsWith("data:")) {
            newPreviews.push(img);
          } else {
            newPreviews.push(`http://localhost:8000/api/images/${img}`);
          }
        }
      });
    } else if (form.image) {
      if (typeof form.image === "string" && form.image !== "") {
        if (form.image.startsWith("http") || form.image.startsWith("data:")) {
          newPreviews.push(form.image);
        } else {
          newPreviews.push(`http://localhost:8000/api/images/${form.image}`);
        }
      }
    }
    setPreviews(newPreviews);
  }, [form.images, form.image]);

  const handlePaste = (e) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        e.preventDefault(); 
        
        const fileInput = document.querySelector('input[name="images"]');
        if (fileInput) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        }
        
        handleChange({
          target: {
            name: "images",
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
            <option value="">Select Category</option>
            <option value="Paints">Paints</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Stationery">Stationery</option>
            <option value="Grocery">Grocery</option>
            <option value="Household">Household</option>
            <option value="Gift Items">Gift Items</option>
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
            placeholder="Discount % (Optional)"
            value={discountPercent}
            onChange={handleDiscountChange}
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

        {/* OPTIONS SECTION */}
        <div className="options-section" style={{ borderTop: "1px solid #eee", paddingTop: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ marginBottom: "5px" }}>Product Variants (Amazon-Style)</h3>
          
          <div className="option-group" style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
              <input type="checkbox" checked={form.hasVariants || false} onChange={() => setForm(f => ({...f, hasVariants: !f.hasVariants}))} style={{ width: "auto", margin: 0, cursor: "pointer" }} />
              Enable Variants (Color, Size, specific Prices & Images)
            </label>
            
            {form.hasVariants && (
              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                {form.variants?.map((variant, idx) => (
                  <div key={idx} style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", background: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}>
                    
                    <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "120px"}}>
                      <label style={{fontSize: "12px", color: "#666"}}>Color</label>
                      <input type="text" placeholder="e.g. Red" value={variant.color} onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[idx].color = e.target.value;
                        setForm(f => ({...f, variants: newVariants}));
                      }} />
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "120px"}}>
                      <label style={{fontSize: "12px", color: "#666"}}>Size</label>
                      <input type="text" placeholder="e.g. XL or 1kg" value={variant.size} onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[idx].size = e.target.value;
                        setForm(f => ({...f, variants: newVariants}));
                      }} />
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "100px"}}>
                      <label style={{fontSize: "12px", color: "#666"}}>MRP (₹)</label>
                      <input type="number" placeholder="MRP" value={variant.mrp} onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[idx].mrp = Number(e.target.value);
                        setForm(f => ({...f, variants: newVariants}));
                      }} required />
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "100px"}}>
                      <label style={{fontSize: "12px", color: "#666"}}>Price (₹)</label>
                      <input type="number" placeholder="Price" value={variant.price} onChange={(e) => {
                        const newVariants = [...form.variants];
                        newVariants[idx].price = Number(e.target.value);
                        setForm(f => ({...f, variants: newVariants}));
                      }} required />
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "150px"}}>
                      <label style={{fontSize: "12px", color: "#666"}}>Variant Image</label>
                      <input type="file" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newVariants = [...form.variants];
                          newVariants[idx].image = e.target.files[0];
                          setForm(f => ({...f, variants: newVariants}));
                        }
                      }} />
                    </div>

                    <div style={{display: "flex", alignItems: "flex-end", paddingBottom: "5px"}}>
                      {typeof variant.image === "string" && variant.image && (
                        <img src={variant.image.startsWith("http") ? variant.image : `//${window.location.host}/api/images/${variant.image}`} alt="Variant" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "5px", marginRight: "10px" }} />
                      )}
                      <button type="button" onClick={() => setForm(f => ({...f, variants: f.variants.filter((_, i) => i !== idx)}))} style={{ padding: "8px 12px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                    </div>

                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({...f, variants: [...(f.variants || []), { color: "", size: "", mrp: "", price: "", image: "" }]}))} style={{ alignSelf: "flex-start", padding: "8px 15px", background: "#e6f7ff", color: "#1890ff", border: "1px solid #91d5ff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Add Variant</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="file-input-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label>Product Images (Max 5)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
          <small style={{color: '#666'}}>💡 Tip: You can also paste an image directly anywhere in this form (Ctrl+V / Cmd+V)</small>
        </div>

        {previews.length > 0 && (
          <div className="preview-box" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
              />
            ))}
          </div>
        )}

        <button
          className="save-btn"
          type="submit"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;