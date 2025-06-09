function Cached(cacheLiveTime = 1) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Оригинальный метод
    const originalMethod = descriptor.value;

    // Кеш
    const cache: { result: any; time: number } = { result: null, time: 0 };

    descriptor.value = function () {
      // Если есть закешированный результат, и с момента его кеширования прошло меньше cacheLiveTime, отдаём кеш
      if (cache.result || new Date().getTime() - cache.time < cacheLiveTime) {
        return cache.result;
      }

      // Иначе - вызываем реальную функцию, получаем результат
      const result = originalMethod.apply(this);

      // Обновляем кеш
      cache.result = result;
      cache.time = new Date().getTime();

      return cache.result;
    };
  };
}

/**
 * Движок для работы с прогнозами погоды
 */
class WeatherEngine {
  @Cached(3600)
  public getTemp() {
    const factor = 0.1 + Math.random() * 3;
    for (let i = 0; i < 1e9 * factor; i++) {}

    console.log('Генерируем случайную температуру');
    const temp = -50 + Math.round(Math.random() * 100);

    return temp;
  }
}

const main = () => {
  const weather = new WeatherEngine();

  let start = new Date().getTime();

  const temp1 = weather.getTemp();
  console.log(`Температура=${temp1}, ответ получен за ${new Date().getTime() - start} ms`);

  start = new Date().getTime();
  const temp2 = weather.getTemp();
  console.log(`Температура=${temp2}, ответ получен за ${new Date().getTime() - start} ms`);
};

main();
