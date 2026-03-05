import { useEffect, useState } from "react";
import { getStockSummary } from "../../services/api";
import AddIcon from "../../assets/icons/Add Circle.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";
import AddProductModal from "../../components/AddProductModal";

interface AllStock {
    id: string;
    productCode: string;
    category: string;
    productName: string;
    unit: string;
    stockIn: number;
    stockOut: number;
    remainingStock: number;
}

export default function AllStock() {

    const [data, setData] = useState<AllStock[]>([]);
    const [filteredData, setFilteredData] = useState<AllStock[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 13;

    // filters
    const [productCode, setProductCode] = useState("");
    const [category, setCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [unit, setUnit] = useState("");
    const [stockIn, setStockIn] = useState("");
    const [stockOut, setStockOut] = useState("");
    const [remainingStock, setRemainingStock] = useState("");

    const columns: Column<AllStock>[] = [
        { id: "productCode", key: "productCode", label: "รหัสสินค้า", align: "center" },
        { id: "category", key: "category", label: "หมวดหมู่", align: "center" },
        { id: "productName", key: "productName", label: "ชื่อสินค้า", align: "center" },
        { id: "unit", key: "unit", label: "หน่วยนับ", align: "center" },
        { id: "stockIn", key: "stockIn", label: "รับเข้า", align: "center" },
        { id: "stockOut", key: "stockOut", label: "จ่ายออก", align: "center" },
        { id: "remainingStock", key: "remainingStock", label: "คงเหลือ", align: "center" },
    ];


    const fetchSummary = async () => {
        try {

            setLoading(true);

            const res = await getStockSummary();

            const list = res.data.list;

            const formatted = list.map((item: any) => ({
                id: item.sku,
                productCode: item.sku,
                category: item.category,
                productName: item.name,
                unit: item.unit,
                stockIn: item.inQty,
                stockOut: item.outQty,
                remainingStock: item.onHand,
            }));

            setData(formatted);
            setFilteredData(formatted);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    // filter
    useEffect(() => {

        const filtered = data.filter((item) => {

            return (
                item.productCode.toLowerCase().includes(productCode.toLowerCase()) &&
                item.category.toLowerCase().includes(category.toLowerCase()) &&
                item.productName.toLowerCase().includes(productName.toLowerCase()) &&
                item.unit.toLowerCase().includes(unit.toLowerCase()) &&
                (stockIn === "" || item.stockIn.toString().includes(stockIn)) &&
                (stockOut === "" || item.stockOut.toString().includes(stockOut)) &&
                (remainingStock === "" ||
                    item.remainingStock.toString().includes(remainingStock))
            );

        });

        setFilteredData(filtered);
        setPage(1);

    }, [
        productCode,
        category,
        productName,
        unit,
        stockIn,
        stockOut,
        remainingStock,
        data,
    ]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (

        <div className="w-full">

            {/* Header */}

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

            {/* Search */}

            <SearchBox>

                <div className="grid grid-cols-4 justify-between gap-2.5">

                    <TextInputFilter
                        label="รหัสสินค้า"
                        value={productCode}
                        onChange={(value) => setProductCode(value)}
                    />

                    <TextInputFilter
                        label="หมวดหมู่"
                        value={category}
                        onChange={(value) => setCategory(value)}
                    />

                    <TextInputFilter
                        label="ชื่อสินค้า"
                        value={productName}
                        onChange={(value) => setProductName(value)}
                    />

                    <TextInputFilter
                        label="หน่วยนับ"
                        value={unit}
                        onChange={(value) => setUnit(value)}
                    />

                    <TextInputFilter
                        label="รับเข้า"
                        value={stockIn}
                        onChange={(value) => setStockIn(value)}
                    />

                    <TextInputFilter
                        label="จ่ายออก"
                        value={stockOut}
                        onChange={(value) => setStockOut(value)}
                    />

                    <TextInputFilter
                        label="คงเหลือ"
                        value={remainingStock}
                        onChange={(value) => setRemainingStock(value)}
                    />

                </div>

            </SearchBox>

            {/* Table */}

            <div className="pt-[25px]">

                <DataTable<AllStock>
                    columns={columns}
                    data={paginatedData}
                    loading={loading}
                />

            </div>

            {/* Pagination */}

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

            {/* Modal */}

            <AddProductModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={fetchSummary}
            />

        </div>
    );
}

