import { useEffect } from "react";
import { Header } from "../components/Header";

export function SupportPage() {
  useEffect(() => {
    // Загружаем скрипт Yandex Forms
    const script = document.createElement("script");
    script.src = "https://forms.yandex.ru/_static/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://forms.yandex.ru/_static/embed.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Служба поддержки</h1>
          <p className="text-gray-600 mb-6">
            Если у вас возникли вопросы или проблемы, пожалуйста, заполните форму ниже.
            Мы свяжемся с вами в ближайшее время.
          </p>
          <div className="flex justify-center">
            <iframe
              src="https://forms.yandex.ru/cloud/692ca1c7eb614685ef900820?iframe=1"
              frameBorder="0"
              name="ya-form-692ca1c7eb614685ef900820"
              width="650"
              height="600"
              style={{ minHeight: "600px" }}
              title="Форма поддержки"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

