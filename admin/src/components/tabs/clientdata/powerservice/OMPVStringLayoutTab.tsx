interface Props {
  project: any;
}

export default function OMPVStringLayoutTab({ project }: Props) {

    // ✅ หา PV_STRING_LAYOUT
    const layout = project?.layouts?.find(
        (l: any) => l.type === "PV_STRING_LAYOUT"
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
                        alt="PV String Layout"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    "img"
                )}
            </div>
        </div>
    );
}