import React, { useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  // Обработчики drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Проверяем, действительно ли курсор покинул элемент
    const rect = e.currentTarget.getBoundingClientRect();
    const relatedTarget = e.relatedTarget;
    
    if (relatedTarget) {
      const relRect = relatedTarget.getBoundingClientRect();
      if (
        relRect.left >= rect.right ||
        relRect.right <= rect.left ||
        relRect.top >= rect.bottom ||
        relRect.bottom <= rect.top
      ) {
        setIsDragging(false);
      }
    } else {
      // Если relatedTarget отсутствует, проверяем координаты курсора
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Проверяем, что файл является изображением
      if (!file.type.startsWith('image/')) {
        if (toastRef && toastRef.current) {
          toastRef.current.show({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Можно загружать только изображения.',
            life: 3000,
          });
        } else {
          alert('Можно загружать только изображения.');
        }
        return;
      }

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
              severity: "error",
              summary: "Ошибка",
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
    <div className={`flex flex-column gap-3 h-full ${className}`}>
      <div className="flex-grow-0 flex gap-2">
        <Button
          className="flex-grow-1"
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
      <div
        id="imageArea"
        className={`flex-grow-1 flex p-3 ${imageSrc ? '' : 'border-dashed'}`}
        style={{
          border: isDragging ? "1px solid white" : "1px solid var(--surface-border)",
          borderRadius: 6,
          backgroundColor: isDragging ? "rgba(255, 255, 255, 0.1)" : "transparent",
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imageSrc && <Image src={imageSrc} width="106px" />}
      </div>
    </div>
  );
};

export default ImageUpload;