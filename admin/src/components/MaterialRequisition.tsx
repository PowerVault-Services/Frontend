import { useState, useEffect } from "react";
import { getStockMeta } from "../services/stock.api";
import type { Category, Product } from "../services/stock.api";

export interface MaterialItem {
    categoryId: number | "";
    productId: number | "";
    quantity: number;
}

interface Props {
    onChange?: (materials: MaterialItem[]) => void;
}

export default function MaterialRequisition({ onChange }: Props) {

    const [materials, setMaterials] = useState<MaterialItem[]>([
        { categoryId: "", productId: "", quantity: 1 }
    ]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    /* =========================
       Load Stock Meta
    ========================= */

    useEffect(() => {

        async function loadMeta() {

            try {

                const data = await getStockMeta();

                setCategories(data.categories);
                setProducts(data.products);

            } catch (err) {

                console.error("โหลด stock meta ไม่สำเร็จ", err);

            }

        }

        loadMeta();

    }, []);

    /* =========================
       Emit to parent
    ========================= */

    useEffect(() => {
        onChange?.(materials);
    }, [materials]);

    /* =========================
       Actions
    ========================= */

    function addItem() {

        setMaterials([
            ...materials,
            { categoryId: "", productId: "", quantity: 1 }
        ]);

    }

    function removeItem(index: number) {

        setMaterials(materials.filter((_, i) => i !== index));

    }

    function updateItem<K extends keyof MaterialItem>(
        index: number,
        key: K,
        value: MaterialItem[K]
    ) {

        const updated = [...materials];

        updated[index][key] = value;

        if (key === "categoryId") {
            updated[index].productId = "";
        }

        setMaterials(updated);

    }

    /* =========================
       Render
    ========================= */

    return (

        <div className="w-[1095px] mt-3">

            {/* Header */}
            <div className="flex justify-between mb-0.5">

                <p className="text-lg font-bold">
                    การเบิกวัสดุ
                </p>

            </div>

            {/* Table */}
            <div className="border rounded-xl overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-[250px_1fr_150px_80px]
        bg-gray-100 text-gray-700 font-medium px-6 py-4 text-sm">

                    <div>หมวดหมู่อุปกรณ์</div>
                    <div>อุปกรณ์ / ชื่ออุปกรณ์</div>
                    <div className="text-center">จำนวน</div>
                    <div></div>

                </div>

                {/* Rows */}
                {materials.map((item, index) => {

                    const filteredProducts = products.filter(
                        p => !item.categoryId || p.categoryId === item.categoryId
                    );

                    return (

                        <div
                            key={index}
                            className="grid grid-cols-[250px_1fr_150px_80px]
              items-center px-6 py-3 border-t text-lg"
                        >

                            {/* Category */}
                            <select
                                value={item.categoryId}
                                onChange={(e) =>
                                    updateItem(index, "categoryId", Number(e.target.value))
                                }
                                className="border rounded-lg px-4 py-1.5 w-[220px] text-sm"
                            >

                                <option value="" className="tetx-sm">Select</option>

                                {categories.map((cat) => (

                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>

                                ))}

                            </select>

                            {/* Product */}
                            <select
                                value={item.productId}
                                onChange={(e) =>
                                    updateItem(index, "productId", Number(e.target.value))
                                }
                                className="border rounded-lg px-4 py-1.5 w-[420px] text-sm"
                            >

                                <option value="">Select product</option>

                                {filteredProducts.map((product) => (

                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>

                                ))}

                            </select>

                            {/* Quantity */}
                            <input
                                type="number"
                                value={item.quantity}
                                min={1}
                                onChange={(e) =>
                                    updateItem(index, "quantity", Number(e.target.value))
                                }
                                className="border rounded-lg px-4 py-1.5 w-[90px] text-center text-sm mx-auto"
                            />

                            {/* Delete */}
                            <button
                                onClick={() => removeItem(index)}
                                className="bg-red-500 text-white rounded-md
                w-10 h-10 flex items-center justify-center mx-auto"
                            >
                                🗑
                            </button>

                        </div>

                    );

                })}

                <div className="border-t p-4 bg-gray-50">

                    <button
                        onClick={addItem}
                        className="w-full bg-[#2979FF] hover:bg-[#1d6dfc]
    text-white py-3 rounded-md font-medium"
                    >
                        Add new row
                    </button>

                </div>

                {/* Footer */}
                {/* <div className="px-6 py-4 border-t bg-gray-50">

                    <div className="flex items-center gap-3">

                        <span>Total Items :</span>

                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                            {materials.length}
                        </span>

                    </div>

                </div> */}

            </div>

        </div>

    );

}