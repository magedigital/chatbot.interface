/**
 * Конфигурационные параметры для выравнивания
 */

// Опции для ELK
export const elkOptions = {
  "elk.algorithm": "mrtree", //layered,mrtree,rectpacking
  "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  "elk.spacing.nodeNode": "100", // Увеличил расстояние между нодами
  "elk.spacing.componentComponent": "100", // Расстояние между компонентами
  "elk.spacing.nodeNode.selfLoop": "100", // Расстояние для самозацикленных нод
};
