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
  const [discountAmount, setDiscountAmount] = useState("");

  // Recalculate discount based on MRP and Price
  useEffect(() => {
    if (form.mrp && form.price) {
      const mrp = Number(form.mrp);
      const price = Number(form.price);
      if (mrp > 0 && price <= mrp) {
        const dAmount = mrp - price;
        const dPercent = Math.round((dAmount / mrp) * 100);
        setDiscountAmount(dAmount.toString());
        setDiscountPercent(dPercent.toString());
      } else {
        setDiscountAmount("");
        setDiscountPercent("");
      }
    } else {
      setDiscountAmount("");
      setDiscountPercent("");
    }
  }, [form.mrp, form.price]);

  const handleDiscountPercentChange = (e) => {
    const dPercent = Number(e.target.value);
    setDiscountPercent(e.target.value);
    if (form.mrp && dPercent >= 0 && dPercent <= 100) {
      const mrp = Number(form.mrp);
      const calculatedPrice = Math.round(mrp - (mrp * (dPercent / 100)));
      handleChange({
        target: { name: "price", value: calculatedPrice }
      });
    }
  };

  const handleDiscountAmountChange = (e) => {
    const dAmount = Number(e.target.value);
    setDiscountAmount(e.target.value);
    if (form.mrp && dAmount >= 0) {
      const mrp = Number(form.mrp);
      const calculatedPrice = Math.round(mrp - dAmount);
      handleChange({
        target: { name: "price", value: calculatedPrice >= 0 ? calculatedPrice : 0 }
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
          if (img.startsWith("http") || img.startsWith("data:") || img.startsWith("//")) {
            newPreviews.push(img);
          } else {
            newPreviews.push(`//${window.location.host}/api/images/${img}`);
          }
        }
      });
    } else if (form.image) {
      if (typeof form.image === "string" && form.image !== "") {
        if (form.image.startsWith("http") || form.image.startsWith("data:") || form.image.startsWith("//")) {
          newPreviews.push(form.image);
        } else {
          newPreviews.push(`//${window.location.host}/api/images/${form.image}`);
        }
      }
    }
    setPreviews(newPreviews);
  }, [form.images, form.image]);

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        handleChange({
          target: { name: "images", files: [...(form.images || []), file] }
        });
      }
    }
  };

  return (
    <div className="admin-card product-management-form">
      <h2>{isEditing ? "Update Product" : "Add Product"}</h2>
      <form className="product-form" onSubmit={handleSubmit} onPaste={handlePaste} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

        {/* CARD 1: Basic Information */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>1. Basic Information</h3>
          <div className="form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Paints">Paints</option>
                <option value="Cosmetics">Cosmetics</option>
                <option value="Stationery">Stationery</option>
                <option value="Grocery">Grocery</option>
                <option value="Household">Household</option>
                <option value="Gift Items">Gift Items</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Sub-Category</label>
              <input type="text" name="subCategory" value={form.subCategory} onChange={handleChange} placeholder="e.g. Hair Oil" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Brand</label>
              <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Bajaj" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Product SKU</label>
              <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. BAJ-HAIR-001" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "15px" }}>
            <label>Product Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Detailed product description..."></textarea>
          </div>
        </div>

        {/* CARD 2: Pricing */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>2. Pricing</h3>
          <div className="form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>MRP (₹) *</label>
              <input type="number" name="mrp" value={form.mrp} onChange={handleChange} required min="0" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Selling Price (₹) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Discount (%)</label>
              <input type="number" value={discountPercent} onChange={handleDiscountPercentChange} min="0" max="100" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Discount Amount (₹)</label>
              <input type="number" value={discountAmount} onChange={handleDiscountAmountChange} min="0" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>GST (%)</label>
              <select name="gstPercent" value={form.gstPercent} onChange={handleChange}>
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>
          </div>
          {Number(form.price) > Number(form.mrp) && (
            <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>Selling Price cannot be greater than MRP!</p>
          )}
        </div>

        {/* CARD 3: Images */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>3. Images</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
              <label>Add Image from URL</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  id="imageUrlInput"
                  placeholder="https://example.com/image.jpg" 
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        handleChange({ target: { name: "images", value: [...(form.images || []), val] } });
                        e.target.value = "";
                      }
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={(e) => {
                    const input = document.getElementById('imageUrlInput');
                    const val = input.value.trim();
                    if (val) {
                      handleChange({ target: { name: "images", value: [...(form.images || []), val] } });
                      input.value = "";
                    }
                  }}
                  style={{ padding: "0 20px", background: "#0056b3", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Add
                </button>
              </div>
            </div>

            <div style={{ position: "relative", width: "100%", height: "120px", border: "2px dashed #0056b3", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f8ff", cursor: "pointer", overflow: "hidden" }}>
              <span style={{ fontSize: "16px", color: "#0056b3", fontWeight: "bold" }}>Click or Paste Images (Ctrl+V)</span>
              <input type="file" name="images" multiple accept="image/*" style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} onChange={(e) => {
                if (e.target.files) {
                  handleChange({ target: { name: "images", files: [...(form.images || []), ...Array.from(e.target.files)] } });
                }
              }} />
            </div>
            {previews.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {previews.map((src, idx) => (
                  <div key={idx} style={{ position: "relative", border: idx === 0 ? "2px solid #0056b3" : "1px solid #ddd", borderRadius: "8px", padding: "4px" }}>
                    <img src={src} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "5px", display: "block" }} />
                    {idx === 0 && <div style={{ position: "absolute", top: 0, left: 0, background: "#0056b3", color: "white", fontSize: "10px", padding: "2px 5px", borderTopLeftRadius: "5px" }}>MAIN</div>}
                    <button type="button" onClick={() => {
                      const newImages = [...form.images];
                      newImages.splice(idx, 1);
                      handleChange({ target: { name: "images", value: newImages } });
                    }} style={{ position: "absolute", top: -5, right: -5, background: "red", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: Variants */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>4. Product Variants / Sizes</h3>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "bold" }}>
            <input type="checkbox" name="hasVariants" checked={form.hasVariants} onChange={(e) => handleChange({ target: { name: "hasVariants", value: e.target.checked } })} />
            Does this product have variants?
          </label>
          
          {form.hasVariants && (
            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
              {form.variants?.map((variant, idx) => (
                <div key={idx} style={{ display: "flex", gap: "15px", flexWrap: "wrap", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "100px"}}>
                    <label style={{fontSize: "12px", color: "#666"}}>Size/Name *</label>
                    <input type="text" placeholder="e.g. 1 Litre" value={variant.size} onChange={(e) => {
                      const newVariants = [...form.variants];
                      newVariants[idx].size = e.target.value;
                      handleChange({ target: { name: "variants", value: newVariants } });
                    }} required />
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "100px"}}>
                    <label style={{fontSize: "12px", color: "#666"}}>MRP (₹) *</label>
                    <input type="number" placeholder="MRP" value={variant.mrp} onChange={(e) => {
                      const newVariants = [...form.variants];
                      newVariants[idx].mrp = Number(e.target.value);
                      handleChange({ target: { name: "variants", value: newVariants } });
                    }} required />
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "100px"}}>
                    <label style={{fontSize: "12px", color: "#666"}}>Price (₹) *</label>
                    <input type="number" placeholder="Price" value={variant.price} onChange={(e) => {
                      const newVariants = [...form.variants];
                      newVariants[idx].price = Number(e.target.value);
                      handleChange({ target: { name: "variants", value: newVariants } });
                    }} required />
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "80px"}}>
                    <label style={{fontSize: "12px", color: "#666"}}>Stock</label>
                    <input type="number" placeholder="Stock" value={variant.stock} onChange={(e) => {
                      const newVariants = [...form.variants];
                      newVariants[idx].stock = Number(e.target.value);
                      handleChange({ target: { name: "variants", value: newVariants } });
                    }} />
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "100px"}}>
                    <label style={{fontSize: "12px", color: "#666"}}>SKU</label>
                    <input type="text" placeholder="SKU" value={variant.sku || ""} onChange={(e) => {
                      const newVariants = [...form.variants];
                      newVariants[idx].sku = e.target.value;
                      handleChange({ target: { name: "variants", value: newVariants } });
                    }} />
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "120px"}}>
                    <label style={{fontSize: "12px", color: "#666"}}>Image</label>
                    <div style={{ position: "relative", width: "100%", height: "38px", border: "1px dashed #0056b3", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f8ff", cursor: "pointer", overflow: "hidden" }}>
                      <span style={{ fontSize: "11px", color: "#0056b3", fontWeight: "bold" }}>Upload</span>
                      <input type="file" accept="image/*" style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newVariants = [...form.variants];
                          newVariants[idx].image = e.target.files[0];
                          handleChange({ target: { name: "variants", value: newVariants } });
                        }
                      }} />
                    </div>
                  </div>
                  <div style={{display: "flex", alignItems: "flex-end", paddingBottom: "5px"}}>
                    {variant.image && (
                      <img src={typeof variant.image === "string" ? (variant.image.startsWith("http") || variant.image.startsWith("//") ? variant.image : `//${window.location.host}/api/images/${variant.image}`) : URL.createObjectURL(variant.image)} alt="Variant" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "5px", marginRight: "10px" }} />
                    )}
                    <button type="button" onClick={() => handleChange({ target: { name: "variants", value: form.variants.filter((_, i) => i !== idx) }})} style={{ padding: "8px 12px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleChange({ target: { name: "variants", value: [...(form.variants || []), { color: "", size: "", mrp: "", price: "", stock: 0, sku: "", image: "" }] }})} style={{ alignSelf: "flex-start", padding: "8px 15px", background: "#e6f7ff", color: "#1890ff", border: "1px solid #91d5ff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Add Variant</button>
            </div>
          )}
        </div>

        {/* CARD 5: Inventory */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>5. Inventory</h3>
          <div className="form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Total Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" disabled={form.hasVariants} title={form.hasVariants ? "Stock is managed at the variant level" : ""} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Low Stock Alert Threshold</label>
              <input type="number" name="lowStockThreshold" value={form.lowStockThreshold} onChange={handleChange} min="0" />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "15px" }}>
            <input type="checkbox" name="allowOutOfStockPurchase" checked={form.allowOutOfStockPurchase} onChange={(e) => handleChange({ target: { name: "allowOutOfStockPurchase", value: e.target.checked } })} />
            Allow Purchase When Out of Stock
          </label>
        </div>

        {/* CARD 6: Delivery */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>6. Delivery</h3>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "15px", fontWeight: "bold" }}>
            <input type="checkbox" name="deliveryAvailable" checked={form.deliveryAvailable} onChange={(e) => handleChange({ target: { name: "deliveryAvailable", value: e.target.checked } })} />
            Delivery Available
          </label>
          {form.deliveryAvailable && (
            <div className="form-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label>Delivery Charge (₹)</label>
                <input type="number" name="deliveryCharge" value={form.deliveryCharge} onChange={handleChange} min="0" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label>Free Delivery Above (₹)</label>
                <input type="number" name="freeDeliveryAbove" value={form.freeDeliveryAbove} onChange={handleChange} min="0" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label>Estimated Delivery Time</label>
                <input type="text" name="estimatedDeliveryTime" value={form.estimatedDeliveryTime} onChange={handleChange} placeholder="e.g. 2-3 Business Days" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label>Delivery Radius (KM) - 0 for unlimited</label>
                <input type="number" name="deliveryRadiusKm" value={form.deliveryRadiusKm} onChange={handleChange} min="0" />
              </div>
            </div>
          )}
        </div>

        {/* CARD 7: Product Information */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>7. Product Information</h3>
          <div className="form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Product Weight / Volume</label>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} min="0" step="0.01" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="">Select Unit</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="litre">litre</option>
                <option value="ml">ml</option>
                <option value="piece">piece</option>
                <option value="pack">pack</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Manufacturer</label>
              <input type="text" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Country of Origin</label>
              <input type="text" name="countryOfOrigin" value={form.countryOfOrigin} onChange={handleChange} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Expiry / Shelf Life</label>
              <input type="text" name="expiryDate" value={form.expiryDate} onChange={handleChange} placeholder="e.g. 24 Months" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label>Product Type</label>
              <input type="text" name="productType" value={form.productType} onChange={handleChange} placeholder="e.g. Liquid" />
            </div>
          </div>
        </div>

        {/* CARD 8: Product Page Settings */}
        <div style={{ background: "#f9fafb", border: "1px solid #eee", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>8. Product Page Settings</h3>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="checkbox" name="active" checked={form.active} onChange={(e) => handleChange({ target: { name: "active", value: e.target.checked } })} />
              Active / Visible
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={(e) => handleChange({ target: { name: "featured", value: e.target.checked } })} />
              Featured Product
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={(e) => handleChange({ target: { name: "bestSeller", value: e.target.checked } })} />
              Best Seller
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="checkbox" name="newArrival" checked={form.newArrival} onChange={(e) => handleChange({ target: { name: "newArrival", value: e.target.checked } })} />
              New Arrival
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <input type="checkbox" name="showOnHomepage" checked={form.showOnHomepage} onChange={(e) => handleChange({ target: { name: "showOnHomepage", value: e.target.checked } })} />
              Show on Homepage
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px", position: "sticky", bottom: "20px", background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 -4px 10px rgba(0,0,0,0.1)", zIndex: 10 }}>
          <button type="submit" disabled={Number(form.price) > Number(form.mrp)} style={{ flex: 1, padding: "12px", background: Number(form.price) > Number(form.mrp) ? "#ccc" : "#0056b3", color: "white", border: "none", borderRadius: "5px", cursor: Number(form.price) > Number(form.mrp) ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "16px" }}>
            {isEditing ? "Save Product Changes" : "Save New Product"}
          </button>
          {isEditing && (
             <button type="button" onClick={() => {
               setForm({
                  name: "", category: "", subCategory: "", brand: "", sku: "", description: "", mrp: "", price: "", gstPercent: 0, stock: "", lowStockThreshold: 5, allowOutOfStockPurchase: false, images: [], hasVariants: false, variants: [], deliveryAvailable: true, deliveryCharge: 0, freeDeliveryAbove: 1000, estimatedDeliveryTime: "3-5 Business Days", deliveryRadiusKm: 0, weight: "", unit: "", manufacturer: "", countryOfOrigin: "", expiryDate: "", productType: "", featured: false, bestSeller: false, newArrival: false, showOnHomepage: false, active: true
               });
               // Force window reload or clear edit state via prop if available. Assuming Admin.jsx handles it via a cancel mechanism, or we just clear.
               window.location.reload();
             }} style={{ padding: "12px 20px", background: "#f8d7da", color: "#721c24", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
          )}
        </div>

      </form>
    </div>
  );
}

export default ProductForm;
