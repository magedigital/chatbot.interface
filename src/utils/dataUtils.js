/**
 * Утилиты для экспорта и импорта данных приложения
 */

/**
 * Функция экспорта данных приложения в JSON
 * @param {Array} nodes - массив нод
 * @param {Array} edges - массив связей
 * @param {Object} additionalData - дополнительные данные приложения
 * @returns {Object} - объект с данными приложения
 */
export const exportAppData = (nodes, edges, additionalData = {}) => {
  // Подготовка данных для экспорта
  const exportData = {
    nodes: nodes.map(node => ({
      ...node,
      // Копируем все свойства ноды
    })),
    edges: edges.map(edge => ({
      ...edge,
      // Копируем все свойства связи
    })),
    metadata: {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    },
    ...additionalData // Добавляем любые дополнительные данные
  };

  return exportData;
};

/**
 * Функция сохранения данных в JSON-файл
 * @param {Object} data - данные для сохранения
 * @param {string} filename - имя файла
 */
export const saveDataToFile = (data, filename = 'bot-data-export.json') => {
  // Преобразуем данные в строку JSON с форматированием
  const jsonString = JSON.stringify(data, null, 2);
  
  // Создаем Blob с данными
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Создаем URL для скачивания
  const url = URL.createObjectURL(blob);
  
  // Создаем временный элемент ссылки для скачивания
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Добавляем ссылку во временный контейнер
  document.body.appendChild(link);
  
  // Имитируем клик по ссылке для запуска скачивания
  link.click();
  
  // Удаляем ссылку после скачивания
  document.body.removeChild(link);
  
  // Освобождаем URL
  URL.revokeObjectURL(url);
};