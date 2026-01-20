import { useState } from "react";
import AddIcon from "../../assets/icons/Add Circle.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import DataTable, { type Column } from "../../components/table/DataTable";
import AddProductModal from "../../components/AddProductModal";


interface AllStock {
    productCode: number;
    category: string;
    projectType: string;
    productName: string;
    unit: number;
    stockIn: string;
    stockOut: string;
    remainingStock: string;
}

export default function AllStock() {
    const [data] = useState<AllStock[]>([]);
    const [loading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const columns: Column<AllStock>[] = [
        { key: "productCode", label: "รหัสสินค้า", align: "center" },
        { key: "category", label: "หมวดหมู่", align: "center" },
        { key: "productName", label: "ชื่อสินค้า", align: "center" },
        { key: "unit", label: "หน่วยนับ", align: "center" },
        { key: "stockIn", label: "รับเข้า", align: "center" },
        { key: "stockOut", label: "จ่ายออก", align: "center" },
        { key: "remainingStock", label: "คงเหลือ", align: "center" },
    ];

    return (
        <div className="w-full">
            {/* ---------- Header ---------- */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">All Stock</h1>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5"
                >
                    <img src={AddIcon} alt="" />
                    Add สินค้าใหม่
                </button>
            </div>

            {/* ---------- Search ---------- */}
            <SearchBox>
                <div className="grid grid-cols-4 justify-between gap-2.5">
                    <TextInputFilter label="รหัสสินค้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="หมวดหมู่" value={""} onChange={() => { }} />
                    <TextInputFilter label="ชื่อสินค้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="หน่วยนับ" value={""} onChange={() => { }} />
                    <TextInputFilter label="รับเข้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="จ่ายออก" value={""} onChange={() => { }} />
                    <TextInputFilter label="คงเหลือ" value={""} onChange={() => { }} />
                </div>
            </SearchBox>

            {/* ---------- Table ---------- */}
            <div className="pt-[25px]">
                <DataTable<AllStock> columns={columns} data={data} loading={loading} />
            </div>

            <AddProductModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onNext={() => {
                    // logic ขั้นต่อไป
                    setOpenModal(false);
                }}
            />

        </div>
    );
}
