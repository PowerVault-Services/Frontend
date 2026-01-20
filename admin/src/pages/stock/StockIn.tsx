import { useState } from "react";
import AddIcon from "../../assets/icons/Add Circle.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import DataTable, { type Column } from "../../components/table/DataTable";
import SelectFilter from "../../components/SelectFilter";
import AddProductModal from "../../components/AddProductModal";

interface StockIn {
    date: string;                 // วันที่ทำรายการ
    productCode: number;          // รหัสสินค้า
    category: string;             // หมวดหมู่
    projectType: string;          // โครงการ
    productName: string;          // ชื่อสินค้า
    unit: string;                 // หน่วยนับ
    stockIn: number;              // รับเข้า
    stockOut: number;             // จ่ายออก
    remainingStock: number;       // คงเหลือ
    note?: string;                // หมายเหตุ
    warrantyYear?: number;        // รับประกัน (ปี)
    warrantyStartDate?: string;   // วันที่เริ่มประกัน
    warrantyEndDate?: string;     // วันหมดรับประกัน
    description?: string;
}


export default function StockIn() {
    const [data] = useState<StockIn[]>([]);
    const [loading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const columns: Column<StockIn>[] = [
        {
            key: "date",
            label: "วันที่",
            align: "center",
            width: "120px",
        },
        {
            key: "productCode",
            label: "รหัสสินค้า",
            align: "center",
            width: "120px",
        },
        {
            key: "category",
            label: "หมวดหมู่",
            align: "center",
            width: "150px",
        },
        {
            key: "productName",
            label: "ชื่อสินค้า",
            align: "center",
            width: "280px",
        },
        {
            key: "unit",
            label: "หน่วยนับ",
            align: "center",
            width: "100px",
        },
        {
            key: "stockIn",
            label: "รับเข้า",
            align: "center",
            width: "100px",
        },
        {
            key: "projectType",
            label: "โครงการ",
            align: "center",
            width: "100px",
        },
        {
            key: "description",
            label: "รายละเอียด",
            align: "center",
            width: "100px",
        },
        {
            key: "warrantyYear",
            label: "รับประกัน(ปี)",
            align: "center",
            width: "100px",
        },
        {
            key: "warrantyStartDate",
            label: "วันเริ่มประกัน",
            align: "center",
            width: "100px",
        },
        {
            key: "warrantyEndDate",
            label: "วันหมดประกัน",
            align: "center",
            width: "100px",
        },
        {
            key: "note",
            label: "หมายเหตุ",
            align: "center",
            width: "250px",
            render: (value) => value || "-",
        },
    ];


    return (
        <div className="w-full">
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">Stock รับเข้า</h1>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5"
                >
                    <img src={AddIcon} alt="" />
                    Add สินค้าใหม่
                </button>
            </div>

            <SearchBox>
                <div className="grid grid-cols-4 justify-between gap-2.5">
                    <TextInputFilter label="วันที่" type="date" value={""} onChange={() => { }} />
                    <TextInputFilter label="รหัสสินค้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="หมวดหมู่" value={""} onChange={() => { }} />
                    <TextInputFilter label="ชื่อสินค้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="หน่วยนับ" value={""} onChange={() => { }} />
                    <TextInputFilter label="รับเข้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="โครงการ" value={""} onChange={() => { }} />
                    <SelectFilter
                        label="รับประกัน (ปี)"
                        placeholder="All"
                        value=""
                        onChange={() => { }}
                        options={[
                            { label: "All", value: "all" },
                            { label: "1", value: "1" },
                            { label: "2", value: "2" },
                            { label: "3", value: "3" },
                            { label: "4", value: "4" },
                        ]}
                    />

                    <TextInputFilter label="วันที่เริ่มประกัน" type="date" value={""} onChange={() => { }} />
                    <TextInputFilter label="วันหมดรับประกัน" type="date" value={""} onChange={() => { }} />
                </div>
            </SearchBox>

            <div className="pt-[25px]">
                <DataTable<StockIn> columns={columns} data={data} loading={loading} />
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
