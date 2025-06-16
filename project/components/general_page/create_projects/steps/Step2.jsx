import {
  InformationCircleIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  PhotoIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ image, index, setActiveId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab w-full aspect-square"
      onMouseDown={() => setActiveId(index)} // Track dragged item
    >
      <Image
        src={image}
        alt={`image-${index}`}
        layout="fill" // Ensures the image fills the container
        objectFit="cover" // Ensures images are evenly sized without distortion
        className="rounded-xl"
      />
    </div>
  );
};

const PreviewPremise = ({ premise, setPreviewPremise }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <Image
        src={premise}
        alt="Preview"
        width={0}
        height={0}
        sizes="100vh"
        className="max-h-screen w-auto object-contain"
      />
      <XMarkIcon
        className="w-10 h-10 absolute top-5 right-5 text-white cursor-pointer"
        onClick={() => setPreviewPremise(false)}
      />
    </div>
  );
};

const Step2 = ({ generalInfo, setGeneralInfo, setStep }) => {
  const [infoMode, setInfoMode] = useState("general-images");
  const [images, setImages] = useState([]);
  const [premise, setPremise] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [previewPremise, setPreviewPremise] = useState(false);
  const [notify, setNotify] = useState("");

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const deviceImageRef = useRef();

  const handleImageUpload = () => {
    deviceImageRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImages = [];

    // Convert files to base64 for preview
    for (let file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePremiseFileChange = (event) => {
    const file = event.target.files[0]; // lấy file đầu tiên
    if (!file) return; // kiểm tra xem có file không
    const reader = new FileReader();
    reader.onloadend = () => {
      setPremise(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setImages((prevImages) => {
        const oldIndex = prevImages.findIndex((_, i) => i === active.id);
        const newIndex = prevImages.findIndex((_, i) => i === over.id);
        return arrayMove(prevImages, oldIndex, newIndex);
      });
    }
    setActiveId(null);
    setNotify("Đã cập nhật vị trí ảnh!");
  };

  const handleDeleteImage = (index) => {
    const filteredList = images.filter((_, i) => i !== index);

    setImages(filteredList);
    setNotify("Xóa ảnh thành công!");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files;
    const files = [];

    if (droppedFile) {
      // Optionally, validate file type
      for (let file of droppedFile) {
        if (file.type.startsWith("image/")) {
          files.push(URL.createObjectURL(file));
        } else {
          alert("Please drop a valid image file.");
        }
      }
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handlePremiseDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (droppedFile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(droppedFile);
      setPremise(imageUrl);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotify("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [notify]);

  useEffect(() => {
    if (images.length > 0) {
      setGeneralInfo({ ...generalInfo, images });
    }
  }, [images]);

  useEffect(() => {
    setGeneralInfo({ ...generalInfo, premise });
  }, [premise]);

  return (
    <div className="w-full">
      {/* for general images */}
      {infoMode === "general-images" && (
        <>
          {images.length > 0 && (
            <button
              className="flex p-2 border rounded-xl gap-2 items-center border-black font-semibold float-right my-5"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="w-5 h-5" /> Chỉnh sửa ({images.length})
            </button>
          )}

          {images && (
            <div className="w-full grid grid-cols-4 gap-3 items-center my-5">
              {images.map((item, index) => (
                <div className="relative w-full aspect-square" key={index}>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 flex items-center bg-red-600 rounded-xl z-50">
                      <p className=" text-white p-2 px-3 text-xs">
                        Ảnh đại diện
                      </p>
                    </div>
                  )}
                  <Image
                    src={item}
                    alt={`image-${index}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}

          <div
            className="w-full flex-row items-center justify-center border-2 rounded-xl border-black/50 p-2 border-dashed"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <ArrowUpTrayIcon className="w-20 h-w-20 mx-auto mt-3" />
            <p className="text-center text-sm text-neutral-600">
              Kéo thả ảnh vào đây
            </p>
            <p className="text-center text-xs text-neutral-600">hoặc</p>
            <div className="w-full flex gap-5 items-center justify-center my-4">
              <button
                className=" p-2 border w-1/3 border-black rounded-xl flex items-center justify-center gap-2 shadow-md text-center"
                onClick={handleImageUpload}
              >
                <span>
                  <PlusIcon className="w-5 h-5" />
                </span>
                Thêm ảnh lên từ thiết bị
              </button>
              <input
                type="file"
                className="hidden"
                ref={deviceImageRef}
                onChange={handleFileChange}
                multiple
              />
            </div>
          </div>

          {isEditing && (
            <div
              className="fixed w-screen z-50 h-screen bg-black/50 top-0 left-0 flex justify-center items-center"
              onClick={() => setIsEditing(false)}
            >
              <div className="w-[768px]" onClick={(e) => e.stopPropagation()}>
                <h1 className="text-white bg-black w-full p-5 rounded-tl-xl rounded-tr-xl font-bold text-xl">
                  Chỉnh sửa hình ảnh{" "}
                  <span
                    className={`text-green-500 text-xs transition-all duration-300 ease-out ${
                      notify.trim().length > 0 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {notify}
                  </span>
                </h1>
                <div className="w-full bg-white p-5 rounded-bl-xl rounded-br-xl">
                  <p>Kéo và thả hình ảnh để sắp xếp lại thứ tự </p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-4 gap-3 my-5">
                        {images.map((item, index) => (
                          <div className="relative" key={index}>
                            {index === 0 && (
                              <div className="absolute top-2 left-2 flex items-center bg-black p-1 rounded-xl z-50">
                                <StarIcon className="w-5 h-5 text-black rounded-full bg-yellow-500" />
                                <p className=" text-white p-1 px-3 text-xs">
                                  Ảnh bìa
                                </p>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex items-center bg-black text-white p-1 rounded-xl z-50">
                              <TrashIcon
                                className="w-5 h-5"
                                onClick={() => handleDeleteImage(index)}
                              />
                            </div>
                            <SortableItem
                              image={item}
                              index={index}
                              setActiveId={setActiveId}
                            />
                          </div>
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeId !== null && (
                        <Image
                          src={images[activeId]}
                          width={200}
                          height={200}
                          alt="dragging"
                          className="rounded-md shadow-2xl scale-110"
                        />
                      )}
                    </DragOverlay>
                  </DndContext>
                </div>
              </div>
            </div>
          )}
          {images.length >= 3 && (
            <button
              className=" rounded-lg bg-red-500 text-white p-2 px-4 mt-5 float-end"
              onClick={() => setInfoMode("premise-image")}
            >
              Tiếp tục
            </button>
          )}
        </>
      )}

      {/* for premise image */}
      {infoMode === "premise-image" && (
        <>
          <h1 className="text-lg my-5">Ảnh mặt bằng dự án</h1>
          {premise && (
            <div className="relative w-full flex items-center justify-center mb-5">
              <div className="relative">
                <Image
                  src={premise}
                  width={300}
                  height={200}
                  className="rounded-lg"
                  alt="mat-bang-du-an"
                />
                <MagnifyingGlassCircleIcon
                  className="w-10 h-10 absolute top-0 right-0 text-white cursor-pointer"
                  onClick={() => setPreviewPremise(true)}
                />
              </div>
            </div>
          )}
          <div
            className="w-full flex-row items-center justify-center border-2 rounded-xl border-black/50 p-2 border-dashed"
            onDrop={handlePremiseDrop}
            onDragOver={handleDragOver}
          >
            <ArrowUpTrayIcon className="w-20 h-w-20 mx-auto mt-3" />
            <p className="text-center text-sm text-neutral-600">
              Kéo thả ảnh vào đây
            </p>
            <p className="text-center text-xs text-neutral-600">hoặc</p>
            <div className="w-full flex gap-5 items-center justify-center my-4">
              <button
                className=" p-2 border w-1/3 border-black rounded-xl flex items-center justify-center gap-2 shadow-md text-center"
                onClick={handleImageUpload}
              >
                <span>
                  <PlusIcon className="w-5 h-5" />
                </span>
                Thêm ảnh lên từ thiết bị
              </button>
              <input
                type="file"
                className="hidden"
                ref={deviceImageRef}
                onChange={handlePremiseFileChange}
                multiple
              />
            </div>
          </div>
          {premise && (
            <button
              className=" rounded-lg bg-red-500 text-white p-2 px-4 mt-5 float-end"
              onClick={() => setStep(3)}
            >
              Tiếp tục
            </button>
          )}
        </>
      )}
      {previewPremise && (
        <PreviewPremise
          premise={premise}
          setPreviewPremise={setPreviewPremise}
        />
      )}
    </div>
  );
};

export default Step2;
