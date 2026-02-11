import React from "react";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { UI } from "../config/uiConfig";

const ImageUpload = ({
  imageSrc,
  onUpload,
  onClear,
  uploadFieldName = "sendImage",
  className = "",
  toastRef = null,
}) => {
  const handleClick = () => {
    // Создаем скрытый input для выбора файла
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Принимаем только изображения
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Проверяем размер файла
        if (file.size > UI.maxUploadSize) {
          if (toastRef && toastRef.current) {
            toastRef.current.show({
              severity: 'error',
              summary: 'Ошибка',
              detail: UI.fileSizeExceededMessage,
              life: 3000,
            });
          } else {
            alert(UI.fileSizeExceededMessage);
          }
          return;
        }

        const reader = new FileReader();

        reader.onloadend = function () {
          onUpload(uploadFieldName, reader.result);
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click(); // Открываем диалог выбора файла
  };

  return (
    <div className={`flex flex-column gap-3 ${className}`}>
      <div className="flex flex-row gap-2">
        <Button outlined icon="pi pi-image" onClick={handleClick} />
        {imageSrc && (
          <Button
            outlined
            icon="pi pi-trash"
            severity="danger"
            onClick={() => onClear(uploadFieldName)}
          />
        )}
      </div>
      {imageSrc && <Image src={imageSrc} width="106px" />}
    </div>
  );
};

export default ImageUpload;
