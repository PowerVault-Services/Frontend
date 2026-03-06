import { useEffect, useState } from "react";
import { getStockInList } from "../../services/api";

import AddIcon from "../../assets/icons/Add Circle.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";
import AddProductModal from "../../components/AddProductModal";

interface StockIn {
    id: number;
    date: string;
    productCode: string;
    category: string;
    productName: string;
    unit: string;
    stockIn: number;
    project?: string;
    receiver?: string;
    vendor?: string;
    insuranceCompany?: string;
    insuranceNo?: string;
    note?: string;
}

export default function StockIn() {

    const [data, setData] = useState<StockIn[]>([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 13;

    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / pageSize);

    const [keyword, setKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const columns: Column<StockIn>[] = [
        { id: "date", key: "date", label: "วันที่", align: "center" },
        { id: "productCode", key: "productCode", label: "รหัสสินค้า", align: "center" },
        { id: "category", key: "category", label: "หมวดหมู่", align: "center" },
        { id: "productName", key: "productName", label: "ชื่อสินค้า", align: "center" },
        { id: "unit", key: "unit", label: "หน่วยนับ", align: "center" },
        { id: "stockIn", key: "stockIn", label: "รับเข้า", align: "center" },
        { id: "project", key: "project", label: "โครงการ", align: "center" },
        { id: "receiver", key: "receiver", label: "ผู้รับสินค้า", align: "center" },
        { id: "vendor", key: "vendor", label: "ผู้ขาย", align: "center" },
        {
            id: "note",
            key: "note",
            label: "หมายเหตุ",
            align: "center",
            render: (v) => v || "-"
        }
    ];

    const fetchStockIn = async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize)
            });

            if (keyword) params.append("q", keyword);
            if (dateFrom) params.append("dateFrom", dateFrom);
            if (dateTo) params.append("dateTo", dateTo);

            const res = await getStockInList(params.toString());

            const json = res.data;

            if (!json.success) return;

            const mapped: StockIn[] = json.data.list.map((item: any) => ({
                id: item.id,
                date: item.txDate?.slice(0, 10),
                productCode: item.sku,
                category: item.category,
                productName: item.productName,
                unit: item.unit,
                stockIn: item.quantity,
                project: item.project,
                receiver: item.receiver,
                vendor: item.vendor,
                insuranceCompany: item.insuranceCompany,
                insuranceNo: item.insuranceNo,
                note: item.note
            }));

            setData(mapped);
            setTotalItems(json.data.pagination.total);

        } catch (err) {

            console.error("โหลด StockIn ไม่สำเร็จ", err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchStockIn();
    }, [page, keyword, dateFrom, dateTo]);

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

                    <TextInputFilter
                        label="ค้นหา"
                        value={keyword}
                        onChange={setKeyword}
                    />

                    <TextInputFilter
                        label="วันที่เริ่ม"
                        type="date"
                        value={dateFrom}
                        onChange={setDateFrom}
                    />

                    <TextInputFilter
                        label="วันที่สิ้นสุด"
                        type="date"
                        value={dateTo}
                        onChange={setDateTo}
                    />

                </div>

            </SearchBox>

            <div className="pt-[25px]">

                <DataTable<StockIn>
                    columns={columns}
                    data={data}
                    loading={loading}
                />

            </div>

            <div className="flex items-center justify-between py-6 text-sm text-gray-500">

                <span>
                    {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, totalItems)} of {totalItems} items
                </span>

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                />

            </div>

            <AddProductModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />

        </div>
    );
}
