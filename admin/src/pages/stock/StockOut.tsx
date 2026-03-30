import { useEffect, useState } from "react";
import { getStockOutList, createStockOut } from "../../services/stock.api";
import MinusIcon from "../../assets/icons/Minus Circle.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import DataTable, { type Column } from "../../components/table/DataTable";
import AddProductModal from "../../components/AddProductModal";

interface StockOut {
    id: number | string;
    date: string;
    productCode: string;
    category: string;
    projectType: string;
    productName: string;
    unit: string;
    stockOut: number;
    note?: string;
    description?: string;
}

export default function StockOut() {
    const [data, setData] = useState<StockOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 13;
    const [totalItems, setTotalItems] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const totalPages = Math.ceil(totalItems / pageSize);

    const columns: Column<StockOut>[] = [
        { id: "date", key: "date", label: "วันที่", align: "center", width: "120px" },
        { id: "productCode", key: "productCode", label: "รหัสสินค้า", align: "center", width: "120px" },
        { id: "category", key: "category", label: "หมวดหมู่", align: "center", width: "150px" },
        { id: "productName", key: "productName", label: "ชื่อสินค้า", align: "center", width: "280px" },
        { id: "unit", key: "unit", label: "หน่วยนับ", align: "center", width: "100px" },
        { id: "stockOut", key: "stockOut", label: "จ่ายออก", align: "center", width: "100px" },
        { id: "projectType", key: "projectType", label: "โครงการ", align: "center", width: "100px" },
        { id: "description", key: "description", label: "รายละเอียด", align: "center", width: "100px" },
        {
            id: "note",
            key: "note",
            label: "หมายเหตุ",
            align: "center",
            width: "250px",
            render: (value) => value || "-",
        },
    ];

    const loadData = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            });

            if (keyword) params.append("q", keyword);
            if (dateFrom) params.append("dateFrom", dateFrom);
            if (dateTo) params.append("dateTo", dateTo);

            const res = await getStockOutList(`?${params.toString()}`);

            if (!res) {
                setData([]);
                return;
            }

            const list = res.data?.list ?? [];

            const mapped: StockOut[] = list.map((item: any) => ({
                id: item.id,
                date: item.txDate?.slice(0, 10) ?? "-",
                productCode: item.sku ?? "-",
                category: item.category ?? "-",
                projectType: item.project ?? "-",
                productName: item.productName ?? "-",
                unit: item.unit ?? "-",
                stockOut: item.quantity ?? 0,
                note: item.note ?? "-",
                description: item.description ?? "-",
            }));

            setData(mapped);
            setTotalItems(res.data?.pagination?.total ?? 0);

        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, keyword, dateFrom, dateTo]);

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
                    <TextInputFilter label="ค้นหา" value={keyword} onChange={setKeyword} />
                    <TextInputFilter label="วันที่เริ่ม" type="date" value={dateFrom} onChange={setDateFrom} />
                    <TextInputFilter label="วันที่สิ้นสุด" type="date" value={dateTo} onChange={setDateTo} />
                </div>
            </SearchBox>

            <div className="pt-[25px]">
                <DataTable<StockOut> columns={columns} data={data} loading={loading} />
            </div>

            <div className="flex items-center justify-between py-6 text-sm text-gray-500">
                <span>
                    {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, totalItems)} of {totalItems} items
                </span>
            </div>

            <AddProductModal
                open={openModal}
                mode="stockOut"
                onClose={() => setOpenModal(false)}
                onSuccess={loadData}
                onSubmit={async (formData) => { // ✅ เพิ่ม onSubmit
                    if (!formData.productId) throw new Error("กรุณาเลือกสินค้า");
                    if (!formData.quantity) throw new Error("กรุณากรอกจำนวน");
                    await createStockOut({
                        productId: Number(formData.productId),
                        quantity: Number(formData.quantity),
                        siteId: formData.projectId ? Number(formData.projectId) : undefined,
                    });
                }}
            />
        </div>
    );
}