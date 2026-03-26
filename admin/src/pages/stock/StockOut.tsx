import { useEffect, useState } from "react";
import { getStockOutList, createStockOut } from "../../services/stock.api";
import  MinusIcon  from "../../assets/icons/Minus Circle.svg"
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import DataTable, { type Column } from "../../components/table/DataTable";
import SelectFilter from "../../components/SelectFilter";
import AddProductModal from "../../components/AddProductModal";

interface StockOut {
    id: number | string;
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


export default function StockOut() {
    const [data, setData] = useState<StockOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const columns: Column<StockOut>[] = [
        {
            id: "date",
            key: "date",
            label: "วันที่",
            align: "center",
            width: "120px",
        },
        {
            id: "productCode",
            key: "productCode",
            label: "รหัสสินค้า",
            align: "center",
            width: "120px",
        },
        {
            id: "category",
            key: "category",
            label: "หมวดหมู่",
            align: "center",
            width: "150px",
        },
        {
            id: "productName",
            key: "productName",
            label: "ชื่อสินค้า",
            align: "center",
            width: "280px",
        },
        {
            id: "unit",
            key: "unit",
            label: "หน่วยนับ",
            align: "center",
            width: "100px",
        },
        {
            id: "stockOut",
            key: "stockOut",
            label: "จ่ายออก",
            align: "center",
            width: "100px",
        },
        {
            id: "projectType",
            key: "projectType",
            label: "โครงการ",
            align: "center",
            width: "100px",
        },
        {
            id: "description",
            key: "description",
            label: "รายละเอียด",
            align: "center",
            width: "100px",
        },
        {
            id: "note",
            key: "note",
            label: "หมายเหตุ",
            align: "center",
            width: "250px",
            render: (value) => value || "-",
        },
    ];

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {
        try {
            setLoading(true);
            const res = await getStockOutList();

            // 🔥 ถ้า backend structure ไม่ตรง ให้ map ตรงนี้
            const mapped = res.map((item: any, index: number) => ({
                id: item.id ?? index,
                date: item.txDate,
                productCode: item.product?.code,
                category: item.product?.category,
                projectType: item.project,
                productName: item.product?.name,
                unit: item.product?.unit,
                stockOut: item.outQty,
                remainingStock: item.onHand,
                note: item.note,
                description: item.description,
            }));

            setData(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="w-full">
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">Stock จ่ายออก</h1>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5"
                >
                    <img src={MinusIcon} alt="" />
                    เบิกสินค้า
                </button>
            </div>

            <SearchBox>
                <div className="grid grid-cols-4 justify-between gap-2.5">
                    <TextInputFilter label="วันที่" type="date" value={""} onChange={() => { }} />
                    <TextInputFilter label="รหัสสินค้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="หมวดหมู่" value={""} onChange={() => { }} />
                    <TextInputFilter label="ชื่อสินค้า" value={""} onChange={() => { }} />
                    <TextInputFilter label="หน่วยนับ" value={""} onChange={() => { }} />
                    <TextInputFilter label="จ่ายออก" value={""} onChange={() => { }} />
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
                </div>
            </SearchBox>

            <div className="pt-[25px]">
                <DataTable<StockOut> columns={columns} data={data} loading={loading} />
            </div>

            <AddProductModal
                open={openModal}
                mode="stockOut"
                onClose={() => setOpenModal(false)}
                onSuccess={async () => {
                    await loadData();
                }}
            />

        </div>
    );
}
