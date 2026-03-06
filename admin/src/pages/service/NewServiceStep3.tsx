import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadFileField from "../../components/UploadFileField";
import SelectFilter from "../../components/SelectFilter";
import TextInputFilter from "../../components/TextInputFilter";
import ImageGalleryUpload from "../../components/ImageGalleryUpload";
import { createServiceStep3Draft } from "../../services/service.api";

import MaterialRequisition from "../../components/MaterialRequisition";

export default function NewServiceStep3() {

    const navigate = useNavigate();

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(3);

    const [loading, setLoading] = useState(false);

    const [reportFile, setReportFile] = useState<File | null>(null);

    const [images, setImages] = useState<File[]>([]);

    const [materialTitle] = useState("");
    const [category, setCategory] = useState("");
    const [equipment, setEquipment] = useState("");
    const [amount, setAmount] = useState("");

    const jobIdStr = localStorage.getItem("serviceJobId");
    const jobId = jobIdStr ? Number(jobIdStr) : null;

    async function handleNext() {

        try {

            if (!jobId) {
                alert("ไม่พบ jobId");
                navigate("/service/new/step1");
                return;
            }

            if (images.length < 6) {
                alert("ต้องอัปโหลดรูปภาพอย่างน้อย 6 รูป");
                return;
            }

            if (images.length > 30) {
                alert("อัปโหลดรูปได้ไม่เกิน 30 รูป");
                return;
            }

            if (!reportFile) {
                alert("กรุณาอัปโหลด Service Report");
                return;
            }

            setLoading(true);

            const metaJson = {
                category,
                equipment,
                amount,
            };

            await createServiceStep3Draft({
                jobId,
                reportFile,
                images,
                metaJson,
            });

            navigate("/service/new/step4");

        } catch (error) {

            console.error("Step3 upload error:", error);
            
            alert("บันทึกข้อมูลไม่สำเร็จ");

        } finally {

            setLoading(false);
        }
    }

    async function handleSaveDraft() {

        try {

            if (!jobId) {
                alert("ไม่พบ jobId");
                return;
            }

            setLoading(true);

            const metaJson = {
                materialTitle,
                category,
                equipment,
                amount,
            };

            await createServiceStep3Draft({
                jobId,
                reportFile,
                images,
                metaJson,
            });

            alert("บันทึก Draft สำเร็จ");

        } catch (error) {

            console.error("Save draft error:", error);
            alert("บันทึก Draft ไม่สำเร็จ");

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">
                    New Service Job
                </h1>

                <button
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
                    text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="save draft" />
                    Save Draft
                </button>

            </div>

            {/* Form */}
            <div className="flex flex-col min-h-[822px] px-28 py-5 bg-white rounded-2xl items-center justify-between">

                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Fields */}
                <div className="w-[1091px]">

                    {/* Upload Images */}
                    <div>

                        <p className="text-lg font-medium text-green-800 pb-1.5">
                            รูปภาพ Service
                        </p>

                    </div>

                    <ImageGalleryUpload
                        images={images}
                        setImages={setImages}
                    />

                    <p className="text-[16px] text-[#E54848]">
                        *** หมายเหตุ : จํานวนรูปภาพขั้นตํ่า 6 รูป
                    </p>

                    {/* Upload Report */}
                    <UploadFileField
                        label="Service Report"
                        onChange={(file) => setReportFile(file)}
                    />

                    <div className="">
                        <MaterialRequisition/>
                    </div>
                    

                    {/* <div
                        className="grid
                        w-[1091px]
                        grid-cols-2
                        gap-x-[27px]
                        gap-y-2.5"
                    >

                        <SelectFilter
                            label="หมวดหมู่อุปกรณ์"
                            placeholder="Select"
                            value={category}
                            onChange={setCategory}
                            options={[
                                { label: "Type A", value: "type_a" },
                                { label: "Type B", value: "type_b" },
                                { label: "Type C", value: "type_c" },
                            ]}
                        />

                        <SelectFilter
                            label="อุปกรณ์"
                            placeholder="Select"
                            value={equipment}
                            onChange={setEquipment}
                            options={[
                                { label: "Type A", value: "type_a" },
                                { label: "Type B", value: "type_b" },
                                { label: "Type C", value: "type_c" },
                            ]}
                        />

                        <TextInputFilter
                            label="จำนวน"
                            type="number"
                            placeholder="เช่น 3"
                            value={amount}
                            onChange={setAmount}
                        />

                    </div> */}

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between pt-4">

                    <button
                        onClick={() => navigate("/service/new/step2")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                    >
                        {loading ? "กำลังบันทึก..." : "ถัดไป"}
                    </button>

                </div>

            </div>

        </div>
    );
}

