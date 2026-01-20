import { X } from "lucide-react";
import SelectFilter from "./SelectFilter";
import InputField from "./InputField";

interface OtherRow {
    id: number;
    status: string;
    description: string;
    remark: string;
}

interface Props {
    value: OtherRow;
    isEdit: boolean;
    onChange: (value: OtherRow) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function OtherForm({
    value,
    isEdit,
    onChange,
    onClose,
    onSave,
}: Props) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[500px] p-6 relative">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={18} />
                </button>

                <h3 className="font-semibold mb-4">
                    {isEdit ? "Edit Description" : "Add Description"}
                </h3>

                <div className="space-y-4">
                    <SelectFilter
                        value={value.status}
                        onChange={(status: string) => onChange({ ...value, status })}
                        options={[
                            { label: "Pending", value: "pending" },
                            { label: "Approved", value: "approved" },
                            { label: "Rejected", value: "rejected" },
                        ]} label={""} />

                    <InputField
                        placeholder="Description"
                        value={value.description}
                        textarea
                        onChange={(e) => onChange({ ...value, description: e.target.value })} label={""}                    />


                    <InputField
                        placeholder="Remark"
                        value={value.remark}
                        textarea
                        onChange={(e) => onChange({ ...value, remark: e.target.value })} label={""}                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-green-700 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
