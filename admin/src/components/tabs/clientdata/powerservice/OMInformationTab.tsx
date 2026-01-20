import DocumentIcon from "../../../../assets/icons/Document.svg";

export default function OMInformationTab() {
    return (
        <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">
            <div className="pr-3">
                {/* Image */}
                <div className="w-[700px] h-96 rounded-xl overflow-hidden mb-[41px]">
                    <img
                        src="https://powervaultthailand.com/wp-content/uploads/2025/01/UNIQUE-PLASTIC-INDUSTRY.jpg"
                        alt="solar"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Map */}
                <div className="w-[700px] h-60 rounded-xl overflow-hidden">
                    <iframe
                        className="w-full h-full"
                        loading="lazy"
                        src="https://www.google.com/maps?q=13.7563,100.5018&output=embed"
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between">
                {/* Company Info */}
                <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">
                    <p>Description</p>
                    <p>Company :</p>
                    <p>Address :</p>
                    <p>Location : (จังหวัด)</p>
                    <p>Type :</p>
                    <p>O&amp;M : _Y (_ time/Y)</p>
                    <p>Solar Panel :</p>
                    <p>Panel Brand :</p>
                    <p>ขนาดแผง (W) :</p>
                    <p>หมดรับประกันอุปกรณ์ :</p>
                    <p>เงื่อนไขเข้างาน : </p>
                    <p>Remark  :</p>
                </div>
                {/* Contact Info */}
                <div className="flex flex-col justify-between p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">
                    <div>
                        <p>Customer Contact E-mail :</p>
                        <p>Tel :</p>
                    </div>
                </div>
                {/* Button doc */}
                <div className="flex justify-end">
                    <button className="flex text-white text-sm font-normal bg-green-600 px-6 py-2.5 gap-5 rounded-md">
                        <img src={DocumentIcon} alt="docicon" />
                        Document
                    </button>
                </div>
            </div>
        </div>
    );
}