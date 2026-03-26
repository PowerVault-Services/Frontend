interface Props {
  project: any;
}

export default function CleaningPVLayoutTab({ project }: Props) {

    // ✅ หา PV_LAYOUT จาก layouts
    const layout = project?.layouts?.find(
        (l: any) => l.type === "PV_LAYOUT"
    );

    const imageUrl = layout?.fileUrl
        ? "http://localhost:3000" + layout.fileUrl
        : null;

    return (
        <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">
            <div>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="PV Layout"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    "img"
                )}
            </div>
        </div>
    );
}