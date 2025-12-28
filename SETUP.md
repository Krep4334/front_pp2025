# Установка проекта на новом устройстве

## Быстрая переустановка зависимостей (на текущем устройстве)

```bash
# Удалить node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Или на Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json

# Переустановить зависимости
npm install
```

## Установка на новом устройстве

### 1. Убедитесь, что установлены Node.js и npm
```bash
node --version
npm --version
```

Если не установлены, скачайте с https://nodejs.org/

### 2. Клонируйте проект (если из Git)
```bash
git clone <repository-url>
cd food
```

### 3. Установите зависимости
```bash
npm install
```

### 4. Запустите dev сервер
```bash
npm run dev
```

## Полезные команды

```bash
# Очистить кеш npm
npm cache clean --force

# Удалить все зависимости и переустановить
rm -rf node_modules package-lock.json && npm install

# Проверить установленные пакеты
npm list --depth=0
```

