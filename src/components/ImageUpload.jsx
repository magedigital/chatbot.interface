import React from "react";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

const ImageUpload = ({ 
  imageSrc, 
  onUpload, 
  onClear, 
  uploadFieldName = "sendImage",
  maxFileSize = 1000 * 1024, // 1000 KB default
  className = ""
}) => {
  const handleClick = () => {
    // Создаем скрытый input для выбора файла
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Принимаем только изображения
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Проверяем размер файла
        if (file.size > maxFileSize) {
          alert(`Размер файла превышает ${(maxFileSize / 1024).toFixed(0)} КБ. Пожалуйста, выберите файл меньшего размера.`);
          return;
        }

        const reader = new FileReader();

        reader.onloadend = function() {
          onUpload(uploadFieldName, reader.result);
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click(); // Открываем диалог выбора файла
  };

  return (
    <div className={`flex flex-column ${className}`}>
      <div className="flex flex-row gap-2">
        <Button
          outlined
          icon="pi pi-image"
          onClick={handleClick}
        />
        {imageSrc && (
          <Button
            outlined
            icon="pi pi-trash"
            severity="danger"
            onClick={() => onClear(uploadFieldName)}
          />
        )}
      </div>
      {imageSrc && (
        <Image src={imageSrc} width="106px" />
      )}
    </div>
  );
};

export default ImageUpload;