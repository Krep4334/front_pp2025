// Генерация цветных placeholder'ов для блюд
export function getPlaceholderImage(category: string, index: number): string {
  const colors: Record<string, string[]> = {
    "Пицца": ["#FF6B6B", "#FF8E53"],
    "Бургеры": ["#FFA726", "#FB8C00"],
    "Суши": ["#66BB6A", "#43A047"],
    "Паста": ["#FFB74D", "#FFA726"],
    "Шашлык": ["#E57373", "#EF5350"],
    "Салаты": ["#81C784", "#66BB6A"],
    "Супы": ["#FFD54F", "#FFCA28"],
    "Мясо": ["#8D6E63", "#6D4C41"],
    "Выпечка": ["#FFB74D", "#FFA726"],
  };

  const categoryColors = colors[category] || ["#9E9E9E", "#757575"];
  const color1 = categoryColors[0];
  const color2 = categoryColors[1];
  const gradientId = `grad-${category}-${index}`;

  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#${gradientId})"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
        ${category}
      </text>
    </svg>
  `.trim();

  // Используем encodeURIComponent для правильной работы с кириллицей
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

