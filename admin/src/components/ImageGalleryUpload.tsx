import { useRef } from "react";

interface Props {
    images: (File | string)[];
    setImages: (files: (File | string)[]) => void;
    readOnly?: boolean;
}

export default function ImageGalleryUpload({ images, setImages, readOnly = false }: Props) {

    const inputRef = useRef<HTMLInputElement>(null);

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {

        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        setImages([...images, ...files]);
    }

    function removeImage(index: number) {

        const newImages = images.filter((_, i) => i !== index);

        setImages(newImages);
    }

    const progress = Math.min((images.length / 6) * 100, 100);

    return (
        <div className="w-full">

            {/* image preview */}
            <div className="flex gap-4 mb-4">

                {images.map((img, index) => {

                    const imageUrl =
                        typeof img === "string"
                            ? "http://localhost:3000" + img
                            : URL.createObjectURL(img);

                    return (
                        <div key={index} className="relative">

                            <img
                                src={imageUrl}
                                className="w-[160px] h-[160px] object-cover rounded-lg border"
                            />

                            {!readOnly && (
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2"
                                >
                                    x
                                </button>
                            )}

                        </div>
                    );
                })}

                {/* add button */}
                {!readOnly && (
                    <div
                        onClick={() => inputRef.current?.click()}
                        className="
            w-[160px] h-[160px]
            flex items-center justify-center
            rounded-lg border
            border-gray-300
            cursor-pointer
            bg-gray-100
        "
                    >
                        <span className="text-3xl text-gray-500">+</span>
                    </div>
                )}

                {!readOnly && (
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                )}

            </div>

        </div>
    );
}